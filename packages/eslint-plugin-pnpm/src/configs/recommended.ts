import { GLOB_EXCLUDE } from "@storm-software/package-constants";
import type { Linter } from "eslint";
import parserJsonc from "jsonc-eslint-parser";
import parserYaml from "yaml-eslint-parser";
import { plugin } from "../plugin";

const config: Linter.Config[] = [
  {
    name: "storm-pnpm/recommended/setup",
    plugins: {
      "storm-pnpm": plugin
    }
  },
  {
    name: "storm-pnpm/recommended/package-json",
    ignores: GLOB_EXCLUDE,
    files: ["package.json", "**/package.json"],
    languageOptions: {
      parser: parserJsonc
    },
    rules: {
      "pnpm/json-enforce-catalog": [
        "error",
        {
          autofix: true,
          allowedProtocols: ["workspace", "link", "file"],
          defaultCatalog: "default",
          reuseExistingCatalog: true,
          conflicts: "overrides",
          fields: ["dependencies", "devDependencies"]
        }
      ],
      "pnpm/json-valid-catalog": "error",
      "pnpm/json-prefer-workspace-settings": "error"
    }
  },
  {
    name: "storm-pnpm/recommended/pnpm-workspace",
    ignores: GLOB_EXCLUDE,
    files: ["pnpm-workspace.yaml", "**/pnpm-workspace.yaml"],
    languageOptions: {
      parser: parserYaml
    },
    rules: {
      "pnpm/yaml-no-unused-catalog-item": "error",
      "pnpm/yaml-no-duplicate-catalog-item": "error"
    }
  }
];

export default config;
