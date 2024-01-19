import { joinPathFragments } from "@nx/devkit";
import type { Options } from "tsup";
import type { GetConfigParams, TsupGetConfigOptions } from "../types";

export function defaultConfig({
  entry,
  outDir,
  projectRoot,
  workspaceRoot,
  tsconfig = "tsconfig.json",
  splitting,
  treeshake,
  format = ["cjs", "esm"],
  debug = false,
  shims = true,
  external,
  banner = {},
  platform = "neutral",
  verbose = false,
  apiReport = true,
  docModel = true,
  tsdocMetadata = true,
  metafile = true,
  skipNativeModulesPlugin = false,
  define,
  env,
  plugins,
  generatePackageJson,
  dtsTsConfig,
  minify = false,
  getTransform
}: GetConfigParams) {
  return {
    name: "default",
    entry,
    format,
    target:
      platform !== "node"
        ? ["chrome91", "firefox90", "edge91", "safari15", "ios15", "opera77", "esnext"]
        : ["esnext", "node20"],
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
    outDir: joinPathFragments(outDir, "dist"),
    silent: !verbose,
    metafile,
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
          outDir: joinPathFragments(outDir, "dist")
        }
      }
    },
    minify,
    apiReport,
    docModel,
    tsdocMetadata,
    sourcemap: debug,
    clean: false,
    skipNativeModulesPlugin,
    tsconfigDecoratorMetadata: true,
    plugins,
    getTransform,
    outExtension
  } as Options;
}

export function getConfig(
  workspaceRoot: string,
  projectRoot: string,
  getConfigFn: (options: GetConfigParams) => Options,
  { outputPath, tsConfig, platform, ...rest }: TsupGetConfigOptions
) {
  return getConfigFn({
    ...rest,
    additionalEntryPoints: [],
    outDir: outputPath,
    tsconfig: tsConfig,
    workspaceRoot,
    projectRoot,
    platform
  });
}

export const outExtension = ({ format }) => {
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
