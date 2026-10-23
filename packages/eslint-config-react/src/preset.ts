import {
  createGrammarConfigView,
  type GrammarSourceConfig
} from "@tamagui/style-grammar/tooling";
import {
  preset as base,
  type PresetConfig,
  type PresetResult,
  type UserConfig
} from "@storm-software/eslint";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import type { OptionsConfig, OptionsTamagui } from "./types";

async function loadTamaguiConfig(
  configPath: string
): Promise<GrammarSourceConfig> {
  const loaded = (await import(pathToFileURL(resolve(configPath)).href)) as {
    default?: GrammarSourceConfig;
  };

  return loaded.default ?? (loaded as GrammarSourceConfig);
}

async function resolveTamagui(option: false | OptionsTamagui) {
  if (!option) return false;

  const { config, configPath, ...rest } = option;
  const source =
    config ?? (configPath ? await loadTamaguiConfig(configPath) : undefined);

  if (!source) return false;

  return {
    ...rest,
    config: createGrammarConfigView({
      tokensParsed: {},
      themes: {},
      fontsParsed: {},
      ...source
    })
  };
}

/**
 * Get the ESLint React configuration for a Storm workspace.
 *
 * @param options - The preset options.
 * @param userConfigs - Additional ESLint configurations.
 */
export async function preset(
  options: PresetConfig<OptionsConfig>,
  ...userConfigs: UserConfig[]
): Promise<PresetResult> {
  const {
    strict = false,
    mdx: enableMdx = true,
    react = true,
    "react-native": enableReactNative = false,
    storybook: enableStorybook = true,
    tamagui: enableTamagui = false,
    ...rest
  } = options;

  return base(
    {
      ...rest,
      jsx: true,
      mdx: enableMdx,
      react: typeof react === "object" ? { ...react, strict } : { strict },
      "react-native": enableReactNative,
      storybook: enableStorybook,
      tamagui: await resolveTamagui(enableTamagui)
    },
    ...userConfigs
  );
}

export const getConfig = preset;
export const defineConfig = preset;
export default preset;
