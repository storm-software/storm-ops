import config from "eslint-config-prettier/flat";
import type { TypedFlatConfigItem } from "../types";

/**
 * Config for Prettier eslint integration
 */
export async function prettier(): Promise<TypedFlatConfigItem[]> {
  return [
    config,
    {
      name: "storm/prettier/rules",
      rules: {
        "prettier/prettier": "error",
        "arrow-body-style": "off",
        "prefer-arrow-callback": "off"
      }
    }
  ];
}
