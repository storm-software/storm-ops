import { GLOB_EXCLUDE } from "@storm-software/package-constants/globs";
import type { Linter } from "eslint";
import parserJsonc from "jsonc-eslint-parser";
import { plugin } from "../plugin";

const config: Linter.Config[] = [
  {
    name: "bun/recommended/setup",
    plugins: {
      bun: plugin
    }
  },
  {
    name: "bun/recommended/package-json",
    ignores: GLOB_EXCLUDE,
    files: ["package.json", "**/package.json"],
    languageOptions: {
      parser: parserJsonc
    },
    rules: {
      "bun/json-enforce-catalog": [
        "error",
        {
          autofix: true,
          allowedProtocols: ["workspace", "link", "file"],
          defaultCatalog: "default",
          reuseExistingCatalog: true,
          conflicts: "overrides",
          fields: ["dependencies", "devDependencies"],
          ignore: ["typescript"]
        }
      ],
      "bun/json-valid-catalog": "error",
      "bun/json-no-unused-catalog-item": "error",
      "bun/json-no-duplicate-catalog-item": "error"
    }
  }
];

export default config;
