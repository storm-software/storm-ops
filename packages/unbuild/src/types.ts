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
import type { BuildConfig, BuildOptions, RollupBuildOptions } from "unbuild";

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type UnbuildOptions = Omit<TypeScriptBuildOptions, "entry" | "format"> &
  Omit<
    BuildOptions,
    | "entries"
    | "rootDir"
    | "externals"
    | "rollupConfig"
    | "outDir"
    | "declaration"
    | "format"
    | "parallel"
  > & {
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

    emitTypes?: boolean;
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
