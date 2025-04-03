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

import type { ProjectGraph, ProjectsConfigurations } from "@nx/devkit";
import type {
  AdditionalCLIOptions,
  TypeScriptBuildOptions,
  TypeScriptBuildResolvedOptions
} from "@storm-software/build-tools";
import type { BuildOptions, BuildResult, Format, Metafile } from "esbuild";
import type { SourceMap } from "rollup";
import type { RawSourceMap } from "source-map";
import type { RendererEngine } from "./base/renderer-engine";

export type ESBuildOptions = Omit<
  BuildOptions,
  "outbase" | "outfile" | "outExtension" | "banner" | "entryPoints"
> &
  Omit<TypeScriptBuildOptions, "format" | "emitOnAll"> & {
    emitTypes?: boolean;
    injectShims?: boolean;
    renderers?: Renderer[];
    distDir?: string;
  };

export type ESBuildResult = BuildResult;

export type ESBuildResolvedOptions = Omit<
  TypeScriptBuildResolvedOptions,
  | "banner"
  | "footer"
  | "target"
  | "format"
  | "sourcemap"
  | "outExtension"
  | "emitOnAll"
> &
  Pick<
    BuildOptions,
    | "loader"
    | "inject"
    | "metafile"
    | "keepNames"
    | "target"
    | "color"
    | "banner"
    | "footer"
    | "sourcemap"
  > & {
    injectShims: boolean;
    outdir: string;
    projectGraph: ProjectGraph;
    projectConfigurations: ProjectsConfigurations;
    entryPoints: string[];
    renderers?: Renderer[];
    format: Format;
    distDir: string;
  };

export type ESBuildCLIOptions = AdditionalCLIOptions &
  Pick<
    ESBuildOptions,
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
    | "metafile"
    | "minify"
    | "includeSrc"
    | "verbose"
    | "emitTypes"
    | "injectShims"
  >;

export type ESBuildContext = {
  options: ESBuildResolvedOptions;
  rendererEngine: RendererEngine;
  result?: BuildResult;
};

export type MaybePromise<T> = T | Promise<T>;

export type ChunkInfo = {
  type: "chunk";
  code: string;
  map?: string | RawSourceMap | null;
  path: string;
  /**
   * Sets the file mode
   */
  mode?: number;
  entryPoint?: string;
  exports?: string[];
  imports?: Metafile["outputs"][string]["imports"];
};

export type AssetInfo = {
  type: "asset";
  path: string;
  contents: Uint8Array;
};

export type RenderChunk = (
  options: ESBuildResolvedOptions,
  code: string,
  chunkInfo: ChunkInfo
) => MaybePromise<
  | {
      code: string;
      map?: object | string | SourceMap | null;
    }
  | undefined
  | null
  | void
>;

export type BuildStart = (
  options: ESBuildResolvedOptions
) => MaybePromise<void>;
export type BuildEnd = (
  options: ESBuildResolvedOptions,
  ctx: { writtenFiles: WrittenFile[] }
) => MaybePromise<void>;

export type ModifyEsbuildOptions = (options: ESBuildResolvedOptions) => void;

/**
 * A renderer that can be used to determine how chunks are written to the output directory and to modify the esbuild process
 *
 * @remarks
 * It is essentially an extended form of the esbuild's built in plugins
 */
export type Renderer = {
  name: string;

  esbuildOptions?: ModifyEsbuildOptions;

  buildStart?: BuildStart;

  renderChunk?: RenderChunk;

  buildEnd?: BuildEnd;
};

export type WrittenFile = { readonly name: string; readonly size: number };
