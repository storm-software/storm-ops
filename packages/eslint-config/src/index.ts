import eslintPlugin from "@storm-software/eslint-plugin";
import { ignores } from "@storm-software/eslint/ignores";

export = [
  ...eslintPlugin.configs.recommended,
  {
    plugins: {
      "@storm-software": eslintPlugin
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        project: "./tsconfig.base.json"
      }
    },
    ignores
  }
];
