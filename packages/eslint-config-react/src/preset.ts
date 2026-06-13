import {
  PresetConfig,
  PresetResult,
  UserConfig,
  preset as base
} from "@storm-software/eslint";
import type { OptionsConfig } from "./types";

/**
 * Get the ESLint React configuration for a Storm workspace.
 *
 * @param options - The preset options.
 * @param userConfigs - Additional ESLint configurations.
 */
export function preset(
  options: PresetConfig<OptionsConfig>,
  ...userConfigs: UserConfig[]
): PresetResult {
  const {
    mdx: enableMdx = true,
    react = true,
    "react-native": enableReactNative = true,
    storybook: enableStorybook = true,
    ...rest
  } = options;

  return base(
    {
      ...rest,
      jsx: true,
      mdx: enableMdx,
      react: typeof react === "object" ? react : true,
      "react-native": enableReactNative,
      storybook: enableStorybook
    },
    ...userConfigs
  );
}

export const getConfig = preset;
export const defineConfig = preset;
export default preset;
