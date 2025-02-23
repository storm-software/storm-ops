import type { OptionsOverrides, TypedFlatConfigItem } from "../types";
import { ensurePackages, interopDefault } from "../utils/helpers";

/**
 * Config for React Native projects.
 */
export async function reactNative(
  options: OptionsOverrides = {}
): Promise<TypedFlatConfigItem[]> {
  const { overrides = {} } = options;

  await ensurePackages(["eslint-plugin-react-native"]);

  const reactNative = await interopDefault(
    // eslint-disable-next-line @nx/enforce-module-boundaries
    import("eslint-plugin-react-native")
  );

  return [
    {
      name: "storm/react-native/rules",
      plugins: { "react-native": reactNative },
      rules: {
        ...reactNative.configs.all.rules,

        ...overrides
      }
    }
  ];
}
