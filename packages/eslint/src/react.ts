import type { Linter } from "eslint";
import importPlugin from "eslint-plugin-import";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import { FlatCompat } from "@eslint/eslintrc";
import reactTypescriptConfigs from "@nx/eslint-plugin/src/configs/react-typescript.js";
import { findWorkspaceRoot } from "@storm-software/config-tools";
import nx from "./nx";
import jsxA11yRules from "./rules/jsx-a11y";
import reactRules from "./rules/react";
import { CODE_FILE } from "./utils/constants";
import { formatConfig } from "./utils/format-config";
import { ignores } from "./utils/ignores";

const workspaceRoot = findWorkspaceRoot();
const compat = new FlatCompat({
  baseDirectory: workspaceRoot,
  recommendedConfig: reactTypescriptConfigs,
  ignores
});

const config: Linter.FlatConfig[] = [
  ...nx,
  ...jsxA11yPlugin.configs.recommended,
  ...reactPlugin.configs.recommended,
  ...reactHooksPlugin.configs.recommended,
  importPlugin.configs.react,
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
  },
  ...compat.plugins("@nx").map(config => ({
    ...config,
    files: [
      "**/*.ts",
      "**/*.mts",
      "**/*.cts",
      "**/*.tsx",
      "**/*.cjs",
      "**/*.js",
      "**/*.jsx"
    ],
    ignores
  }))
];

export default formatConfig("React", config);
