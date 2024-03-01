import { joinPathFragments } from "@nx/devkit";
import type { Options } from "tsup";
import { outExtension } from "../../base/get-tsup-config";
import type { GetConfigParams } from "../../types";
import type { BuildOptions } from "../../../declarations";

export const browserConfig = ({
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
  platform = "browser",
  verbose = true,
  metafile = true,
  skipNativeModulesPlugin = false,
  define,
  env,
  plugins,
  generatePackageJson,
  dtsTsConfig,
  minify = false,
  getTransform
}: GetConfigParams): BuildOptions => {
  const outputPath = joinPathFragments(outDir, "dist");

  const options = {
    name: "modern",
    entry,
    format: ["cjs", "esm", "iife"],
    target: ["chrome91", "firefox90", "edge91", "safari15", "ios15", "opera77", "esnext"],
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
    metafile,
    shims,
    external,
    platform,
    banner,
    define,
    env,
    dts: false,
    minify,
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
    apiReport: false,
    docModel: false,
    tsdocMetadata: false,
    sourcemap: debug,
    clean: false,
    skipNativeModulesPlugin,
    tsconfigDecoratorMetadata: true,
    plugins,
    outExtension,
    getTransform
  } as Options;

  if (!debug || minify) {
    options.minify = "terser";
    options.terserOptions = {
      compress: true,
      ecma: 2020,
      keep_classnames: true,
      keep_fnames: true
    };
  }

  return options;
};

/*export const legacyBrowserConfig = ({
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
  platform = "browser",
  verbose = false,
  shims = true,
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
}: GetConfigParams) => {
  const outputPath = joinPathFragments(outDir, "dist", "legacy");

  const options = {
    name: "legacy",
    entry,
    format: ["cjs", "esm", "iife"],
    target: ["es2022"],
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
    metafile,
    shims,
    external,
    platform,
    banner,
    define,
    env,
    dts: false,
    minify,
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
    apiReport,
    docModel,
    tsdocMetadata,
    sourcemap: debug,
    clean: false,
    skipNativeModulesPlugin,
    tsconfigDecoratorMetadata: true,
    plugins,
    outExtension,
    getTransform
  } as Options;

  if (!debug || minify) {
    options.minify = "terser";
    options.terserOptions = {
      compress: true,
      ecma: 2020,
      keep_classnames: true,
      keep_fnames: true
    };
  }

  return options;
};*/
