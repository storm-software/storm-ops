import type {
  OptionsConfig as BaseOptionsConfig,
  OptionsOverrides,
  OptionsReact,
  OptionsStorybook
} from "@storm-software/eslint";

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
   * Enable UnoCSS rules.
   *
   * @defaultValue false
   */
  unocss?: true | OptionsOverrides;
}
