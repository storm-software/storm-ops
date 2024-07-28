import { joinPathFragments, ProjectGraph } from "@nx/devkit";
import { getHelperDependency, HelperDependency } from "@nx/js";
import { getCustomTrasformersFactory } from "@nx/js/src/executors/tsc/lib/get-custom-transformers-factory";
import { normalizeOptions } from "@nx/js/src/executors/tsc/lib/normalize-options.js";
import {
  calculateProjectBuildableDependencies,
  computeCompilerOptionsPaths,
  DependentBuildableProjectNode
} from "@nx/js/src/utils/buildable-libs-utils.js";
import { NormalizedExecutorOptions } from "@nx/js/src/utils/schema";
import { ensureTypescript } from "@nx/js/src/utils/typescript/ensure-typescript";
import { TypeScriptCompilationOptions as BaseTypeScriptCompilationOptions } from "@nx/workspace/src/utilities/typescript/compilation";
import type { StormConfig } from "@storm-software/config";
import {
  LogLevelLabel,
  writeDebug,
  writeTrace
} from "@storm-software/config-tools";
import merge from "deepmerge";
import { LogLevel, TsconfigRaw } from "esbuild";
import { glob } from "glob";
import { dirname, extname, relative } from "node:path";
import { pathToFileURL } from "node:url";
import { readNxJson } from "nx/src/config/nx-json.js";
import type { PackageJson } from "nx/src/utils/package-json.js";
import tsPlugin from "rollup-plugin-typescript2";
import ts, { CompilerOptions } from "typescript";
import { defineBuildConfig, type BuildConfig } from "unbuild";
import type { UnbuildBuildOptions } from "../types";
import { getFileBanner } from "../utils/get-file-banner";
import { createTaskId, getAllWorkspaceTaskGraphs } from "../utils/task-graph";

type TypeScriptCompilationOptions = BaseTypeScriptCompilationOptions & {
  lib: CompilerOptions["lib"];
};

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

  writeDebug(
    "✍️  Generating TypeScript Compiler Options (tsconfig.json) to use for build process",
    config
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

  // const compilerOptionPaths = computeCompilerOptionsPaths(
  //   tsConfig,
  //   dependencies ?? []
  // );
  // const compilerOptions: TsconfigRaw = {
  //   rootDir: options.projectRoot,
  //   module: "ESNext",
  //   bundle:
  //   // allowJs: options.allowJs,
  //   declaration: true,
  //   paths: compilerOptionPaths
  // };

  const _options = { ...options };
  delete _options.external;

  const tsConfig = await getNormalizedTsConfig(
    config.workspaceRoot,
    options.outputPath,
    createTypeScriptCompilationOptions(
      normalizeOptions(
        {
          ..._options,
          external: undefined,
          watch: false,
          main: options.entry ?? `${options.sourceRoot}/index.ts`,
          transformers: []
        },
        config.workspaceRoot,
        options.sourceRoot,
        config.workspaceRoot
      ),
      options
    ),
    dependencies
  );

  writeTrace(tsConfig, config);

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
    externals: [...externals, ...(options.external ?? [])],
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
            cwd: config.workspaceRoot,
            check: true,
            tsconfig: options.tsConfig,
            tsconfigOverride: tsConfig
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
      outDir: relative(
        options.projectRoot,
        joinPathFragments(options.outputPath, "dist")
      )
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

async function getNormalizedTsConfig(
  workspaceRoot: string,
  outputPath: string,
  options: TypeScriptCompilationOptions,
  dependencies: DependentBuildableProjectNode[]
) {
  const { correctPaths } = await import("@storm-software/config-tools");

  const tsModule = ensureTypescript();
  const rawTsconfig = tsModule.readConfigFile(
    options.tsConfig,
    tsModule.sys.readFile
  );
  if (!rawTsconfig?.config || rawTsconfig?.error) {
    throw new Error(
      `Unable to find ${options.tsConfig || "tsconfig.json"} in ${dirname(
        options.tsConfig
      )}${rawTsconfig?.error ? ` \nError: ${rawTsconfig.error.messageText}` : ""}`
    );
  }

  const tsConfigPath = joinPathFragments(workspaceRoot, options.tsConfig);
  const tsConfigFile = ts.readConfigFile(tsConfigPath, ts.sys.readFile);
  const tsConfig = ts.parseJsonConfigFileContent(
    tsConfigFile.config,
    ts.sys,
    dirname(tsConfigPath)
  );

  const compilerOptionPaths = computeCompilerOptionsPaths(
    tsConfig,
    dependencies ?? []
  );

  // const tsConfig = parseJsonConfigFileContent(config, sys, dirname(options.tsConfig), {
  //   outDir: outputPath,
  //   noEmit: false,
  //   esModuleInterop: true,
  //   noUnusedLocals: false,
  //   emitDeclarationOnly: true,
  //   declaration: true,
  //   declarationMap: true,
  //   declarationDir: join(workspaceRoot, "tmp", ".tsup", "declaration")
  // });

  const lib = (
    options.lib && options.lib.length > 0
      ? options.lib
      : rawTsconfig.config?.compilerOptions?.lib &&
          rawTsconfig.config?.compilerOptions?.lib.length > 0
        ? rawTsconfig.config?.compilerOptions?.lib
        : ["ESNext"]
  ) as string[];

  const basePath = correctPaths(workspaceRoot);
  const parsedTsconfig = tsModule.parseJsonConfigFileContent(
    {
      ...rawTsconfig.config,
      compilerOptions: {
        module: "ESNext",
        target: "ESNext",
        moduleResolution: "Bundler",
        ...rawTsconfig.config?.compilerOptions,
        lib,
        outDir: outputPath,
        skipLibCheck: true,
        noEmit: false,
        declaration: true,
        declarationMap: true,
        paths: compilerOptionPaths
      },
      include: [
        joinPathFragments(
          basePath,
          `node_modules/typescript/**/{${lib.map(file => `lib.${file.toLowerCase()}.d.ts`).join(",")}}`
        ).replaceAll("\\", "/"),
        ...rawTsconfig.config?.include
      ]
    },
    tsModule.sys,
    dirname(options.tsConfig)
  );

  parsedTsconfig.fileNames = [
    ...parsedTsconfig.fileNames,
    ...(await glob(
      correctPaths(
        joinPathFragments(
          workspaceRoot,
          `node_modules/typescript/**/{${lib.map(file => `lib.${file.toLowerCase()}.d.ts`).join(",")}}`
        )
      )
    ))
  ];

  parsedTsconfig.options.pathsBasePath = basePath;
  parsedTsconfig.options.rootDir = basePath;
  parsedTsconfig.options.baseUrl = ".";

  if (parsedTsconfig.options.incremental) {
    parsedTsconfig.options.tsBuildInfoFile = correctPaths(
      joinPathFragments(outputPath, "tsconfig.tsbuildinfo")
    );
  }

  return parsedTsconfig;
}

const createTypeScriptCompilationOptions = (
  normalizedOptions: NormalizedExecutorOptions,
  buildOptions: UnbuildBuildOptions
): TypeScriptCompilationOptions => {
  return {
    outputPath: normalizedOptions.outputPath,
    projectName: buildOptions.projectName,
    projectRoot: normalizedOptions.projectRoot,
    rootDir: normalizedOptions.rootDir,
    lib: buildOptions.tsLibs,
    tsConfig: normalizedOptions.tsConfig,
    watch: normalizedOptions.watch,
    deleteOutputPath: normalizedOptions.clean,
    getCustomTransformers: getCustomTrasformersFactory(
      normalizedOptions.transformers
    )
  };
};
