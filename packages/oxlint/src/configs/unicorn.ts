import type { TypedConfigItem } from "../types";

export function unicorn(): TypedConfigItem {
  return {
    plugins: ["unicorn"],
    rules: {
      "unicorn/no-array-for-each": "warn",
      "unicorn/prefer-array-flat-map": "warn"
    }
  };
}
