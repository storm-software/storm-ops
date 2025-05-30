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

import { joinPaths } from "@storm-software/config-tools/utilities/correct-paths";
import { findFilePath } from "@storm-software/config-tools/utilities/file-path-utils";
import type { Plugin } from "esbuild";
import path from "node:path";
import { ESBuildContext } from "../types";

type TsConfig = {
  compilerOptions?: {
    paths?: Record<string, string[]>;
  };
  extends?: string;
};

/**
 * Recursive function to resolve the paths config from a tsconfig.json, whether
 * it is in the config directly or via an inherited config (via "extends").
 * @param options
 * @param cwd
 * @returns
 */
function resolvePathsConfig(
  options: TsConfig,
  cwd: string,
  projectRoot?: string
) {
  if (options?.compilerOptions?.paths) {
    const paths = Object.entries(options.compilerOptions.paths);

    const resolvedPaths = paths.map(([key, paths]) => {
      return [key, paths.map(v => path.resolve(cwd, v))] as const;
    });

    return Object.fromEntries(resolvedPaths);
  }

  if (options.extends) {
    const extendsPath = path.resolve(
      projectRoot
        ? joinPaths(cwd, projectRoot, options.extends)
        : joinPaths(cwd, options.extends)
    );
    const extendsDir = path.dirname(extendsPath);
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const extendsConfig = require(extendsPath);

    return resolvePathsConfig(extendsConfig, extendsDir);
  }

  return [];
}

/**
 * Forces `esbuild` to always use the TS compiler paths, even when we are
 * bundling a local dependency of a local dependency, ensuring maximum
 * tree-shaking. Note: `esbuild` has some support for this, though it is limited
 * in the amount of dependency nesting it supports.
 */
export const resolvePathsPlugin = (context: ESBuildContext): Plugin => ({
  name: "storm:resolve-paths",
  setup(build) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const parentTsConfig = require(
      build.initialOptions.tsconfig
        ? joinPaths(
            context.workspaceConfig.workspaceRoot,
            build.initialOptions.tsconfig.replace(
              context.workspaceConfig.workspaceRoot,
              ""
            )
          )
        : joinPaths(context.workspaceConfig.workspaceRoot, "tsconfig.json")
    );
    const resolvedTsPaths = resolvePathsConfig(
      parentTsConfig,
      context.workspaceConfig.workspaceRoot,
      context.options.projectRoot
    );
    const packagesRegex = new RegExp(
      `^(${Object.keys(resolvedTsPaths).join("|")})$`
    );

    build.onResolve({ filter: packagesRegex }, args => {
      if (build.initialOptions.external?.includes(args.path)) {
        return { path: args.path, external: true };
      }

      let resolvedPath = resolvedTsPaths[args.path][0];
      if (resolvedPath.endsWith(".ts") || resolvedPath.endsWith(".tsx")) {
        resolvedPath = findFilePath(resolvedPath);
      }

      return { path: joinPaths(resolvedPath, "index.ts") };
    });
  }
});
