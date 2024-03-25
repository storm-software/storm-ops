import type { Linter } from "eslint";
import { CODE_BLOCK } from "../constants";

const JSONC_FILES = ["tsconfig.json", "tsconfig.base.json", "nx.json", ".vscode/launch.json"];
const config: Linter.Config = {
  root: true,
  overrides: [
    {
      files: "*.json",
      excludedFiles: JSONC_FILES,
      extends: "plugin:jsonc/recommended-with-json"
    },
    {
      files: ["*.jsonc", ...JSONC_FILES],
      extends: "plugin:jsonc/recommended-with-jsonc"
    },
    {
      files: "*.json5",
      extends: "plugin:jsonc/recommended-with-json5"
    },
    {
      files: "*.json{,c,5}",
      excludedFiles: CODE_BLOCK,
      plugins: ["unicorn"],
      rules: {
        "unicorn/filename-case": "error"
      }
    }
  ]
};

export default config;
