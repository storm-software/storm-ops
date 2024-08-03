import { joinPathFragments } from "@nx/devkit";
import type { Options } from "tsup";
import type { BuildOptions, GetConfigParams } from "../../declarations";
import { outExtension } from "../utils";

export const neutralConfig = ({
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
  verbose = true,
  metafile = true,
  skipNativeModulesPlugin = false,
  define,
  env,
  apiReport = true,
  docModel = true,
  tsdocMetadata = true,
  plugins,
  generatePackageJson,
  dtsTsConfig,
  minify = false,
  getTransform
}: GetConfigParams): BuildOptions => {
  const outputPath = joinPathFragments(outDir, "dist");

  const options = {
    name: "neutral",
    entry,
    format: ["cjs", "esm"],
    target: ["esnext"],
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
};

/*export function legacyNeutralConfig({
  entry,
  outDir,
  projectRoot,
  workspaceRoot,
  tsconfig = "tsconfig.json",
  splitting,
  treeshake,
  apiReport = true,
  docModel = true,
  tsdocMetadata = true,
  debug = false,
  external,
  banner = {},
  platform = "neutral",
  verbose = false,
  shims = true,
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
}*/
