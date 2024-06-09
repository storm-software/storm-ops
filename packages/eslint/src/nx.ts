import type { Linter } from "eslint";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import nxEslintPlugin from "@nx/eslint-plugin";
import { findWorkspaceRoot } from "@storm-software/config-tools";
import base from "./base";
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
    files: [
      "**/*.ts",
      "**/*.mts",
      "**/*.cts",
      "**/*.tsx",
      "**/*.cjs",
      "**/*.js",
      "**/*.jsx"
    ],
    ignores,
    plugins: {
      "@nx": nxEslintPlugin
    }
  },
  ...compat
    .config({
      extends: [
        "plugin:@nx/eslint",
        "plugin:@nx/react",
        "plugin:@nx/next",
        "plugin:@nx/typescript",
        "plugin:@nx/javascript",
        "plugin:@nx/prettier"
      ]
    })
    .map(config => ({
      ...config,
      files: [
        "**/*.ts",
        "**/*.mts",
        "**/*.cts",
        "**/*.tsx",
        "**/*.cjs",
        "**/*.js",
        "**/*.jsx"
      ],
      ignores,
      rules: {
        ...config.rules,
        "@nx/enforce-module-boundaries": [
          "error",
          {
            enforceBuildableLibDependency: true,
            "checkDynamicDependenciesExceptions": [".*"],
            allow: [],
            depConstraints: [
              {
                sourceTag: "*",
                onlyDependOnLibsWithTags: ["*"]
              }
            ]
          }
        ],
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "no-restricted-imports": ["error", "create-nx-workspace"],
        "@typescript-eslint/no-restricted-imports": [
          "error",
          {
            "patterns": [
              {
                "group": ["nx/src/plugins/js*"],
                "message":
                  "Imports from 'nx/src/plugins/js' are not allowed. Use '@nx/js' instead"
              },
              {
                "group": ["**/native-bindings", "**/native-bindings.js", ""],
                "message":
                  "Direct imports from native-bindings.js are not allowed. Import from index.js instead."
              }
            ]
          }
        ]
      }
    }))
];

export = config;
