import {
  DEFAULT_CSS_BANNER,
  DEFAULT_JS_BANNER
} from "@storm-software/build-tools/config";
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
    | "cjsInterop"
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
  cjsInterop: true,
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
    js: DEFAULT_JS_BANNER,
    css: DEFAULT_CSS_BANNER
  }
};
