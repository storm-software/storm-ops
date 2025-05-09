import { DEFAULT_COMPILED_BANNER } from "@storm-software/build-tools";
import { ESBuildOptions } from "./types";

export const DEFAULT_BUILD_OPTIONS: Required<
  Pick<
    ESBuildOptions,
    | "assets"
    | "format"
    | "platform"
    | "target"
    | "tsconfig"
    | "mode"
    | "includeSrc"
    | "generatePackageJson"
    | "keepNames"
    | "metafile"
    | "treeshake"
    | "splitting"
    | "shims"
    | "watch"
    | "bundle"
    | "loader"
    | "banner"
    | "distDir"
  >
> = {
  assets: [],
  platform: "node",
  target: "node22",
  format: "esm",
  tsconfig: "tsconfig.json",
  mode: "production",
  generatePackageJson: true,
  includeSrc: false,
  keepNames: true,
  metafile: false,
  treeshake: true,
  splitting: true,
  shims: false,
  watch: false,
  bundle: true,
  distDir: "dist",
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
  banner: {
    js: DEFAULT_COMPILED_BANNER,
    css: DEFAULT_COMPILED_BANNER
  }
};
