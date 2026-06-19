import type { TypedConfigItem } from "../types";

export function javascript(): TypedConfigItem {
  return {
    categories: {
      correctness: "error",
      suspicious: "warn",
      perf: "warn"
    },
    env: {
      builtin: true,
      es2026: true
    },
    plugins: ["eslint", "oxc"],
    rules: {
      eqeqeq: "error",
      "no-console": "warn",
      "no-debugger": "error",
      "no-alert": "warn",
      "no-constant-binary-expression": "error",
      "no-unused-vars": "error"
    }
  };
}
