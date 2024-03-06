import type { StormConfig } from "@storm-software/config";
import type { TypeScriptBuildOptions } from "../../declarations";
import { defaultConfig } from "../config";
import { getLogLevel, LogLevel } from "@storm-software/config-tools";

export const applyDefaultOptions = (
  options: Partial<TypeScriptBuildOptions>,
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

  if (!options.getConfig) {
    options.getConfig = defaultConfig;
  }

  options.verbose = options.verbose || getLogLevel(config?.logLevel) >= LogLevel.DEBUG;

  return options as TypeScriptBuildOptions;
};
