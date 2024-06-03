import type { Linter } from "eslint";
import { CODE_BLOCK } from "./constants";

const config: Linter.Config = {
  ignorePatterns: ["pnpm-lock.yaml"],
  overrides: [
    {
      files: "*.y{,a}ml",
      excludedFiles: [CODE_BLOCK, ".github/FUNDING.yml"],
      extends: ["plugin:yml/standard", "plugin:yml/prettier"],
      plugins: ["unicorn"],
      rules: {
        "unicorn/filename-case": "error"
      }
    }
  ]
};

export default config;
