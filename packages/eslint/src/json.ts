import type { Linter } from "eslint";
import jsoncPlugin from "eslint-plugin-jsonc";
import unicornPlugin from "eslint-plugin-unicorn";
import jsoncParser from "jsonc-eslint-parser";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import nxEslintPlugin from "@nx/eslint-plugin";
import { findWorkspaceRoot } from "@storm-software/config-tools";
import base from "./base";
import { CODE_BLOCK } from "./constants";
import { ignores } from "./ignores";

const JSONC_FILES = [
  "**/tsconfig.json",
  "**/tsconfig.base.json",
  "**/nx.json",
  "**/.vscode/launch.json"
];

const workspaceRoot = findWorkspaceRoot();
const compat = new FlatCompat({
  baseDirectory: workspaceRoot,
  recommendedConfig: js.configs.recommended,
  ignores
});

const config: Linter.FlatConfig[] = [
  ...base,
  {
    files: ["**/*.json", "**/*.jsonc", ...JSONC_FILES, "**/*.json5"],
    ignores,
    plugins: {
      "jsonc": jsoncPlugin,
      "@nx": nxEslintPlugin,
      "unicorn": unicornPlugin
    },
    languageOptions: {
      parser: jsoncParser
    }
  },
  ...compat
    .config({
      extends: ["plugin:jsonc/recommended-with-json"]
    })
    .map(config => ({
      ...config,
      files: ["**/*.json"],
      ignores: [...ignores, JSONC_FILES]
    })),
  ...compat
    .config({
      extends: ["plugin:jsonc/recommended-with-json"]
    })
    .map(config => ({
      ...config,
      files: ["**/executors/**/schema.json", "**/generators/**/schema.json"],
      ignores: [...ignores, JSONC_FILES],
      rules: {
        ...config.rules,
        "@nx/workspace/valid-schema-description": "error"
      }
    })),
  ...compat
    .config({
      extends: ["plugin:jsonc/recommended-with-jsonc"]
    })
    .map(config => ({
      ...config,
      files: ["**/*.jsonc", ...JSONC_FILES],
      ignores
    })),
  ...compat
    .config({
      extends: ["plugin:jsonc/recommended-with-json5"]
    })
    .map(config => ({
      ...config,
      files: ["**/*.json5"],
      ignores
    })),
  ...compat
    .config({
      extends: ["plugin:jsonc/recommended-with-json5"]
    })
    .map(config => ({
      ...config,
      files: ["**/*.json{,c,5}"],
      ignores: [CODE_BLOCK],
      rules: {
        ...config.rules,
        "unicorn/filename-case": "error"
      }
    }))
];

export = config;
