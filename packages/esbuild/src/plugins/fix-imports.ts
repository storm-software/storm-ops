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

import type * as esbuild from "esbuild";
import { ESBuildOptions, ESBuildResolvedOptions } from "../types";

/**
 * For dependencies that forgot to add them into their package.json.
 */
export const fixImportsPlugin = (
  options: ESBuildOptions,
  resolvedOptions: ESBuildResolvedOptions,
): esbuild.Plugin => ({
  name: "storm:fix-imports",
  setup(build) {
    build.onResolve({ filter: /^spdx-exceptions/ }, () => {
      return { path: require.resolve("spdx-exceptions") };
    });
    build.onResolve({ filter: /^spdx-license-ids/ }, () => {
      return { path: require.resolve("spdx-license-ids") };
    });
  },
});
