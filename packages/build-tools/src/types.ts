/* eslint-disable @typescript-eslint/no-explicit-any */

import { StormConfig } from "@storm-software/config";

export type Entry = string | Record<string, string> | string[];
export type Platform = "browser" | "node" | "neutral";
export type Format = "cjs" | "esm" | "iife";

export type FileInputOutput = {
  input: string;
  output: string;
};

export type AssetGlob = FileInputOutput & {
  glob: string;
  ignore?: string[];
  dot?: boolean;
};

export interface AdditionalCLIOptions {
  projectRoot: string;
  sourceRoot?: string;
  projectName?: string;
}

export interface TypeScriptBuildOptions extends AdditionalCLIOptions {
  name?: string;
  entry?: Entry;
  assets?: (AssetGlob | string)[];
  tsconfig?: string;
  format?: Format | Format[];
  bundle?: boolean;
  external?: string[];
  outputPath?: string;
  platform?: "node" | "browser" | "neutral";
  sourcemap?: boolean | "linked" | "inline" | "external" | "both";
  mode?: "development" | "staging" | "production";
  orgName?: string;
  target?: string | string[];
  watch?: boolean;
  clean?: boolean;
  debug?: boolean;
  banner?: string;
  footer?: string;
  define?: { [key: string]: string };
  env?: { [key: string]: string };
  plugins?: any[];
  splitting?: boolean;
  treeShaking?: boolean;
  generatePackageJson?: boolean;
  emitOnAll?: boolean;
  metafile?: boolean;
  minify?: boolean;
  includeSrc?: boolean;
  verbose?: boolean;
}

export type TypeScriptBuildBaseEnv = {
  STORM_BUILD: string;
  STORM_MODE: TypeScriptBuildOptions["mode"];
  STORM_ORG: TypeScriptBuildOptions["orgName"];
  STORM_NAME: string;
  STORM_PLATFORM: Platform;
  STORM_FORMAT: string;
  STORM_TARGET: string;
};

export type TypeScriptBuildEnv = TypeScriptBuildBaseEnv & {
  [key: string]: string;
};

export type TypeScriptBuildResolvedOptions = Omit<
  TypeScriptBuildOptions,
  "entry" | "outputPath" | "env"
> &
  Required<
    Pick<
      TypeScriptBuildOptions,
      | "name"
      | "sourceRoot"
      | "projectName"
      | "platform"
      | "target"
      | "tsconfig"
      | "clean"
      | "define"
      | "generatePackageJson"
      | "emitOnAll"
      | "metafile"
      | "minify"
      | "includeSrc"
      | "verbose"
    >
  > & {
    config: StormConfig;
    entryPoints: string[];
    env: TypeScriptBuildEnv;
  };

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;
