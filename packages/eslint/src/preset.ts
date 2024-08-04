import {
  plugins as cspellPlugins,
  rules as cspellRules
} from "@cspell/eslint-plugin/recommended";
import eslint from "@eslint/js";
import nxPlugin from "@nx/eslint-plugin";
import type { Linter } from "eslint";
import jsxA11y from "eslint-plugin-jsx-a11y";
import markdown from "eslint-plugin-markdown";
import prettierConfig from "eslint-plugin-prettier/recommended";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import tsdoc from "eslint-plugin-tsdoc";
import unicorn from "eslint-plugin-unicorn";
import yml from "eslint-plugin-yml";
import globals from "globals";
import jsoncParser from "jsonc-eslint-parser";
import tsEslint from "typescript-eslint";
import type { RuleOptions } from "./rules.d";
import jsxA11yRules from "./rules/jsx-a11y";
import reactRules from "./rules/react";
import reactHooksRules from "./rules/react-hooks";
import stormRules from "./rules/storm";
import tsdocRules from "./rules/ts-docs";
import banner from "./utils/banner-plugin";
import { CODE_BLOCK, TS_FILE } from "./utils/constants";
import { formatConfig } from "./utils/format-config";

/**
 * The module boundary dependency constraints.
 */
export type PresetModuleBoundaryDepConstraints = {
  sourceTag: string;
  onlyDependOnLibsWithTags: string[];
};

/**
 * The module boundary options.
 */
export type PresetModuleBoundary = {
  enforceBuildableLibDependency: boolean;
  allow: any[];
  depConstraints: PresetModuleBoundaryDepConstraints[];
};

/**
 * The ESLint preset options.
 */
export interface PresetOptions {
  name?: string;
  banner?: string;
  rules?: RuleOptions;
  ignores?: string[];
  tsconfig?: string;
  parserOptions?: Linter.ParserOptions;
  markdown?: false | Linter.RulesRecord;
  react?: false | Linter.RulesRecord;
}

/**
 * Get the ESLint configuration for a Storm workspace.
 *
 * @param options - The preset options.
 * @param userConfigs - Additional ESLint configurations.
 */
export function getStormConfig(
  options: PresetOptions = {
    rules: {},
    ignores: [],
    tsconfig: "./tsconfig.base.json",
    parserOptions: {},
    markdown: {},
    react: {}
  },
  ...userConfigs: Linter.FlatConfig[]
): Linter.FlatConfig[] {
  const configs: Linter.FlatConfig[] = [
    // https://eslint.org/docs/latest/rules/
    eslint.configs.recommended,

    // https://typescript-eslint.io/
    ...tsEslint.configs.stylisticTypeChecked.map(config => ({
      ...config,
      files: ["**/*.ts"] // We use TS config only for TS files
    })),

    // https://github.com/sindresorhus/eslint-plugin-unicorn
    unicorn.configs["flat/recommended"] as Linter.FlatConfig,

    // Prettier
    prettierConfig,

    // Import
    // https://www.npmjs.com/package/eslint-plugin-import
    // { plugins: { import: importEslint } },
    // {
    //   files: [CODE_FILE],
    //   rules: importRules
    // },

    // Banner
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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

    // CSpell
    {
      plugins: {
        ...cspellPlugins
      },
      rules: {
        ...cspellRules,
        "@cspell/spellchecker": [
          "warn",
          {
            // configFile: new URL(
            //   "./.vscode/cspell.json",
            //   import.meta.url
            // ).toString(),
            autoFix: true
          }
        ]
      }
    },

    // User overrides
    ...(userConfigs as Linter.FlatConfig[])
  ].filter(Boolean) as Linter.FlatConfig[];

  // TypeScript and JavaScript
  const typescriptConfig: Linter.FlatConfig<Linter.RulesRecord> = {
    // https://typescript-eslint.io/
    // ...tsEslint.configs.stylisticTypeChecked,

    // https://www.npmjs.com/package/eslint-plugin-unicorn
    // ...unicorn.configs["flat/recommended"],

    // plugins: {
    //   "@typescript-eslint": tsPlugin,
    //   "@nx": nxPlugin,
    //   unicorn,
    //   prettier,
    //   banner,
    //   tsdoc
    // },

    files: [TS_FILE],
    languageOptions: {
      globals: {
        ...Object.fromEntries(
          Object.keys(globals).flatMap(group =>
            Object.keys(globals[group as keyof typeof globals]).map(key => [
              key,
              "readonly"
            ])
          )
        ),
        ...globals.browser,
        ...globals.node,
        "window": "readonly",
        "Storm": "readonly"
      },
      ecmaVersion: "latest",
      parserOptions: {
        emitDecoratorMetadata: true,
        experimentalDecorators: true,
        project: options.tsconfig ? options.tsconfig : "./tsconfig.base.json",
        projectService: true,
        sourceType: "module",
        projectFolderIgnoreList: [
          "**/node_modules/**",
          "**/dist/**",
          "**/coverage/**",
          "**/tmp/**",
          "**/.nx/**"
        ],
        ...options.parserOptions
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
      ...unicorn.configs["flat/recommended"].rules,

      // Banner
      ...banner.configs!["recommended"]![1]?.rules,

      ...stormRules,

      "banner/banner": [
        "error",
        {
          repositoryName: options.name,
          banner: options.banner,
          commentType: "block",
          numNewlines: 2
        }
      ],

      ...(options.rules ?? {})
    },
    ignores: ["dist", "coverage", "tmp", ".nx", ...(options.ignores || [])]
  };

  // React
  // https://www.npmjs.com/package/eslint-plugin-react
  if (options.react) {
    typescriptConfig.plugins = {
      ...typescriptConfig.plugins,
      react,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y
    };

    typescriptConfig.settings = {
      react: {
        version: "detect"
      }
    };

    typescriptConfig.rules = {
      ...typescriptConfig.rules,

      // React
      ...reactRules,
      ...reactHooksRules,
      ...jsxA11yRules,

      ...options.react
    };

    typescriptConfig.languageOptions = {
      ...typescriptConfig.languageOptions,
      parserOptions: {
        ...typescriptConfig.languageOptions?.parserOptions,
        ecmaFeatures: {
          ...typescriptConfig.languageOptions?.parserOptions?.ecmaFeatures,
          jsx: true
        }
      }
    };
  }

  configs.push(typescriptConfig);

  // Markdown
  // https://www.npmjs.com/package/eslint-plugin-markdown
  if (options.markdown) {
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
        ...options.markdown
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
        ...options.markdown
      }) as any
    });
  }

  return formatConfig("Preset", configs);
}
