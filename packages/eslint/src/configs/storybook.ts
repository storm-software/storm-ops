import type { OptionsStorybook, TypedFlatConfigItem } from "../types";
import { ensurePackages, interopDefault } from "../utils/helpers";

export async function storybook(
  options: OptionsStorybook = {}
): Promise<TypedFlatConfigItem[]> {
  const { csf = "loose" } = options;

  await ensurePackages(["eslint-plugin-storybook"]);

  const [pluginStorybook] = await Promise.all([
    interopDefault(import("eslint-plugin-storybook"))
  ] as const);

  return [
    {
      name: "storm/storybook/setup",
      plugins: {
        storybook: pluginStorybook
      },
      ignores: ["!.storybook"]
    },
    {
      name: "storm/storybook/rules",
      files: [
        "**/*.stories.@(ts|tsx|js|jsx|mjs|cjs)",
        "**/*.story.@(ts|tsx|js|jsx|mjs|cjs)"
      ],
      rules: {
        ...(csf !== "none"
          ? csf === "strict"
            ? {
                "storybook/csf-component": "error",
                "storybook/no-title-property-in-meta": "error"
              }
            : {
                "storybook/csf-component": "warn",
                "storybook/no-title-property-in-meta": "warn"
              }
          : {}),

        // errors
        "storybook/await-interactions": "error",
        "storybook/context-in-play-function": "error",
        "storybook/default-exports": "error",
        "storybook/story-exports": "error",
        "storybook/use-storybook-expect": "error",
        "storybook/use-storybook-testing-library": "error",

        // warnings
        "storybook/hierarchy-separator": "warn",
        "storybook/no-redundant-story-name": "warn",
        "storybook/prefer-pascal-case": "warn",

        // off
        "react-hooks/rules-of-hooks": "off",
        "import/no-anonymous-default-export": "off"
      }
    },
    {
      name: "storm/storybook/main",
      files: ["**/.storybook/main.@(js|cjs|mjs|ts)"],
      rules: {
        "storybook/no-uninstalled-addons": "error"
      }
    }
  ];
}
