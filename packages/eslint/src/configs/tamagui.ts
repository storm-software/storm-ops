import type { OptionsTamagui, TypedFlatConfigItem } from "../types";
import { ensurePackages, interopDefault } from "../utils/helpers";

/**
 * Config for `@tamagui/eslint-plugin`.
 *
 * @see https://github.com/tamagui/tamagui/tree/main/code/core/eslint-plugin
 */
export async function tamagui(
  options: OptionsTamagui = {}
): Promise<TypedFlatConfigItem[]> {
  const { config = {}, strictPayloads = false, overrides = {} } = options;

  await ensurePackages(["@tamagui/eslint-plugin"]);

  const pluginTamagui = await interopDefault(import("@tamagui/eslint-plugin"));

  return [
    {
      name: "storm/tamagui/rules",
      files: ["**/*.{ts,tsx}"],
      plugins: {
        tamagui: pluginTamagui
      },
      rules: {
        "tamagui/valid-flat-values": [
          "error",
          {
            config: config as any,
            ...(strictPayloads ? { strictPayloads: true } : {})
          }
        ],
        ...overrides
      }
    }
  ];
}
