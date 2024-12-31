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

import { hfs } from "@humanfs/node";
import {
  createProjectGraphAsync,
  joinPathFragments,
  readProjectsConfigurationFromProjectGraph,
  writeJsonFile
} from "@nx/devkit";
import {
  addPackageDependencies,
  addPackageJsonExport,
  addWorkspacePackageJsonFields,
  copyAssets
} from "@storm-software/build-tools";
import { loadStormConfig } from "@storm-software/config-tools/create-storm-config";
import {
  getStopwatch,
  writeDebug,
  writeError,
  writeFatal,
  writeSuccess,
  writeTrace,
  writeWarning
} from "@storm-software/config-tools/logger/console";
import { watch as createWatcher } from "chokidar";
import { debounce, flatten, omit } from "es-toolkit";
import { map } from "es-toolkit/compat";
import * as esbuild from "esbuild";
import { BuildContext } from "esbuild";
import { globbySync } from "globby";
import path from "node:path";
import { findWorkspaceRoot } from "nx/src/utils/find-workspace-root";
import { DEFAULT_BUILD_OPTIONS, getOutputExtensionMap } from "./config";
import { depsCheckPlugin } from "./plugins/deps-check";
import { esmSplitCodeToCjsPlugin } from "./plugins/esm-split-code-to-cjs";
import { fixImportsPlugin } from "./plugins/fix-imports";
import { nativeNodeModulesPlugin } from "./plugins/native-node-module";
import { nodeProtocolPlugin } from "./plugins/node-protocol";
import { onErrorPlugin } from "./plugins/on-error";
import { resolvePathsPlugin } from "./plugins/resolve-paths";
import { tscPlugin } from "./plugins/tsc";
import { ESBuildResolvedOptions, type ESBuildOptions } from "./types";
import { handle, pipe, transduce } from "./utilities/helpers";

/**
 * Apply defaults to the original build options
 *
 * @param options - the original build options
 * @returns the build options with defaults applied
 */
const resolveOptions = async (
  options: ESBuildOptions
): Promise<ESBuildResolvedOptions> => {
  const projectRoot = options.projectRoot;

  const workspaceRoot = findWorkspaceRoot(projectRoot);
  if (!workspaceRoot) {
    throw new Error("Cannot find Nx workspace root");
  }

  const config = await loadStormConfig(workspaceRoot.dir);

  writeDebug("  ⚙️   Resolving build options", config);
  const stopwatch = getStopwatch("Build options resolution");

  const nxJsonPath = joinPathFragments(workspaceRoot.dir, "nx.json");
  if (!(await hfs.isFile(nxJsonPath))) {
    throw new Error("Cannot find Nx workspace configuration");
  }

  const projectGraph = await createProjectGraphAsync({
    exitOnError: true
  });

  const projectJsonPath = joinPathFragments(
    workspaceRoot.dir,
    projectRoot,
    "project.json"
  );
  if (!(await hfs.isFile(projectJsonPath))) {
    throw new Error("Cannot find project.json configuration");
  }

  const projectJson = await hfs.json(projectJsonPath);
  const projectName = projectJson.name;

  const projectConfigurations =
    readProjectsConfigurationFromProjectGraph(projectGraph);
  if (!projectConfigurations?.projects?.[projectName]) {
    throw new Error(
      "The Build process failed because the project does not have a valid configuration in the project.json file. Check if the file exists in the root of the project."
    );
  }

  const packageJsonPath = joinPathFragments(
    workspaceRoot.dir,
    projectRoot,
    "package.json"
  );
  if (!(await hfs.isFile(packageJsonPath))) {
    throw new Error("Cannot find package.json configuration");
  }

  const packageJson = await hfs.json(packageJsonPath);

  const format = options.format || "cjs";
  const platform = options.platform || "node";

  const outExtension = getOutputExtensionMap(options, format, packageJson.type);
  const env: { [k: string]: string } = {
    ...options.env
  };

  const result = {
    ...DEFAULT_BUILD_OPTIONS,
    config,
    mainFields:
      platform === "node" ? ["module", "main"] : ["browser", "module", "main"],
    resolveExtensions: [".ts", ".js", ".node"],
    ...options,
    tsconfig:
      options.tsconfig || joinPathFragments(projectRoot, "tsconfig.json"),
    outExtension,
    splitting:
      format === "iife"
        ? false
        : typeof options.splitting === "boolean"
          ? options.splitting
          : format === "esm",
    platform,
    format,
    entryPoints: options.entryPoints || ["./src/index.ts"],
    outdir:
      options.outdir ||
      joinPathFragments(workspaceRoot.dir, "dist", projectRoot),
    loader: {
      ".aac": "file",
      ".css": "file",
      ".eot": "file",
      ".flac": "file",
      ".gif": "file",
      ".jpeg": "file",
      ".jpg": "file",
      ".mp3": "file",
      ".mp4": "file",
      ".ogg": "file",
      ".otf": "file",
      ".png": "file",
      ".svg": "file",
      ".ttf": "file",
      ".wav": "file",
      ".webm": "file",
      ".webp": "file",
      ".woff": "file",
      ".woff2": "file",
      ...options.loader
    },
    define: {
      STORM_FORMAT: JSON.stringify(format || "cjs"),
      ...(format === "cjs" && options.injectShims
        ? {
            "import.meta.url": "importMetaUrl"
          }
        : {}),
      ...options.define,
      ...Object.keys(env).reduce((res, key) => {
        const value = JSON.stringify(env[key]);
        return {
          ...res,
          [`process.env.${key}`]: value,
          [`import.meta.env.${key}`]: value
        };
      }, {})
    },
    inject: [
      format === "cjs" && options.injectShims
        ? path.join(__dirname, "../assets/cjs_shims.js")
        : "",
      format === "esm" && options.injectShims && platform === "node"
        ? path.join(__dirname, "../assets/esm_shims.js")
        : "",
      ...(options.inject || [])
    ].filter(Boolean),
    plugins: [
      ...(options.plugins ?? []),
      nodeProtocolPlugin(),
      resolvePathsPlugin,
      fixImportsPlugin,
      nativeNodeModulesPlugin(),
      esmSplitCodeToCjsPlugin,
      tscPlugin(options.emitTypes),
      onErrorPlugin
    ],
    external: [...(options.external ?? [])],
    name: `${options.name || projectName}-${format}`,
    projectConfigurations,
    projectName,
    projectGraph,
    workspaceRoot,
    sourceRoot:
      options.sourceRoot ||
      joinPathFragments(workspaceRoot.dir, projectRoot, "src")
  } satisfies ESBuildResolvedOptions;

  stopwatch();

  return result;
};

async function generatePackageJson(options: ESBuildResolvedOptions) {
  if (
    options.generatePackageJson !== false &&
    (await hfs.isFile(joinPathFragments(options.projectRoot, "package.json")))
  ) {
    writeDebug("  ✍️   Writing package.json file", options.config);
    const stopwatch = getStopwatch("Write package.json file");

    const packageJsonPath = joinPathFragments(
      options.projectRoot,
      "project.json"
    );
    if (!(await hfs.isFile(packageJsonPath))) {
      throw new Error("Cannot find package.json configuration");
    }

    let packageJson = await hfs.json(
      joinPathFragments(
        options.workspaceRoot.dir,
        options.projectRoot,
        "package.json"
      )
    );
    if (!packageJson) {
      throw new Error("Cannot find package.json configuration file");
    }

    packageJson = await addPackageDependencies(
      options.workspaceRoot.dir,
      options.projectRoot,
      options.projectName,
      packageJson
    );

    packageJson = await addWorkspacePackageJsonFields(
      options.config,
      options.projectRoot,
      options.sourceRoot,
      options.projectName,
      false,
      packageJson
    );

    let entryPoints = [{ in: "./src/index.ts", out: "./src/index.ts" }];
    if (options.entryPoints) {
      if (Array.isArray(options.entryPoints)) {
        entryPoints = (
          options.entryPoints as (string | { in: string; out: string })[]
        ).map(entryPoint =>
          typeof entryPoint === "string"
            ? { in: entryPoint, out: entryPoint }
            : entryPoint
        );
      } else {
        entryPoints = Object.entries(options.entryPoints).map(
          ([key, value]) => ({
            in: key,
            out: value
          })
        );
      }
    }

    for (const entryPoint of entryPoints) {
      const split = entryPoint.out.split(".");
      split.pop();
      const entry = split.join(".").replaceAll("\\", "/");

      packageJson.exports[`./${entry}`] ??= addPackageJsonExport(entry);
    }

    packageJson.exports["./package.json"] ??= "./package.json";
    packageJson.exports["."] ??= addPackageJsonExport("./src/index.ts");

    packageJson.main = "./dist/index.cjs";
    packageJson.module = "./dist/index.js";
    packageJson.types = "./dist/index.d.ts";

    await writeJsonFile(
      joinPathFragments(options.outdir, "package.json"),
      packageJson
    );

    stopwatch();
  }

  return options;
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
      map(options, options => [
        // we defer it so that we don't trigger glob immediately
        () => resolveOptions(options)
      ])
    )
  );
}

/**
 * We only want to trigger the glob search once we are ready, and that is when
 * the previous build has finished. We get the build options from the deferred.
 */
async function computeOptions(
  options: () => Promise<ESBuildResolvedOptions>
): Promise<ESBuildResolvedOptions> {
  return options();
}

// /**
//  * Extensions are not automatically by esbuild set for `options.outfile`. We
//  * look at the set `options.outExtension` and we add that to `options.outfile`.
//  */
// function addExtensionFormat(options: ESBuildOptions) {
//   if (options.outfile && options.outExtension) {
//     const ext = options.outExtension[".js"];

//     options.outfile = `${options.outfile}${ext}`;
//   }

//   return options;
// }

// /**
//  * If we don't have `options.outfile`, we default `options.outdir`
//  */
// function addDefaultOutDir(options: ESBuildOptions) {
//   if (options.outfile === undefined) {
//     options.outdir = getOutDir(options);
//   }

//   return options;
// }

/**
 * Execute esbuild with all the configurations we pass
 */
async function executeEsBuild(options: ESBuildResolvedOptions) {
  writeDebug(`  🚀  Running ${options.name} build`, options.config);
  const stopwatch = getStopwatch(`${options.name} build`);

  if (process.env.WATCH === "true") {
    const context = await esbuild.context(
      omit(options, ["name", "emitTypes", "emitMetafile"]) as any
    );

    watch(context, options);
  }

  const result = await esbuild.build(
    omit(options, ["name", "emitTypes", "emitMetafile"]) as any
  );

  if (result.metafile && options.emitMetafile) {
    const metafilePath = `${options.outdir}/${options.name}.meta.json`;
    await hfs.write(metafilePath, JSON.stringify(result.metafile));
  }

  stopwatch();

  return [options, result] as const;
}

/**
 * Copy the assets to the build directory
 */
async function copyBuildAssets([options, result]: [
  ESBuildResolvedOptions,
  esbuild.BuildResult
]) {
  if (result.errors.length === 0) {
    writeDebug(
      `  📋  Copying asset files to output directory: ${options.outdir}`,
      options.config
    );
    const stopwatch = getStopwatch(`${options.name} asset copy`);

    await copyAssets(
      options.config,
      options.assets ?? [],
      options.outdir,
      options.projectRoot,
      options.projectName,
      options.sourceRoot,
      true,
      false
    );

    stopwatch();
  }

  return [options, result] as const;
}

/**
 * Report the results of the build
 */
async function reportResults([options, result]: [
  ESBuildResolvedOptions,
  esbuild.BuildResult
]) {
  if (result.errors.length === 0) {
    if (result.warnings.length > 0) {
      writeWarning(
        `  🚧  The following warnings occurred during the build: ${result.warnings
          .map(warning => warning.text)
          .join("\n")}`,
        options.config
      );
    }

    writeSuccess(
      `  📦  The ${options.name} build completed successfully`,
      options.config
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
 * @param options - the build options
 */
async function cleanOutputPath(options: ESBuildResolvedOptions) {
  if (options.clean !== false && options.outdir) {
    writeDebug(
      ` 🧹  Cleaning ${options.name} output path: ${options.outdir}`,
      options.config
    );
    const stopwatch = getStopwatch(`${options.name} output clean`);

    await hfs.deleteAll(options.outdir);

    stopwatch();
  }

  return options;
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
        computeOptions,
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
  if (process.env.WATCH !== "true") return context;

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
