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

import { readCachedProjectGraph, writeJsonFile } from "@nx/devkit";
import { getHelperDependency, HelperDependency } from "@nx/js";
import { calculateProjectBuildableDependencies } from "@nx/js/src/utils/buildable-libs-utils";
import {
  addPackageDependencies,
  addPackageJsonExports,
  addWorkspacePackageJsonFields,
  copyAssets
} from "@storm-software/build-tools";
import { loadStormConfig } from "@storm-software/config-tools/create-storm-config";
import {
  getStopwatch,
  writeDebug,
  writeFatal,
  writeSuccess
} from "@storm-software/config-tools/logger/console";
import { isVerbose } from "@storm-software/config-tools/logger/get-log-level";
import { LogLevelLabel } from "@storm-software/config-tools/types";
import { joinPaths } from "@storm-software/config-tools/utilities/correct-paths";
import { StormConfig } from "@storm-software/config/types";
import defu from "defu";
import { LogLevel } from "esbuild";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { relative } from "node:path";
import { findWorkspaceRoot } from "nx/src/utils/find-workspace-root";
import { type BuildConfig, type BuildContext, build as unbuild } from "unbuild";
import { cleanDirectories } from "./clean";
import { getDefaultBuildPlugins } from "./config";
import type { UnbuildOptions, UnbuildResolvedOptions } from "./types";
import { loadConfig } from "./utilities/helpers";

/**
 * Get the build options for the unbuild process
 *
 * @param options - the unbuild options
 * @returns the resolved options
 */
async function resolveOptions(
  options: UnbuildOptions,
  config: StormConfig
): Promise<UnbuildResolvedOptions> {
  writeDebug("  ⚙️   Resolving build options", config);
  const stopwatch = getStopwatch("Build options resolution");

  if (options.configPath) {
    const configFile = await loadConfig(options.configPath as string);
    if (configFile) {
      options = defu(options, configFile) as UnbuildOptions;
    }
  }

  const outputPath =
    options.outputPath || joinPaths("dist", options.projectRoot);

  const projectGraph = readCachedProjectGraph();

  const projectJsonPath = joinPaths(
    config.workspaceRoot,
    options.projectRoot,
    "project.json"
  );
  if (!existsSync(projectJsonPath)) {
    throw new Error("Cannot find project.json configuration");
  }

  const projectJsonContent = await readFile(projectJsonPath, "utf8");
  const projectJson = JSON.parse(projectJsonContent);

  const projectName = projectJson.name;

  const packageJsonPath = joinPaths(
    config.workspaceRoot,
    options.projectRoot,
    "package.json"
  );
  if (!existsSync(packageJsonPath)) {
    throw new Error("Cannot find package.json configuration");
  }

  const packageJsonContent = await readFile(packageJsonPath, "utf8");
  const packageJson = JSON.parse(packageJsonContent);

  let tsconfig = options.tsconfig;
  if (!tsconfig) {
    tsconfig = joinPaths(
      config.workspaceRoot,
      options.projectRoot,
      "tsconfig.json"
    );
  }

  if (!existsSync(tsconfig)) {
    throw new Error("Cannot find tsconfig.json configuration");
  }

  let sourceRoot = projectJson.sourceRoot;
  if (!sourceRoot) {
    sourceRoot = joinPaths(options.projectRoot, "src");
  }

  if (!existsSync(sourceRoot)) {
    throw new Error("Cannot find sourceRoot directory");
  }

  const result = calculateProjectBuildableDependencies(
    undefined,
    projectGraph,
    config.workspaceRoot,
    projectName,
    process.env.NX_TASK_TARGET_TARGET || "build",
    process.env.NX_TASK_TARGET_CONFIGURATION || "production",
    true
  );
  let dependencies = result.dependencies;

  const tsLibDependency = getHelperDependency(
    HelperDependency.tsc,
    tsconfig,
    dependencies,
    projectGraph,
    true
  );
  if (tsLibDependency) {
    dependencies = dependencies.filter(
      deps => deps.name !== tsLibDependency.name
    );
    dependencies.push(tsLibDependency);
  }

  const resolvedOptions = {
    name: projectName,
    config,
    projectRoot: options.projectRoot,
    sourceRoot,
    projectName,
    tsconfig,
    clean: false,
    entries: [
      {
        builder: "mkdist",
        input: `.${sourceRoot.replace(options.projectRoot, "")}`,
        outDir: joinPaths(
          relative(
            joinPaths(config.workspaceRoot, options.projectRoot),
            config.workspaceRoot
          ).replaceAll("\\", "/"),
          outputPath,
          "dist"
        ).replaceAll("\\", "/"),
        declaration: options.emitTypes !== false,
        format: "esm"
      },
      {
        builder: "mkdist",
        input: `.${sourceRoot.replace(options.projectRoot, "")}`,
        outDir: joinPaths(
          relative(
            joinPaths(config.workspaceRoot, options.projectRoot),
            config.workspaceRoot
          ).replaceAll("\\", "/"),
          outputPath,
          "dist"
        ).replaceAll("\\", "/"),
        declaration: options.emitTypes !== false,
        format: "cjs",
        ext: "cjs"
      }
    ],
    declaration: options.emitTypes !== false ? "compatible" : false,
    failOnWarn: false,
    sourcemap: options.sourcemap ?? !!options.debug,
    outDir: outputPath,
    parallel: true,
    stub: false,
    stubOptions: {
      jiti: {}
    },
    externals: options.external ?? [],
    dependencies: [] as string[],
    peerDependencies: [] as string[],
    devDependencies: [] as string[],
    hooks: {},
    alias: {},
    replace: {},
    rollup: {
      replace: {},
      alias: {},
      json: {},
      commonjs: {
        sourceMap: options.sourcemap ?? true
      },
      emitCJS: true,
      cjsBridge: true,
      dts: {
        respectExternal: true,
        tsconfig
      },
      output: {
        banner:
          options.banner ||
          `
//      ⚡ Built by Storm Software
  `,
        footer: options.footer
      },
      resolve: {
        preferBuiltins: true,
        extensions: [".cjs", ".mjs", ".js", ".jsx", ".ts", ".tsx", ".json"]
      },
      esbuild: {
        minify: options.minify !== false,
        splitting: options.splitting !== false,
        treeShaking: options.treeShaking !== false,
        color: true,
        logLevel: (config.logLevel === LogLevelLabel.FATAL
          ? LogLevelLabel.ERROR
          : isVerbose()
            ? "verbose"
            : config.logLevel) as LogLevel
      }
    }
  };

  dependencies = dependencies.filter(
    dep =>
      dep.node.type === "npm" ||
      dep.node.type === "lib" ||
      dep.node.type === "app"
  );
  if (dependencies.length > 0) {
    resolvedOptions.dependencies = dependencies.map(dep => dep.name);
  }
  if (packageJson.devDependencies) {
    resolvedOptions.devDependencies = Object.keys(packageJson.devDependencies);
  }
  if (packageJson.peerDependencies) {
    resolvedOptions.peerDependencies = Object.keys(
      packageJson.peerDependencies
    );
  }

  if (options.rollup) {
    let rollup = {};
    if (typeof options.rollup === "string") {
      const rollupFile = await loadConfig(options.rollup as string);
      if (rollupFile) {
        rollup = rollupFile;
      }
    } else {
      rollup = options.rollup;
    }

    resolvedOptions.rollup = defu(resolvedOptions.rollup ?? {}, rollup);
  }

  resolvedOptions.hooks = {
    "rollup:options": async (ctx: BuildContext, opts: any) => {
      opts.plugins =
        options.plugins ??
        (await getDefaultBuildPlugins(options, resolvedOptions as any));
    }
  };

  stopwatch();

  return resolvedOptions as any;
}

async function generatePackageJson(options: UnbuildResolvedOptions) {
  if (
    options.generatePackageJson !== false &&
    existsSync(joinPaths(options.projectRoot, "package.json"))
  ) {
    writeDebug("  ✍️   Writing package.json file", options.config);
    const stopwatch = getStopwatch("Write package.json file");

    const packageJsonPath = joinPaths(options.projectRoot, "project.json");
    if (!existsSync(packageJsonPath)) {
      throw new Error("Cannot find package.json configuration");
    }

    let packageJsonContent = await readFile(
      joinPaths(
        options.config.workspaceRoot,
        options.projectRoot,
        "package.json"
      ),
      "utf8"
    );
    if (!packageJsonContent) {
      throw new Error("Cannot find package.json configuration file");
    }

    let packageJson = JSON.parse(packageJsonContent);
    packageJson = await addPackageDependencies(
      options.config.workspaceRoot,
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

    await writeJsonFile(
      joinPaths(options.outDir, "package.json"),
      await addPackageJsonExports(options.sourceRoot, packageJson)
    );

    stopwatch();
  }

  return options;
}

// type UnbuildModule = {
//   build: (
//     rootDir: string,
//     stub: boolean,
//     inputConfig: BuildConfig
//   ) => Promise<void>;
// };

/**
 * Resolve the unbuild package using [Jiti](https://github.com/unjs/jiti)
 */
// async function resolveUnbuild(
//   options: UnbuildResolvedOptions
// ): Promise<UnbuildModule> {
//   trace(`Resolving Unbuild package with Jiti`);

//   try {
//     return options.jiti.import<UnbuildModule>("unbuild");
//   } catch (error) {
//     error(
//       "  ❌  An error occurred while resolving the Unbuild package"
//     );

//     throw new Error("An error occurred while resolving the Unbuild package", {
//       cause: error
//     });
//   }
// }

/**
 * Execute esbuild with all the configurations we pass
 */
async function executeUnbuild(options: UnbuildResolvedOptions) {
  writeDebug(
    `  🚀  Running ${options.name} (${options.projectRoot}) build`,
    options.config
  );
  const stopwatch = getStopwatch(
    `${options.name} (${options.projectRoot}) build`
  );

  try {
    // const unbuild = await resolveUnbuild(options);

    await unbuild(options.projectRoot, false, {
      ...options,
      config: null,
      rootDir: options.projectRoot
    } as BuildConfig);
  } finally {
    stopwatch();
  }

  return options;
}

/**
 * Copy the assets to the build directory
 */
async function copyBuildAssets(options: UnbuildResolvedOptions) {
  writeDebug(
    `  📋  Copying asset files to output directory: ${options.outDir}`,
    options.config
  );
  const stopwatch = getStopwatch(`${options.name} asset copy`);

  await copyAssets(
    options.config,
    options.assets ?? [],
    options.outDir,
    options.projectRoot,
    options.projectName,
    options.sourceRoot,
    options.generatePackageJson,
    options.includeSrc
  );

  stopwatch();

  return options;
}

/**
 * Clean the output path
 *
 * @param options - the build options
 */
async function cleanOutputPath(options: UnbuildResolvedOptions) {
  if (options.clean !== false && options.outDir) {
    writeDebug(
      ` 🧹  Cleaning ${options.name} output path: ${options.outDir}`,
      options.config
    );
    const stopwatch = getStopwatch(`${options.name} output clean`);

    await cleanDirectories(options.name, options.outDir, options.config);

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
export async function build(options: UnbuildOptions) {
  const projectRoot = options.projectRoot;
  if (!projectRoot) {
    throw new Error("Cannot find project root");
  }

  const workspaceRoot = findWorkspaceRoot(projectRoot);
  if (!workspaceRoot) {
    throw new Error("Cannot find workspace root");
  }

  const config = await loadStormConfig(workspaceRoot.dir);

  writeDebug(` ⚡  Executing Storm Unbuild pipeline`, config);
  const stopwatch = getStopwatch("Unbuild pipeline");

  try {
    options.projectRoot = projectRoot;
    const resolvedOptions = await resolveOptions(options, config);

    await cleanOutputPath(resolvedOptions);
    await generatePackageJson(resolvedOptions);
    await executeUnbuild(resolvedOptions);
    await copyBuildAssets(resolvedOptions);

    writeSuccess(
      `  🏁  The ${resolvedOptions.name} build completed successfully`,
      config
    );
  } catch (error) {
    writeFatal(
      "  ❌  Fatal errors occurred during the build that could not be recovered from. The build process has been terminated.",
      config
    );

    throw error;
  } finally {
    stopwatch();
  }
}
