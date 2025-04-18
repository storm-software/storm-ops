import { DEFAULT_COMPILED_BANNER } from "@storm-software/build-tools/utilities/get-out-extension";
import { esmSplitCodeToCjsPlugin } from "./plugins/esm-split-code-to-cjs";
import { fixImportsPlugin } from "./plugins/fix-imports";
import { nativeNodeModulesPlugin } from "./plugins/native-node-module";
import { nodeProtocolPlugin } from "./plugins/node-protocol";
import { onErrorPlugin } from "./plugins/on-error";
import { resolvePathsPlugin } from "./plugins/resolve-paths";
import { tscPlugin } from "./plugins/tsc";
import { ESBuildOptions, ESBuildResolvedOptions } from "./types";

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

export const DEFAULT_BUILD_OPTIONS: Required<
  Pick<
    ESBuildOptions,
    | "format"
    | "platform"
    | "target"
    | "external"
    | "tsconfig"
    | "mode"
    | "keepNames"
    | "metafile"
    | "injectShims"
    | "color"
    | "watch"
    | "bundle"
    | "clean"
    | "debug"
    | "resolveExtensions"
    | "loader"
    | "banner"
    | "logLevel"
  >
> = {
  platform: "node",
  target: "node22",
  format: "esm",
  external: [],
  logLevel: "error",
  tsconfig: "tsconfig.json",
  mode: "production",
  keepNames: true,
  metafile: true,
  injectShims: true,
  color: true,
  watch: false,
  bundle: true,
  clean: true,
  debug: false,
  resolveExtensions: [
    ".tsx",
    ".ts",
    ".cts",
    ".mts",
    ".jsx",
    ".js",
    ".cjs",
    ".mjs",
    ".css",
    ".json"
  ],
  loader: {
    ".aac": "file",
    ".css": "file",
    ".eot": "file",
    ".flac": "file",
    ".gif": "file",
    ".jpeg": "file",
    ".jpg": "file",
    ".mp3": "file",
    ".mp4": "file",
    ".ogg": "file",
    ".otf": "file",
    ".png": "file",
    ".svg": "file",
    ".ttf": "file",
    ".wav": "file",
    ".webm": "file",
    ".webp": "file",
    ".woff": "file",
    ".woff2": "file"
  },
  banner: DEFAULT_COMPILED_BANNER
};
