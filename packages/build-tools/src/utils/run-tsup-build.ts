import { dirname, sep, join } from "node:path";
import { esbuildDecorators } from "@anatine/esbuild-decorators";
import { getCustomTrasformersFactory } from "@nx/js/src/executors/tsc/lib/get-custom-transformers-factory.js";
import { normalizeOptions } from "@nx/js/src/executors/tsc/lib/normalize-options.js";
import type { NormalizedExecutorOptions } from "@nx/js/src/utils/schema.js";
import type { TypeScriptCompilationOptions } from "@nx/workspace/src/utilities/typescript/compilation.js";
import type { StormConfig } from "@storm-software/config";
import { environmentPlugin } from "esbuild-plugin-environment";
import type { TsupContext, TypeScriptBuildOptions } from "../types";
import { defaultConfig, getConfig } from "../config";
import { findFileName, removeExtension } from "@storm-software/config-tools";
// import { type TSConfig, readTSConfig } from "pkg-types";
import { type Options, build as tsup, defineConfig } from "tsup";
import { ensureTypescript } from "@nx/js/src/utils/typescript/ensure-typescript.js";
import { glob } from "glob";

export const runTsupBuild = async (
  context: TsupContext,
  config: Partial<StormConfig>,
  options: TypeScriptBuildOptions
) => {
  const {
    writeInfo,
    writeTrace,
    writeWarning,
    correctPaths,
    findWorkspaceRoot
  } = await import("@storm-software/config-tools");

  const workspaceRoot = correctPaths(
    config?.workspaceRoot ?? findWorkspaceRoot()
  );

  writeTrace(
    `⚙️  Tsup (ESBuild) Build options:
${Object.keys(options)
  .map(
    key =>
      `${key}: ${
        !options[key] || _isPrimitive(options[key])
          ? options[key]
          : JSON.stringify(options[key])
      }`
  )
  .join("\n")}
`,
    config
  );

  // process.chdir(workspaceRoot);

  // #region Add default plugins

  const stormEnv = Object.keys(options.env ?? {})
    .filter(key => key.startsWith("STORM_"))
    .reduce((ret, key) => {
      ret[key] = options.env?.[key];
      return ret;
    }, {});
  options.plugins?.push(
    esbuildDecorators({
      tsconfig: options.tsConfig,
      cwd: workspaceRoot
    })
  );
  options.plugins?.push(environmentPlugin(stormEnv));

  // #endregion Add default plugins

  // #region Run the build process

  const dtsTsConfig = await getNormalizedTsConfig(
    workspaceRoot,
    options.outputPath,
    createTypeScriptCompilationOptions(
      normalizeOptions(
        {
          ...options,
          watch: false,
          main: context.main,
          transformers: []
        },
        workspaceRoot,
        context.sourceRoot,
        workspaceRoot
      ),
      context.projectName
    )
  );

  writeTrace(
    `⚙️  TSC (Type Declarations) Build options:
${Object.keys(dtsTsConfig.options)
  .map(
    key =>
      `${key}: ${
        !dtsTsConfig.options[key] || _isPrimitive(dtsTsConfig.options[key])
          ? dtsTsConfig.options[key]
          : JSON.stringify(dtsTsConfig.options[key])
      }`
  )
  .join("\n")}
`,
    config
  );

  // #endregion Add default plugins

  // #region Run the build process

  const getConfigOptions = {
    ...options,
    entry: {
      [removeExtension(
        context.main
          ?.split(
            context.main?.includes(sep)
              ? sep
              : context.main?.includes("/")
                ? "/"
                : "\\"
          )
          ?.pop()
      )]: context.main
    },
    define: {
      __STORM_CONFIG: JSON.stringify(stormEnv)
    },
    env: {
      __STORM_CONFIG: JSON.stringify(stormEnv),
      ...Object.keys(options.env ?? {})
        .filter(key => !key.includes("(") && !key.includes(")"))
        .reduce((ret, key) => {
          ret[key] = options.env?.[key];
          return ret;
        }, {})
    },
    dtsTsConfig,
    banner: options.banner
      ? {
          js: `

${options.banner}

`,
          css: `/*

${options.banner}

*/`
        }
      : undefined,
    outputPath: options.outputPath
  };

  if (!options.getConfig) {
    options.getConfig = defaultConfig;
    writeWarning(
      "Applying the default configuration for Build process because no `getConfig` parameter was provided",
      config
    );
  }

  writeInfo("⚡ Running the Build process", config);

  const getConfigFns = [options.getConfig];
  const tsupConfig = defineConfig(
    getConfigFns.map(getConfigFn =>
      getConfig(
        workspaceRoot,
        context.projectRoot,
        getConfigFn,
        getConfigOptions
      )
    )
  );

  if (_isFunction(tsupConfig)) {
    const tsupOptions = await Promise.resolve(tsupConfig({}));
    await build(tsupOptions, config as StormConfig);
  } else {
    await build(tsupConfig, config as StormConfig);
  }
};

async function getNormalizedTsConfig(
  workspaceRoot: string,
  outputPath: string,
  options: TypeScriptCompilationOptions
) {
  const { correctPaths } = await import("@storm-software/config-tools");

  const tsModule = ensureTypescript();

  const rawTsconfig = tsModule.readConfigFile(
    options.tsConfig,
    tsModule.sys.readFile
  );
  if (!rawTsconfig?.config || rawTsconfig?.error) {
    throw new Error(
      `Unable to find ${findFileName(options.tsConfig) || "tsconfig.json"} in ${dirname(
        options.tsConfig
      )}${rawTsconfig?.error ? ` \nError: ${rawTsconfig.error.messageText}` : ""}`
    );
  }

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

  const basePath = correctPaths(workspaceRoot);

  const parsedTsconfig = tsModule.parseJsonConfigFileContent(
    {
      ...rawTsconfig.config,
      compilerOptions: {
        ...rawTsconfig.config?.compilerOptions,
        preserveSymlinks: true,
        outDir: outputPath,
        noEmit: false,
        emitDeclarationOnly: true,
        declaration: true,
        declarationMap: true,
        declarationDir: join("tmp", ".tsup", "declaration")
      },
      include: [
        join(basePath, "node_modules/typescript/**/*.d.ts").replaceAll(
          "\\",
          "/"
        ),
        ...rawTsconfig.config?.include
      ]
    },
    tsModule.sys,
    dirname(options.tsConfig)
  );

  parsedTsconfig.fileNames = [
    ...parsedTsconfig.fileNames,
    ...(await glob(
      correctPaths(join(workspaceRoot, "node_modules/typescript/**/*.d.ts"))
    ))
  ];

  parsedTsconfig.options.declarationDir = correctPaths(
    join(basePath, "tmp", ".tsup", "declaration")
  );
  parsedTsconfig.options.pathsBasePath = basePath;
  parsedTsconfig.options.rootDir = basePath;
  parsedTsconfig.options.baseUrl = ".";
  // parsedTsconfig.options.pathsBasePath = basePath;

  // if (parsedTsconfig.options.paths) {
  //   parsedTsconfig.options.paths = Object.keys(parsedTsconfig.options.paths).reduce(
  //     (ret: Record<string, string[]>, key: string) => {
  //       if (parsedTsconfig.options.paths?.[key]) {
  //         ret[key] = parsedTsconfig.options.paths[key]?.map((path) =>
  //           correctPaths(join(basePath, path))
  //         ) as string[];
  //       }

  //       return ret;
  //     },
  //     {} as Record<string, string[]>
  //   );
  // }

  // if (parsedTsconfig.fileNames) {
  //   parsedTsconfig.fileNames = parsedTsconfig.fileNames.map((fileName) => correctPaths(fileName));
  //   parsedTsconfig.fileNames.push(
  //     correctPaths(join(basePath, "node_modules", "typescript", "lib", "lib.esnext.d.ts"))
  //   );
  // }

  if (parsedTsconfig.options.incremental) {
    parsedTsconfig.options.tsBuildInfoFile = correctPaths(
      join(outputPath, "tsconfig.tsbuildinfo")
    );
  }

  return parsedTsconfig;
}

const build = async (options: Options | Options[], config?: StormConfig) => {
  const { writeDebug } = await import("@storm-software/config-tools");

  if (Array.isArray(options)) {
    await Promise.all(options.map(buildOptions => build(buildOptions, config)));
  } else {
    let tsupOptions = options;
    if (_isFunction(tsupOptions)) {
      tsupOptions = (await Promise.resolve(tsupOptions({}))) as Options;
    }

    writeDebug(
      `⚙️  Tsup Build options:
${
  !_isFunction(tsupOptions)
    ? Object.keys(tsupOptions)
        .map(
          key =>
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
`,
      config
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
    getCustomTransformers: getCustomTrasformersFactory(
      normalizedOptions.transformers
    )
  };
};
