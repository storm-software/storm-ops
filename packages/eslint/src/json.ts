import type { Linter } from "eslint";
import jsoncPlugin from "eslint-plugin-jsonc";
// import unicornPlugin from "eslint-plugin-unicorn";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import nxEslintPlugin from "@nx/eslint-plugin";
import { findWorkspaceRoot } from "@storm-software/config-tools";
import jsoncParser from "jsonc-eslint-parser";
import base from "./base";
// import { CODE_BLOCK } from "./utils/constants";
import { formatConfig } from "./utils/format-config";
import { DEFAULT_IGNORES } from "./utils/ignores";

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
  ignores: DEFAULT_IGNORES
});

const config: Linter.FlatConfig[] = [
  ...base,
  {
    files: ["**/*.json", "**/*.jsonc", ...JSONC_FILES, "**/*.json5"],
    ignores: DEFAULT_IGNORES,
    plugins: {
      "jsonc": jsoncPlugin,
      "@nx": nxEslintPlugin
      // "unicorn": unicornPlugin
    },
    languageOptions: {
      parser: jsoncParser
    }
  },
  ...compat.extends("plugin:jsonc/recommended-with-json").map(config => ({
    ...config,
    files: ["**/*.json"],
    ignores: [...DEFAULT_IGNORES, JSONC_FILES]
  })),
  ...compat.extends("plugin:jsonc/recommended-with-json").map(config => ({
    ...config,
    files: ["**/executors/**/schema.json", "**/generators/**/schema.json"],
    ignores: [...DEFAULT_IGNORES, JSONC_FILES],
    rules: {
      ...config.rules,
      "@nx/workspace/valid-schema-description": "error"
    }
  })),
  ...compat.extends("plugin:jsonc/recommended-with-jsonc").map(config => ({
    ...config,
    files: ["**/*.jsonc", ...JSONC_FILES],
    ignores: DEFAULT_IGNORES
  })),
  ...compat.extends("plugin:jsonc/recommended-with-json5").map(config => ({
    ...config,
    files: ["**/*.json5"],
    ignores: DEFAULT_IGNORES
  }))
  // ...compat.extends("plugin:jsonc/recommended-with-json5").map(config => ({
  //   ...config,
  //   files: ["**/*.json{,c,5}"],
  //   ignores: [CODE_BLOCK],
  //   rules: {
  //     ...config.rules,
  //     "unicorn/filename-case": "error"
  //   }
  // }))
];

export default formatConfig("JSON", config);
