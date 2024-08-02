import { joinPathFragments, ProjectGraph } from "@nx/devkit";
import { getHelperDependency, HelperDependency } from "@nx/js";
// import { getCustomTrasformersFactory } from "@nx/js/src/executors/tsc/lib/get-custom-transformers-factory";
import {
  calculateProjectBuildableDependencies,
  computeCompilerOptionsPaths,
  DependentBuildableProjectNode
} from "@nx/js/src/utils/buildable-libs-utils";
// import { NormalizedExecutorOptions } from "@nx/js/src/utils/schema";
// import { ensureTypescript } from "@nx/js/src/utils/typescript/ensure-typescript";
// import { TypeScriptCompilationOptions as BaseTypeScriptCompilationOptions } from "@nx/workspace/src/utilities/typescript/compilation";
import type { StormConfig } from "@storm-software/config";
import { LogLevelLabel, writeDebug } from "@storm-software/config-tools";
import merge from "deepmerge";
import { LogLevel } from "esbuild";
import { dirname, extname, join } from "node:path";
import { pathToFileURL } from "node:url";
// import { fileExists } from "nx/src/utils/fileutils";
import type { PackageJson } from "nx/src/utils/package-json.js";
import { InputPluginOption, RollupOptions } from "rollup";
import tsPlugin from "rollup-plugin-typescript2";
// import { parse } from "tsconfck";
import ts from "typescript";
import {
  BuildContext,
  defineBuildConfig,
  RollupBuildOptions,
  type BuildConfig
} from "unbuild";
import { typeDefinitions } from "../plugins/type-definitions";
import type { UnbuildBuildOptions } from "../types";

// type TypeScriptCompilationOptions = BaseTypeScriptCompilationOptions & {
//   lib: CompilerOptions["lib"];
// };

export async function getUnbuildBuildOptions(
  config: StormConfig,
  options: UnbuildBuildOptions,
  packageJson: PackageJson,
  projectGraph: ProjectGraph
) {
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

  const result = calculateProjectBuildableDependencies(
    undefined,
    projectGraph,
    config.workspaceRoot,
    options.projectName,
    process.env.NX_TASK_TARGET_TARGET || "build",
    process.env.NX_TASK_TARGET_CONFIGURATION || "production",
    true
  );
  let dependencies = result.dependencies;

  const tsLibDependency = getHelperDependency(
    HelperDependency.tsc,
    options.tsConfig,
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

  const buildConfig: BuildConfig = {
    clean: false,
    name: options.projectName,
    rootDir: config.workspaceRoot,
    entries: [
      {
        builder: "mkdist",
        input: options.sourceRoot,
        outDir: join(options.outputPath, "dist"),
        declaration: "compatible"
      }
    ],
    outDir: options.outputPath,
    externals: [...externals, ...(options.external ?? [])],
    declaration: "compatible",
    failOnWarn: false,
    hooks: {
      // "mkdist:entry:options": async (
      //   ctx: BuildContext,
      //   entry: MkdistBuildEntry,
      //   opts: MkdistOptions
      // ) => {
      //   const tsconfig = await getNormalizedTsConfig(
      //     config,
      //     createTypeScriptCompilationOptions(
      //       normalizeOptions(
      //         {
      //           ..._options,
      //           external: undefined,
      //           watch: false,
      //           main: options.entry ?? `${options.sourceRoot}/index.ts`,
      //           transformers: []
      //         },
      //         config.workspaceRoot,
      //         options.sourceRoot,
      //         config.workspaceRoot
      //       ),
      //       options
      //     ),
      //     dependencies
      //   );

      //   const dtsCompilerOptions = {
      //     ...tsconfig.compilerOptions,
      //     skipLibCheck: true,
      //     skipDefaultLibCheck: true,
      //     noEmit: false,
      //     declaration: true,
      //     declarationMap: true
      //   };

      //   writeDebug(dtsCompilerOptions, config);

      //   opts.rootDir = options.projectRoot;
      //   opts.typescript = {
      //     compilerOptions: dtsCompilerOptions
      //   };
      // },
      "rollup:options": async (ctx: BuildContext, opts: RollupOptions) => {
        opts.plugins = [
          tsPlugin({
            check: true,
            tsconfig: options.tsConfig,
            tsconfigOverride: {
              compilerOptions: await createTsCompilerOptions(
                config,
                options,
                dependencies
              )
            }
          }),
          typeDefinitions({ projectRoot: options.projectRoot }),
          ...(opts.plugins as InputPluginOption[])
        ];
      }
    }
  };

  // const files = await new Glob("**/*.{ts,tsx}", {
  //   absolute: false,
  //   cwd: options.projectRoot,
  //   root: options.projectRoot
  // }).walk();
  // files.forEach(file => {
  //   const split = file.split(".");
  //   split.pop();

  //   buildConfig.entries!.push({
  //     builder: "mkdist",
  //     name: split.join(".").replaceAll("\\", "/"),
  //     input: join(options.projectRoot, file.replace(config.workspaceRoot, "")),
  //     outDir: join(options.outputPath, "dist", `${split.join(".")}.mjs`),
  //     declaration: "compatible"
  //   });
  // });

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

  const buildOptions = defineBuildConfig(buildConfig);
  return Promise.all(
    buildOptions.map(async buildOpt => {
      let rollupConfig: RollupBuildOptions = options.rollup;
      if (rollupConfig && typeof rollupConfig === "string") {
        const rollupConfigFile = await loadConfig(rollupConfig as string);
        if (rollupConfigFile) {
          rollupConfig = rollupConfigFile;
        }
      }

      buildOpt.externals = [...externals, ...(options.external ?? [])];
      buildOpt.sourcemap ??= options.sourcemap ?? true;
      buildOpt.rollup = {
        ...rollupConfig,
        ...(buildOpt.rollup as any),
        emitCJS: true,
        // dts: {
        //   respectExternal: true,
        //   projectRoot: options.projectRoot
        // compilerOptions: dtsCompilerOptions
        // },
        dts: true,
        output: {
          ...rollupConfig?.output,
          banner: options.banner,
          footer: options.footer
        },
        // commonjs: {
        //   include: /node_modules/,
        //   sourceMap: options.sourcemap
        // },
        // resolve: {
        //   preferBuiltins: true,
        //   extensions: [".cjs", ".mjs", ".js", ".jsx", ".ts", ".tsx", ".json"]
        // },
        esbuild: {
          ...rollupConfig?.esbuild,
          minify: !!options.minify,
          treeShaking: true,
          color: true,
          logLevel: (config.logLevel === LogLevelLabel.FATAL
            ? LogLevelLabel.ERROR
            : config.logLevel === LogLevelLabel.ALL ||
                config.logLevel === LogLevelLabel.TRACE
              ? "verbose"
              : config.logLevel) as LogLevel
          // tsconfigRaw: tsConfig as TsconfigRaw
        }
      };

      return buildOpt;
    })
  );
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
  options: UnbuildBuildOptions,
  dependencies?: DependentBuildableProjectNode[]
) {
  const { writeTrace } = await import("@storm-software/config-tools");

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

  const compilerOptions = {
    rootDir: options.projectRoot,
    declaration: true,
    paths: computeCompilerOptionsPaths(tsConfig, dependencies ?? [])
  };
  writeTrace(compilerOptions, config);

  return compilerOptions;
}

// async function getNormalizedTsConfig(
//   config: StormConfig,
//   options: TypeScriptCompilationOptions,
//   dependencies: DependentBuildableProjectNode[]
// ) {
//   const { correctPaths, writeTrace } = await import(
//     "@storm-software/config-tools"
//   );

//   const tsModule = ensureTypescript();
//   const rawTsconfig = tsModule.readConfigFile(
//     options.tsConfig,
//     tsModule.sys.readFile
//   );
//   if (!rawTsconfig?.config || rawTsconfig?.error) {
//     throw new Error(
//       `Unable to find ${options.tsConfig || "tsconfig.json"} in ${dirname(
//         options.tsConfig
//       )}${rawTsconfig?.error ? ` \nError: ${rawTsconfig.error.messageText}` : ""}`
//     );
//   }

//   const result = await parse(options.tsConfig, { root: config.workspaceRoot });
//   result.tsconfig.compilerOptions ??= {};

//   const tsConfigFile = ts.readConfigFile(options.tsConfig, ts.sys.readFile);
//   const tsConfig = ts.parseJsonConfigFileContent(
//     tsConfigFile.config,
//     ts.sys,
//     dirname(options.tsConfig)
//   );

//   result.tsconfig.compilerOptions.paths = computeCompilerOptionsPaths(
//     tsConfig,
//     dependencies ?? []
//   );

//   result.tsconfig.compilerOptions.lib = (
//     options.lib && options.lib.length > 0
//       ? options.lib
//       : result.tsconfig.compilerOptions.lib &&
//           result.tsconfig.compilerOptions.lib.length > 0
//         ? result.tsconfig.compilerOptions.lib
//         : []
//   ) as string[];

//   const basePath = correctPaths(config.workspaceRoot);

//   result.tsconfig.include ??= [];
//   if (result.tsconfig.compilerOptions.lib.length > 0) {
//     result.tsconfig.include = result.tsconfig.compilerOptions.lib
//       ?.map(file =>
//         correctPaths(
//           join(
//             config.workspaceRoot,
//             `node_modules/typescript/lib/lib.${file.toLowerCase()}.d.ts`
//           )
//         )
//       )
//       ?.reduce((ret: string[], file: string) => {
//         writeTrace(
//           `Checking if TypeScript Declarations library exists: ${file}`
//         );
//         if (fileExists(file) && !ret.includes(file)) {
//           ret.push(file);
//         }

//         const fullLibPath = `${file.slice(0, -5)}.full.d.ts`;
//         writeTrace(
//           `Checking if full TypeScript Declarations library exists: ${fullLibPath}`
//         );

//         if (fileExists(fullLibPath) && !ret.includes(fullLibPath)) {
//           ret.push(fullLibPath);
//         }

//         return ret;
//       }, result.tsconfig.include);
//   } else {
//     result.tsconfig.include.push(
//       correctPaths(
//         join(config.workspaceRoot, "node_modules/typescript/lib/*.d.ts")
//       )
//     );
//   }

//   result.tsconfig.compilerOptions.pathsBasePath = basePath;
//   result.tsconfig.compilerOptions.rootDir = basePath;
//   result.tsconfig.compilerOptions.baseUrl = ".";

//   return result.tsconfig;
// }

// const createTypeScriptCompilationOptions = (
//   normalizedOptions: NormalizedExecutorOptions,
//   buildOptions: UnbuildBuildOptions
// ): TypeScriptCompilationOptions => {
//   return {
//     outputPath: normalizedOptions.outputPath,
//     projectName: buildOptions.projectName,
//     projectRoot: normalizedOptions.projectRoot,
//     rootDir: normalizedOptions.rootDir,
//     lib: buildOptions.tsLibs,
//     tsConfig: normalizedOptions.tsConfig,
//     watch: normalizedOptions.watch,
//     deleteOutputPath: normalizedOptions.clean,
//     getCustomTransformers: getCustomTrasformersFactory(
//       normalizedOptions.transformers
//     )
//   };
// };
