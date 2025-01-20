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
import defu from "defu";
import { LogLevel } from "esbuild";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { relative } from "node:path";
import { findWorkspaceRoot } from "nx/src/utils/find-workspace-root";
import { BuildConfig, BuildContext, build as unbuild } from "unbuild";
import { clean } from "./clean";
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
  options: UnbuildOptions
): Promise<UnbuildResolvedOptions> {
  const projectRoot = options.projectRoot;
  if (!projectRoot) {
    throw new Error("Cannot find project root");
  }

  const outputPath = options.outputPath || joinPaths("dist", projectRoot);

  const workspaceRoot = findWorkspaceRoot(projectRoot);
  if (!workspaceRoot) {
    throw new Error("Cannot find workspace root");
  }

  const config = await loadStormConfig(workspaceRoot.dir);

  writeDebug("  ⚙️   Resolving build options", config);
  const stopwatch = getStopwatch("Build options resolution");

  if (options.configPath) {
    const configFile = await loadConfig(options.configPath as string);
    if (configFile) {
      options = defu(options, configFile) as UnbuildOptions;
    }
  }

  const projectGraph = await createProjectGraphAsync({
    exitOnError: true
  });

  const projectJsonPath = joinPaths(
    config.workspaceRoot,
    projectRoot,
    "project.json"
  );
  if (!existsSync(projectJsonPath)) {
    throw new Error("Cannot find project.json configuration");
  }

  const projectJsonContent = await readFile(projectJsonPath, "utf8");
  const projectJson = JSON.parse(projectJsonContent);

  const projectName = projectJson.name;

  const packageJsonPath = joinPaths(
    workspaceRoot.dir,
    projectRoot,
    "package.json"
  );
  if (!existsSync(packageJsonPath)) {
    throw new Error("Cannot find package.json configuration");
  }

  const packageJsonContent = await readFile(packageJsonPath, "utf8");
  const packageJson = JSON.parse(packageJsonContent);

  let tsconfig = options.tsconfig;
  if (!tsconfig) {
    tsconfig = joinPaths(workspaceRoot.dir, projectRoot, "tsconfig.json");
  }

  if (!existsSync(tsconfig)) {
    throw new Error("Cannot find tsconfig.json configuration");
  }

  let sourceRoot = projectJson.sourceRoot;
  if (!sourceRoot) {
    sourceRoot = joinPaths(projectRoot, "src");
  }

  if (!existsSync(sourceRoot)) {
    throw new Error("Cannot find sourceRoot directory");
  }

  const projectConfigurations =
    readProjectsConfigurationFromProjectGraph(projectGraph);
  if (!projectConfigurations?.projects?.[projectName]) {
    throw new Error(
      "The Build process failed because the project does not have a valid configuration in the project.json file. Check if the file exists in the root of the project."
    );
  }

  const result = calculateProjectBuildableDependencies(
    undefined,
    projectGraph,
    workspaceRoot.dir,
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
    projectRoot,
    sourceRoot,
    projectName,
    tsconfig,
    clean: false,
    entries: [
      {
        builder: "mkdist",
        input: `.${sourceRoot.replace(projectRoot, "")}`,
        outDir: joinPaths(
          relative(
            joinPaths(config.workspaceRoot, projectRoot),
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
        input: `.${sourceRoot.replace(projectRoot, "")}`,
        outDir: joinPaths(
          relative(
            joinPaths(config.workspaceRoot, projectRoot),
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
        minify: !!options.minify,
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

    packageJson = await addPackageJsonExports(options.sourceRoot, packageJson);

    await writeJsonFile(joinPaths(options.outDir, "package.json"), packageJson);

    stopwatch();
  }

  return options;
}

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
    await unbuild(options.projectRoot, false, {
      ...options,
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
    await clean(options.name, options.outDir, options.config);
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
  writeDebug(` ⚡  Executing Storm Unbuild pipeline`);
  const stopwatch = getStopwatch("Unbuild pipeline");

  try {
    const resolvedOptions = await resolveOptions(options);

    await cleanOutputPath(resolvedOptions);
    await generatePackageJson(resolvedOptions);
    await executeUnbuild(resolvedOptions);
    await copyBuildAssets(resolvedOptions);

    writeSuccess(
      `  🏁  The ${resolvedOptions.name} build completed successfully`,
      resolvedOptions.config
    );
  } catch (error) {
    writeFatal(
      "  ❌  Fatal errors occurred during the build that could not be recovered from. The build process has been terminated."
    );

    throw error;
  } finally {
    stopwatch();
  }
}
