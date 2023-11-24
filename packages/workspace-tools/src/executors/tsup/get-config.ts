import { Path, globSync } from "glob";
import { join } from "path";
import { Options, defineConfig } from "tsup";
import { removeExtension } from "../../utils/file-path-utils";
import { TsupExecutorSchema } from "./schema";

type Entry = string | string[] | Record<string, string>;

export type TsupGetConfigOptions = Omit<TsupExecutorSchema, "banner"> & {
  banner?: { js?: string; css?: string };
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
  apiReport?: boolean;
  docModel?: boolean;
  tsdocMetadata?: boolean;
};

export function modernConfig({
  entry,
  outDir,
  projectRoot,
  workspaceRoot,
  tsconfig = "tsconfig.json",
  debug = false,
  external,
  banner = {},
  platform = "neutral",
  verbose = false,
  apiReport = true,
  docModel = true,
  tsdocMetadata = true,
  define,
  env,
  options
}: GetConfigParams) {
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
    projectRoot,
    workspaceRoot,
    outDir: join(outDir, "dist", "modern"),
    silent: !verbose,
    metafile: true,
    shims: true,
    minify: false,
    external,
    platform,
    banner,
    define,
    env,
    dts: false,
    experimentalDts: {
      entry,
      compilerOptions: {
        noEmit: false
      }
    },
    apiReport,
    docModel,
    tsdocMetadata,
    sourcemap: debug,
    clean: false,
    outExtension
  } as Options;
}

export function legacyConfig({
  entry,
  outDir,
  projectRoot,
  workspaceRoot,
  tsconfig = "tsconfig.json",
  debug = false,
  external,
  banner = {},
  platform = "neutral",
  verbose = false,
  define,
  env,
  options
}: GetConfigParams) {
  return {
    name: "legacy",
    entry,
    format: platform !== "node" ? ["cjs", "esm", "iife"] : ["cjs", "esm"],
    target: ["es2022", "node18"],
    tsconfig,
    projectRoot,
    workspaceRoot,
    outDir: join(outDir, "dist", "legacy"),
    silent: !verbose,
    metafile: true,
    shims: true,
    minify: false,
    external,
    platform,
    banner,
    define,
    env,
    dts: false,
    experimentalDts: {
      entry,
      compilerOptions: {
        noEmit: false
      }
    },
    apiReport: false,
    docModel: false,
    tsdocMetadata: false,
    sourcemap: debug,
    clean: false,
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
    debug,
    banner,
    platform,
    external,
    options,
    additionalEntryPoints,
    apiReport,
    docModel,
    tsdocMetadata,
    define,
    env,
    verbose,
    ...rest
  }: TsupGetConfigOptions
) {
  const entry = globSync(
    [
      rest.entry ? rest.entry : join(sourceRoot, "index.ts"),
      ...(additionalEntryPoints ?? [])
    ],
    {
      withFileTypes: true
    }
  ).reduce((ret, filePath: Path) => {
    ret[
      join(filePath.path, removeExtension(filePath.name))
        .replaceAll("/", "-")
        .replaceAll("\\", "-")
    ] = join(filePath.path, filePath.name);

    return ret;
  }, {});

  return defineConfig([
    modernConfig({
      entry,
      outDir: outputPath,
      projectRoot,
      workspaceRoot,
      tsconfig: tsConfig,
      debug,
      banner,
      platform,
      external,
      verbose,
      apiReport,
      docModel,
      tsdocMetadata,
      define,
      env,
      options
    }),
    legacyConfig({
      entry,
      outDir: outputPath,
      projectRoot,
      workspaceRoot,
      tsconfig: tsConfig,
      debug,
      banner,
      platform,
      external,
      verbose,
      define,
      env,
      options
    })
  ]);
}

const outExtension = ({ options, format, pkgType }) => {
  console.log(options);
  console.log(format);
  console.log(pkgType);

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
