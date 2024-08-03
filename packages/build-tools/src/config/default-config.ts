import { joinPathFragments } from "@nx/devkit";
import type { Options } from "tsup";
import type { BuildOptions, GetConfigParams } from "../../declarations";
import { outExtension } from "../utils";

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
  // dtsTsConfig,
  minify = false,
  getTransform
}: GetConfigParams): BuildOptions {
  return {
    name: "default",
    entry,
    format,
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
    dts: true,
    // experimentalDts: {
    //   entry,
    //   compilerOptions: {
    //     ...dtsTsConfig,
    //     options: {
    //       ...dtsTsConfig.options,
    //       outDir: joinPathFragments(outDir, "dist")
    //     }
    //   }
    // },
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
