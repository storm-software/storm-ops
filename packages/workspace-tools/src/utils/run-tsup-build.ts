import { dirname, sep } from "node:path";
import { esbuildDecorators } from "@anatine/esbuild-decorators";
import { joinPathFragments } from "@nx/devkit";
import { getCustomTrasformersFactory } from "@nx/js/src/executors/tsc/lib/get-custom-transformers-factory";
import { normalizeOptions } from "@nx/js/src/executors/tsc/lib/normalize-options";
import type { NormalizedExecutorOptions } from "@nx/js/src/utils/schema";
import type { TypeScriptCompilationOptions } from "@nx/workspace/src/utilities/typescript/compilation";
import {
  LogLevel,
  getLogLevel,
  writeDebug,
  writeInfo,
  writeWarning
} from "@storm-software/config-tools";
import type { StormConfig } from "@storm-software/config";
import { environmentPlugin } from "esbuild-plugin-environment";
import type { TsupContext } from "../../declarations";
import { type Options, build as tsup, defineConfig } from "tsup";
import { parseJsonConfigFileContent, readConfigFile, sys } from "typescript";
import { defaultConfig, getConfig } from "../base/get-tsup-config";
import type { TsupExecutorSchema } from "../executors/tsup/schema";
import { removeExtension } from "./file-path-utils";

export const applyDefaultOptions = (options: TsupExecutorSchema): TsupExecutorSchema => {
  options.entry ??= "{sourceRoot}/index.ts";
  options.outputPath ??= "dist/{projectRoot}";
  options.tsConfig ??= "tsconfig.json";
  options.generatePackageJson ??= true;
  options.splitting ??= true;
  options.treeshake ??= true;
  options.platform ??= "neutral";
  options.format ??= ["cjs", "esm"];
  options.verbose ??= false;
  options.external ??= [];
  options.additionalEntryPoints ??= [];
  options.assets ??= [];
  options.plugins ??= [];
  options.includeSrc ??= false;
  options.minify ??= false;
  options.clean ??= true;
  options.bundle ??= true;
  options.debug ??= false;
  options.watch ??= false;
  options.apiReport ??= true;
  options.docModel ??= true;
  options.tsdocMetadata ??= true;
  options.emitOnAll ??= false;
  options.metafile ??= true;
  options.skipNativeModulesPlugin ??= false;
  options.define ??= {};
  options.env ??= {};

  if (options.getConfig) {
    options.getConfig = defaultConfig;
  }

  return options;
};

export const runTsupBuild = async (
  context: TsupContext,
  config: Partial<StormConfig>,
  options: TsupExecutorSchema
) => {
  // #region Add default plugins

  const stormEnv = Object.keys(options.env ?? {})
    .filter((key) => key.startsWith("STORM_"))
    .reduce((ret, key) => {
      ret[key] = options.env?.[key];
      return ret;
    }, {});
  options.plugins?.push(
    esbuildDecorators({
      tsconfig: options.tsConfig,
      cwd: config.workspaceRoot
    })
  );
  options.plugins?.push(environmentPlugin(stormEnv));

  // #endregion Add default plugins

  // #region Run the build process

  const getConfigOptions = {
    ...options,
    main: context.main,
    entry: {
      [removeExtension(
        context.main
          ?.split(context.main?.includes(sep) ? sep : context.main?.includes("/") ? "/" : "\\")
          ?.pop()
      )]: context.main
    },
    define: {
      __STORM_CONFIG: JSON.stringify(stormEnv)
    },
    env: {
      __STORM_CONFIG: JSON.stringify(stormEnv),
      ...stormEnv
    },
    dtsTsConfig: getNormalizedTsConfig(
      context,
      config.workspaceRoot ?? ".",
      options.outputPath,
      createTypeScriptCompilationOptions(
        normalizeOptions(
          {
            ...options,
            watch: false,
            main: context.main,
            transformers: []
          },
          config.workspaceRoot ?? ".",
          context.sourceRoot,
          config.workspaceRoot ?? "."
        ),
        context.projectName
      )
    ),
    banner: options.banner
      ? {
          js: `${options.banner}

`,
          css: `/*
${options.banner}\n


*/`
        }
      : undefined,
    outputPath: options.outputPath
  };

  if (options.getConfig) {
    writeInfo(config, "⚡ Running the Build process");

    const getConfigFns = [options.getConfig];
    const tsupConfig = defineConfig(
      getConfigFns.map((getConfigFn) =>
        getConfig(config.workspaceRoot ?? ".", context.projectRoot, getConfigFn, getConfigOptions)
      )
    );

    if (_isFunction(tsupConfig)) {
      const tsupOptions = await Promise.resolve(tsupConfig({}));
      await build(tsupOptions, config as StormConfig);
    } else {
      await build(tsupConfig, config as StormConfig);
    }
  } else if (getLogLevel(config?.logLevel ?? "debug") >= LogLevel.WARN) {
    writeWarning(
      config,
      "The Build process did not run because no `getConfig` parameter was provided"
    );
  }
};

function getNormalizedTsConfig(
  context: TsupContext,
  workspaceRoot: string,
  outputPath: string,
  options: TypeScriptCompilationOptions
) {
  const config = readConfigFile(options.tsConfig, sys.readFile).config;
  const tsConfig = parseJsonConfigFileContent(
    {
      ...config,
      compilerOptions: {
        ...config?.compilerOptions,
        entry: {
          [removeExtension(context.main)
            .replace(workspaceRoot, "")
            .replace(context.sourceRoot, "")]: context.main
        },
        outDir: outputPath,
        rootDir: workspaceRoot,
        baseUrl: workspaceRoot,
        noEmit: false,
        esModuleInterop: true,
        downlevelIteration: true,
        noUnusedLocals: false,
        emitDeclarationOnly: true,
        declaration: true,
        declarationMap: true,
        declarationDir: joinPathFragments(workspaceRoot, "tmp", ".tsup", "declaration")
      }
    },
    sys,
    dirname(options.tsConfig)
  );

  tsConfig.options.pathsBasePath = workspaceRoot;
  if (
    (config?.compilerOptions?.incremental || tsConfig?.options?.incremental) &&
    !tsConfig?.options.tsBuildInfoFile
  ) {
    tsConfig.options.tsBuildInfoFile = joinPathFragments(outputPath, "tsconfig.tsbuildinfo");
  }

  return tsConfig;
}

const build = async (options: Options | Options[], config?: StormConfig) => {
  if (Array.isArray(options)) {
    await Promise.all(options.map((buildOptions) => build(buildOptions, config)));
  } else {
    let tsupOptions = options;
    if (_isFunction(tsupOptions)) {
      tsupOptions = (await Promise.resolve(tsupOptions({}))) as Options;
    }

    writeDebug(
      config,
      `⚙️  Tsup Build options:
${
  !_isFunction(tsupOptions)
    ? Object.keys(tsupOptions)
        .map(
          (key) =>
            `${key}: ${
              !tsupOptions[key] || _isPrimitive(tsupOptions[key])
                ? tsupOptions[key]
                : _isFunction(tsupOptions[key])
                  ? "<function>"
                  : JSON.stringify(tsupOptions[key])
            }`
        )
        .join("\n")
    : "<function>"
}
`
    );

    await tsup(tsupOptions);
  }
};

const _isPrimitive = (value: unknown): boolean => {
  try {
    return (
      value === undefined ||
      value === null ||
      (typeof value !== "object" && typeof value !== "function")
    );
    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
  } catch (e) {
    return false;
  }
};

const _isFunction = (
  value: unknown
): value is ((params?: unknown) => unknown) & ((param?: any) => any) => {
  try {
    return (
      value instanceof Function ||
      typeof value === "function" ||
      !!(value?.constructor && (value as any)?.call && (value as any)?.apply)
    );
    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
  } catch (e) {
    return false;
  }
};

const createTypeScriptCompilationOptions = (
  normalizedOptions: NormalizedExecutorOptions,
  projectName: string
): TypeScriptCompilationOptions => {
  return {
    outputPath: normalizedOptions.outputPath,
    projectName,
    projectRoot: normalizedOptions.projectRoot,
    rootDir: normalizedOptions.rootDir,
    tsConfig: normalizedOptions.tsConfig,
    watch: normalizedOptions.watch,
    deleteOutputPath: normalizedOptions.clean,
    getCustomTransformers: getCustomTrasformersFactory(normalizedOptions.transformers)
  };
};
