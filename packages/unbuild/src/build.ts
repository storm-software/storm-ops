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
import { getHelperDependency, HelperDependency } from "@nx/js";
import {
  calculateProjectBuildableDependencies,
  computeCompilerOptionsPaths,
  DependentBuildableProjectNode
} from "@nx/js/src/utils/buildable-libs-utils";
import {
  addPackageDependencies,
  addPackageJsonExports,
  addWorkspacePackageJsonFields,
  copyAssets
} from "@storm-software/build-tools";
import { StormConfig } from "@storm-software/config";
import {
  getStopwatch,
  loadStormConfig,
  LogLevelLabel,
  writeFatal,
  writeInfo,
  writeSuccess,
  writeTrace
} from "@storm-software/config-tools";
import { default as merge } from "deepmerge";
import { LogLevel } from "esbuild";
import { dirname, extname, join, relative } from "node:path";
import { pathToFileURL } from "node:url";
import { findWorkspaceRoot } from "nx/src/utils/find-workspace-root";
import type { InputPluginOption } from "rollup";
import tsPlugin from "rollup-plugin-typescript2";
import ts from "typescript";
import {
  BuildConfig,
  BuildContext,
  RollupBuildOptions,
  build as unbuild
} from "unbuild";
import { analyzePlugin } from "./plugins/analyze-plugin";
import { onErrorPlugin } from "./plugins/on-error";
import { swcPlugin } from "./plugins/swc-plugin";
import { typeDefinitions } from "./plugins/type-definitions";
import type { UnbuildOptions, UnbuildResolvedOptions } from "./types";

/**
 * Get the build options for the unbuild process
 *
 * @param config - the storm configuration
 * @param options - the unbuild options
 * @param packageJson - the package.json
 * @param projectGraph - the project graph
 */
async function resolveOptions(
  options: UnbuildOptions
): Promise<UnbuildResolvedOptions> {
  const projectRoot = options.projectRoot;

  const workspaceRoot = findWorkspaceRoot(projectRoot);
  if (!workspaceRoot) {
    throw new Error("Cannot find Nx workspace root");
  }

  if (options.configPath) {
    const configFile = await loadConfig(options.configPath as string);
    if (configFile) {
      options = merge(options, configFile) as UnbuildOptions;
    }
  }

  const config = await loadStormConfig(workspaceRoot.dir);

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

  const packageJsonPath = joinPathFragments(
    workspaceRoot.dir,
    projectRoot,
    "package.json"
  );
  if (!(await hfs.isFile(packageJsonPath))) {
    throw new Error("Cannot find package.json configuration");
  }

  const packageJson = await hfs.json(packageJsonPath);

  let tsConfigPath = options.tsConfigPath;
  if (!tsConfigPath) {
    tsConfigPath = joinPathFragments(
      workspaceRoot.dir,
      projectRoot,
      "tsconfig.json"
    );
  }

  if (!(await hfs.isFile(tsConfigPath))) {
    throw new Error("Cannot find tsconfig.json configuration");
  }

  let sourceRoot = projectJson.sourceRoot;
  if (!sourceRoot) {
    sourceRoot = joinPathFragments(projectRoot, "src");
  }

  if (!(await hfs.isDirectory(sourceRoot))) {
    throw new Error("Cannot find sourceRoot directory");
  }

  const projectConfigurations =
    readProjectsConfigurationFromProjectGraph(projectGraph);
  if (!projectConfigurations?.projects?.[projectName]) {
    throw new Error(
      "The Build process failed because the project does not have a valid configuration in the project.json file. Check if the file exists in the root of the project."
    );
  }

  const nxJsonPath = joinPathFragments(config.workspaceRoot, "nx.json");
  if (!(await hfs.isFile(nxJsonPath))) {
    throw new Error("Cannot find Nx workspace configuration");
  }

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
    tsConfigPath,
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
    workspaceRoot,
    projectRoot,
    sourceRoot,
    projectName,
    tsConfigPath,
    clean: false,
    entries: [
      {
        builder: "mkdist",
        input: `.${sourceRoot.replace(projectRoot, "")}`,
        outDir: join(
          relative(
            join(workspaceRoot.dir, projectRoot),
            workspaceRoot.dir
          ).replaceAll("\\", "/"),
          options.outDir,
          "dist"
        ).replaceAll("\\", "/"),
        declaration: true,
        format: "esm"
      },
      {
        builder: "mkdist",
        input: `.${sourceRoot.replace(projectRoot, "")}`,
        outDir: join(
          relative(
            join(workspaceRoot.dir, projectRoot),
            workspaceRoot.dir
          ).replaceAll("\\", "/"),
          options.outDir,
          "dist"
        ).replaceAll("\\", "/"),
        declaration: true,
        format: "cjs",
        ext: "cjs"
      }
    ],
    declaration: "compatible",
    failOnWarn: false,
    hooks: {
      "rollup:options": async (ctx: BuildContext, opts: any) => {
        opts.plugins = [
          analyzePlugin(),
          swcPlugin(),
          ...((opts.plugins ?? []) as InputPluginOption[]),
          tsPlugin({
            check: true,
            tsconfig: tsConfigPath,
            tsconfigOverride: {
              compilerOptions: await createTsCompilerOptions(
                config,
                tsConfigPath,
                projectRoot,
                dependencies
              )
            }
          }),
          typeDefinitions({ projectRoot }),
          onErrorPlugin()
        ];
      }
    },
    sourcemap: options.sourcemap ?? true,
    outDir: options.outDir,
    stub: false,
    stubOptions: {
      jiti: {}
    },
    externals: [],
    dependencies: [] as string[],
    peerDependencies: [] as string[],
    devDependencies: [] as string[],
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
        tsconfig: tsConfigPath
      },
      output: {
        banner: options.banner,
        footer: options.footer
      },
      resolve: {
        preferBuiltins: true,
        extensions: [".cjs", ".mjs", ".js", ".jsx", ".ts", ".tsx", ".json"]
      },
      esbuild: {
        minify: !!options.minify,
        treeShaking: true,
        color: true,
        logLevel: (config.logLevel === LogLevelLabel.FATAL
          ? LogLevelLabel.ERROR
          : config.logLevel === LogLevelLabel.ALL ||
              config.logLevel === LogLevelLabel.TRACE
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

    resolvedOptions.rollup = merge(resolvedOptions.rollup ?? {}, rollup);
  }

  return resolvedOptions as any;
}

/**
 * Load a rolldown configuration file
 */
async function loadConfig(
  configPath: string
): Promise<RollupBuildOptions | undefined> {
  if (!/\.(js|mjs)$/.test(extname(configPath))) {
    throw new Error("Unsupported config file format");
  }
  return import(pathToFileURL(configPath).toString()).then(
    config => config.default
  );
}

async function createTsCompilerOptions(
  config: StormConfig,
  tsConfigPath: string,
  projectRoot: string,
  dependencies?: DependentBuildableProjectNode[]
) {
  const tsConfigFile = ts.readConfigFile(
    joinPathFragments(config.workspaceRoot, projectRoot, tsConfigPath),
    ts.sys.readFile
  );
  const tsConfig = ts.parseJsonConfigFileContent(
    tsConfigFile.config,
    ts.sys,
    dirname(joinPathFragments(config.workspaceRoot, projectRoot, tsConfigPath))
  );

  const compilerOptions = {
    rootDir: projectRoot,
    declaration: true,
    paths: computeCompilerOptionsPaths(tsConfig, dependencies ?? [])
  };
  writeTrace(compilerOptions, config);

  return compilerOptions;
}

const generatePackageJson = async (options: UnbuildResolvedOptions) => {
  if (options.generatePackageJson !== false) {
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

    packageJson = await addPackageJsonExports(options.sourceRoot, packageJson);

    await writeJsonFile(
      joinPathFragments(options.outDir, "package.json"),
      packageJson
    );
  }

  return options;
};

/**
 * Execute esbuild with all the configurations we pass
 */
async function executeUnbuild(options: UnbuildResolvedOptions) {
  const stopwatch = getStopwatch(`${options.projectRoot} build`);
  writeInfo(
    `📦  Building ${options.name} (${options.projectRoot})...`,
    options.config
  );

  await unbuild(options.projectRoot, false, {
    ...options,
    rootDir: options.projectRoot
  } as BuildConfig).finally(() => {
    stopwatch();
  });

  return options;
}

/**
 * Copy the assets to the build directory
 */
async function copyBuildAssets(options: UnbuildResolvedOptions) {
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

  return options;
}

/**
 * Report the results of the build
 */
function reportResults(options: UnbuildResolvedOptions) {
  writeSuccess(
    `The ${options.name} build completed successfully`,
    options.config
  );
}

/**
 * Execution pipeline that applies a set of actions
 *
 * @param options - the build options
 * @returns the build result
 */
export async function build(options: UnbuildOptions) {
  const stopwatch = getStopwatch("full build");

  try {
    const resolvedOptions = await resolveOptions(options);
    await generatePackageJson(resolvedOptions);
    await executeUnbuild(resolvedOptions);
    await copyBuildAssets(resolvedOptions);

    reportResults(resolvedOptions);
  } catch (error) {
    writeFatal(
      "Fatal errors occurred during the build that could not be recovered from. The build process has been terminated."
    );
  }

  stopwatch();
}
