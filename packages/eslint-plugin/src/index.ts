import configs from "./configs";
import meta from "./meta";
import type { StormESLintPlugin } from "./types";

export = {
  meta,
  configs,
  rules: {},
  processors: {}
} satisfies StormESLintPlugin;
