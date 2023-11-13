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
  publicDir,
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
        : ["esnext", "edge91", "node18"],
    tsconfig: tsConfig,
    outDir: joinPathFragments(outDir, "build", "modern"),
    metafile: true,
    minify: !debug ? "terser" : false,
    terserOptions: !debug
      ? {
          mangle: true,
          module: true,
          compress: true,
          format: {
            comments: false
          },
          ecma: 2020,
          keep_classnames: false,
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
    clean: false,
    publicDir,
    outExtension: (ctx: { format: string }) => ({
      js: ctx.format === "cjs" ? "cjs" : "js",
      dts: ctx.format === "cjs" ? "d.cts" : "d.ts"
    }),
    esbuildPlugins: [
      esbuildPluginFilePathExtensions({
        esmExtension: "js",
        cjsExtension: "cjs"
      })
    ]
  } as Options;
}

export function legacyConfig(
  entry: Entry,
  outDir: string,
  tsConfig = "tsconfig.json",
  debug = false,
  bundle = true,
  platform = "neutral",
  publicDir,
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
    format: ["cjs", "esm"],
    target: ["es2022", "node18"],
    tsconfig: tsConfig,
    outDir: joinPathFragments(outDir, "build", "legacy"),
    metafile: true,
    minify: !debug ? "terser" : false,
    terserOptions: !debug
      ? {
          mangle: true,
          module: true,
          compress: true,
          format: {
            comments: false
          },
          ecma: 2020,
          keep_classnames: false,
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
    clean: false,
    publicDir,
    outExtension: (ctx: { format: string }) => ({
      js: ctx.format === "cjs" ? "cjs" : "js",
      dts: ctx.format === "cjs" ? "d.cts" : "d.ts"
    }),
    esbuildPlugins: [
      esbuildPluginFilePathExtensions({
        esmExtension: "js",
        cjsExtension: "cjs"
      })
    ]
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
  const publicDir = joinPathFragments(sourceRoot, "src");

  return defineConfig([
    modernConfig(
      entry,
      outputPath,
      tsConfig,
      debug,
      bundle,
      platform,
      publicDir,
      options
    ),
    legacyConfig(
      entry,
      outputPath,
      tsConfig,
      debug,
      bundle,
      platform,
      publicDir,
      options
    )
  ]);
}
