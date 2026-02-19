import defu from "defu";
import config from "eslint-config-prettier/flat";
import type { TypedFlatConfigItem } from "../types";

/**
 * Config for Prettier eslint integration
 */
export async function prettier(): Promise<TypedFlatConfigItem[]> {
  return [
    defu(
      {
        name: "storm/prettier",
        rules: {
          "prettier/prettier": "error",
          "arrow-body-style": "off",
          "prefer-arrow-callback": "off"
        }
      },
      config
    )
  ];
}
