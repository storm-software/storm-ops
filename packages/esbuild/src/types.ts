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
import { AssetGlob } from "@storm-software/build-tools";
import { StormConfig } from "@storm-software/config";
import * as esbuild from "esbuild";
import { WorkspaceTypeAndRoot } from "nx/src/utils/find-workspace-root";

export type ContextForOutPathGeneration = {
  format: esbuild.Format;
  /** "type" field in project's package.json */
  pkgType?: string;
};

export type OutExtensionObject = { js?: string; dts?: string };

export type OutExtensionFactory = (
  ctx: ContextForOutPathGeneration
) => OutExtensionObject;

export type ESBuildOptions = Omit<
  esbuild.BuildOptions,
  "outbase" | "outfile" | "outExtension"
> & {
  projectRoot: string;
  name?: string;
  generatePackageJson?: boolean;
  emitTypes?: boolean;
  emitMetafile?: boolean;
  assets?: (AssetGlob | string)[];
  env?: Record<string, string>;
  define?: Record<string, string>;
  outExtension?: OutExtensionFactory;
  injectShims?: boolean;
  clean?: boolean;
};

export type ESBuildResult = esbuild.BuildResult;

export type ESBuildResolvedOptions = Omit<ESBuildOptions, "outExtension"> &
  Required<Pick<ESBuildOptions, "name" | "outdir" | "entryPoints">> & {
    config: StormConfig;
    workspaceRoot: WorkspaceTypeAndRoot;
    sourceRoot: string;
    projectName: string;
    projectGraph: ProjectGraph;
    projectConfigurations: ProjectsConfigurations;
    outExtension: OutExtensionObject;
    tsconfig: string;
  };
