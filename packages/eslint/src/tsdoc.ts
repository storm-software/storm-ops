import type { Linter } from "eslint";
import tsdocPlugin from "eslint-plugin-tsdoc";
import typescriptEslintParser from "@typescript-eslint/parser";
import rules from "./rules/ts-docs";
import { CODE_FILE } from "./utils/constants";
import { ignores } from "./utils/ignores";

const config: Linter.FlatConfig[] = [
  {
    files: [CODE_FILE],
    ignores,
    languageOptions: {
      parser: typescriptEslintParser,
      ecmaVersion: "latest",
      globals: {
        "BigInt": true
      },
      parserOptions: {
        ecmaVersion: "latest",
        project: "./tsconfig.base.json"
      }
    },
    plugins: {
      tsdoc: tsdocPlugin
    },
    rules
  }
];

export default config;
