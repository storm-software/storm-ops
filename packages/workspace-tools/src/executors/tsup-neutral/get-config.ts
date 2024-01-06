import { joinPathFragments } from "@nx/devkit";
import { Options } from "tsup";
import { outExtension } from "../../base/get-tsup-config";
import { GetConfigParams } from "../../types";

export function modernNeutralConfig({
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
