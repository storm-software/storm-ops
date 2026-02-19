import defu from "defu";
import config from "eslint-plugin-prettier/recommended";
import { pluginPrettier } from "../plugins";
import type { TypedFlatConfigItem } from "../types";

/**
 * Config for Prettier eslint integration
 */
export async function prettier(): Promise<TypedFlatConfigItem[]> {
  return [
    defu(
      {
        name: "storm/prettier",
        plugins: {
          prettier: pluginPrettier
        },
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
