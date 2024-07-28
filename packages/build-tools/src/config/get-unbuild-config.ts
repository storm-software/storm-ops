import { joinPathFragments, ProjectGraph } from "@nx/devkit";
import { getHelperDependency, HelperDependency } from "@nx/js";
import {
  calculateProjectBuildableDependencies,
  computeCompilerOptionsPaths
} from "@nx/js/src/utils/buildable-libs-utils.js";
import type { StormConfig } from "@storm-software/config";
import { LogLevelLabel } from "@storm-software/config-tools";
import merge from "deepmerge";
import { LogLevel, TsconfigRaw } from "esbuild";
import { dirname, extname, relative } from "node:path";
import { pathToFileURL } from "node:url";
import { readNxJson } from "nx/src/config/nx-json.js";
import type { PackageJson } from "nx/src/utils/package-json.js";
import tsPlugin from "rollup-plugin-typescript2";
import ts from "typescript";
import { defineBuildConfig, type BuildConfig } from "unbuild";
import type { UnbuildBuildOptions } from "../types";
import { getFileBanner } from "../utils/get-file-banner";
import { createTaskId, getAllWorkspaceTaskGraphs } from "../utils/task-graph";

export async function getUnbuildBuildOptions(
  config: StormConfig,
  options: UnbuildBuildOptions,
  packageJson: PackageJson,
  projectGraph: ProjectGraph
): Promise<BuildConfig[]> {
  if (options.configPath) {
    const configFile = await loadConfig(options.configPath as string);
    options = configFile ? merge(options, configFile) : options;
  }

  const externals = config.externalPackagePatterns.map(dep => {
    let regex = dep;
    if (!dep.endsWith("*")) {
      if (!dep.endsWith("/")) {
        regex = dep + "/";
      }
      regex += "*";
    }

    return new RegExp(regex);
  });

  const tsConfigPath = joinPathFragments(
    config.workspaceRoot,
    options.tsConfig
  );
  const tsConfigFile = ts.readConfigFile(tsConfigPath, ts.sys.readFile);
  const tsConfig = ts.parseJsonConfigFileContent(
    tsConfigFile.config,
    ts.sys,
    dirname(tsConfigPath)
  );

  const nxJson = readNxJson(config.workspaceRoot);
  const taskGraphs = getAllWorkspaceTaskGraphs(nxJson, projectGraph);

  const { dependencies } = calculateProjectBuildableDependencies(
    taskGraphs[createTaskId(options.projectName, "build")],
    projectGraph,
    config.workspaceRoot,
    options.projectName,
    process.env.NX_TASK_TARGET_TARGET || "build",
    process.env.NX_TASK_TARGET_CONFIGURATION || "production",
    true
  );

  const tsLibDependency = getHelperDependency(
    HelperDependency.tsc,
    options.tsConfig,
    dependencies,
    projectGraph,
    true
  );

  if (tsLibDependency) {
    dependencies.push(tsLibDependency);
  }

  const compilerOptionPaths = computeCompilerOptionsPaths(
    tsConfig,
    dependencies ?? []
  );
  const compilerOptions = {
    rootDir: options.projectRoot,
    // allowJs: options.allowJs,
    declaration: true,
    paths: compilerOptionPaths
  };

  // if (config.options.module === ts.ModuleKind.CommonJS) {
  //   compilerOptions["module"] = "ESNext";
  // }
  // if (options.compiler === "swc") {
  //   compilerOptions["emitDeclarationOnly"] = true;
  // }

  const buildConfig: BuildConfig = {
    clean: false,
    name: options.projectName,
    rootDir: options.projectRoot,
    entries: options.entry
      ? [
          options.entry.startsWith("./") || options.entry.startsWith("C:")
            ? options.entry
            : `./${options.entry}`
        ]
      : [],
    outDir: relative(options.projectRoot, options.outputPath),
    externals,
    declaration: "compatible",
    rollup: {
      esbuild: {
        minify: options.minify,
        treeShaking: true,
        color: true,
        logLevel: (config.logLevel === LogLevelLabel.FATAL
          ? LogLevelLabel.ERROR
          : config.logLevel === LogLevelLabel.ALL ||
              config.logLevel === LogLevelLabel.TRACE
            ? "verbose"
            : config.logLevel) as LogLevel,
        tsconfigRaw: tsConfig as TsconfigRaw
      },
      output: {
        plugins: [
          tsPlugin({
            check: true,
            tsconfig: options.tsConfig,
            tsconfigOverride: {
              compilerOptions
            }
          } as any)
        ]
      } as any
    }
  };

  // const result = calculateProjectBuildableDependencies(
  //   undefined,
  //   projectGraph,
  //   workspaceRoot,
  //   projectNode.name,
  //   process.env.NX_TASK_TARGET_TARGET,
  //   process.env.NX_TASK_TARGET_CONFIGURATION,
  //   true
  // );
  // dependencies = result.dependencies;

  if (packageJson.dependencies) {
    buildConfig.dependencies = dependencies
      .filter(
        dep =>
          dep.node.type === "npm" ||
          dep.node.type === "lib" ||
          dep.node.type === "app"
      )
      .map(dep => dep.name);

    // buildConfig.dependencies = Object.keys(packageJson.dependencies);
  }
  if (packageJson.devDependencies) {
    buildConfig.devDependencies = Object.keys(packageJson.devDependencies);
  }
  if (packageJson.peerDependencies) {
    buildConfig.peerDependencies = Object.keys(packageJson.peerDependencies);
  }

  if (
    options.additionalEntryPoints &&
    options.additionalEntryPoints.length > 0
  ) {
    for (const additionalEntryPoint of options.additionalEntryPoints) {
      buildConfig.entries!.push(additionalEntryPoint);
    }
  }

  buildConfig.entries!.push(
    // mkdist builder transpiles file-to-file keeping original sources structure
    {
      builder: "mkdist",
      input: "./src/",
      outDir: relative(options.projectRoot, options.outputPath)
    }
  );

  const buildOptions = defineBuildConfig(buildConfig);
  for (const buildOpt of buildOptions) {
    let rollupConfig: any = options.rollup;
    if (rollupConfig && typeof rollupConfig === "string") {
      const rollupConfigFile = await loadConfig(rollupConfig as string);
      rollupConfig = rollupConfigFile;
    }
    if (!rollupConfig) {
      rollupConfig = {};
    }

    buildOpt.rollup = {
      ...rollupConfig,
      output: {
        ...rollupConfig?.output,
        banner: getFileBanner(options.projectName),
        footer: options.footer,
        sourcemap: options.sourcemap
      },
      esbuild: {
        ...rollupConfig?.esbuild,
        minify: options.minify
      }
    };
  }

  return buildOptions;
}

/**
 * Load a rolldown configuration file
 */
async function loadConfig(
  configPath: string
): Promise<UnbuildBuildOptions | undefined> {
  if (!/\.(js|mjs)$/.test(extname(configPath))) {
    throw new Error("Unsupported config file format");
  }
  return import(pathToFileURL(configPath).toString()).then(
    config => config.default
  );
}
