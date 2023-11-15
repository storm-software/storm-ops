import { joinPathFragments } from "@nx/devkit";
import { BuildOptions, Format } from "esbuild";
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
    treeshake: {
      moduleSideEffects: ["src"],
      preset: "recommended"
    },
    format: ["esm", "cjs"],
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
        : ["esnext", "edge91", "node18"],
    tsconfig: tsConfig,
    outDir: joinPathFragments(outDir, "build", "modern"),
    metafile: true,
    minify: !debug ? "terser" : false,
    terserOptions: !debug
      ? {
          mangle: true,
          compress: true,
          format: {
            comments: false
          },
          ecma: 2020,
          keep_classnames: true,
          keep_fnames: true
        }
      : undefined,
    minifyWhitespace: !debug,
    minifyIdentifiers: !debug,
    minifySyntax: !debug,
    bundle,
    platform,
    dts: true,
    sourcemap: debug,
    cjsInterop: true,
    clean: false
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
    treeshake: {
      moduleSideEffects: ["src"],
      preset: "recommended"
    },
    format: ["esm", "cjs"],
    target: ["es2022", "node18"],
    tsconfig: tsConfig,
    outDir: joinPathFragments(outDir, "build", "legacy"),
    metafile: true,
    minify: !debug ? "terser" : false,
    terserOptions: !debug
      ? {
          mangle: true,
          compress: true,
          format: {
            comments: false
          },
          ecma: 2020,
          keep_classnames: false,
          keep_fnames: true,
          safari10: true
        }
      : undefined,
    minifyWhitespace: !debug,
    minifyIdentifiers: !debug,
    minifySyntax: !debug,
    bundle,
    platform,
    dts: true,
    sourcemap: debug,
    cjsInterop: true,
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
