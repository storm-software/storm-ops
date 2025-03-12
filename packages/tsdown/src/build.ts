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
  getEntryPoints,
  getEnv
} from "@storm-software/build-tools";
import { getConfig } from "@storm-software/config-tools/get-config";
import {
  getStopwatch,
  writeDebug,
  writeFatal,
  writeSuccess,
  writeWarning
} from "@storm-software/config-tools/logger/console";
import { isVerbose } from "@storm-software/config-tools/logger/get-log-level";
import { joinPaths } from "@storm-software/config-tools/utilities/correct-paths";
import defu from "defu";
import { existsSync } from "node:fs";
import hf from "node:fs/promises";
import { findWorkspaceRoot } from "nx/src/utils/find-workspace-root";
import { build as tsdown } from "tsdown";
import { cleanDirectories } from "./clean";
import { DEFAULT_BUILD_OPTIONS } from "./config";
import { TSDownResolvedOptions, type TSDownOptions } from "./types";

/**
 * Apply defaults to the original build options
 *
 * @param userOptions - the original build options provided by the user
 * @returns the build options with defaults applied
 */
const resolveOptions = async (
  userOptions: TSDownOptions
): Promise<TSDownResolvedOptions> => {
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

  const env = getEnv("tsdown", options as Parameters<typeof getEnv>[1]);

  const result: TSDownResolvedOptions = {
    ...options,
    config,
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
    plugins: [] as TSDownResolvedOptions["plugins"],
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
    dts:
      userOptions.emitTypes === true
        ? { transformer: "oxc" }
        : userOptions.emitTypes,
    bundleDts: userOptions.emitTypes,
    assets: userOptions.assets ?? [],
    shims: userOptions.injectShims !== true,
    bundle: userOptions.bundle !== false,
    watch: userOptions.watch === true,
    define: {
      STORM_FORMAT: JSON.stringify(options.format || "cjs"),
      ...(options.format === "cjs" && options.injectShims
        ? {
            "import.meta.url": "importMetaUrl"
          }
        : {}),
      ...Object.keys(env || {}).reduce((res, key) => {
        const value = JSON.stringify(env[key]);
        return {
          ...res,
          [`process.env.${key}`]: value,
          [`import.meta.env.${key}`]: value
        };
      }, {}),
      ...options.define
    }
  };

  stopwatch();

  return result;
};

async function generatePackageJson(options: TSDownResolvedOptions) {
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

    const packageJsonFile = await hf.readFile(
      joinPaths(
        options.config.workspaceRoot,
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

    packageJson.exports ??= {};
    packageJson.exports["./package.json"] ??= "./package.json";
    packageJson.exports["."] ??= addPackageJsonExport(
      "index",
      packageJson.type,
      options.sourceRoot
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
      }

      for (const entryPoint of entryPoints) {
        const split = entryPoint.out.split(".");
        split.pop();
        const entry = split.join(".").replaceAll("\\", "/");

        packageJson.exports[`./${entry}`] ??= addPackageJsonExport(
          entry,
          packageJson.type,
          options.sourceRoot
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

    await writeJsonFile(joinPaths(options.outdir, "package.json"), packageJson);

    stopwatch();
  }

  return options;
}

/**
 * Execute tsdown with all the configurations we pass
 */
async function executeTSDown(options: TSDownResolvedOptions) {
  writeDebug(`  🚀  Running ${options.name} build`, options.config);
  const stopwatch = getStopwatch(`${options.name} build`);

  await tsdown({
    ...options,
    entry: options.entryPoints,
    outDir: options.outdir,
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
    `  📋  Copying asset files to output directory: ${options.outdir}`,
    options.config
  );
  const stopwatch = getStopwatch(`${options.name} asset copy`);

  await copyAssets(
    options.config,
    options.assets ?? [],
    options.outdir,
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
    options.config
  );
}

/**
 * Clean the output path
 *
 * @param options - the build options
 */
export async function cleanOutputPath(options: TSDownResolvedOptions) {
  if (options.clean !== false && options.outdir) {
    writeDebug(
      ` 🧹  Cleaning ${options.name} output path: ${options.outdir}`,
      options.config
    );
    const stopwatch = getStopwatch(`${options.name} output clean`);

    await cleanDirectories(options.name, options.outdir, options.config);

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
