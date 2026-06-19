import type { TypedConfigItem } from "../types";

export function node(): TypedConfigItem {
  return {
    env: {
      node: true
    },
    plugins: ["node"]
  };
}
