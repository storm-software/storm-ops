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
import type {
  AdditionalCLIOptions,
  TypeScriptBuildOptions
} from "@storm-software/build-tools";
import { StormWorkspaceConfig } from "@storm-software/config";
import type { BuildResult, TsconfigRaw } from "esbuild";
import type { Options } from "tsup";

export type ESBuildOptions = Omit<Options, "outDir" | "entryPoints"> &
  Required<Pick<TypeScriptBuildOptions, "projectRoot">> &
  Pick<
    TypeScriptBuildOptions,
    | "assets"
    | "sourceRoot"
    | "outputPath"
    | "generatePackageJson"
    | "includeSrc"
    | "mode"
  > & {
    userOptions?: any;
    distDir?: string;
    tsconfigRaw?: TsconfigRaw;
    verbose?: boolean;
  };

export type ESBuildResult = BuildResult;

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
    | "mode"
    | "banner"
    | "footer"
    | "splitting"
    | "treeshake"
    | "generatePackageJson"
    | "metafile"
    | "minify"
    | "includeSrc"
    | "dts"
    | "shims"
  >;

export type ESBuildContext = {
  options: ESBuildOptions;
  clean: boolean;
  workspaceConfig: StormWorkspaceConfig;
  projectConfigurations: ProjectsConfigurations;
  projectName: string;
  projectGraph: ProjectGraph;
  sourceRoot: string;
  outputPath: string;
  result?: BuildResult;
};

export type MaybePromise<T> = T | Promise<T>;

interface ModuleExport {
  kind: "module";
  sourceFileName: string;
  destFileName: string;
  moduleName: string;
  isTypeOnly: boolean;
}

interface NamedExport {
  kind: "named";
  sourceFileName: string;
  destFileName: string;
  alias: string;
  name: string;
  isTypeOnly: boolean;
}

export type ExportDeclaration = ModuleExport | NamedExport;
