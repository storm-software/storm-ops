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
  TypeScriptBuildOptions
} from "@storm-software/build-tools";
import type { StormWorkspaceConfig } from "@storm-software/config/types";
import type { UserConfig } from "tsdown";

type ExternalTSDownOptions = Omit<
  UserConfig,
  "treeshake" | "outDir" | "external"
>;

export type TSDownOptions = ExternalTSDownOptions &
  Partial<
    Pick<
      TypeScriptBuildOptions,
      | "name"
      | "mode"
      | "outputPath"
      | "assets"
      | "format"
      | "treeShaking"
      | "sourceRoot"
      | "debug"
      | "generatePackageJson"
    >
  > &
  Required<Pick<TypeScriptBuildOptions, "projectRoot">> & {
    external?: string | RegExp | Array<string | RegExp>;
    noExternal?: string | RegExp | Array<string | RegExp>;
    distDir?: string;
  };

export type TSDownResolvedOptions = UserConfig &
  Required<Pick<UserConfig, "entry" | "outDir" | "format">> &
  Required<
    Pick<
      TSDownOptions,
      | "name"
      | "mode"
      | "projectRoot"
      | "sourceRoot"
      | "assets"
      | "generatePackageJson"
    >
  > & {
    workspaceConfig: StormWorkspaceConfig;
    projectName: string;
    projectGraph?: ProjectGraph;
    projectConfigurations?: ProjectsConfigurations;
  };

export type MaybePromise<T> = T | Promise<T>;

export type TSDownCLIOptions = AdditionalCLIOptions & TSDownOptions;
