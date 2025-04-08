/*-------------------------------------------------------------------

                  ⚡ Storm Software - Storm Stack

 This code was released as part of the Storm Stack project. Storm Stack
 is maintained by Storm Software under the Apache-2.0 License, and is
 free for commercial and private use. For more information, please visit
 our licensing page.

 Website:         https://stormsoftware.com
 Repository:      https://github.com/storm-software/storm-ops
 Documentation:   https://stormsoftware.com/projects/storm-ops/docs
 Contact:         https://stormsoftware.com/contact
 License:         https://stormsoftware.com/projects/storm-ops/license

 -------------------------------------------------------------------*/

import {
  AdditionalCLIOptions,
  TypeScriptBuildOptions,
  TypeScriptBuildResolvedOptions
} from "@storm-software/build-tools";
import { CommonOptions } from "esbuild";
import { MkdistOptions } from "mkdist";
import type {
  BuildConfig,
  BuildContext,
  BuildOptions,
  MkdistBuildEntry,
  RollupBuildOptions
} from "unbuild";

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export interface LoaderInputFile {
  path: string;
  extension: string;
  srcPath?: string;
  getContents: () => Promise<string> | string;
}

export interface LoaderOutputFile {
  /**
   * relative to distDir
   */
  path: string;
  srcPath?: string;
  extension?: string;
  contents?: string;
  declaration?: boolean;
  errors?: Error[];
  raw?: boolean;
  skip?: boolean;
}

export type LoaderResult = LoaderOutputFile[] | undefined;

export type LoadFile = (
  input: LoaderInputFile
) => LoaderResult | Promise<LoaderResult>;

export interface LoaderOptions {
  ext?: "js" | "mjs" | "cjs" | "ts" | "mts" | "cts";
  format?: "cjs" | "esm";
  declaration?: boolean;
  esbuild?: CommonOptions;
  postcss?: false | Record<string, any>;
}

export interface LoaderContext {
  loadFile: LoadFile;
  options: LoaderOptions;
}

export type Loader = (
  input: LoaderInputFile,
  context: LoaderContext
) => LoaderResult | Promise<LoaderResult>;

// export type UnbuildLoaderOptions = {
//   pre?: <T extends TransformOptions>(
//     input: string | Uint8Array,
//     options?: SameShape<TransformOptions, T>
//   ) => Promise<TransformResult<T>>;

//   post?: <T extends TransformOptions>(
//     input: string | Uint8Array,
//     options?: SameShape<TransformOptions, T>
//   ) => Promise<TransformResult<T>>;

//   /**
//    * Override the loader options used in the build process
//    */
//   override?: (Loader | string)[];
// };

export type Loaders = ("js" | "vue" | "sass" | "postcss" | Loader)[];

export type UnbuildOptions = Omit<
  Partial<BuildOptions>,
  | "entries"
  | "rootDir"
  | "externals"
  | "rollupConfig"
  | "outDir"
  | "declaration"
  | "format"
  | "parallel"
> &
  Omit<TypeScriptBuildOptions, "entry" | "format"> & {
    /**
     * The directories to run the build process out of
     *
     * @defaultValue ["{sourceRoot}"]
     */
    entry?: string[];

    /**
     * Path to a rollup configuration file relative to the project root
     */
    rollup?: string | DeepPartial<RollupBuildOptions>;

    /**
     * Path to a unbuild configuration file relative to the project root
     */
    configPath?: string;

    /**
     * Should the build process emit declaration files
     *
     * @defaultValue `true`
     */
    emitTypes?: boolean;

    /**
     * Should the build process skip generating a package.json and copying assets
     *
     * @defaultValue `false`
     */
    buildOnly?: boolean;

    /**
     * Override the loader options used in the build process
     */
    loaders?:
      | Loaders
      | ((
          ctx: BuildContext,
          entry: MkdistBuildEntry,
          opts: MkdistOptions
        ) => Loaders | Promise<Loaders>);
  };

export type UnbuildResolvedOptions = Omit<
  TypeScriptBuildResolvedOptions,
  "entryPoints" | "external" | "emitTypes"
> &
  BuildConfig & {
    /**
     * Path to a rollup configuration file relative to the project root
     */
    rollup: DeepPartial<RollupBuildOptions>;

    /**
     * Should the build process skip generating a package.json and copying assets
     *
     * @defaultValue `false`
     */
    buildOnly?: boolean;

    outDir: string;
    externals: string[];
    entries: BuildOptions["entries"];
    declaration: BuildOptions["declaration"];
  };

export type UnbuildCLIOptions = AdditionalCLIOptions &
  Pick<
    UnbuildOptions,
    | "name"
    | "outputPath"
    | "platform"
    | "bundle"
    | "target"
    | "watch"
    | "clean"
    | "debug"
    | "banner"
    | "footer"
    | "splitting"
    | "treeShaking"
    | "generatePackageJson"
    | "metafile"
    | "minify"
    | "includeSrc"
    | "verbose"
    | "emitTypes"
  >;
