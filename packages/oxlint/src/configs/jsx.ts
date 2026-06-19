import type { TypedConfigItem } from "../types";

export function jsx(): TypedConfigItem {
  return {
    plugins: ["jsx-a11y"],
    rules: {
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/anchor-has-content": "warn"
    }
  };
}
