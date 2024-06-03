import type { Linter } from "eslint";
import reactRules from "./rules/react";
import jsxA11yRules from "./rules/ts-docs";

const config: Linter.Config = {
  root: true,
  extends: [
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:import/react",
    "prettier"
  ],
  settings: {
    react: {
      version: "detect"
    }
  },
  rules: {
    ...jsxA11yRules,
    ...reactRules
  }
};

export default config;
