import { DEFAULT_COMPILED_BANNER } from "@storm-software/build-tools";
import { ESBuildOptions } from "./types";

export const DEFAULT_BUILD_OPTIONS: Required<
  Pick<
    ESBuildOptions,
    | "format"
    | "platform"
    | "target"
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
  platform: "node",
  target: "node22",
  format: "esm",
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
