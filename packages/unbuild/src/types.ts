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

import { AssetGlob } from "@storm-software/build-tools";
import { StormConfig } from "@storm-software/config";
import { WorkspaceTypeAndRoot } from "nx/src/utils/find-workspace-root";
import type { BuildConfig, BuildOptions, RollupBuildOptions } from "unbuild";

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export type UnbuildOptions = Omit<
  BuildOptions,
  "entries" | "rootDir" | "externals" | "rollupConfig"
> & {
  name?: string;

  /**
   * Path to the project root relative to the workspace root
   */
  projectRoot: string;

  /**
   * Path to the source root relative to the workspace root
   */
  sourceRoot?: string;

  /**
   * Path to the `tsconfig.json` file relative to the project root
   */
  tsConfigPath?: string;

  /**
   * Path to a rollup configuration file relative to the project root
   */
  rollup?: string | DeepPartial<RollupBuildOptions>;

  /**
   * Path to a unbuild configuration file relative to the project root
   */
  configPath?: string;

  includeSrc?: boolean;
  generatePackageJson?: boolean;
  assets?: (AssetGlob | string)[];
  externals?: string[];
  banner?: string;
  footer?: string;
  minify?: boolean;
};

export type UnbuildResolvedOptions = UnbuildOptions &
  BuildConfig &
  Required<Pick<UnbuildOptions, "name" | "outDir">> & {
    config: StormConfig;

    /**
     * Path to the workspace
     */
    workspaceRoot: WorkspaceTypeAndRoot;

    /**
     * Path to the project root relative to the workspace root
     */
    projectRoot: string;

    /**
     * Path to the source root relative to the workspace root
     */
    sourceRoot: string;

    /**
     * Path to the `tsconfig.json` file relative to the project root
     */
    tsConfigPath: string;

    /**
     * Path to a rollup configuration file relative to the project root
     */
    rollup: DeepPartial<RollupBuildOptions>;

    projectName: string;
    externals: string[];
    entries: BuildOptions["entries"];
    declaration: BuildOptions["declaration"];
  };
