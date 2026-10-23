import type { GrammarSourceConfig } from "@tamagui/style-grammar/tooling";
import type {
  OptionsConfig as BaseOptionsConfig,
  OptionsTamagui as BaseOptionsTamagui,
  OptionsOverrides,
  OptionsReact,
  OptionsStorybook
} from "@storm-software/eslint";

export interface OptionsTamagui extends Omit<BaseOptionsTamagui, "config"> {
  /**
   * Tamagui config passed to `createGrammarConfigView`.
   *
   * Used instead of `configPath` when both are set.
   */
  config?: GrammarSourceConfig;

  /**
   * Path to a Tamagui config module.
   *
   * The default export is passed to `createGrammarConfigView`.
   */
  configPath?: string;
}

export interface OptionsConfig extends Omit<
  BaseOptionsConfig,
  "jsx" | "react" | "react-native" | "mdx" | "storybook"
> {
  /**
   * Use a strict mode for React rules, which will enable more strict rules that may cause more false positives but can catch more potential issues.
   *
   * @defaultValue false
   */
  strict?: OptionsReact["strict"];

  /**
   * Enable linting for mdx files.
   *
   * @defaultValue true
   */
  mdx?: false | OptionsOverrides;

  /**
   * Enable Storybook support.
   *
   * @defaultValue true
   */
  storybook?: false | OptionsStorybook;

  /**
   * Override React rules.
   */
  react?: Omit<OptionsReact, "strict">;

  /**
   * Enable react native rules.
   *
   * @defaultValue true
   */
  "react-native"?: false | OptionsOverrides;

  /**
   * Enable Astro rules.
   *
   * @defaultValue false
   */
  astro?: true | OptionsOverrides;

  /**
   * Enable Next.js rules.
   *
   * @defaultValue false
   */
  next?: true | OptionsOverrides;

  /**
   * Enable Tamagui rules.
   *
   * @defaultValue false
   */
  tamagui?: false | OptionsTamagui;

  /**
   * Enable UnoCSS rules.
   *
   * @defaultValue false
   */
  unocss?: true | OptionsOverrides;
}
