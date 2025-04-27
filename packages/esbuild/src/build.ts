/*-------------------------------------------------------------------

                  ⚡ Storm Software - Storm Stack

 This code was released as part of the Storm Stack project. Storm Stack
 is maintained by Storm Software under the Apache-2.0 License, and is
 free for commercial and private use. For more information, please visit
 our licensing page.

 Website:         https://stormsoftware.com
 Repository:      https://github.com/storm-software/storm-ops
 Documentation:   https://stormsoftware.com/projects/storm-ops/docs
 Contact:         https://stormsoftware.com/contact
 License:         https://stormsoftware.com/projects/storm-ops/license

 -------------------------------------------------------------------*/

import {
  createProjectGraphAsync,
  readProjectsConfigurationFromProjectGraph,
  writeJsonFile
} from "@nx/devkit";
import {
  addPackageDependencies,
  addWorkspacePackageJsonFields,
  copyAssets,
  DEFAULT_TARGET,
  getEnv
} from "@storm-software/build-tools";
import { getWorkspaceConfig } from "@storm-software/config-tools/get-config";
import {
  getStopwatch,
  writeDebug,
  writeError,
  writeFatal,
  writeSuccess,
  writeTrace,
  writeWarning
} from "@storm-software/config-tools/logger/console";
import { joinPaths } from "@storm-software/config-tools/utilities/correct-paths";
import { watch as createWatcher } from "chokidar";
import defu from "defu";
import { debounce } from "es-toolkit";
import * as esbuild from "esbuild";
import { BuildContext } from "esbuild";
import { globbySync } from "globby";
import { existsSync } from "node:fs";
import hf from "node:fs/promises";
import { findWorkspaceRoot } from "nx/src/utils/find-workspace-root";
import { Options, build as tsup } from "tsup";
import { cleanDirectories } from "./clean";
import { DEFAULT_BUILD_OPTIONS } from "./config";
import { depsCheckPlugin } from "./plugins/deps-check";
import { emitDts } from "./tsc";
import { ESBuildContext, type ESBuildOptions } from "./types";
import { handle } from "./utilities/helpers";

/**
 * Apply defaults to the original build options
 *
 * @param userOptions - the original build options provided by the user
 * @returns the build options with defaults applied
 */
const resolveContext = async (
  userOptions: ESBuildOptions
): Promise<ESBuildContext> => {
  const projectRoot = userOptions.projectRoot;

  const workspaceRoot = findWorkspaceRoot(projectRoot);
  if (!workspaceRoot) {
    throw new Error("Cannot find Nx workspace root");
  }

  const workspaceConfig = await getWorkspaceConfig(true, {
    workspaceRoot: workspaceRoot.dir
  });

  writeDebug("  ⚙️   Resolving build options", workspaceConfig);
  const stopwatch = getStopwatch("Build options resolution");

  const projectGraph = await createProjectGraphAsync({
    exitOnError: true
  });

  const projectJsonPath = joinPaths(
    workspaceRoot.dir,
    projectRoot,
    "project.json"
  );
  if (!existsSync(projectJsonPath)) {
    throw new Error("Cannot find project.json configuration");
  }

  const projectJsonFile = await hf.readFile(projectJsonPath, "utf8");
  const projectJson = JSON.parse(projectJsonFile);
  const projectName = projectJson.name || userOptions.name;

  const projectConfigurations =
    readProjectsConfigurationFromProjectGraph(projectGraph);
  if (!projectConfigurations?.projects?.[projectName]) {
    throw new Error(
      "The Build process failed because the project does not have a valid configuration in the project.json file. Check if the file exists in the root of the project."
    );
  }

  const options = defu(userOptions, DEFAULT_BUILD_OPTIONS);
  options.name ??= `${projectName}-${options.format}`;
  options.target ??= DEFAULT_TARGET;

  const packageJsonPath = joinPaths(
    workspaceRoot.dir,
    options.projectRoot,
    "package.json"
  );
  if (!existsSync(packageJsonPath)) {
    throw new Error("Cannot find package.json configuration");
  }

  const env = getEnv("esbuild", options as Parameters<typeof getEnv>[1]);

  const resolvedOptions = {
    ...options,
    tsconfig: joinPaths(
      projectRoot,
      userOptions.tsconfig
        ? userOptions.tsconfig.replace(projectRoot, "")
        : "tsconfig.json"
    ),
    distDir: "dist",
    name: projectName,
    metafile: userOptions.mode === "development",
    ...userOptions,
    clean: false,
    target: (userOptions.target || options.target) as Options["target"],
    splitting:
      options.format === "iife"
        ? false
        : options.treeshake === undefined
          ? options.splitting
          : true,
    env,
    define: {
      STORM_FORMAT: JSON.stringify(options.format),
      ...options.define,
      ...Object.keys(env || {}).reduce((res, key) => {
        const value = JSON.stringify(env[key]);
        const safeKey = key.replaceAll("(", "").replaceAll(")", "");

        return {
          ...res,
          [`process.env.${safeKey}`]: value,
          [`import.meta.env.${safeKey}`]: value
        };
      }, {})
    }
  } satisfies ESBuildOptions;

  // if (
  //   options.inject &&
  //   Array.isArray(options.inject) &&
  //   options.inject.length > 0
  // ) {
  //   result.inject = options.inject.reduce((ret, inj) => {
  //     if (inj && typeof inj === "string" && ret.includes(inj)) {
  //       ret.push(inj);
  //     }

  //     return ret;
  //   }, result.inject);
  // }

  stopwatch();

  return {
    options: resolvedOptions,
    clean: userOptions.clean !== false,
    workspaceConfig,
    projectConfigurations,
    projectName,
    projectGraph,
    sourceRoot:
      resolvedOptions.sourceRoot ||
      projectJson.sourceRoot ||
      joinPaths(resolvedOptions.projectRoot, "src"),
    outputPath:
      resolvedOptions.outputPath ||
      joinPaths(
        workspaceConfig.workspaceRoot,
        "dist",
        resolvedOptions.projectRoot
      ),
    minify: resolvedOptions.minify || resolvedOptions.mode === "production"
  } as ESBuildContext;
};

async function generatePackageJson(context: ESBuildContext) {
  if (
    context.options.generatePackageJson !== false &&
    existsSync(joinPaths(context.options.projectRoot, "package.json"))
  ) {
    writeDebug("  ✍️   Writing package.json file", context.workspaceConfig);
    const stopwatch = getStopwatch("Write package.json file");

    const packageJsonPath = joinPaths(
      context.options.projectRoot,
      "project.json"
    );
    if (!existsSync(packageJsonPath)) {
      throw new Error("Cannot find package.json configuration");
    }

    const packageJsonFile = await hf.readFile(
      joinPaths(
        context.workspaceConfig.workspaceRoot,
        context.options.projectRoot,
        "package.json"
      ),
      "utf8"
    );
    let packageJson = JSON.parse(packageJsonFile);
    if (!packageJson) {
      throw new Error("Cannot find package.json configuration file");
    }

    packageJson = await addPackageDependencies(
      context.workspaceConfig.workspaceRoot,
      context.options.projectRoot,
      context.projectName,
      packageJson
    );

    packageJson = await addWorkspacePackageJsonFields(
      context.workspaceConfig,
      context.options.projectRoot,
      context.sourceRoot,
      context.projectName,
      false,
      packageJson
    );

    if (context.options.entry) {
      packageJson.exports ??= {};
      packageJson.exports["./package.json"] ??= "./package.json";
      packageJson.exports["."] ??=
        `.${context.options.distDir ? `/${context.options.distDir}` : ""}/index.js`;

      const entryPoints = Array.isArray(context.options.entry)
        ? context.options.entry
        : Object.keys(context.options.entry);
      for (const entryPoint of entryPoints) {
        if (context.options.entry[entryPoint]) {
          const entry = context.options.entry[entryPoint]
            .replaceAll("\\", "/")
            .replaceAll(/^(\.\/)*/g, "")
            .replace(/\.([cm])?[jt]s(x)?$/g, "");

          packageJson.exports[`./${entry}`] ??=
            `.${context.options.distDir ? `/${context.options.distDir}` : ""}/${entry}.js`;
        }
      }

      if (context.options.format === "esm") {
        packageJson.module =
          packageJson.type === "module"
            ? `.${context.options.distDir ? `/${context.options.distDir}` : ""}/index.js`
            : `.${context.options.distDir ? `/${context.options.distDir}` : ""}/index.mjs`;
      } else {
        packageJson.main =
          packageJson.type === "commonjs"
            ? `.${context.options.distDir ? `/${context.options.distDir}` : ""}/index.js`
            : `.${context.options.distDir ? `/${context.options.distDir}` : ""}/index.cjs`;
      }

      packageJson.types = `.${context.options.distDir ? `/${context.options.distDir}` : ""}/index.d.ts`;

      packageJson.exports = Object.keys(packageJson.exports).reduce(
        (ret, key) => {
          if (key.endsWith("/index") && !ret[key.replace("/index", "")]) {
            ret[key.replace("/index", "")] = packageJson.exports[key];
          }

          return ret;
        },
        packageJson.exports
      );
    }

    await writeJsonFile(
      joinPaths(context.outputPath, "package.json"),
      packageJson
    );

    stopwatch();
  }

  return context;
}

/**
 * Execute tsup with all the configurations we pass
 */
async function executeTsup(context: ESBuildContext) {
  writeDebug(
    `  🚀  Running ${context.options.name} build`,
    context.workspaceConfig
  );
  const stopwatch = getStopwatch(`${context.options.name} build`);

  await tsup({
    ...context.options,
    outDir: context.outputPath,
    workspaceConfig: context.workspaceConfig
  } as Options);

  stopwatch();

  return context;
}

// /**
//  * Execute esbuild with all the configurations we pass
//  */
// async function executeEsBuild(context: ESBuildContext) {
//   writeDebug(
//     `  🚀  Running ${context.options.name} build`,
//     context.options.config
//   );
//   const stopwatch = getStopwatch(`${context.options.name} build`);

//   if (process.env.STORM_WATCH) {
//     const ctx = await esbuild.context(context.options as esbuild.BuildOptions);

//     watch(ctx, context.options);
//   }

//   // Remove options not used by esbuild
//   const options = { ...context.options } as Partial<ESBuildOptions>;
//   options.outdir = joinPaths(context.options.outdir, context.options.distDir);

//   if (
//     !options.inject ||
//     !Array.isArray(options.inject) ||
//     options.inject.length === 0 ||
//     // eslint-disable-next-line no-constant-binary-expression, @typescript-eslint/no-explicit-any
//     (options.inject as any) === ({} as any)
//   ) {
//     delete options.inject;
//   }

//   delete options.dts;
//   delete options.env;
//   delete options.name;
//   delete options.assets;
//   delete options.mode;
//   delete options.orgName;
//   delete options.watch;
//   delete options.clean;
//   delete options.debug;
//   delete options.generatePackageJson;
//   delete options.distDir;
//   delete options.includeSrc;
//   delete options.verbose;
//   delete options.projectRoot;
//   delete options.projectName;
//   delete options.projectGraph;
//   delete options.projectConfigurations;
//   delete options.renderers;
//   delete options.config;
//   delete options.injectShims;
//   delete options.external;

//   writeTrace(
//     `Run esbuild (${context.options.name}) with the following options: \n${formatLogMessage({ ...options, define: "<Hidden>" })}`,
//     context.options.config
//   );

//   const result = await esbuild.build(
//     options as Omit<
//       ESBuildOptions,
//       | "dts"
//       | "env"
//       | "name"
//       | "assets"
//       | "mode"
//       | "orgName"
//       | "watch"
//       | "clean"
//       | "debug"
//       | "generatePackageJson"
//       | "emitOnAll"
//       | "distDir"
//       | "includeSrc"
//       | "verbose"
//       | "projectRoot"
//       | "projectName"
//       | "projectGraph"
//       | "projectConfigurations"
//       | "renderers"
//       | "config"
//       | "injectShims"
//     >
//   );
//   await esbuild.stop();

//   if (result.metafile) {
//     const metafilePath = `${context.options.outdir}/${context.options.name}.meta.json`;
//     await hf.writeFile(metafilePath, JSON.stringify(result.metafile));
//   }

//   stopwatch();

//   return context;
// }

/**
 * Execute the typescript compiler
 */
export async function executeTypescript(context: ESBuildContext) {
  if (context.result?.errors.length === 0 && context.options.dts) {
    writeDebug(
      `  📋  Running TypeScript Compiler for ${context.options.name}`,
      context.workspaceConfig
    );
    const stopwatch = getStopwatch(`${context.options.name} asset copy`);

    await emitDts(
      context.workspaceConfig,
      context.options.tsconfig!,
      context.options.tsconfigRaw,
      true
    );

    stopwatch();
  }

  return context;
}

/**
 * Copy the assets to the build directory
 */
async function copyBuildAssets(context: ESBuildContext) {
  if (context.result?.errors.length === 0) {
    writeDebug(
      `  📋  Copying asset files to output directory: ${context.outputPath}`,
      context.workspaceConfig
    );
    const stopwatch = getStopwatch(`${context.options.name} asset copy`);

    await copyAssets(
      context.workspaceConfig,
      context.options.assets ?? [],
      context.outputPath,
      context.options.projectRoot,
      context.sourceRoot,
      true,
      false
    );

    stopwatch();
  }

  return context;
}

/**
 * Report the results of the build
 */
async function reportResults(context: ESBuildContext) {
  if (context.result?.errors.length === 0) {
    if (context.result.warnings.length > 0) {
      writeWarning(
        `  🚧  The following warnings occurred during the build: ${context.result.warnings
          .map(warning => warning.text)
          .join("\n")}`,
        context.workspaceConfig
      );
    }

    writeSuccess(
      `  📦  The ${context.options.name} build completed successfully`,
      context.workspaceConfig
    );
  } else if (context.result?.errors && context.result?.errors.length > 0) {
    writeError(
      `  ❌  The ${context.options.name} build failed with the following errors: ${context.result.errors
        .map(error => error.text)
        .join("\n")}`,
      context.workspaceConfig
    );

    throw new Error(
      `The ${context.options.name} build failed with the following errors: ${context.result.errors
        .map(error => error.text)
        .join("\n")}`
    );
  }
}

/**
 * A blank esbuild run to do an analysis of our deps
 */
async function dependencyCheck(options: ESBuildOptions) {
  // we only check our dependencies for a full build
  if (process.env.DEV === "true") {
    return undefined;
  }
  // Only run on test and publish pipelines on Buildkite
  // Meaning we skip on GitHub Actions
  // Because it's slow and runs for each job, during setup, making each job slower
  if (process.env.CI && !process.env.BUILDKITE) {
    return undefined;
  }

  // we need to bundle everything to do the analysis
  const buildPromise = esbuild.build({
    entryPoints: globbySync("**/*.{j,t}s", {
      // We don't check dependencies in ecosystem tests because tests are isolated from the build.
      ignore: ["./src/__tests__/**/*", "./tests/e2e/**/*", "./dist/**/*"],
      gitignore: true
    }),
    logLevel: "silent", // there will be errors
    bundle: true, // we bundle to get everything
    write: false, // no need to write for analysis
    outdir: "out",
    plugins: [depsCheckPlugin(options.bundle)]
  });

  // we absolutely don't care if it has any errors
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  await buildPromise.catch(() => {});

  return undefined;
}

/**
 * Clean the output path
 *
 * @param context - the build context
 */
export async function cleanOutputPath(context: ESBuildContext) {
  if (context.clean !== false && context.outputPath) {
    writeDebug(
      ` 🧹  Cleaning ${context.options.name} output path: ${context.outputPath}`,
      context.workspaceConfig
    );
    const stopwatch = getStopwatch(`${context.options.name} output clean`);

    await cleanDirectories(
      context.options.name,
      context.outputPath,
      context.workspaceConfig
    );

    stopwatch();
  }

  return context;
}

/**
 * Execution pipeline that applies a set of actions
 *
 * @param options - the build options
 * @returns the build result
 */
export async function build(options: ESBuildOptions) {
  writeDebug(`  ⚡   Executing Storm ESBuild pipeline`);
  const stopwatch = getStopwatch("ESBuild pipeline");

  try {
    const opts = Array.isArray(options) ? options : [options];
    if (opts.length === 0) {
      throw new Error("No build options were provided");
    }

    const context = await resolveContext(options);
    await cleanOutputPath(context);

    await Promise.all([
      dependencyCheck(context.options),
      generatePackageJson(context),
      copyBuildAssets(context),
      executeTsup(context)
    ]);
    await reportResults(context);

    writeSuccess("  🏁  ESBuild pipeline build completed successfully");
  } catch (error) {
    writeFatal(
      "Fatal errors that the build process could not recover from have occured. The build process has been terminated."
    );

    throw error;
  } finally {
    stopwatch();
  }
}

/**
 * Executes the build and rebuilds what is necessary
 *
 * @param context - the build context
 * @param options - the build options
 * @returns the build result
 */
export const watch = (context: BuildContext, options: ESBuildOptions) => {
  if (!options.watch) {
    return context;
  }

  // common chokidar options for the watchers
  const config = {
    ignoreInitial: true,
    useFsEvents: true,
    ignored: ["./src/__tests__/**/*", "./package.json"]
  };

  // prepare the incremental builds watcher
  const changeWatcher = createWatcher(["./src/**/*"], config);

  // triggers quick rebuild on file change
  const fastRebuild = debounce(async () => {
    const timeBefore = Date.now();

    // we handle possible rebuild exceptions
    const rebuildResult = await handle.async(() => {
      return context.rebuild();
    });

    if (rebuildResult instanceof Error) {
      writeError(rebuildResult.message);
    }

    writeTrace(`${Date.now() - timeBefore}ms [${options.name ?? ""}]`);
  }, 10);

  changeWatcher.on("change", fastRebuild);

  return undefined;
};

// Utils ::::::::::::::::::::::::::::::::::::::::::::::::::

// get the current project externals this helps to mark dependencies as external
// by having convention in the package.json (dev = bundled, non-dev = external)
// function getProjectExternals(options: ESBuildOptions) {
//   const pkg = require(`${process.cwd()}/package.json`);
//   const peerDeps = Object.keys(pkg.peerDependencies ?? {});
//   const regDeps = Object.keys(pkg.dependencies ?? {});

//   // when bundling, only the devDeps will be bundled
//   if (!process.env.IGNORE_EXTERNALS && options.bundle === true) {
//     return [...new Set([...peerDeps, ...regDeps])];
//   }

//   // otherwise, all the dependencies will be bundled
//   return [];
// }
