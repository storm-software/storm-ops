import { joinPathFragments } from "@nx/devkit";
import { Options } from "tsup";
import { outExtension } from "../../base/get-tsup-config";
import { GetConfigParams } from "../../types";

export function neutralConfig({
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
  metafile = false,
  define,
  env,
  plugins,
  generatePackageJson,
  dtsTsConfig
}: GetConfigParams) {
  let outputPath = joinPathFragments(outDir, "dist");

  const options = {
    name: "neutral",
    entry,
    format: ["cjs", "esm", "iife"],
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
    tsconfigDecoratorMetadata: true,
    plugins,
    outExtension
  } as Options;

  if (!debug) {
    options.minify = "terser";
    options.terserOptions = {
      compress: true,
      ecma: 2020,
      keep_classnames: true,
      keep_fnames: true
    };
  }

  return options;
}

export function legacyNeutralConfig({
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
  metafile = false,
  define,
  env,
  plugins,
  generatePackageJson,
  dtsTsConfig
}: GetConfigParams) {
  let outputPath = joinPathFragments(outDir, "dist", "legacy");

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
    tsconfigDecoratorMetadata: true,
    plugins,
    outExtension
  } as Options;

  if (!debug) {
    options.minify = "terser";
    options.terserOptions = {
      compress: true,
      ecma: 2020,
      keep_classnames: true,
      keep_fnames: true
    };
  }

  return options;
}
