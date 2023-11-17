import { joinPathFragments } from "@nx/devkit";
import { Path, globSync } from "glob";
import { Options, defineConfig } from "tsup";
import { removeExtension } from "../../utils/file-path-utils";
import { TsupExecutorSchema } from "./schema";

type Entry = string | string[] | Record<string, string>;

export function modernConfig(
  entry: Entry,
  outDir: string,
  tsconfig = "tsconfig.json",
  debug = false,
  bundle = true,
  platform = "node",
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
    shims: true,
    minify: false,
    platform,
    dts: true,
    sourcemap: debug,
    clean: false,
    outExtension
  } as Options;
}

export function legacyConfig(
  entry: Entry,
  outDir: string,
  tsconfig = "tsconfig.json",
  debug = false,
  bundle = true,
  platform = "node",
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
    outExtension
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
  const entry = globSync(
    [
      joinPathFragments(sourceRoot, "**/*.ts"),
      joinPathFragments(sourceRoot, "**/*.tsx"),
      ...(additionalEntryPoints ?? [])
    ],
    { withFileTypes: true }
  ).reduce((ret, filePath: Path) => {
    ret[removeExtension(filePath.name)] = joinPathFragments(
      filePath.path,
      filePath.name
    );

    return ret;
  }, {});

  return defineConfig([
    modernConfig(entry, outputPath, tsConfig, debug, bundle, platform, options),
    legacyConfig(entry, outputPath, tsConfig, debug, bundle, platform, options)
  ]);
}

const outExtension = ({ options, format, pkgType }) => {
  console.log(options);
  console.log(format);
  console.log(pkgType);

  let jsExtension = ".js";
  let dtsExtension = ".d.ts";
  if (format === "cjs") {
    jsExtension = ".cjs";
    dtsExtension = ".d.cts";
  }
  if (format === "esm") {
    jsExtension = ".js";
    dtsExtension = ".d.ts";
  }
  if (format === "iife") {
    jsExtension = ".global.js";
  }

  return {
    js: jsExtension,
    dts: dtsExtension
  };
};
