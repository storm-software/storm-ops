import defu from "defu";
import type { TypedFlatConfigItem } from "../types";
import { interopDefault } from "../utils/helpers";

/**
 * Config for Prettier eslint integration
 */
export async function prettier(
  enableRule = true
): Promise<TypedFlatConfigItem[]> {
  if (!enableRule) {
    const config = await interopDefault(import("eslint-config-prettier"));
    return [{ ...config, name: "storm/prettier/disables" }];
  }

  const [config, pluginPrettier] = await Promise.all([
    interopDefault(import("eslint-plugin-prettier/recommended")),
    interopDefault(import("eslint-plugin-prettier"))
  ]);

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
