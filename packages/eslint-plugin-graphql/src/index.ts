import { createMeta } from "eslint-plugin-storm-software/utils";
import configs from "./configs";
import type { StormESLintGraphQLPlugin } from "./types";

export default {
  meta: createMeta(),
  configs,
  rules: {},
  processors: {}
} satisfies StormESLintGraphQLPlugin;

