import type { Linter } from "eslint";
import ymlPlugin from "eslint-plugin-yml";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import { findWorkspaceRoot } from "@storm-software/config-tools";
import * as base from "./base";
import { CODE_BLOCK } from "./constants";
import { ignores } from "./ignores";

const workspaceRoot = findWorkspaceRoot();
const compat = new FlatCompat({
  baseDirectory: workspaceRoot,
  recommendedConfig: js.configs.recommended,
  ignores
});

const config: Linter.FlatConfig[] = [
  ...base,
  {
    plugins: {
      "yml": ymlPlugin
    }
  },
  ...compat
    .config({
      extends: ["plugin:yml/standard", "plugin:yml/prettier"]
    })
    .map(config => ({
      ...config,
      files: ["**/*.y{,a}ml"],
      ignores: [
        ...ignores,
        CODE_BLOCK,
        "**/pnpm-lock.yaml",
        ".github/FUNDING.yml"
      ],
      rules: {
        ...config.rules,
        "unicorn/filename-case": "error"
      }
    }))
];

export = config;
