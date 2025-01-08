import { getOutExtension } from "@storm-software/build-tools/utilities/get-out-extension";
import { Format } from "esbuild";
import { esmSplitCodeToCjsPlugin } from "./plugins/esm-split-code-to-cjs";
import { fixImportsPlugin } from "./plugins/fix-imports";
import { nativeNodeModulesPlugin } from "./plugins/native-node-module";
import { nodeProtocolPlugin } from "./plugins/node-protocol";
import { onErrorPlugin } from "./plugins/on-error";
import { resolvePathsPlugin } from "./plugins/resolve-paths";
import { tscPlugin } from "./plugins/tsc";
import { ESBuildOptions, ESBuildResolvedOptions } from "./types";

export const getOutputExtensionMap = (
  options: ESBuildOptions,
  format: Format,
  pkgType: string | undefined
) => {
  return options.outExtension
    ? options.outExtension({ format, pkgType })
    : getOutExtension(format, pkgType);
};

export const getDefaultBuildPlugins = (
  options: ESBuildOptions,
  resolvedOptions: ESBuildResolvedOptions
) => [
  nodeProtocolPlugin(options, resolvedOptions),
  resolvePathsPlugin(options, resolvedOptions),
  fixImportsPlugin(options, resolvedOptions),
  nativeNodeModulesPlugin(options, resolvedOptions),
  esmSplitCodeToCjsPlugin(options, resolvedOptions),
  tscPlugin(options, resolvedOptions),
  onErrorPlugin(options, resolvedOptions)
];

export const DEFAULT_BUILD_OPTIONS = {
  platform: "node",
  target: "ES2021",
  logLevel: "error",
  tsconfig: "tsconfig.json",
  keepNames: true,
  metafile: true,
  format: "cjs"
} as const;
