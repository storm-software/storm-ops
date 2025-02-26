import config from "eslint-config-prettier";
import { pluginPrettier } from "../plugins";
import type { TypedFlatConfigItem } from "../types";

/**
 * Config for Prettier eslint integration
 */
export async function prettier(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      ...config,
      name: "storm/prettier/rules",
      plugins: {
        ...config.plugins,
        prettier: pluginPrettier
      },
      rules: {
        ...config.rules,
        "prettier/prettier": "error",
        "arrow-body-style": "off",
        "prefer-arrow-callback": "off"
      }
    }
  ];
}
