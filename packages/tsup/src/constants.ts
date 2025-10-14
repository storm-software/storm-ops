import { DEFAULT_COMPILED_BANNER } from "@storm-software/build-tools";
import { ResolvedBuildOptions } from "./types";

export const DEFAULT_BUILD_OPTIONS: Required<
  Pick<
    ResolvedBuildOptions,
    | "format"
    | "dts"
    | "platform"
    | "target"
    | "keepNames"
    | "metafile"
    | "treeshake"
    | "splitting"
    | "shims"
    | "watch"
    | "clean"
    | "bundle"
    | "loader"
    | "banner"
  >
> = {
  platform: "node",
  target: "node22",
  format: "esm",
  dts: true,
  keepNames: true,
  metafile: false,
  treeshake: true,
  splitting: true,
  shims: false,
  watch: false,
  bundle: true,
  clean: true,
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
