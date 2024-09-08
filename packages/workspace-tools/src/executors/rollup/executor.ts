import { type ExecutorContext, type PromiseExecutor } from "@nx/devkit";
// import {
//   computeCompilerOptionsPaths,
//   DependentBuildableProjectNode
// } from "@nx/js/src/utils/buildable-libs-utils";
import { rollupExecutor } from "@nx/rollup/src/executors/rollup/rollup.impl";
import { RollupExecutorOptions } from "@nx/rollup/src/executors/rollup/schema";
// import { RollupWithNxPluginOptions } from "@nx/rollup/src/plugins/with-nx/with-nx-options";
import type { AssetGlob } from "@storm-software/build-tools";
import type { StormConfig } from "@storm-software/config";
import { removeSync } from "fs-extra";
import { Glob } from "glob";
import { join } from "path";
// import ts from "typescript";
import { withRunExecutor } from "../../base/base-executor";
import { RollupExecutorSchema } from "./schema";

export async function* rollupExecutorFn(
  options: RollupExecutorSchema,
  context: ExecutorContext,
  config?: StormConfig
) {
  const {
    writeDebug,
    writeTrace,
    formatLogMessage,
    findWorkspaceRoot,
    correctPaths
  } = await import("@storm-software/config-tools");

  if (
    !context?.projectName ||
    !context?.projectsConfigurations?.projects?.[context.projectName]?.root
  ) {
    throw new Error("Nx executor context was invalid");
  }

  const workspaceRoot = findWorkspaceRoot();
  const projectRoot =
    context?.projectsConfigurations?.projects[context.projectName!]?.root;
  const sourceRoot =
    context.projectsConfigurations.projects[context.projectName]?.sourceRoot ??
    projectRoot;

  // #region Clean output directory

  if (options.clean !== false) {
    writeDebug(`🧹 Cleaning output path: ${options.outputPath}`, config);
    removeSync(options.outputPath);
  }

  // #endregion Clean output directory

  // #region Copy asset files to output directory

  writeDebug(
    `📦  Copying asset files to output directory: ${options.outputPath}`,
    config
  );

  const assets = Array.from(options.assets ?? []);
  if (!options.assets?.some((asset: AssetGlob) => asset?.glob === "*.md")) {
    assets.push({
      input: projectRoot,
      glob: "*.md",
      output: "/"
    });
  }

  if (!options.assets?.some((asset: AssetGlob) => asset?.glob === "LICENSE")) {
    assets.push({
      input: "",
      glob: "LICENSE",
      output: "."
    });
  }

  if (options.fileLevelInput !== false) {
    const files = await new Glob("**/*.{ts,mts,cts,tsx}", {
      absolute: true,
      cwd: sourceRoot,
      root: workspaceRoot
    }).walk();
    options.additionalEntryPoints = files
      .reduce(
        (ret, file) => {
          const corrected = correctPaths(file);
          if (!corrected.includes("node_modules") && !ret.includes(corrected)) {
            ret.push(corrected);
          }

          return ret;
        },
        (options.additionalEntryPoints?.map(entry =>
          correctPaths(join(workspaceRoot, entry))
        ) ?? []) as string[]
      )
      .map(entry => {
        const formatted = entry.replace(workspaceRoot, "");
        return formatted.startsWith("/") ? formatted.slice(1) : formatted;
      });
  }

  const executorOptions: RollupExecutorOptions = {
    ...options,
    main: options.entry
  };
  executorOptions.rollupConfig = (options.rollupConfig ??
    {}) as RollupExecutorOptions["rollupConfig"];

  // if (!global.NX_GRAPH_CREATION) {
  //   executorOptions.rollupConfig!.plugins = [
  //     copy({
  //       targets: convertCopyAssetsToRollupOptions(
  //         options.outputPath,
  //         options.assets
  //       ),
  //     }),
  //     image(),
  //     json(),
  //     // Needed to generate type definitions, even if we're using babel or swc.
  //     require('rollup-plugin-typescript2')({
  //       check: !options.skipTypeCheck,
  //       tsconfig: options.tsConfig,
  //       tsconfigOverride: {
  //         compilerOptions: createTsCompilerOptions(
  //           projectRoot,
  //           tsConfig,
  //           options,
  +(
    //           dependencies
    //         ),
    //       },
    //     }),
    //     typeDefinitions({
    //       projectRoot,
    //     }),
    //     postcss({
    //       inject: true,
    //       extract: options.extractCss,
    //       autoModules: true,
    //       plugins: [autoprefixer],
    //       use: {
    //         less: {
    //           javascriptEnabled: options.javascriptEnabled,
    //         },
    //       },
    //     }),
    //     nodeResolve({
    //       preferBuiltins: true,
    //       extensions: fileExtensions,
    //     }),
    //     useSwc && swc(),
    //     useBabel &&
    //       getBabelInputPlugin({
    //         // Lets `@nx/js/babel` preset know that we are packaging.
    //         caller: {
    //           // @ts-ignore
    //           // Ignoring type checks for caller since we have custom attributes
    //           isNxPackage: true,
    //           // Always target esnext and let rollup handle cjs
    //           supportsStaticESM: true,
    //           isModern: true,
    //         },
    //         cwd: join(
    //           workspaceRoot,
    //           projectNode.data.sourceRoot ?? projectNode.data.root
    //         ),
    //         rootMode: options.babelUpwardRootMode ? 'upward' : undefined,
    //         babelrc: true,
    //         extensions: fileExtensions,
    //         babelHelpers: 'bundled',
    //         skipPreflightCheck: true, // pre-flight check may yield false positives and also slows down the build
    //         exclude: /node_modules/,
    //       }),
    //     commonjs(),
    //     analyze(),
    //     generatePackageJson(options, packageJson),
    //   ];

    writeDebug(
      `📦  Running Storm Rollup build process on the ${context?.projectName} project`,
      config
    )
  );

  writeTrace(
    `Rollup schema options ⚙️ \n${formatLogMessage(executorOptions)}`,
    config
  );

  yield* rollupExecutor(executorOptions, context);

  return {
    success: true
  };
}

// function createTsCompilerOptions(
//   projectRoot: string,
//   config: ts.ParsedCommandLine,
//   options: RollupWithNxPluginOptions,
//   dependencies?: DependentBuildableProjectNode[]
// ) {
//   const compilerOptionPaths = computeCompilerOptionsPaths(
//     config,
//     dependencies ?? []
//   );
//   const compilerOptions = {
//     rootDir: projectRoot,
//     allowJs: options.allowJs,
//     declaration: true,
//     paths: compilerOptionPaths
//   };
//   if (config.options.module === ts.ModuleKind.CommonJS) {
//     compilerOptions["module"] = "ESNext";
//   }
//   if (options.compiler === "swc") {
//     compilerOptions["emitDeclarationOnly"] = true;
//   }
//   return compilerOptions;
// }

export default withRunExecutor<RollupExecutorSchema>(
  "Rollup build executor",
  rollupExecutorFn,
  {
    skipReadingConfig: false,
    hooks: {
      applyDefaultOptions: (options: RollupExecutorSchema) => {
        options.entry ??= "{sourceRoot}/index.ts";
        options.outputPath ??= "dist/{projectRoot}";
        options.tsConfig ??= "{projectRoot}/tsconfig.json";
        options.assets ??= [];
        options.fileLevelInput ??= true;
        options.generatePackageJson ??= true;
        options.platform ??= "neutral";
        options.verbose ??= false;
        options.external ??= (
          process.env.STORM_EXTERNAL_PACKAGE_PATTERNS &&
          process.env.STORM_EXTERNAL_PACKAGE_PATTERNS.split(",")?.length > 0
            ? process.env.STORM_EXTERNAL_PACKAGE_PATTERNS.split(",")
            : []
        ) as string[];
        options.additionalEntryPoints ??= [];
        options.assets ??= [];
        options.clean ??= true;
        options.watch ??= false;
        options.babelUpwardRootMode ??= true;
        options.sourcemap ??= true;
        options.compiler ??= "babel";

        return options as RollupExecutorSchema;
      }
    }
  }
) as PromiseExecutor<RollupExecutorSchema>;
