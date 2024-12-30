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

import { Format } from "esbuild";
import {
  ESBuildOptions,
  OutExtensionFactory,
  OutExtensionObject
} from "./types";

export function defaultOutExtension({
  format,
  pkgType
}: {
  format: Format;
  pkgType?: string;
}): { js: string; dts: string } {
  let jsExtension = ".js";
  let dtsExtension = ".d.ts";
  const isModule = pkgType === "module";
  if (isModule && format === "cjs") {
    jsExtension = ".cjs";
    dtsExtension = ".d.cts";
  }
  if (!isModule && format === "esm") {
    jsExtension = ".mjs";
    dtsExtension = ".d.mts";
  }
  if (format === "iife") {
    jsExtension = ".global.js";
  }
  return {
    js: jsExtension,
    dts: dtsExtension
  };
}

export const getOutputExtensionMap = (
  options: ESBuildOptions,
  format: Format,
  pkgType: string | undefined
) => {
  const outExtension: OutExtensionFactory =
    options.outExtension || defaultOutExtension;

  const defaultExtension = defaultOutExtension({ format, pkgType });
  const extension = outExtension({ format, pkgType });

  return {
    ".js": extension.js || defaultExtension.js
  } as OutExtensionObject;
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

export const adapterConfig: Omit<ESBuildOptions, "projectRoot">[] = [
  {
    name: "cjs",
    format: "cjs",
    bundle: true,
    entryPoints: ["src/index.ts"],
    emitTypes: true
  },
  {
    name: "esm",
    format: "esm",
    bundle: true,
    entryPoints: ["src/index.ts"],
    emitTypes: true
  }
];
