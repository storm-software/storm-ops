/* eslint-disable @typescript-eslint/no-explicit-any */

import { StormConfig } from "@storm-software/config";

export type Entry = string | Record<string, string> | string[];
export type Platform = "browser" | "node" | "neutral";

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
  entry: Entry;
  assets?: (AssetGlob | string)[];
  tsconfig?: string;
  format: string | string[];
  bundle?: boolean;
  external?: string[];
  outputPath: string;
  platform?: "node" | "browser" | "neutral";
  sourcemap?: boolean | "linked" | "inline" | "external" | "both";
  target?: string;
  watch?: boolean;
  clean?: boolean;
  debug?: boolean;
  banner?: string;
  footer?: string;
  define?: Record<string, string | undefined | null>;
  env?: Record<string, string | undefined | null>;
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

export type TypeScriptBuildResolvedOptions = Omit<
  TypeScriptBuildOptions,
  "entry" | "outputPath"
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
      | "splitting"
      | "treeShaking"
      | "generatePackageJson"
      | "emitOnAll"
      | "format"
      | "metafile"
      | "minify"
      | "includeSrc"
      | "verbose"
    >
  > & {
    config: StormConfig;
    entryPoints: string[];
  };

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;
