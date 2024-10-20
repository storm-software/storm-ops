/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @nx/enforce-module-boundaries */
import {
  plugins as cspellPlugins,
  rules as cspellRules
} from "@cspell/eslint-plugin/recommended";
import eslint from "@eslint/js";
import next from "@next/eslint-plugin-next";
import nxPlugin from "@nx/eslint-plugin";
import type { Linter } from "eslint";
import json from "eslint-plugin-json";
import markdown from "eslint-plugin-markdown";
import prettierConfig from "eslint-plugin-prettier/recommended";
import reactPlugin from "eslint-plugin-react";
import reactCompiler from "eslint-plugin-react-compiler";
import reactHooks from "eslint-plugin-react-hooks";
import tsdoc from "eslint-plugin-tsdoc";
import unicorn from "eslint-plugin-unicorn";
import yml from "eslint-plugin-yml";
import globals from "globals";
import type { RuleOptions } from "./rules.d";
// import jsxA11yRules from "./rules/jsx-a11y";
// import reactRules from "./rules/react";
// import reactHooksRules from "./rules/react-hooks";
import { merge } from "radash";
import tsEslint from "typescript-eslint";
import {
  getStormRulesConfig,
  GetStormRulesConfigOptions,
  TypeScriptEslintConfigType
} from "./rules/storm";
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
export type PresetOptions = GetStormRulesConfigOptions & {
  name?: string;
  banner?: string;
  rules?: RuleOptions;
  ignores?: string[];
  tsconfig?: string;
  typescriptEslintConfigType?: TypeScriptEslintConfigType;
  parserOptions?: Linter.ParserOptions;
  markdown?: false | Linter.RulesRecord;
  react?: false | Linter.RulesRecord;
  useReactCompiler?: boolean;
  nextFiles?: string[];
};

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
    typescriptEslintConfigType: "eslint-recommended",
    useUnicorn: true,
    markdown: {},
    react: {},
    useReactCompiler: false
  },
  ...userConfigs: Linter.FlatConfig[]
): Linter.FlatConfig[] {
  const tsconfig = options.tsconfig ?? "./tsconfig.base.json";
  const typescriptEslintConfigType =
    options.typescriptEslintConfigType || "eslint-recommended";
  const useUnicorn = options.useUnicorn ?? true;
  const react = options.react ?? {};
  const useReactCompiler = options.useReactCompiler ?? false;

  // Banner
  const bannerConfig = {
    ...banner.configs!["recommended"],
    files: [TS_FILE],
    rules: {
      "banner/banner": [
        "error",
        { commentType: "block", numNewlines: 2, repositoryName: options.name }
      ]
    }
  } as Linter.FlatConfig<Linter.RulesRecord>;

  const configs: Linter.FlatConfig[] = [
    // Prettier
    prettierConfig,

    // Import
    // https://www.npmjs.com/package/eslint-plugin-import
    // { plugins: { import: importEslint } },
    // {
    //   files: [CODE_FILE],
    //   rules: importRules
    // },

    bannerConfig,

    // NX
    {
      plugins: { "@nx": nxPlugin }
    },

    // Json
    // https://www.npmjs.com/package/eslint-plugin-json
    {
      files: ["**/*.json"],
      ...json.configs["recommended"],
      rules: {
        "json/json": ["warn", { "allowComments": true }]
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

  // const typescriptConfigs: Linter.FlatConfig<Linter.RulesRecord>[] = [
  //   eslint.configs.recommended
  // ];

  configs.push(eslint.configs.recommended);

  if (typescriptEslintConfigType !== "none") {
    // https://typescript-eslint.io/
    if (!(typescriptEslintConfigType in tsEslint.configs)) {
      console.warn(
        "Invalid TypeScript ESLint configuration type:",
        typescriptEslintConfigType
      );
    } else {
      configs.push(
        ...(Array.isArray(tsEslint.configs[typescriptEslintConfigType])
          ? tsEslint.configs[typescriptEslintConfigType]
          : [tsEslint.configs[typescriptEslintConfigType]])
      );
    }
  }

  if (useUnicorn) {
    // https://www.npmjs.com/package/eslint-plugin-unicorn
    configs.push({
      files: [TS_FILE],
      plugins: { unicorn },
      rules: {
        ...unicorn.configs["flat/recommended"].rules
      }
    });
  }

  // TSDoc
  // https://www.npmjs.com/package/eslint-plugin-tsdoc
  configs.push({
    files: [TS_FILE],
    plugins: { tsdoc },
    rules: tsdocRules
  });

  configs.push(bannerConfig);

  // React
  // https://www.npmjs.com/package/eslint-plugin-react
  if (react) {
    // TSX - React
    const reactConfigs: Linter.FlatConfig<Linter.RulesRecord>[] = [
      {
        ...reactPlugin.configs?.recommended,
        files: ["**/*.tsx"],
        ignores: [
          "**/node_modules/**",
          "**/dist/**",
          "**/coverage/**",
          "**/tmp/**",
          "**/.nx/**",
          "**/.tamagui/**",
          "**/.next/**",
          ...(options.ignores || [])
        ],
        ...react
      },
      {
        ...reactHooks.configs?.recommended,
        files: [TS_FILE],
        ignores: [
          "**/node_modules/**",
          "**/dist/**",
          "**/coverage/**",
          "**/tmp/**",
          "**/.nx/**",
          "**/.tamagui/**",
          "**/.next/**",
          ...(options.ignores || [])
        ]
      }
      // {
      //   files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
      //   ...jsxA11y.flatConfigs?.recommended
      // }
    ];

    if (useReactCompiler) {
      reactConfigs.push({
        files: ["**/*.tsx"],
        ignores: [
          "**/node_modules/**",
          "**/dist/**",
          "**/coverage/**",
          "**/tmp/**",
          "**/.nx/**",
          "**/.tamagui/**",
          "**/.next/**",
          ...(options.ignores || [])
        ],
        plugins: {
          "react-compiler": reactCompiler
        },
        rules: {
          "react-compiler/react-compiler": "error"
        }
      });
    }

    configs.push(...reactConfigs);
  }

  if (options.nextFiles && options.nextFiles.length > 0) {
    configs.push({
      ...next.configs["core-web-vitals"],
      ignores: [
        "**/node_modules/**",
        "**/dist/**",
        "**/coverage/**",
        "**/tmp/**",
        "**/.nx/**",
        "**/.tamagui/**",
        "**/.next/**",
        ...(options.ignores || [])
      ],
      files: options.nextFiles
    });
  }

  // TypeScript
  configs.push({
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
      parserOptions: {
        emitDecoratorMetadata: true,
        experimentalDecorators: true,
        project: tsconfig,
        projectService: true,
        sourceType: "module",
        projectFolderIgnoreList: [
          "**/node_modules/**",
          "**/dist/**",
          "**/coverage/**",
          "**/tmp/**",
          "**/.nx/**",
          "**/.tamagui/**",
          "**/.next/**",
          ...(options.ignores || [])
        ],
        ...options.parserOptions
      }
    },
    rules: {
      ...getStormRulesConfig({
        ...options,
        typescriptEslintConfigType,
        useUnicorn
      }),
      ...(options.rules ?? {})
    },
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/coverage/**",
      "**/tmp/**",
      "**/.nx/**",
      "**/.tamagui/**",
      "**/.next/**",
      ...(options.ignores || [])
    ]
  });

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

  return formatConfig(
    "Preset",
    configs.reduce(
      (ret, config) => merge(ret, [config], c => c.files),
      []
    ) as Linter.FlatConfig<Linter.RulesRecord>[]
  );
}
