import eslint from "@eslint/js";
import tsEslint from "typescript-eslint";
// @ts-ignore
import eslintPluginUnicorn from "eslint-plugin-unicorn";
// @ts-ignore
import nxPlugin from "@nx/eslint-plugin";
import type { Linter } from "eslint";
import json from "eslint-plugin-json";
import jsxA11y from "eslint-plugin-jsx-a11y";
import markdown from "eslint-plugin-markdown";
import prettierConfig from "eslint-plugin-prettier/recommended";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import tsdoc from "eslint-plugin-tsdoc";
import yml from "eslint-plugin-yml";
import globals from "globals";
import jsoncParser from "jsonc-eslint-parser";
import type { RuleOptions } from "./preset.d";
import jsxA11yRules from "./rules/jsx-a11y";
import reactRules from "./rules/react";
import reactHooksRules from "./rules/react-hooks";
import tsdocRules from "./rules/ts-docs";
import { CODE_BLOCK, CODE_FILE, TS_FILE } from "./utils/constants";
import { formatConfig } from "./utils/format-config";

export type PresetModuleBoundaryDepConstraints = {
  sourceTag: string;
  onlyDependOnLibsWithTags: string[];
};

export type PresetModuleBoundary = {
  enforceBuildableLibDependency: boolean;
  allow: any[];
  depConstraints: PresetModuleBoundaryDepConstraints[];
};

export interface PresetOptions {
  rules?: RuleOptions;
  markdown?: false | { rules: RuleOptions };
  react?: false | { rules: RuleOptions };
  ignores?: string[];
  moduleBoundaries?: PresetModuleBoundary;
}

export interface TypedFlatConfig extends Omit<Linter.FlatConfig, "rules"> {
  rules?: RuleOptions;
}

export default function stormPreset(
  options: PresetOptions = {
    moduleBoundaries: {
      enforceBuildableLibDependency: true,
      allow: [],
      depConstraints: [
        {
          sourceTag: "*",
          onlyDependOnLibsWithTags: ["*"]
        }
      ]
    }
  },
  ...userConfigs: TypedFlatConfig[]
): Linter.FlatConfig[] {
  const rules: RuleOptions = {
    "unicorn/number-literal-case": 0,
    "unicorn/template-indent": 0,
    "unicorn/prevent-abbreviations": 0,
    "unicorn/no-await-expression-member": 0,
    "unicorn/no-useless-undefined": 0,
    "unicorn/no-array-push-push": 0,
    "unicorn/no-array-reduce": 0,
    "unicorn/no-useless-switch-case": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/no-empty-function": 0,
    "@typescript-eslint/no-var-requires": 0,
    "@typescript-eslint/ban-ts-comment": 0,
    "@typescript-eslint/no-empty-interface": 0,
    "@typescript-eslint/explicit-module-boundary-types": 0,
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/no-unused-vars": [
      "warn",
      { varsIgnorePattern: "^_", argsIgnorePattern: "^_" }
    ],
    "unicorn/prefer-string-replace-all": 0,
    "unicorn/no-abusive-eslint-disable": 0,
    "unicorn/import-style": 0,
    "unicorn/prefer-module": 0,
    "unicorn/consistent-function-scoping": 0,
    ...options.rules
  };

  const configs: Linter.FlatConfig[] = [
    // https://eslint.org/docs/latest/rules/
    eslint.configs.recommended,
    // https://typescript-eslint.io/
    ...(tsEslint.configs.recommended as Linter.FlatConfig[]),
    // https://github.com/sindresorhus/eslint-plugin-unicorn
    eslintPluginUnicorn.configs["flat/recommended"] as Linter.FlatConfig,

    // Prettier
    prettierConfig,

    // Preset overrides
    { rules: rules as Linter.RulesRecord },
    {
      languageOptions: {
        globals: Object.fromEntries(
          Object.keys(globals).flatMap(group =>
            Object.keys(globals[group as keyof typeof globals]).map(k => [
              k,
              true
            ])
          )
        )
      }
    },
    { ignores: ["dist", "coverage", ...(options.ignores || [])] },

    // Markdown
    // https://www.npmjs.com/package/eslint-plugin-markdown
    options.markdown !== false && { plugins: { markdown } },
    options.markdown !== false && {
      files: [CODE_BLOCK],
      processor: "markdown/markdown"
    },
    options.markdown !== false && {
      files: ["**/*.md/*.js", "**/*.md/*.ts"],
      rules: (<RuleOptions>{
        "unicorn/filename-case": 0,
        "no-undef": 0,
        "no-unused-expressions": 0,
        "padded-blocks": 0,
        "@typescript-eslint/no-unused-vars": 0,
        "no-empty-pattern": 0,
        "no-redeclare": 0,
        "no-import-assign": 0,
        ...options.markdown?.rules
      }) as any
    },

    // React
    // https://www.npmjs.com/package/eslint-plugin-react
    options.react !== false && {
      plugins: { react, "react-hooks": reactHooks, "jsx-a11y": jsxA11y }
    },
    options.react !== false && {
      files: [CODE_FILE],
      rules: (<RuleOptions>{
        ...reactRules,
        ...reactHooksRules,
        ...jsxA11yRules,
        ...options.react?.rules
      }) as any
    },

    // Import
    // https://www.npmjs.com/package/eslint-plugin-import
    // { plugins: { import: importEslint } },
    // {
    //   files: [CODE_FILE],
    //   rules: importRules
    // },

    // TSDoc
    // https://www.npmjs.com/package/eslint-plugin-tsdoc
    { plugins: { tsdoc } },
    {
      files: [TS_FILE],
      rules: tsdocRules
    },

    // Nx plugin
    {
      plugins: { "@nx": nxPlugin },
      languageOptions: {
        parser: tsEslint.parser,
        globals: {
          ...globals.node
        }
      },
      files: [CODE_FILE],
      rules: {
        "@nx/enforce-module-boundaries": [
          "error",
          options.moduleBoundaries
            ? options.moduleBoundaries
            : {
                enforceBuildableLibDependency: true,
                checkDynamicDependenciesExceptions: [".*"],
                allow: [],
                depConstraints: [
                  {
                    sourceTag: "*",
                    onlyDependOnLibsWithTags: ["*"]
                  }
                ]
              }
        ],
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
    },

    // Json
    // https://www.npmjs.com/package/eslint-plugin-json
    ...json.configs["recommended"],
    {
      files: ["*.json", "*.jsonc"],
      languageOptions: {
        parser: jsoncParser
      }
    },
    {
      files: ["**/executors/**/schema.json", "**/generators/**/schema.json"],
      rules: {
        "@nx/workspace/valid-schema-description": "error"
      }
    },

    // YML
    // https://www.npmjs.com/package/eslint-plugin-yml
    ...yml.configs["flat/recommended"],
    ...yml.configs["flat/prettier"],

    // User overrides
    ...(userConfigs as Linter.FlatConfig[])
  ].filter(Boolean) as Linter.FlatConfig[];

  return formatConfig("Preset", configs);
}
