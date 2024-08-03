import { joinPathFragments } from "@nx/devkit";
import type { Options } from "tsup";
import type { BuildOptions, GetConfigParams } from "../../declarations";
import { outExtension } from "../utils";

export function nodeConfig({
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
  platform = "node",
  verbose = true,
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
}: GetConfigParams): BuildOptions {
  const options = {
    name: "node",
    entry,
    format: ["cjs", "esm"],
    target: ["esnext", "node20"],
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
    minify,
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
  metafile = true,
  skipNativeModulesPlugin = false,
  define,
  env,
  plugins,
  generatePackageJson,
  dtsTsConfig,
  getTransform
}: GetConfigParams): BuildOptions {
  const options = {
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
    outDir: joinPathFragments(outDir, "dist"),
    silent: !verbose,
    metafile,
    shims,
    external,
    platform: "browser",
    banner,
    define,
    env,
    dts: false,
    minify: false,
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
