import { joinPathFragments } from "@nx/devkit";
import { Path, globSync } from "glob";
import { Options, defineConfig } from "tsup";
import type { ParsedCommandLine } from "typescript";
import { removeExtension } from "../../utils/file-path-utils";
import { TsupExecutorSchema } from "./schema";

type Entry = string | string[] | Record<string, string>;

export type TsupGetConfigOptions = Omit<TsupExecutorSchema, "banner"> & {
  banner?: { js?: string; css?: string };
  dtsTsConfig: ParsedCommandLine;
};

type GetConfigParams = Omit<
  TsupGetConfigOptions,
  "entry" | "assets" | "clean" | "outputPath" | "tsConfig" | "main"
> & {
  entry: Entry;
  outDir: string;
  projectRoot: string;
  workspaceRoot: string;
  tsconfig: string;
  shims?: boolean;
  apiReport?: boolean;
  docModel?: boolean;
  tsdocMetadata?: boolean;
  dtsTsConfig: ParsedCommandLine;
};

export function modernConfig({
  entry,
  outDir,
  projectRoot,
  workspaceRoot,
  tsconfig = "tsconfig.json",
  splitting,
  treeshake,
  debug = false,
  shims = true,
  external,
  banner = {},
  platform = "neutral",
  verbose = false,
  apiReport = true,
  docModel = true,
  tsdocMetadata = true,
  define,
  env,
  plugins,
  generatePackageJson,
  dtsTsConfig
}: GetConfigParams) {
  let outputPath = joinPathFragments(outDir, "dist", "modern");

  return {
    name: "modern",
    entry,
    format: platform !== "node" ? ["cjs", "esm", "iife"] : ["cjs", "esm"],
    target:
      platform !== "node"
        ? [
            "chrome91",
            "firefox90",
            "edge91",
            "safari15",
            "ios15",
            "opera77",
            "esnext"
          ]
        : ["esnext", "node18"],
    tsconfig,
    splitting,
    generatePackageJson,
    treeshake: treeshake
      ? {
          preset: "recommended"
        }
      : false,
    projectRoot,
    workspaceRoot,
    outDir: outputPath,
    silent: !verbose,
    metafile: true,
    shims,
    external,
    platform,
    banner,
    define,
    env,
    dts: false,
    experimentalDts: {
      entry,
      compilerOptions: {
        ...dtsTsConfig,
        options: {
          ...dtsTsConfig.options,
          outDir: outputPath
        }
      }
    },
    /*minify: debug ? false : "terser",
    terserOptions: {
      compress: true,
      ecma: 2020,
      keep_classnames: true,
      keep_fnames: true
    },*/
    apiReport,
    docModel,
    tsdocMetadata,
    sourcemap: debug,
    clean: false,
    tsconfigDecoratorMetadata: true,
    plugins,
    outExtension
  } as Options;
}

export function legacyConfig({
  entry,
  outDir,
  projectRoot,
  workspaceRoot,
  tsconfig = "tsconfig.json",
  splitting,
  treeshake,
  debug = false,
  external,
  banner = {},
  platform = "neutral",
  verbose = false,
  shims = true,
  define,
  env,
  plugins,
  generatePackageJson,
  dtsTsConfig
}: GetConfigParams) {
  let outputPath = joinPathFragments(outDir, "dist", "legacy");

  return {
    name: "legacy",
    entry,
    format: platform !== "node" ? ["cjs", "esm", "iife"] : ["cjs", "esm"],
    target: ["es2022", "node18"],
    tsconfig,
    splitting,
    generatePackageJson,
    treeshake: treeshake
      ? {
          preset: "recommended"
        }
      : false,
    projectRoot,
    workspaceRoot,
    outDir: outputPath,
    silent: !verbose,
    metafile: true,
    shims,
    external,
    platform,
    banner,
    define,
    env,
    dts: false,
    experimentalDts: {
      entry,
      compilerOptions: {
        ...dtsTsConfig,
        options: {
          ...dtsTsConfig.options,
          outDir: outputPath
        }
      }
    },
    /*minify: debug ? false : "terser",
    terserOptions: {
      compress: true,
      ecma: 2020,
      keep_classnames: true,
      keep_fnames: true
    },*/
    apiReport: false,
    docModel: false,
    tsdocMetadata: false,
    sourcemap: debug,
    clean: false,
    tsconfigDecoratorMetadata: true,
    plugins,
    outExtension
  } as Options;
}

export function workerConfig({
  entry,
  outDir,
  projectRoot,
  workspaceRoot,
  tsconfig = "tsconfig.json",
  splitting,
  treeshake,
  debug = false,
  external,
  banner = {},
  verbose = false,
  apiReport = true,
  docModel = true,
  tsdocMetadata = true,
  shims = true,
  define,
  env,
  plugins,
  generatePackageJson,
  dtsTsConfig
}: GetConfigParams) {
  let outputPath = joinPathFragments(outDir, "dist");

  return {
    name: "worker",
    entry,
    format: ["esm"],
    target: ["chrome95"],
    bundle: true,
    tsconfig,
    splitting,
    generatePackageJson,
    treeshake: treeshake
      ? {
          preset: "recommended"
        }
      : false,
    projectRoot,
    workspaceRoot,
    outDir: outputPath,
    silent: !verbose,
    metafile: true,
    shims,
    external,
    platform: "browser",
    banner,
    define,
    env,
    dts: false,
    experimentalDts: {
      entry,
      compilerOptions: {
        ...dtsTsConfig,
        options: {
          ...dtsTsConfig.options,
          outDir: outputPath
        }
      }
    },
    minify: debug ? false : "terser",
    terserOptions: {
      compress: true,
      ecma: 2020,
      keep_classnames: true,
      keep_fnames: true
    },
    apiReport,
    docModel,
    tsdocMetadata,
    sourcemap: debug,
    clean: false,
    tsconfigDecoratorMetadata: true,
    plugins,
    outExtension
  } as Options;
}

export function getConfig(
  workspaceRoot: string,
  projectRoot: string,
  sourceRoot: string,
  {
    outputPath,
    tsConfig,
    additionalEntryPoints,
    platform,
    ...rest
  }: TsupGetConfigOptions
) {
  const entry = globSync(
    [
      rest.entry
        ? rest.entry
        : joinPathFragments(
            sourceRoot.includes(workspaceRoot)
              ? sourceRoot
              : joinPathFragments(workspaceRoot, sourceRoot),
            "**/*.{ts,tsx}"
          ),
      ...(additionalEntryPoints ?? [])
    ],
    {
      withFileTypes: true
    }
  ).reduce((ret, filePath: Path) => {
    let propertyKey = joinPathFragments(
      filePath.path,
      removeExtension(filePath.name)
    )
      .replaceAll(workspaceRoot, "")
      .replaceAll("\\", "/")
      .replaceAll(sourceRoot, "")
      .replaceAll(projectRoot, "");

    if (propertyKey) {
      while (propertyKey.startsWith("/")) {
        propertyKey = propertyKey.substring(1);
      }

      console.debug(
        `Trying to add entry point ${propertyKey} at "${joinPathFragments(
          filePath.path,
          filePath.name
        )}"`
      );
      if (!(propertyKey in ret)) {
        ret[propertyKey] = joinPathFragments(filePath.path, filePath.name);
      }
    }

    return ret;
  }, {});

  const params = {
    ...rest,
    entry,
    outDir: outputPath,
    tsconfig: tsConfig,
    workspaceRoot,
    projectRoot,
    sourceRoot,
    platform
  };

  if (platform === "worker") {
    return defineConfig(workerConfig(params));
  }

  return defineConfig([modernConfig(params), legacyConfig(params)]);
}

const outExtension = ({ format }) => {
  let jsExtension = ".js";
  let dtsExtension = ".d.ts";
  if (format === "cjs") {
    jsExtension = ".cjs";
    dtsExtension = ".d.cts";
  }
  if (format === "esm") {
    jsExtension = ".js";
    dtsExtension = ".d.ts";
  }
  if (format === "iife") {
    jsExtension = ".global.js";
  }

  return {
    js: jsExtension,
    dts: dtsExtension
  };
};
