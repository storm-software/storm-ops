import type { TypedConfigItem } from "../types";

export function regexp(): TypedConfigItem {
  return {
    jsPlugins: [
      {
        name: "regexp",
        specifier: "eslint-plugin-regexp"
      }
    ],
    rules: {
      "regexp/no-dupe-disjunctions": "warn"
    }
  };
}
