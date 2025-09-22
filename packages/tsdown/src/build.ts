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
  DEFAULT_TARGET,
  getEnv
} from "@storm-software/build-tools";
import { getWorkspaceConfig } from "@storm-software/config-tools/get-config";
import {
  getStopwatch,
  writeDebug,
  writeFatal,
  writeSuccess,
  writeWarning
} from "@storm-software/config-tools/logger/console";
import { joinPaths } from "@storm-software/config-tools/utilities/correct-paths";
import { findWorkspaceRoot } from "@storm-software/config-tools/utilities/find-workspace-root";
import defu from "defu";
import { existsSync } from "node:fs";
import hf from "node:fs/promises";
import { build as tsdown } from "tsdown";
import { cleanDirectories } from "./clean";
import { getDefaultOptions, toTSDownFormat } from "./config";
import { TSDownResolvedOptions, type TSDownOptions } from "./types";

/**
 * Apply defaults to the original build options
 *
 * @param options - the original build options provided by the user
 * @returns the build options with defaults applied
 */
const resolveOptions = async (
  userOptions: TSDownOptions
): Promise<TSDownResolvedOptions> => {
  const options = getDefaultOptions(userOptions);

  const workspaceRoot = findWorkspaceRoot(options.projectRoot);
  if (!workspaceRoot) {
    throw new Error("Cannot find Nx workspace root");
  }

  const workspaceConfig = await getWorkspaceConfig(options.debug === true, {
    workspaceRoot
  });

  writeDebug("  ⚙️   Resolving build options", workspaceConfig);
  const stopwatch = getStopwatch("Build options resolution");

  const projectGraph = await createProjectGraphAsync({
    exitOnError: true
  });

  const projectJsonPath = joinPaths(
    workspaceRoot,
    options.projectRoot,
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

  const packageJsonPath = joinPaths(
    workspaceRoot,
    options.projectRoot,
    "package.json"
  );
  if (!existsSync(packageJsonPath)) {
    throw new Error("Cannot find package.json configuration");
  }

  const debug =
    options.debug ?? (options.mode || workspaceConfig.mode) === "development";
  const sourceRoot =
    projectJson.sourceRoot || joinPaths(options.projectRoot, "src");

  const result: TSDownResolvedOptions = {
    name: projectName,
    mode: "production",
    target: DEFAULT_TARGET,
    generatePackageJson: true,
    outDir: joinPaths("dist", options.projectRoot),
    minify: !debug,
    plugins: [],
    assets: [],
    dts: true,
    shims: true,
    silent: !debug,
    logLevel:
      workspaceConfig.logLevel === "success" ||
      workspaceConfig.logLevel === "debug" ||
      workspaceConfig.logLevel === "trace" ||
      workspaceConfig.logLevel === "all"
        ? "info"
        : workspaceConfig.logLevel === "fatal"
          ? "error"
          : workspaceConfig.logLevel,
    sourcemap: debug ? "inline" : false,
    clean: false,
    fixedExtension: true,
    nodeProtocol: true,
    tsconfig: joinPaths(options.projectRoot, "tsconfig.json"),
    debug,
    sourceRoot,
    cwd: workspaceConfig.workspaceRoot,
    entry: {
      ["index"]: joinPaths(sourceRoot, "index.ts")
    },
    workspace: true,
    ...options,
    treeshake: options.treeShaking !== false,
    format: toTSDownFormat(options.format),
    workspaceConfig,
    projectName,
    projectGraph,
    projectConfigurations
  };

  result.env = defu(
    options.env,
    getEnv("tsdown", result as Parameters<typeof getEnv>[1])
  );

  stopwatch();

  return result;
};

async function generatePackageJson(options: TSDownResolvedOptions) {
  if (
    options.generatePackageJson !== false &&
    existsSync(joinPaths(options.projectRoot, "package.json"))
  ) {
    writeDebug("  ✍️   Writing package.json file", options.workspaceConfig);
    const stopwatch = getStopwatch("Write package.json file");

    const packageJsonPath = joinPaths(options.projectRoot, "project.json");
    if (!existsSync(packageJsonPath)) {
      throw new Error("Cannot find package.json configuration");
    }

    const packageJsonFile = await hf.readFile(
      joinPaths(
        options.workspaceConfig.workspaceRoot,
        options.projectRoot,
        "package.json"
      ),
      "utf8"
    );
    if (!packageJsonFile) {
      throw new Error("Cannot find package.json configuration file");
    }

    let packageJson = JSON.parse(packageJsonFile);
    packageJson = await addPackageDependencies(
      options.workspaceConfig.workspaceRoot,
      options.projectRoot,
      options.projectName,
      packageJson
    );

    packageJson = await addWorkspacePackageJsonFields(
      options.workspaceConfig,
      options.projectRoot,
      options.sourceRoot,
      options.projectName,
      false,
      packageJson
    );

    packageJson.exports ??= {};
    packageJson.exports["./package.json"] ??= "./package.json";
    packageJson.exports["."] ??= addPackageJsonExport(
      "index",
      packageJson.type,
      options.sourceRoot
    );

    let entry = [{ in: "./src/index.ts", out: "./src/index.ts" }];
    if (options.entry) {
      if (Array.isArray(options.entry)) {
        entry = (options.entry as (string | { in: string; out: string })[]).map(
          entryPoint =>
            typeof entryPoint === "string"
              ? { in: entryPoint, out: entryPoint }
              : entryPoint
        );
      }

      for (const entryPoint of entry) {
        const split = entryPoint.out.split(".");
        split.pop();
        const entry = split.join(".").replaceAll("\\", "/");

        packageJson.exports[`./${entry}`] ??= addPackageJsonExport(
          entry,
          options.fixedExtension ? "fixed" : packageJson.type,
          options.sourceRoot
        );
      }
    }

    packageJson.main =
      !options.fixedExtension && packageJson.type === "commonjs"
        ? "./dist/index.js"
        : "./dist/index.cjs";
    packageJson.module =
      !options.fixedExtension && packageJson.type === "module"
        ? "./dist/index.js"
        : "./dist/index.mjs";
    packageJson.types = `./dist/index.d.${!options.fixedExtension ? "ts" : "mts"}`;

    packageJson.exports = Object.keys(packageJson.exports).reduce(
      (ret, key) => {
        if (key.endsWith("/index") && !ret[key.replace("/index", "")]) {
          ret[key.replace("/index", "")] = packageJson.exports[key];
        }

        return ret;
      },
      packageJson.exports
    );

    await writeJsonFile(joinPaths(options.outDir, "package.json"), packageJson);

    stopwatch();
  }

  return options;
}

/**
 * Execute tsdown with all the configurations we pass
 */
async function executeTSDown(options: TSDownResolvedOptions) {
  writeDebug(`  🚀  Running ${options.name} build`, options.workspaceConfig);
  const stopwatch = getStopwatch(`${options.name} build`);

  await tsdown({
    ...options,
    entry: options.entry,
    config: false
  });

  stopwatch();

  return options;
}

/**
 * Copy the assets to the build directory
 */
async function copyBuildAssets(options: TSDownResolvedOptions) {
  writeDebug(
    `  📋  Copying asset files to output directory: ${options.outDir}`,
    options.workspaceConfig
  );
  const stopwatch = getStopwatch(`${options.name} asset copy`);

  await copyAssets(
    options.workspaceConfig,
    options.assets ?? [],
    options.outDir,
    options.projectRoot,
    options.sourceRoot,
    true,
    false
  );

  stopwatch();

  return options;
}

/**
 * Report the results of the build
 */
async function reportResults(options: TSDownResolvedOptions) {
  writeSuccess(
    `  📦  The ${options.name} build completed successfully`,
    options.workspaceConfig
  );
}

/**
 * Clean the output path
 *
 * @param options - the build options
 */
export async function cleanOutputPath(options: TSDownResolvedOptions) {
  if (options.clean !== false && options.workspaceConfig) {
    writeDebug(
      ` 🧹  Cleaning ${options.name} output path: ${options.workspaceConfig}`,
      options.workspaceConfig
    );
    const stopwatch = getStopwatch(`${options.name} output clean`);

    await cleanDirectories(
      options.name,
      options.outDir,
      options.workspaceConfig
    );

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
export async function build(options: TSDownOptions | TSDownOptions[]) {
  writeDebug(`  ⚡   Executing Storm TSDown pipeline`);
  const stopwatch = getStopwatch("TSDown pipeline");

  try {
    const opts = Array.isArray(options) ? options : [options];
    if (opts.length === 0) {
      throw new Error("No build options were provided");
    }

    const resolved = await Promise.all(
      opts.map(async opt => await resolveOptions(opt))
    );

    if (resolved.length > 0) {
      await cleanOutputPath(resolved[0]!);
      await generatePackageJson(resolved[0]!);

      await Promise.all(
        resolved.map(async opt => {
          await executeTSDown(opt);
          await copyBuildAssets(opt);
          await reportResults(opt);
        })
      );
    } else {
      writeWarning(
        "  🚧   No options were passed to TSBuild. Please check the parameters passed to the `build` function."
      );
    }

    writeSuccess("  🏁  TSDown pipeline build completed successfully");
  } catch (error) {
    writeFatal(
      "Fatal errors that the build process could not recover from have occured. The build process has been terminated."
    );

    throw error;
  } finally {
    stopwatch();
  }
}
