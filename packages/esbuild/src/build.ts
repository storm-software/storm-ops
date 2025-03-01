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
  addPackageJsonExport,
  addWorkspacePackageJsonFields,
  copyAssets,
  DEFAULT_COMPILED_BANNER,
  DEFAULT_TARGET,
  getEntryPoints,
  getEnv
} from "@storm-software/build-tools";
import { getConfig } from "@storm-software/config-tools/get-config";
import {
  getStopwatch,
  writeDebug,
  writeError,
  writeFatal,
  writeSuccess,
  writeTrace,
  writeWarning
} from "@storm-software/config-tools/logger/console";
import { isVerbose } from "@storm-software/config-tools/logger/get-log-level";
import { joinPaths } from "@storm-software/config-tools/utilities/correct-paths";
import { watch as createWatcher } from "chokidar";
import defu from "defu";
import { debounce, flatten } from "es-toolkit";
import { map } from "es-toolkit/compat";
import * as esbuild from "esbuild";
import { BuildContext } from "esbuild";
import { globbySync } from "globby";
import { existsSync } from "node:fs";
import hf from "node:fs/promises";
import { findWorkspaceRoot } from "nx/src/utils/find-workspace-root";
import { RendererEngine } from "./base/renderer-engine";
import { cleanDirectories } from "./clean";
import {
  DEFAULT_BUILD_OPTIONS,
  getDefaultBuildPlugins,
  getOutputExtensionMap
} from "./config";
import { depsCheckPlugin } from "./plugins/deps-check";
import { shebangRenderer } from "./renderers/shebang";
import {
  ESBuildContext,
  ESBuildResolvedOptions,
  type ESBuildOptions
} from "./types";
import { handle, pipe, transduce } from "./utilities/helpers";

/**
 * Apply defaults to the original build options
 *
 * @param userOptions - the original build options provided by the user
 * @returns the build options with defaults applied
 */
const resolveOptions = async (
  userOptions: ESBuildOptions
): Promise<ESBuildResolvedOptions> => {
  const projectRoot = userOptions.projectRoot;

  const workspaceRoot = findWorkspaceRoot(projectRoot);
  if (!workspaceRoot) {
    throw new Error("Cannot find Nx workspace root");
  }

  const config = await getConfig(workspaceRoot.dir);

  writeDebug("  ⚙️   Resolving build options", config);
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
  const projectName = projectJson.name;

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

  const packageJsonFile = await hf.readFile(packageJsonPath, "utf8");
  const packageJson = JSON.parse(packageJsonFile);
  const outExtension = getOutputExtensionMap(options, packageJson.type);

  const env = getEnv("esbuild", options as Parameters<typeof getEnv>[1]);

  const result = {
    ...options,
    config,
    mainFields:
      options.platform === "node"
        ? ["module", "main"]
        : ["browser", "module", "main"],
    resolveExtensions: [".ts", ".js", ".node"],
    ...userOptions,
    tsconfig: joinPaths(
      projectRoot,
      userOptions.tsconfig
        ? userOptions.tsconfig.replace(projectRoot, "")
        : "tsconfig.json"
    ),
    format: options.format || "cjs",
    entryPoints: await getEntryPoints(
      config,
      projectRoot,
      projectJson.sourceRoot,
      userOptions.entry || ["./src/index.ts"],
      userOptions.emitOnAll
    ),
    outdir: userOptions.outputPath || joinPaths("dist", projectRoot),
    plugins: [] as ESBuildResolvedOptions["plugins"],
    name: userOptions.name || projectName,
    projectConfigurations,
    projectName,
    projectGraph,
    sourceRoot:
      userOptions.sourceRoot ||
      projectJson.sourceRoot ||
      joinPaths(projectRoot, "src"),
    minify: userOptions.minify || !userOptions.debug,
    verbose: userOptions.verbose || isVerbose() || userOptions.debug === true,
    includeSrc: userOptions.includeSrc === true,
    metafile: userOptions.metafile !== false,
    generatePackageJson: userOptions.generatePackageJson !== false,
    clean: userOptions.clean !== false,
    emitOnAll: userOptions.emitOnAll === true,
    assets: userOptions.assets ?? [],
    injectShims: userOptions.injectShims !== true,
    bundle: userOptions.bundle !== false,
    keepNames: true,
    watch: userOptions.watch === true,
    outExtension,
    footer: userOptions.footer,
    banner: {
      js: options.banner || DEFAULT_COMPILED_BANNER,
      css: options.banner || DEFAULT_COMPILED_BANNER
    },
    splitting:
      options.format === "iife"
        ? false
        : typeof options.splitting === "boolean"
          ? options.splitting
          : options.format === "esm",
    treeShaking: options.format === "esm",
    env,
    define: {
      STORM_FORMAT: JSON.stringify(options.format || "cjs"),
      ...(options.format === "cjs" && options.injectShims
        ? {
            "import.meta.url": "importMetaUrl"
          }
        : {}),
      ...options.define,
      ...Object.keys(env || {}).reduce((res, key) => {
        const value = JSON.stringify(env[key]);
        return {
          ...res,
          [`process.env.${key}`]: value,
          [`import.meta.env.${key}`]: value
        };
      }, {})
    },
    inject: [
      options.format === "cjs" && options.injectShims
        ? joinPaths(__dirname, "../assets/cjs_shims.js")
        : "",
      options.format === "esm" &&
      options.injectShims &&
      options.platform === "node"
        ? joinPaths(__dirname, "../assets/esm_shims.js")
        : "",
      ...(options.inject ?? [])
    ].filter(Boolean)
  } satisfies ESBuildResolvedOptions;
  result.plugins =
    userOptions.plugins ?? getDefaultBuildPlugins(userOptions, result);
  delete result.entry;

  stopwatch();

  return result;
};

async function generatePackageJson(context: ESBuildContext) {
  if (
    context.options.generatePackageJson !== false &&
    existsSync(joinPaths(context.options.projectRoot, "package.json"))
  ) {
    writeDebug("  ✍️   Writing package.json file", context.options.config);
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
        context.options.config.workspaceRoot,
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
      context.options.config.workspaceRoot,
      context.options.projectRoot,
      context.options.projectName,
      packageJson
    );

    packageJson = await addWorkspacePackageJsonFields(
      context.options.config,
      context.options.projectRoot,
      context.options.sourceRoot,
      context.options.projectName,
      false,
      packageJson
    );

    packageJson.exports ??= {};
    packageJson.exports["./package.json"] ??= "./package.json";
    packageJson.exports["."] ??= addPackageJsonExport(
      "index",
      packageJson.type,
      context.options.sourceRoot
    );

    let entryPoints = [{ in: "./src/index.ts", out: "./src/index.ts" }];
    if (context.options.entryPoints) {
      if (Array.isArray(context.options.entryPoints)) {
        entryPoints = (
          context.options.entryPoints as (
            | string
            | { in: string; out: string }
          )[]
        ).map(entryPoint =>
          typeof entryPoint === "string"
            ? { in: entryPoint, out: entryPoint }
            : entryPoint
        );
      }

      for (const entryPoint of entryPoints) {
        const split = entryPoint.out.split(".");
        split.pop();
        const entry = split.join(".").replaceAll("\\", "/");

        packageJson.exports[`./${entry}`] ??= addPackageJsonExport(
          entry,
          packageJson.type,
          context.options.sourceRoot
        );
      }
    }

    packageJson.main =
      packageJson.type === "commonjs" ? "./dist/index.js" : "./dist/index.cjs";
    packageJson.module =
      packageJson.type === "module" ? "./dist/index.js" : "./dist/index.mjs";
    packageJson.types = "./dist/index.d.ts";

    packageJson.exports = Object.keys(packageJson.exports).reduce(
      (ret, key) => {
        if (key.endsWith("/index") && !ret[key.replace("/index", "")]) {
          ret[key.replace("/index", "")] = packageJson.exports[key];
        }

        return ret;
      },
      packageJson.exports
    );

    await writeJsonFile(
      joinPaths(context.options.outdir, "package.json"),
      packageJson
    );

    stopwatch();
  }

  return context;
}

/**
 * Create two deferred builds for esm and cjs. The one follows the other:
 * - 1. The code gets compiled to an optimized tree-shaken esm output
 * - 2. We take that output and compile it to an optimized cjs output
 *
 * @param options - the original build options
 * @returns if options = [a, b], we get [a-esm, a-cjs, b-esm, b-cjs]
 */
async function createOptions(options: ESBuildOptions[]) {
  return flatten(
    await Promise.all(
      map(options, opt => [
        // we defer it so that we don't trigger glob immediately
        () => resolveOptions(opt)
      ])
    )
  );
}

/**
 * We only want to trigger the glob search once we are ready, and that is when
 * the previous build has finished. We get the build options from the deferred.
 */
async function generateContext(
  getOptions: () => Promise<ESBuildResolvedOptions>
): Promise<ESBuildContext> {
  const options = await getOptions();

  const rendererEngine = new RendererEngine([
    shebangRenderer,
    ...(options.renderers || [])
    // treeShakingPlugin({
    //   treeshake: options.treeshake,
    //   name: options.globalName,
    //   silent: options.silent
    // }),
    // cjsSplitting(),
    // cjsInterop(),
    // sizeReporter(),
    // terserPlugin({
    //   minifyOptions: options.minify,
    //   format,
    //   terserOptions: options.terserOptions,
    //   globalName: options.globalName
    // })
  ]);

  return { options, rendererEngine };
}

/**
 * Execute esbuild with all the configurations we pass
 */
async function executeEsBuild(context: ESBuildContext) {
  writeDebug(
    `  🚀  Running ${context.options.name} build`,
    context.options.config
  );
  const stopwatch = getStopwatch(`${context.options.name} build`);

  if (process.env.STORM_WATCH) {
    const ctx = await esbuild.context(context.options as esbuild.BuildOptions);

    watch(ctx, context.options);
  }

  // Remove options not used by esbuild
  const options = { ...context.options } as Partial<ESBuildResolvedOptions>;
  delete options.env;
  delete options.name;
  delete options.assets;
  delete options.mode;
  delete options.orgName;
  delete options.watch;
  delete options.clean;
  delete options.debug;
  delete options.generatePackageJson;
  delete options.emitOnAll;
  delete options.includeSrc;
  delete options.verbose;
  delete options.projectRoot;
  delete options.projectName;
  delete options.projectGraph;
  delete options.projectConfigurations;
  delete options.renderers;
  delete options.config;
  delete options.injectShims;

  const result = await esbuild.build(
    options as Omit<
      ESBuildResolvedOptions,
      | "env"
      | "name"
      | "assets"
      | "mode"
      | "orgName"
      | "watch"
      | "clean"
      | "debug"
      | "generatePackageJson"
      | "emitOnAll"
      | "includeSrc"
      | "verbose"
      | "projectRoot"
      | "projectName"
      | "projectGraph"
      | "projectConfigurations"
      | "renderers"
      | "config"
      | "injectShims"
    >
  );

  if (result.metafile) {
    const metafilePath = `${context.options.outdir}/${context.options.name}.meta.json`;
    await hf.writeFile(metafilePath, JSON.stringify(result.metafile));
  }

  stopwatch();

  return context;
}

/**
 * Copy the assets to the build directory
 */
async function copyBuildAssets(context: ESBuildContext) {
  if (context.result?.errors.length === 0) {
    writeDebug(
      `  📋  Copying asset files to output directory: ${context.options.outdir}`,
      context.options.config
    );
    const stopwatch = getStopwatch(`${context.options.name} asset copy`);

    await copyAssets(
      context.options.config,
      context.options.assets ?? [],
      context.options.outdir,
      context.options.projectRoot,
      context.options.sourceRoot,
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
        context.options.config
      );
    }

    writeSuccess(
      `  📦  The ${context.options.name} build completed successfully`,
      context.options.config
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
  if (context.options.clean !== false && context.options.outdir) {
    writeDebug(
      ` 🧹  Cleaning ${context.options.name} output path: ${context.options.outdir}`,
      context.options.config
    );
    const stopwatch = getStopwatch(`${context.options.name} output clean`);

    await cleanDirectories(
      context.options.name,
      context.options.outdir,
      context.options.config
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
export async function build(options: ESBuildOptions | ESBuildOptions[]) {
  writeDebug(`  ⚡   Executing Storm ESBuild pipeline`);
  const stopwatch = getStopwatch("ESBuild pipeline");

  try {
    const opts = Array.isArray(options) ? options : [options];
    if (opts.length === 0) {
      throw new Error("No build options were provided");
    }

    void transduce.async(opts, dependencyCheck);

    await transduce.async(
      await createOptions(opts),
      pipe.async(
        generateContext,
        cleanOutputPath,
        generatePackageJson,
        executeEsBuild,
        copyBuildAssets,
        reportResults
      )
    );

    writeSuccess("  🏁  ESBuild pipeline build completed successfully");
  } catch (error) {
    writeFatal(
      "  ❌  Fatal errors occurred during the build that could not be recovered from. The build process has been terminated."
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
const watch = (context: BuildContext, options: ESBuildResolvedOptions) => {
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
