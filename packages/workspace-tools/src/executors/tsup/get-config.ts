import { joinPathFragments } from "@nx/devkit";
import { esbuildPluginFilePathExtensions } from "esbuild-plugin-file-path-extensions";
import { Options, defineConfig } from "tsup";
import { TsupExecutorSchema } from "./schema";

type Entry = string | string[] | Record<string, string>;

export function modernConfig(
  entry: Entry,
  outDir: string,
  tsConfig = "tsconfig.json",
  debug = false,
  bundle = true,
  platform = "neutral",
  options: Options = {}
) {
  return {
    ...options,
    entry,
    splitting: true,
    treeshake: true,
    format: ["cjs", "esm"],
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
        : ["esnext"],
    tsconfig: tsConfig,
    outDir: joinPathFragments(outDir, "build", "modern"),
    minify: debug,
    bundle,
    platform,
    dts: true,
    sourcemap: debug,
    clean: false,
    esbuildPlugins: [esbuildPluginFilePathExtensions({ esmExtension: "js" })]
  } as Options;
}

export function legacyConfig(
  entry: Entry,
  outDir: string,
  tsConfig = "tsconfig.json",
  debug = false,
  bundle = true,
  platform = "neutral",
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
    outDir: joinPathFragments(outDir, "build", "legacy"),
    minify: debug,
    bundle,
    platform,
    dts: true,
    sourcemap: debug,
    clean: false,
    esbuildPlugins: [esbuildPluginFilePathExtensions({ esmExtension: "js" })]
  } as Options;
}

export function getConfig({
  outputPath,
  tsConfig,
  debug,
  bundle,
  platform,
  options,
  additionalEntryPoints
}: TsupExecutorSchema) {
  const entry = [
    "src/**/*.ts",
    "src/**/*.tsx",
    ...(additionalEntryPoints ?? [])
  ];

  return defineConfig([
    modernConfig(entry, outputPath, tsConfig, debug, bundle, platform, options),
    legacyConfig(entry, outputPath, tsConfig, debug, bundle, platform, options)
  ]);
}
