import { esbuildDecorators } from "@anatine/esbuild-decorators";
import { getCustomTrasformersFactory } from "@nx/js/src/executors/tsc/lib/get-custom-transformers-factory.js";
import { normalizeOptions } from "@nx/js/src/executors/tsc/lib/normalize-options.js";
import type { NormalizedExecutorOptions } from "@nx/js/src/utils/schema.js";
import type { TypeScriptCompilationOptions } from "@nx/workspace/src/utilities/typescript/compilation.js";
import type { StormConfig } from "@storm-software/config";
import { environmentPlugin } from "esbuild-plugin-environment";
import { dirname, join, sep } from "node:path";
import { defaultConfig, getConfig } from "../config";
import type { TsupContext, TypeScriptBuildOptions } from "../types";
// import { type TSConfig, readTSConfig } from "pkg-types";
import { ensureTypescript } from "@nx/js/src/utils/typescript/ensure-typescript.js";
import { Glob } from "glob";
import { fileExists } from "nx/src/utils/fileutils";
import { parse } from "tsconfck";
import { defineConfig, type Options, build as tsup } from "tsup";

export const runTsupBuild = async (
  context: TsupContext,
  config: Partial<StormConfig>,
  options: TypeScriptBuildOptions
) => {
  const {
    writeInfo,
    writeTrace,
    writeWarning,
    writeError,
    correctPaths,
    findWorkspaceRoot,
    removeExtension,
    formatLogMessage
  } = await import("@storm-software/config-tools");

  try {
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

    process.chdir(workspaceRoot);

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
      `⚙️  TSC (Type Declarations) Build options: \r\n${formatLogMessage({ ...dtsTsConfig.options, define: null })}`,
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
  } catch (e) {
    writeError("An error occured running the Build process", config);
    console.error(e);
  }
};

async function getNormalizedTsConfig(
  workspaceRoot: string,
  outputPath: string,
  options: TypeScriptCompilationOptions
) {
  const { correctPaths, findFileName } = await import(
    "@storm-software/config-tools"
  );

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

  const result = await parse(options.tsConfig, {
    root: workspaceRoot
  });

  const tslibDir = correctPaths(
    join(workspaceRoot, "node_modules/typescript/lib")
  );
  const extraFileNames = (
    await new Glob("*.d.ts", {
      absolute: true,
      cwd: tslibDir,
      root: tslibDir
    }).walk()
  ).map(file => correctPaths(file));

  // const rawConfig = rawTsconfig.config ?? {};

  const basePath = correctPaths(workspaceRoot);
  const declarationDir = correctPaths(
    join(workspaceRoot, "tmp", ".tsup", "declaration")
  );

  const parsedTsconfig = tsModule.parseJsonConfigFileContent(
    {
      ...(result.tsconfig ?? {}),
      compilerOptions: {
        ...(result.tsconfig?.compilerOptions ?? {}),
        typeRoots: [
          ...(result.tsconfig?.compilerOptions?.typeRoots ?? []),
          join(dirname(options.tsConfig), "node_modules/@types"),
          correctPaths(join(basePath, "node_modules/@types"))
        ],
        outDir: outputPath,
        noEmit: false,
        skipLibCheck: true,
        skipDefaultLibCheck: true,
        emitDeclarationOnly: true,
        declaration: true,
        declarationMap: true,
        declarationDir
      },
      include: [...extraFileNames, ...(result.tsconfig?.include ?? [])]
    },
    tsModule.sys,
    dirname(options.tsConfig)
  );

  parsedTsconfig.fileNames = [...parsedTsconfig.fileNames, ...extraFileNames]
    .filter(fileName => !fileName.includes("*"))
    .map(fileName => correctPaths(fileName))
    .reduce((ret: string[], fileName: string) => {
      if (fileExists(fileName) && !ret.includes(fileName)) {
        ret.push(fileName);
      }

      return ret;
    }, []);

  parsedTsconfig.options.declarationDir = declarationDir;

  parsedTsconfig.options.pathsBasePath = basePath;
  parsedTsconfig.options.rootDir = basePath;
  parsedTsconfig.options.baseUrl = basePath;

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
    parsedTsconfig.options.tsBuildInfoFile = join(
      outputPath,
      "tsconfig.tsbuildinfo"
    ).replaceAll("\\", "/");
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
