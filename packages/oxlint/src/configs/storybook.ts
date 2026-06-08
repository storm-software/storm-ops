import type { OptionsStorybook, TypedConfigItem } from "../types";

export function storybook(options: OptionsStorybook = {}): TypedConfigItem {
  const files = options.files ?? ["**/*.stories.{js,jsx,ts,tsx,mdx}"];

  return {
    overrides: [
      {
        files,
        jsPlugins: ["eslint-plugin-storybook"],
        rules: {
          "storybook/no-redundant-story-name": "warn"
        }
      }
    ]
  };
}
