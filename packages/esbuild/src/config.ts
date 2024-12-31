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

import { getOutExtension } from "@storm-software/build-tools/utilities/get-out-extension";
import { Format } from "esbuild";
import { ESBuildOptions } from "./types";

export const getOutputExtensionMap = (
  options: ESBuildOptions,
  format: Format,
  pkgType: string | undefined
) => {
  return options.outExtension
    ? options.outExtension({ format, pkgType })
    : getOutExtension(format, pkgType);
};

export const DEFAULT_BUILD_OPTIONS = {
  platform: "node",
  target: "ES2021",
  logLevel: "error",
  tsconfig: "tsconfig.json",
  keepNames: true,
  metafile: true,
  format: "cjs"
} as const;
