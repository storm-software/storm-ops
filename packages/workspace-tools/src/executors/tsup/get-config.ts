import { joinPathFragments } from "@nx/devkit";
import { BuildOptions, Format } from "esbuild";
import { esbuildPluginFilePathExtensions } from "esbuild-plugin-file-path-extensions";
import { Options, defineConfig } from "tsup";
import { TsupExecutorSchema } from "./schema";

type Entry = string | string[] | Record<string, string>;

export function modernConfig(
  entry: Entry,
  outDir: string,
  tsconfig = "tsconfig.json",
  debug = false,
  bundle = true,
  platform = "neutral",
  options: Options
) {
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
    outDir: joinPathFragments(outDir, "dist", "modern"),
    silent: false,
    metafile: true,
    minify: false,
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
  tsconfig = "tsconfig.json",
  debug = false,
  bundle = true,
  platform = "neutral",
  options: Options
) {
  return {
    name: "legacy",
    entry,
    format: platform !== "node" ? ["cjs", "esm", "iife"] : ["cjs", "esm"],
    target: ["es2022", "node18"],
    tsconfig,
    outDir: joinPathFragments(outDir, "dist", "legacy"),
    silent: false,
    metafile: true,
    shims: true,
    minify: false,
    platform,
    dts: true,
    sourcemap: debug,
    clean: false,
    esbuildPlugins: [esbuildPluginFilePathExtensions({ esmExtension: "js" })]
  } as Options;
}

export function getConfig(
  sourceRoot: string,
  {
    outputPath,
    tsConfig,
    debug,
    bundle,
    platform,
    options,
    additionalEntryPoints
  }: TsupExecutorSchema
) {
  const entry = [
    joinPathFragments(sourceRoot, "**/*.ts"),
    joinPathFragments(sourceRoot, "**/*.tsx"),
    ...(additionalEntryPoints ?? [])
  ];

  return defineConfig([
    modernConfig(entry, outputPath, tsConfig, debug, bundle, platform, options),
    legacyConfig(entry, outputPath, tsConfig, debug, bundle, platform, options)
  ]);
}

const esbuildOptions = (
  options: BuildOptions,
  context: {
    format: Format;
  }
) => {
  if (context.format === "esm") {
    options.outExtension = {
      ".js": ".js"
    };
  } else if (context.format === "cjs") {
    options.outExtension = { ".js": ".cjs" };
  }
};
