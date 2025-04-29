import {
  createProjectGraphAsync,
  readProjectsConfigurationFromProjectGraph,
  writeJsonFile
} from "@nx/devkit";
import {
  addPackageDependencies,
  addWorkspacePackageJsonFields,
  copyAssets,
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
import { ESBuildContext, type ESBuildOptions } from "./types";
import { handle } from "./utilities/helpers";

/**
 * Apply defaults to the original build options
 *
 * @param userOptions - the original build options provided by the user
 * @returns the build options with defaults applied
 */
async function resolveContext(
  userOptions: ESBuildOptions
): Promise<ESBuildContext> {
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

  const options = defu(userOptions, DEFAULT_BUILD_OPTIONS) as ESBuildOptions;

  const packageJsonPath = joinPaths(
    workspaceRoot.dir,
    options.projectRoot,
    "package.json"
  );
  if (!existsSync(packageJsonPath)) {
    throw new Error("Cannot find package.json configuration");
  }

  const env = getEnv("esbuild", options as Parameters<typeof getEnv>[1]);
  const define = defu(options.define ?? {}, env ?? {});

  const resolvedOptions = {
    name: projectName,
    ...options,
    tsconfig: joinPaths(
      projectRoot,
      userOptions.tsconfig
        ? userOptions.tsconfig.replace(projectRoot, "")
        : "tsconfig.json"
    ),
    metafile: userOptions.mode === "development",
    clean: false,
    env,
    define: {
      STORM_FORMAT: JSON.stringify(options.format),
      ...Object.keys(define)
        .filter(key => define[key] !== undefined)
        .reduce((res, key) => {
          const value = JSON.stringify(define[key]);
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
}

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

      const entryPoints = Array.isArray(context.options.entry)
        ? context.options.entry
        : Object.keys(context.options.entry);
      if (entryPoints.length > 0) {
        const defaultEntry = entryPoints.includes("index")
          ? `.${context.options.distDir ? `/${context.options.distDir}` : ""}/index`
          : `.${context.options.distDir ? `/${context.options.distDir}` : ""}/${entryPoints[0]}`;

        const isEsm = Array.isArray(context.options.format)
          ? context.options.format.includes("esm")
          : context.options.format === "esm";
        const isCjs = Array.isArray(context.options.format)
          ? context.options.format.includes("cjs")
          : context.options.format === "cjs";
        const isDts = context.options.dts || context.options.experimentalDts;

        packageJson.exports["."] ??=
          `${defaultEntry}.${isEsm ? "mjs" : isCjs ? "cjs" : "js"}`;

        for (const entryPoint of entryPoints) {
          packageJson.exports[`./${entryPoint}`] ??= {};
          if (isEsm) {
            if (isDts) {
              packageJson.exports[`./${entryPoint}`].import = {
                types: `./dist/${entryPoint}.d.mts`,
                default: `./dist/${entryPoint}.mjs`
              };
            } else {
              packageJson.exports[`./${entryPoint}`].import =
                `./dist/${entryPoint}.mjs`;
            }

            if (isDts) {
              packageJson.exports[`./${entryPoint}`].default = {
                types: `./dist/${entryPoint}.d.mts`,
                default: `./dist/${entryPoint}.mjs`
              };
            } else {
              packageJson.exports[`./${entryPoint}`].default =
                `./dist/${entryPoint}.mjs`;
            }
          }
          if (isCjs) {
            if (isDts) {
              packageJson.exports[`./${entryPoint}`].require = {
                types: `./dist/${entryPoint}.d.cts`,
                default: `./dist/${entryPoint}.cjs`
              };
            } else {
              packageJson.exports[`./${entryPoint}`].require =
                `./dist/${entryPoint}.cjs`;
            }

            if (!isEsm) {
              if (isDts) {
                packageJson.exports[`./${entryPoint}`].default = {
                  types: `./dist/${entryPoint}.d.cts`,
                  default: `./dist/${entryPoint}.cjs`
                };
              } else {
                packageJson.exports[`./${entryPoint}`].default =
                  `./dist/${entryPoint}.cjs`;
              }
            }
          }

          if (!isEsm && !isCjs) {
            if (isDts) {
              packageJson.exports[`./${entryPoint}`].default = {
                types: `./dist/${entryPoint}.d.ts`,
                default: `./dist/${entryPoint}.js`
              };
            } else {
              packageJson.exports[`./${entryPoint}`].default =
                `./dist/${entryPoint}.js`;
            }
          }
        }

        if (isEsm) {
          packageJson.module = `${defaultEntry}.mjs`;
        } else {
          packageJson.main = `${defaultEntry}.cjs`;
        }

        if (isDts) {
          packageJson.types = `${defaultEntry}.d.${isEsm ? "mts" : isCjs ? "cts" : "ts"}`;
        }

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
    outDir: context.options.distDir
      ? joinPaths(context.outputPath, context.options.distDir)
      : context.outputPath,
    workspaceConfig: context.workspaceConfig
  } as Options);

  stopwatch();

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
async function cleanOutputPath(context: ESBuildContext) {
  if (context.clean !== false && context.outputPath) {
    writeDebug(
      ` 🧹  Cleaning ${context.options.name} output path: ${context.outputPath}`,
      context.workspaceConfig
    );
    const stopwatch = getStopwatch(`${context.options.name} output clean`);

    await cleanDirectories(context.outputPath);

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
