import eslintPlugin from "eslint-plugin-storm-software";
import { ignores } from "@storm-software/eslint/utils/ignores";

export default [
  ...eslintPlugin.configs.recommended!,
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
