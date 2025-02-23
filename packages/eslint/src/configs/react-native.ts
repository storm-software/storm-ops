import { FlatCompat } from "@eslint/eslintrc";
import type { OptionsOverrides, TypedFlatConfigItem } from "../types";
import { ensurePackages, interopDefault } from "../utils/helpers";

const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname
});

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
    ...compat.config({
      name: "storm/react-native/rules",
      parserOptions: {
        ecmaFeatures: {
          "jsx": true
        }
      },
      env: {
        "react-native/react-native": true
      },
      plugins: ["react-native"],
      extends: ["plugin:react-native/all"],
      rules: {
        ...reactNative.configs.all.rules,

        ...overrides
      }
    })
  ];
}
