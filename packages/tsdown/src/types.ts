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

import { ProjectGraph, ProjectsConfigurations } from "@nx/devkit";
import {
  AdditionalCLIOptions,
  TypeScriptBuildOptions,
  TypeScriptBuildResolvedOptions,
} from "@storm-software/build-tools";
import type { Options } from "tsdown";

type ExternalTSDownOptions = Omit<Options, "config" | "outDir" | "entryPoints">;

export type TSDownOptions = Omit<
  Omit<ExternalTSDownOptions, "dts" | "bundleDts">,
  "outbase" | "outfile" | "outExtension" | "banner"
> &
  Omit<TypeScriptBuildOptions, "format"> & {
    emitTypes?: boolean;
    injectShims?: boolean;
  };

export type TSDownResolvedOptions = Omit<
  TypeScriptBuildResolvedOptions,
  "target" | "format" | "sourcemap" | "env"
> &
  ExternalTSDownOptions & {
    injectShims: boolean;
    outdir: string;
    projectGraph: ProjectGraph;
    projectConfigurations: ProjectsConfigurations;
    entryPoints: string[];
  };

export type TSDownCLIOptions = AdditionalCLIOptions &
  Pick<
    TSDownOptions,
    | "name"
    | "entry"
    | "outputPath"
    | "platform"
    | "format"
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
    | "emitOnAll"
    | "metafile"
    | "minify"
    | "includeSrc"
    | "verbose"
    | "emitTypes"
    | "injectShims"
  >;

export type MaybePromise<T> = T | Promise<T>;
