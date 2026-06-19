import type { TypedConfigItem } from "../types";

export function imports(): TypedConfigItem {
  return {
    plugins: ["import"],
    rules: {
      "import/no-duplicates": "error",
      "import/no-cycle": "warn",
      "import/no-self-import": "error"
    }
  };
}
