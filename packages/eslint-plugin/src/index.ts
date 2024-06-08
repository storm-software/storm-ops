import configs from "./configs";
import meta from "./meta";
import type { StormESLintPlugin } from "./types";

export const plugin: StormESLintPlugin = {
  meta,
  configs,
  rules: {},
  processors: {}
};

export * from "./types";
export default plugin;
