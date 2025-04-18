import { TSDownResolvedOptions } from "./types";

export const DEFAULT_BUILD_OPTIONS: Required<
  Pick<
    TSDownResolvedOptions,
    | "platform"
    | "target"
    | "format"
    | "tsconfig"
    | "mode"
    | "unused"
    | "globalName"
    | "injectShims"
    | "watch"
    | "bundle"
    | "treeshake"
    | "clean"
    | "debug"
  >
> = {
  platform: "node",
  target: "node22",
  format: ["esm", "cjs"],
  tsconfig: "tsconfig.json",
  mode: "production",
  globalName: "globalThis",
  unused: { level: "error" },
  injectShims: true,
  watch: false,
  bundle: true,
  treeshake: true,
  clean: true,
  debug: false,
};
