import { join } from "path";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import nxEslintPlugin from "@nx/eslint-plugin";
import { findWorkspaceRoot } from "@storm-software/config-tools";
import * as eslintPlugin from "@storm-software/eslint-plugin";
import typescriptEslintParser from "@typescript-eslint/parser";

const workspaceRoot = findWorkspaceRoot();
const compat = new FlatCompat({
  baseDirectory: workspaceRoot,
  recommendedConfig: js.configs.recommended
});

module.exports = [
  ...compat.extends("plugin:@storm-software/recommended"),
  {
    plugins: {
      "@storm-software": eslintPlugin,
      "@nx": nxEslintPlugin
    }
  },
  {
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: join(workspaceRoot, "tsconfig.base.json")
      }
    }
  },
  ...compat
    .config({
      parser: "jsonc-eslint-parser",
      extends: ["plugin:@storm-software/json"]
    })
    .map(config => ({
      ...config,
      files: ["**/*.json", "**/*.jsonc"],
      rules: {
        ...config.rules
      }
    })),
  ...compat
    .config({
      parser: "jsonc-eslint-parser",
      extends: ["plugin:@storm-software/json"]
    })
    .map(config => ({
      ...config,
      files: ["**/*.json", "**/*.jsonc"],
      rules: {
        ...config.rules
      }
    })),
  ...compat.config({ extends: ["plugin:@storm-software/yml"] }).map(config => ({
    ...config,
    files: ["**/*.yaml", "**/*.yml"],
    rules: { ...config.rules }
  })),
  ...compat.config({ extends: ["plugin:@storm-software/mdx"] }).map(config => ({
    ...config,
    files: ["**/*.md", "**/*.mdx"],
    rules: { ...config.rules }
  })),
  ...compat
    .config({ extends: ["plugin:@storm-software/javascript"] })
    .map(config => ({
      ...config,
      files: ["**/*.js", "**/*.jsx"],
      rules: { ...config.rules }
    })),
  ...compat
    .config({
      extends: [
        "plugin:@nx/typescript",
        "plugin:@storm-software/react",
        "plugin:@storm-software/next"
      ]
    })
    .map(config => ({
      ...config,
      files: ["**/*.ts", "**/*.mts", "**/*.cts", "**/*.tsx"],
      rules: {
        ...config.rules,
        "@nx/enforce-module-boundaries": [
          "error",
          {
            enforceBuildableLibDependency: true,
            allow: [],
            depConstraints: [
              {
                sourceTag: "*",
                onlyDependOnLibsWithTags: ["*"]
              }
            ]
          }
        ]
      }
    })),
  ...compat
    .config({ extends: ["plugin:@storm-software/graphql"] })
    .map(config => ({
      ...config,
      files: ["**/*.gql", "**/*.graphql"],
      rules: { ...config.rules }
    })),
  ...compat
    .config({ extends: ["plugin:@storm-software/jest"], env: { jest: true } })
    .map(config => ({
      ...config,
      files: [
        "**/*.test.ts",
        "**/*.test.tsx",
        "**/*.spec.ts",
        "**/*.spec.tsx",
        "**/*.spec.js",
        "**/*.spec.jsx"
      ],
      rules: { ...config.rules }
    }))
];
