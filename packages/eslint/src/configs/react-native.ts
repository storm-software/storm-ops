import plugin from "eslint-plugin-react-native";
import type { OptionsOverrides, TypedFlatConfigItem } from "../types";

/**
 * Config for React Native projects.
 */
export async function reactNative(
  options: OptionsOverrides = {}
): Promise<TypedFlatConfigItem[]> {
  const { overrides = {} } = options;

  return [
    {
      name: "storm/react-native/rules",
      plugins: { "react-native": plugin },
      rules: {
        ...plugin.configs.all.rules,

        ...overrides
      }
    }
  ];
}
