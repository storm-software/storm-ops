import eslint from "@eslint/js";
import tsEslint from "typescript-eslint";
// @ts-ignore
import eslintPluginUnicorn from "eslint-plugin-unicorn";
// @ts-ignore
import markdown from "eslint-plugin-markdown";
import type { Linter } from "eslint";
import type { RuleOptions } from "./preset.d";
import globals from "globals";
import { formatConfig } from "./utils/format-config";
import nxPlugin from "@nx/eslint-plugin";
import jsoncParser from "jsonc-eslint-parser";
import react from "eslint-plugin-react";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11yRules from "./rules/jsx-a11y";
import reactRules from "./rules/react";
import reactHooksRules from "./rules/react-hooks";
import tsdoc from "eslint-plugin-tsdoc";
import tsdocRules from "./rules/ts-docs";

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
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/no-empty-function": 0,
    "@typescript-eslint/no-var-requires": 0,
    "@typescript-eslint/ban-ts-comment": 0,
    "@typescript-eslint/no-empty-interface": 0,
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
      files: ["*.md"],
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
      files: ["*.ts", "*.tsx", "*.js", "*.jsx"],
      rules: (<RuleOptions>{
        ...reactRules,
        ...reactHooksRules,
        ...jsxA11yRules,
        ...options.react?.rules
      }) as any
    },

    // TSDoc
    // https://www.npmjs.com/package/eslint-plugin-tsdoc
    { plugins: { tsdoc } },
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        ...tsdocRules
      }
    },

    // Nx plugin
    { plugins: { "@nx": nxPlugin } },
    {
      languageOptions: {
        parser: tsEslint.parser,
        globals: {
          ...globals.node
        }
      },
      rules: {
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/explicit-function-return-type": [
          "warn",
          {
            allowExpressions: true,
            allowConciseArrowFunctionExpressionsStartingWithVoid: true,
            allowFunctionsWithoutTypeParameters: true,
            allowIIFEs: true
          }
        ]
      }
    },

    {
      files: ["*.json", "*.jsonc"],
      languageOptions: {
        parser: jsoncParser
      },
      rules: {}
    },
    {
      files: ["*.ts", "*.tsx", "*.js", "*.jsx"],
      rules: {
        "@nx/enforce-module-boundaries": [
          "error",
          options.moduleBoundaries
            ? options.moduleBoundaries
            : {
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
    },

    // User overrides
    ...(userConfigs as Linter.FlatConfig[])
  ].filter(Boolean) as Linter.FlatConfig[];

  return formatConfig("Preset", configs);
}
