import { readFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { esbuildDecorators } from "@anatine/esbuild-decorators";
import { joinPathFragments } from "@nx/devkit";
import { getCustomTrasformersFactory } from "@nx/js/src/executors/tsc/lib/get-custom-transformers-factory";
import { normalizeOptions } from "@nx/js/src/executors/tsc/lib/normalize-options";
import type { NormalizedExecutorOptions } from "@nx/js/src/utils/schema";
import type { TypeScriptCompilationOptions } from "@nx/workspace/src/utilities/typescript/compilation";
import {
  LogLevel,
  type StormConfig,
  getLogLevel,
  writeInfo,
  writeWarning
} from "@storm-software/config-tools";
import { environmentPlugin } from "esbuild-plugin-environment";
import { globSync } from "glob";
import type { TsupContext } from "packages/workspace-tools/declarations";
import { format } from "prettier";
import { type Options, build as tsup, defineConfig } from "tsup";
import * as ts from "typescript";
import { defaultConfig, getConfig } from "../base/get-tsup-config";
import type { TsupExecutorSchema } from "../executors/tsup/schema";

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
  options.getConfig ??= { dist: defaultConfig };

  return options;
};

export const runTsupBuild = async (
  context: TsupContext,
  config: Partial<StormConfig>,
  options: TsupExecutorSchema
) => {
  if (options.includeSrc === true) {
    const files = globSync([
      joinPathFragments(config.workspaceRoot, options.outputPath, "src/**/*.ts"),
      joinPathFragments(config.workspaceRoot, options.outputPath, "src/**/*.tsx"),
      joinPathFragments(config.workspaceRoot, options.outputPath, "src/**/*.js"),
      joinPathFragments(config.workspaceRoot, options.outputPath, "src/**/*.jsx")
    ]);
    await Promise.allSettled(
      files.map(async (file) =>
        writeFile(
          file,
          await format(
            `${
              options.banner
                ? options.banner.startsWith("//")
                  ? options.banner
                  : `// ${options.banner}`
                : ""
            }\n\n${readFileSync(file, "utf-8")}`,
            {
              ...{
                plugins: ["prettier-plugin-packagejson"],
                trailingComma: "none",
                tabWidth: 2,
                semi: true,
                singleQuote: false,
                quoteProps: "preserve",
                insertPragma: false,
                bracketSameLine: true,
                printWidth: 80,
                bracketSpacing: true,
                arrowParens: "avoid",
                endOfLine: "lf"
              },
              parser: "typescript"
            }
          ),
          "utf-8"
        )
      )
    );
  }

  // #endregion Generate the package.json file

  // #region Add default plugins

  const stormEnv = Object.keys(options.env)
    .filter((key) => key.startsWith("STORM_"))
    .reduce((ret, key) => {
      ret[key] = options.env[key];
      return ret;
    }, {});
  options.plugins.push(
    esbuildDecorators({
      tsconfig: options.tsConfig,
      cwd: config.workspaceRoot
    })
  );
  options.plugins.push(environmentPlugin(stormEnv));

  // #endregion Add default plugins

  // #region Run the build process

  const getConfigOptions = {
    ...options,
    define: {
      __STORM_CONFIG: JSON.stringify(stormEnv)
    },
    env: {
      __STORM_CONFIG: JSON.stringify(stormEnv),
      ...stormEnv
    },
    dtsTsConfig: getNormalizedTsConfig(
      config.workspaceRoot,
      options.outputPath,
      createTypeScriptCompilationOptions(
        normalizeOptions(
          {
            ...options,
            watch: false,
            main: options.entry,
            transformers: []
          },
          config.workspaceRoot,
          context.sourceRoot,
          config.workspaceRoot
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
    outputPath: options.outputPath,
    entry: context.entry
  };

  if (options.getConfig) {
    writeInfo(config, "⚡ Running the Build process");

    const getConfigFns = _isFunction(options.getConfig)
      ? [options.getConfig]
      : Object.keys(options.getConfig).map((key) => options.getConfig[key]);

    const tsupConfig = defineConfig(
      getConfigFns.map((getConfigFn) =>
        getConfig(config.workspaceRoot, context.projectRoot, getConfigFn, getConfigOptions)
      )
    );

    if (_isFunction(tsupConfig)) {
      await build(await Promise.resolve(tsupConfig({})), config);
    } else {
      await build(tsupConfig, config);
    }
  } else if (getLogLevel(config?.logLevel) >= LogLevel.WARN) {
    writeWarning(
      config,
      "The Build process did not run because no `getConfig` parameter was provided"
    );
  }
};

function getNormalizedTsConfig(
  workspaceRoot: string,
  outputPath: string,
  options: TypeScriptCompilationOptions
) {
  const config = ts.readConfigFile(options.tsConfig, ts.sys.readFile).config;
  const tsConfig = ts.parseJsonConfigFileContent(
    {
      ...config,
      compilerOptions: {
        ...config.compilerOptions,
        outDir: outputPath,
        rootDir: workspaceRoot,
        baseUrl: workspaceRoot,
        allowJs: true,
        noEmit: false,
        esModuleInterop: true,
        downlevelIteration: true,
        forceConsistentCasingInFileNames: true,
        emitDeclarationOnly: true,
        declaration: true,
        declarationMap: true,
        declarationDir: joinPathFragments(workspaceRoot, "tmp", ".tsup", "declaration")
      }
    },
    ts.sys,
    dirname(options.tsConfig)
  );

  tsConfig.options.pathsBasePath = workspaceRoot;
  if (tsConfig.options.incremental && !tsConfig.options.tsBuildInfoFile) {
    tsConfig.options.tsBuildInfoFile = joinPathFragments(outputPath, "tsconfig.tsbuildinfo");
  }

  return tsConfig;
}

const build = async (options: Options | Options[], config?: StormConfig) => {
  if (Array.isArray(options)) {
    await Promise.all(options.map((buildOptions) => build(buildOptions, config)));
  } else {
    if (getLogLevel(config?.logLevel) >= LogLevel.TRACE && !options.silent) {
      console.log("⚙️  Tsup build config: \n", options, "\n");
    }

    await tsup(options);
    await new Promise((r) => setTimeout(r, 100));
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