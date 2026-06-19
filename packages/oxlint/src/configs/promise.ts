import type { TypedConfigItem } from "../types";

export function promise(): TypedConfigItem {
  return {
    plugins: ["promise"]
  };
}
