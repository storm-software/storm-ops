import eslint from "@eslint/js";
import tsEslint from "typescript-eslint";
// @ts-ignore
import eslintPluginUnicorn from "eslint-plugin-unicorn";
// @ts-ignore
import nxPlugin from "@nx/eslint-plugin";
import type { Linter } from "eslint";
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
import banner from "./utils/banner-plugin";
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
  typescript?: RuleOptions;
  markdown?: false | { rules: RuleOptions };
  react?: false | { rules: RuleOptions };
  ignores?: string[];
  moduleBoundaries?: PresetModuleBoundary;
}

export interface TypedFlatConfig extends Omit<Linter.FlatConfig, "rules"> {
  rules?: RuleOptions;
}

export const DEFAULT_TYPESCRIPT_RULES = {
  "unicorn/number-literal-case": "off",
  "unicorn/template-indent": "off",
  "unicorn/prevent-abbreviations": "off",
  "unicorn/no-await-expression-member": "off",
  "unicorn/no-useless-undefined": "off",
  "unicorn/no-array-push-push": "off",
  "unicorn/no-array-reduce": "off",
  "unicorn/no-useless-switch-case": "off",
  "@typescript-eslint/no-explicit-any": "off",
  "@typescript-eslint/no-empty-function": "off",
  "@typescript-eslint/no-var-requires": "off",
  "@typescript-eslint/ban-ts-comment": "off",
  "@typescript-eslint/no-empty-interface": "off",
  "@typescript-eslint/explicit-module-boundary-types": "off",
  "@typescript-eslint/explicit-function-return-type": "off",
  "@typescript-eslint/no-unused-vars": [
    "warn",
    { varsIgnorePattern: "^_", argsIgnorePattern: "^_" }
  ],
  "unicorn/prefer-string-replace-all": "off",
  "unicorn/no-abusive-eslint-disable": "off",
  "unicorn/import-style": "off",
  "unicorn/prefer-module": "off",
  "unicorn/consistent-function-scoping": "off",
  "class-methods-use-this": "off",
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
          "group": ["**/native-bindings", "**/native-bindings.js"],
          "message":
            "Direct imports from native-bindings.js are not allowed. Import from index.js instead."
        },
        {
          "group": ["create-storm-workspace"],
          "message":
            "Direct imports from `create-storm-workspace` are not allowed. Instead install this package globally (example: 'npm i create-storm-workspace -g')."
        },
        {
          "group": ["create-nx-workspace"],
          "message":
            "Direct imports from `create-nx-workspace` are not allowed. Instead install this package globally (example: 'npm i create-nx-workspace -g')."
        }
      ]
    }
  ]
};

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
  const configs: Linter.FlatConfig[] = [
    // https://eslint.org/docs/latest/rules/
    eslint.configs.recommended,

    // https://typescript-eslint.io/
    ...(tsEslint.configs.stylisticTypeChecked as Linter.FlatConfig[]),

    // https://github.com/sindresorhus/eslint-plugin-unicorn
    eslintPluginUnicorn.configs["flat/recommended"] as Linter.FlatConfig,

    // Prettier
    prettierConfig,

    // React
    // https://www.npmjs.com/package/eslint-plugin-react
    options.react !== false && {
      plugins: { react, "react-hooks": reactHooks, "jsx-a11y": jsxA11y }
    },

    // Import
    // https://www.npmjs.com/package/eslint-plugin-import
    // { plugins: { import: importEslint } },
    // {
    //   files: [CODE_FILE],
    //   rules: importRules
    // },

    // Banner
    banner.configs!["recommended"]![0],

    // TSDoc
    // https://www.npmjs.com/package/eslint-plugin-tsdoc
    { plugins: { tsdoc } },
    {
      files: [TS_FILE],
      rules: tsdocRules
    },

    // NX
    {
      plugins: { "@nx": nxPlugin }
    },

    // Json
    // https://www.npmjs.com/package/eslint-plugin-json
    // json.configs["recommended-with-comments"],
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
    {
      files: ["**/package.json"],
      rules: {
        "@nx/dependency-checks": [
          "error",
          {
            buildTargets: ["build"],
            ignoredDependencies: ["typescript"],
            ignoredFiles: [],
            checkMissingDependencies: true,
            checkObsoleteDependencies: true,
            checkVersionMismatches: false,
            includeTransitiveDependencies: true,
            useLocalPathsForWorkspaceDependencies: true
          }
        ]
      }
    },

    // YML
    // https://www.npmjs.com/package/eslint-plugin-yml
    ...yml.configs["flat/recommended"],
    ...yml.configs["flat/prettier"],

    // User overrides
    ...(userConfigs as Linter.FlatConfig[])
  ].filter(Boolean) as Linter.FlatConfig[];

  // TypeScript and JavaScript
  const typescriptConfig: Linter.FlatConfig<Linter.RulesRecord> = {
    // https://typescript-eslint.io/
    ...tsEslint.configs.stylisticTypeChecked,

    // https://www.npmjs.com/package/eslint-plugin-unicorn
    ...eslintPluginUnicorn.configs["flat/recommended"],

    files: [CODE_FILE],
    languageOptions: {
      parser: tsEslint.parser as Linter.FlatConfigParserModule,
      globals: {
        ...Object.fromEntries(
          Object.keys(globals).flatMap(group =>
            Object.keys(globals[group as keyof typeof globals]).map(k => [
              k,
              true
            ])
          )
        ),
        "StormProvider": true
      }
    },
    rules: {
      // https://eslint.org/docs/latest/rules/
      ...eslint.configs.recommended.rules,

      // https://typescript-eslint.io/
      ...tsEslint.configs.stylisticTypeChecked.reduce(
        (ret, record) => ({ ...ret, ...record.rules }),
        {}
      ),

      // Prettier
      ...prettierConfig.rules,

      // https://www.npmjs.com/package/eslint-plugin-unicorn
      ...eslintPluginUnicorn.configs["flat/recommended"].reduce(
        (ret, record) => ({ ...ret, ...record.rules }),
        {}
      ),

      // Banner
      ...banner.configs!["recommended"]![1].rules,

      // NX
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

      ...DEFAULT_TYPESCRIPT_RULES,
      ...(options.typescript ?? {})
    },
    ignores: ["dist", "coverage", "tmp", ...(options.ignores || [])]
  };

  if (options.react !== false) {
    typescriptConfig.rules = {
      ...typescriptConfig.rules,

      // React
      ...reactRules,
      ...reactHooksRules,
      ...jsxA11yRules
    };

    if (options.react?.rules) {
      typescriptConfig.rules = {
        ...typescriptConfig.rules,
        ...options.react.rules
      };
    }
  }

  configs.push(typescriptConfig);

  // Markdown
  // https://www.npmjs.com/package/eslint-plugin-markdown
  if (options.markdown !== false) {
    configs.push(...markdown.configs.recommended);
    configs.push({
      files: [CODE_BLOCK],
      processor: "markdown/markdown",
      rules: (<RuleOptions>{
        "unicorn/filename-case": "off",
        "no-undef": "off",
        "no-unused-expressions": "off",
        "padded-blocks": "off",
        "no-empty-pattern": "off",
        "no-redeclare": "off",
        "no-import-assign": "off",
        ...options.markdown?.rules
      }) as any
    });
    configs.push({
      files: ["**/*.md/*.js", "**/*.md/*.ts"],
      rules: (<RuleOptions>{
        "unicorn/filename-case": "off",
        "no-undef": "off",
        "no-unused-expressions": "off",
        "padded-blocks": "off",
        "no-empty-pattern": "off",
        "no-redeclare": "off",
        "no-import-assign": "off",
        ...options.markdown?.rules
      }) as any
    });
  }

  return formatConfig("Preset", configs);
}
