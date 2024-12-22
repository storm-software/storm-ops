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

import { ESBuildOptions } from "./types";

export const DEFAULT_BUILD_OPTIONS = {
  platform: "node",
  target: "ES2021",
  logLevel: "error",
  tsconfig: "tsconfig.json",
  metafile: true
} as const;

export const adapterConfig: Omit<ESBuildOptions, "projectRoot">[] = [
  {
    name: "cjs",
    format: "cjs",
    bundle: true,
    entryPoints: ["src/index.ts"],
    outExtension: { ".js": ".js" },
    emitTypes: true
  },
  {
    name: "esm",
    format: "esm",
    bundle: true,
    entryPoints: ["src/index.ts"],
    outExtension: { ".js": ".mjs" },
    emitTypes: true
  }
];
