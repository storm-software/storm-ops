import type { StormConfig } from "@storm-software/config";
import { getLogLevel, LogLevel } from "@storm-software/config-tools";
import type { TypeScriptBuildOptions } from "../../declarations";
import { defaultConfig } from "../config";
import type { RolldownOptions, UnbuildBuildOptions } from "../types";
import { getFileBanner } from "./get-file-banner";

export const applyDefaultOptions = (
  options: Partial<any>,
  config?: StormConfig
): TypeScriptBuildOptions => {
  options.entry ??= "{sourceRoot}/index.ts";
  options.outputPath ??= "dist/{projectRoot}";
  options.tsConfig ??= "{projectRoot}/tsconfig.json";
  options.assets ??= [];
  options.generatePackageJson ??= true;
  options.splitting ??= true;
  options.treeshake ??= true;
  options.platform ??= "neutral";
  options.format ??= ["cjs", "esm"];
  options.verbose ??= false;
  options.external ??= [];
  options.additionalEntryPoints ??= [];
  options.assets ??= [];
  options.plugins ??= [];
  options.includeSrc ??= false;
  options.minify ??= false;
  options.clean ??= true;
  options.bundle ??= true;
  options.debug ??= false;
  options.watch ??= false;
  options.apiReport ??= true;
  options.docModel ??= true;
  options.tsdocMetadata ??= true;
  options.emitOnAll ??= false;
  options.metafile ??= true;
  options.skipNativeModulesPlugin ??= false;
  options.define ??= {};
  options.env ??= {};
  options.getConfig ??= defaultConfig;
  options.verbose =
    options.verbose || getLogLevel(config?.logLevel) >= LogLevel.DEBUG;

  return options as TypeScriptBuildOptions;
};

export const applyDefaultRolldownOptions = (
  options: Partial<RolldownOptions>,
  config?: StormConfig
): RolldownOptions => {
  options.entry ??= "{sourceRoot}/index.ts";
  options.outputPath ??= "dist/{projectRoot}";
  options.tsConfig ??= "{projectRoot}/tsconfig.json";
  options.assets ??= [];
  options.generatePackageJson ??= true;
  options.platform ??= "neutral";
  options.verbose ??= false;
  options.external ??= (source: string) =>
    !!(
      process.env.STORM_EXTERNAL_PACKAGE_PATTERNS &&
      process.env.STORM_EXTERNAL_PACKAGE_PATTERNS.split(",")?.length > 0 &&
      process.env.STORM_EXTERNAL_PACKAGE_PATTERNS.split(",").some(
        pkg => pkg.replaceAll("*", "") && source?.includes(pkg)
      )
    );
  options.additionalEntryPoints ??= [];
  options.assets ??= [];
  options.plugins ??= [];
  options.includeSrc ??= false;
  options.minify ??= false;
  options.clean ??= true;
  options.watch ??= false;
  options.verbose =
    options.verbose || getLogLevel(config?.logLevel) >= LogLevel.DEBUG;
  options.plugins = [];
  options.exports ??= "named";
  options.sourcemap ??= true;
  options.extractCss ??= true;
  options.treeshake ??= true;

  return options as RolldownOptions;
};

export const applyDefaultUnbuildOptions = (
  options: Partial<UnbuildBuildOptions>,
  config?: StormConfig
): UnbuildBuildOptions => {
  options.entry ??= "{sourceRoot}/index.ts";
  options.outputPath ??= "dist/{projectRoot}";
  options.tsConfig ??= "{projectRoot}/tsconfig.json";
  options.external ??= [];
  options.additionalEntryPoints ??= [];
  options.assets ??= [];
  options.includeSrc ??= false;
  options.minify ??= false;
  options.clean ??= true;
  options.watch ??= false;
  options.verbose =
    options.verbose || getLogLevel(config?.logLevel) >= LogLevel.DEBUG;
  options.sourcemap ??= true;
  options.declaration ??= "compatible";
  options.banner = getFileBanner(options.projectName ?? "Storm Software");
  options.tsLibs ??= [];
  options.generatePackageJson ??= true;

  return options as UnbuildBuildOptions;
};
