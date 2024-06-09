import type { Linter } from "eslint";
import importPlugin from "eslint-plugin-import";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import base from "./base";
import { CODE_FILE } from "./constants";
import { ignores } from "./ignores";
import jsxA11yRules from "./rules/jsx-a11y";
import reactRules from "./rules/react";

const config: Linter.FlatConfig[] = [
  ...base,
  ...importPlugin.configs.react,
  ...jsxA11yPlugin.configs.recommended,
  ...reactPlugin.configs.recommended,
  ...reactHooksPlugin.configs.recommended,
  {
    files: [CODE_FILE],
    ignores,
    plugins: {
      "jsx-a11y": jsxA11yPlugin,
      "react": reactPlugin,
      "react-hooks": reactHooksPlugin
    },
    settings: {
      react: {
        version: "detect"
      }
    },
    rules: {
      ...jsxA11yRules,
      ...reactRules
    }
  }
];

export = config;
