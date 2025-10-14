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

import type { TypeScriptBuildOptions } from "@storm-software/build-tools";
import type { TsconfigRaw } from "esbuild";
import type { Options } from "tsup";

export type BuildOptions = Omit<Options, "outDir" | "entryPoints"> &
  Required<Pick<TypeScriptBuildOptions, "projectRoot">> &
  Pick<TypeScriptBuildOptions, "outputPath"> & {
    tsconfig?: string | null;
    tsconfigRaw?: TsconfigRaw;
    verbose?: boolean;
  };

export type ResolvedBuildOptions = Options;
