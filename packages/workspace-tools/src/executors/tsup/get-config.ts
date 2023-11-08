import { esbuildPluginFilePathExtensions } from "esbuild-plugin-file-path-extensions";
import { Options, defineConfig } from "tsup";
import { TsupExecutorSchema } from "./schema";

type Entry = string | string[] | Record<string, string>;

export function modernConfig(
  entry: Entry,
  outDir: string,
  tsConfig = "tsconfig.lib.json",
  debug = false,
  bundle = true,
  platform = "node",
  clean = true,
  options: Options = {}
) {
  return {
    ...options,
    entry,
    splitting: true,
    treeshake: true,
    format: ["cjs", "esm"],
    target: ["chrome91", "firefox90", "edge91", "safari15", "ios15", "opera77"],
    tsconfig: tsConfig,
    outDir,
    minify: debug,
    bundle,
    platform,
    dts: true,
    sourcemap: debug,
    clean,
    esbuildPlugins: [esbuildPluginFilePathExtensions({ esmExtension: "js" })]
  } as Options;
}

export function legacyConfig(
  entry: Entry,
  outDir: string,
  tsConfig = "tsconfig.lib.json",
  debug = false,
  bundle = true,
  platform = "node",
  clean = true,
  options: Options = {}
) {
  return {
    ...options,
    entry,
    splitting: true,
    treeshake: true,
    format: ["cjs", "esm"],
    target: ["es2020", "node16"],
    tsconfig: tsConfig,
    outDir,
    minify: debug,
    bundle,
    platform,
    dts: true,
    sourcemap: debug,
    clean,
    esbuildPlugins: [esbuildPluginFilePathExtensions({ esmExtension: "js" })]
  } as Options;
}

export function getConfig({
  outputPath,
  tsConfig,
  debug,
  bundle,
  platform,
  clean,
  options,
  main,
  additionalEntryPoints
}: TsupExecutorSchema) {
  const entry = [main, ...(additionalEntryPoints ?? [])];

  return defineConfig([
    modernConfig(
      entry,
      outputPath,
      tsConfig,
      debug,
      bundle,
      platform,
      clean,
      options
    ),
    legacyConfig(
      entry,
      outputPath,
      tsConfig,
      debug,
      bundle,
      platform,
      clean,
      options
    )
  ]);
}
