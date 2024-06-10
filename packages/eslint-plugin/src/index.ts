import configs from "./configs";
import meta from "./meta";
import type { StormESLintPlugin } from "./types";

export default {
  meta,
  configs,
  rules: {},
  processors: {}
} satisfies StormESLintPlugin;
