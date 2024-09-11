/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @nx/enforce-module-boundaries */
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
import reactCompiler from "eslint-plugin-react-compiler";
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
  useReactCompiler?: boolean;
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
    react: {},
    useReactCompiler: false
  },
  ...userConfigs: Linter.FlatConfig[]
): Linter.FlatConfig[] {
  const configs: Linter.FlatConfig[] = [
    // https://eslint.org/docs/latest/rules/
    eslint.configs.recommended,

    // https://typescript-eslint.io/
    ...tsEslint.configs.recommended.map(config => ({
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

  // TypeScript
  const typescriptConfig: Linter.FlatConfig<Linter.RulesRecord> = {
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
      // // https://eslint.org/docs/latest/rules/
      // ...eslint.configs.recommended.rules,

      // // https://typescript-eslint.io/
      // ...tsEslint.configs.recommended.reduce(
      //   (ret, record) => ({ ...ret, ...record.rules }),
      //   {}
      // ),

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
    ignores: [
      "dist",
      "coverage",
      "tmp",
      ".nx",
      "node_modules",
      ...(options.ignores || [])
    ]
  };

  configs.push(typescriptConfig);

  // React
  // https://www.npmjs.com/package/eslint-plugin-react
  if (options.react) {
    // TSX - React
    const reactConfig: Linter.FlatConfig<Linter.RulesRecord> = {
      files: ["**/*.tsx"],
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
          ecmaFeatures: {
            jsx: true
          },
          ...options.parserOptions
        }
      },
      settings: {
        react: {
          version: "detect"
        }
      },
      plugins: {
        react,
        "react-hooks": reactHooks,
        "jsx-a11y": jsxA11y
      },
      rules: {
        ...reactRules,
        ...reactHooksRules,
        ...jsxA11yRules,

        ...(options.react ?? {})
      },
      ignores: [
        "dist",
        "coverage",
        "tmp",
        ".nx",
        "node_modules",
        ...(options.ignores || [])
      ]
    };

    if (options.useReactCompiler) {
      reactConfig.plugins = {
        ...reactConfig.plugins,
        "react-compiler": reactCompiler
      };

      reactConfig.rules = {
        ...reactConfig.rules,
        "react-compiler/react-compiler": "error"
      };
    }

    configs.push(reactConfig);
  }

  // // JavaScript and TypeScript code
  // const codeConfig: Linter.FlatConfig<Linter.RulesRecord> = {
  //   files: [CODE_FILE],
  //   rules: {
  //     // Prettier
  //     ...prettierConfig.rules,

  //     // Banner
  //     ...banner.configs!["recommended"]![1]?.rules,

  //     "banner/banner": [
  //       "error",
  //       {
  //         repositoryName: options.name,
  //         banner: options.banner,
  //         commentType: "block",
  //         numNewlines: 2
  //       }
  //     ]
  //   },
  //   ignores: ["dist", "coverage", "tmp", ".nx", ...(options.ignores || [])]
  // };

  // configs.push(codeConfig);

  // Markdown
  // https://www.npmjs.com/package/eslint-plugin-markdown
  if (options.markdown) {
    configs.push(...markdown.configs.recommended);
    configs.push({
      files: [CODE_BLOCK],
      processor: "markdown/markdown",
      rules: <Linter.RulesRecord>{
        "unicorn/filename-case": "off",
        "no-undef": "off",
        "no-unused-expressions": "off",
        "padded-blocks": "off",
        "no-empty-pattern": "off",
        "no-redeclare": "off",
        "no-import-assign": "off",
        ...options.markdown
      }
    });
    configs.push({
      files: ["**/*.md/*.js", "**/*.md/*.ts"],
      rules: <Linter.RulesRecord>{
        "unicorn/filename-case": "off",
        "no-undef": "off",
        "no-unused-expressions": "off",
        "padded-blocks": "off",
        "no-empty-pattern": "off",
        "no-redeclare": "off",
        "no-import-assign": "off",
        ...options.markdown
      }
    });
  }

  return formatConfig("Preset", configs);
}
