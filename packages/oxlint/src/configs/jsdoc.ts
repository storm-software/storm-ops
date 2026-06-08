import type { TypedConfigItem } from "../types";

export function jsdoc(): TypedConfigItem {
  return {
    plugins: ["jsdoc"],
    rules: {
      "jsdoc/check-alignment": "warn",
      "jsdoc/check-property-names": "warn",
      "jsdoc/require-param": "warn",
      "jsdoc/require-returns": "warn"
    }
  };
}
