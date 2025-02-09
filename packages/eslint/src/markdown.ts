import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import { findWorkspaceRoot } from "@storm-software/config-tools";
import type { Linter } from "eslint";
import mdxParser from "eslint-mdx/lib/parser";
import markdownPlugin from "eslint-plugin-markdown";
import markdownLintParser from "eslint-plugin-markdownlint/parser";
import mdxPlugin from "eslint-plugin-mdx";
import base from "./base";
import { CODE_BLOCK } from "./utils/constants";
import { formatConfig } from "./utils/format-config";
import { DEFAULT_IGNORES } from "./utils/ignores";

const workspaceRoot = findWorkspaceRoot();
const compat = new FlatCompat({
  baseDirectory: workspaceRoot,
  recommendedConfig: js.configs.recommended,
  ignores: DEFAULT_IGNORES,
});

const config: Linter.FlatConfig[] = [
  ...base,
  mdxPlugin.configs.recommended,
  {
    files: ["**/.md", "**/.mdx", "**/.markdown"],
    ignores: DEFAULT_IGNORES,
    plugins: {
      mdx: mdxPlugin,
      markdownlint: markdownPlugin,
    },
    languageOptions: {
      parser: mdxParser.parser,
    },
  },
  ...compat
    .config({
      extends: ["plugin:mdx/recommended", "plugin:markdownlint/recommended"],
    })
    .map((config: Linter.FlatConfig) => ({
      ...config,
      files: ["**/.md", "**/.mdx", "**/.markdown"],
      ignores: DEFAULT_IGNORES,
      processor: "mdx/remark",
      languageOptions: {
        parser: mdxParser.parser,
        parserOptions: {
          ecmaVersion: 13,
        },
      },
      settings: {
        "mdx/code-blocks": true,
      },
      rules: {
        ...config.rules,
        "react/self-closing-comp": "off", // TODO: false positive https://github.com/mdx-js/eslint-mdx/issues/437
        "mdx/remark": "error",
        "import/no-default-export": "off",
        "@typescript-eslint/prefer-optional-chain": "off", // throws "parserOptions.project" error
        "react/jsx-filename-extension": "off", // fixes JSX not allowed in files with extension '.mdx'
        "@typescript-eslint/require-await": "off",
        "@typescript-eslint/return-await": "off",
      },
    })),
  ...compat
    .config({
      extends: ["plugin:markdownlint/recommended"],
    })
    .map((config) => ({
      ...config,
      files: ["**/*.md", "**/*.markdown"],
      ignores: DEFAULT_IGNORES,
      languageOptions: {
        parser: markdownLintParser,
      },
      rules: {
        ...config.rules,
        "markdownlint/md001": "off",
        "markdownlint/md003": "warn",
        "markdownlint/md025": [
          "error",
          {
            level: 2,
          },
        ],
      },
    })),
  ...compat
    .config({
      extends: ["plugin:markdownlint/recommended"],
    })
    .map((config) => ({
      ...config,
      files: [
        CODE_BLOCK,
        ".changeset/*.md",
        "CHANGELOG.md",
        ".github/**/PULL_REQUEST_TEMPLATE.md",
        ".github/ISSUE_TEMPLATE/bug_report.md",
        "SECURITY.md",
        "CODE_OF_CONDUCT.md",
        "README.md",
      ],
      ignores: DEFAULT_IGNORES,
      languageOptions: {
        parser: markdownLintParser,
      },
      rules: {
        ...config.rules,
        "storm-software/filename-case": "off",
        "no-console": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "no-undef": "off",
        "import/extensions": "off",
      },
    })),
];

export default formatConfig("Markdown", config);
