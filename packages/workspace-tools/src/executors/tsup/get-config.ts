import { joinPathFragments } from "@nx/devkit";
import { BuildOptions, Format } from "esbuild";
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
  options: Options = {}
) {
  return {
    ...options,
    name: "modern",
    entry,
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
        : ["esnext", "node18"],
    tsconfig,
    outDir: joinPathFragments(outDir, "dist", "modern"),
    metafile: true,
    minify: false,
    bundle,
    platform,
    dts: true,
    sourcemap: debug,
    clean: false
  } as Options;
}

export function legacyConfig(
  entry: Entry,
  outDir: string,
  tsconfig = "tsconfig.json",
  debug = false,
  bundle = true,
  platform = "neutral",
  options: Options = {}
) {
  return {
    ...options,
    name: "legacy",
    entry,
    format: ["cjs", "esm"],
    target: ["es2022", "node18"],
    tsconfig,
    outDir: joinPathFragments(outDir, "dist", "legacy"),
    metafile: true,
    shims: true,
    minify: false,
    bundle,
    platform,
    dts: true,
    sourcemap: debug,
    clean: false
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
