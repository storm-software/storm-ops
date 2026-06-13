import type {
  OptionsConfig as BaseOptionsConfig,
  OptionsOverrides,
  OptionsStorybook
} from "@storm-software/eslint";

export interface OptionsConfig extends Omit<
  BaseOptionsConfig,
  "jsx" | "react" | "react-native" | "mdx" | "storybook"
> {
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
  react?: OptionsOverrides;

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
   * Enable UnoCSS rules.
   *
   * @defaultValue false
   */
  unocss?: true | OptionsOverrides;
}
