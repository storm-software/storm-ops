import type { Linter } from "eslint";
import nextPlugin from "@next/eslint-plugin-next";
import react from "./react";
import { CODE_FILE } from "./utils/constants";
import { formatConfig } from "./utils/format-config";
import { ignores } from "./utils/ignores";

const babelOptions = {
  presets: (() => {
    try {
      require.resolve("next/babel");
      return ["next/babel"];
    } catch (_e) {
      return [];
    }
  })()
};

const config: Linter.FlatConfig[] = [
  ...react,
  ...nextPlugin.configs.recommended,
  {
    files: [CODE_FILE],
    ignores,
    plugins: {
      "@next/next": nextPlugin
    },
    languageOptions: {
      parserOptions: { babelOptions }
    }
  },
  {
    files: [
      "**/pages/**", // Next.js pages directory use default export
      "**/next.config.{js,mjs}",
      "**/*.stories.tsx",
      "**/.storybook/main.ts"
    ],
    ignores,
    languageOptions: {
      parserOptions: { babelOptions }
    },
    rules: {
      "import/no-default-export": "off"
    }
  }
];

export default formatConfig("NextJS", config);
