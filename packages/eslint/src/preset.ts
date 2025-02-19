/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @nx/enforce-module-boundaries */
import cspell from "@cspell/eslint-plugin/recommended";
import eslint from "@eslint/js";
import next from "@next/eslint-plugin-next";
import nxPlugin from "@nx/eslint-plugin/nx.js";
import {
  formatLogMessage,
  writeDebug,
  writeError,
  writeFatal,
  writeInfo,
  writeTrace
} from "@storm-software/config-tools/logger/console";
import { joinPaths } from "@storm-software/config-tools/utilities/correct-paths";
import { findWorkspaceRoot } from "@storm-software/config-tools/utilities/find-workspace-root";
import { defu } from "defu";
import type { Linter } from "eslint";
import json from "eslint-plugin-json";
import markdown from "eslint-plugin-markdown";
import prettierConfig from "eslint-plugin-prettier/recommended";
import reactPlugin from "eslint-plugin-react";
import reactCompiler from "eslint-plugin-react-compiler";
import reactHooks from "eslint-plugin-react-hooks";
import storybook from "eslint-plugin-storybook";
import tsdoc from "eslint-plugin-tsdoc";
import unicorn from "eslint-plugin-unicorn";
import yml from "eslint-plugin-yml";
import globalsObj from "globals";
import tsEslint from "typescript-eslint";
import type { RuleOptions } from "./rules.d";
import { getStormRulesConfig, GetStormRulesConfigOptions } from "./rules/storm";
import tsdocRules from "./rules/ts-docs";
import banner from "./utils/banner-plugin";
import { CODE_BLOCK, CODE_FILE, TS_FILE } from "./utils/constants";
import { formatConfig } from "./utils/format-config";
import { DEFAULT_IGNORES } from "./utils/ignores";

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
 * The ESLint globals property value.
 */
export type ESLintGlobalsPropValue =
  | boolean
  | "readonly"
  | "readable"
  | "writable"
  | "writeable";

/**
 * The ESLint preset options.
 */
export type PresetOptions = GetStormRulesConfigOptions & {
  name?: string;
  banner?: string;
  rules?: RuleOptions;
  ignores?: string[];
  globals?: Record<string, ESLintGlobalsPropValue>;
  tsconfig?: string;
  typescriptEslintConfigType?: string;
  parserOptions?: Linter.ParserOptions;
  markdown?: false | Linter.RulesRecord;
  react?: false | Linter.RulesRecord;
  nx?: false | Linter.RulesRecord;
  useReactCompiler?: boolean;
  nextFiles?: string[];
  logLevel?:
    | "all"
    | "trace"
    | "debug"
    | "info"
    | "warn"
    | "error"
    | "fatal"
    | "silent";
  cspellConfigFile?: string;
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
    globals: {},
    useUnicorn: true,
    markdown: {},
    react: {},
    nx: {},
    useReactCompiler: false,
    logLevel: "info",
    cspellConfigFile: "./.vscode/cspell.json"
  },
  ...userConfigs: Linter.Config[]
): Linter.Config[] {
  const tsconfig = options.tsconfig;
  const parserOptions = options.parserOptions;
  const typescriptEslintConfigType =
    options.typescriptEslintConfigType || "eslintRecommended";
  const useUnicorn = options.useUnicorn ?? true;
  const react = options.react ?? {};
  const nx = options.nx ?? {};
  const useReactCompiler = options.useReactCompiler ?? false;
  const logLevel = options.logLevel ?? "info";
  const globals = options.globals ?? {};
  const cspellConfigFile = options.cspellConfigFile || "./.vscode/cspell.json";

  try {
    const ignoredFiles = [
      ...DEFAULT_IGNORES,
      ...(options.ignores || [])
    ].filter(Boolean);

    const configs: Linter.Config[] = [
      // Prettier
      prettierConfig,

      // Import
      // https://www.npmjs.com/package/eslint-plugin-import
      // { plugins: { import: importEslint } },
      // {
      //   files: [CODE_FILE],
      //   rules: importRules
      // },

      // Json
      // https://www.npmjs.com/package/eslint-plugin-json
      {
        files: ["**/*.json"],
        ...json.configs["recommended"],
        rules: {
          "json/json": ["warn", { allowComments: true }]
        }
      },
      {
        files: ["**/executors/**/schema.json", "**/generators/**/schema.json"],
        rules:
          nx !== false
            ? {
                "@nx/workspace/valid-schema-description": "error"
              }
            : {}
      },
      {
        files: ["**/package.json"],
        rules:
          nx !== false
            ? {
                "@nx/dependency-checks": [
                  "error",
                  {
                    buildTargets: ["build-base", "build"],
                    ignoredDependencies: ["typescript"],
                    checkMissingDependencies: true,
                    checkObsoleteDependencies: true,
                    checkVersionMismatches: false,
                    includeTransitiveDependencies: true,
                    useLocalPathsForWorkspaceDependencies: true
                  }
                ]
              }
            : {}
      },

      // YML
      // https://www.npmjs.com/package/eslint-plugin-yml
      ...yml.configs["flat/recommended"],
      ...yml.configs["flat/prettier"],

      // CSpell
      {
        ...cspell,
        rules: {
          ...cspell.rules,
          "@cspell/spellchecker": [
            "warn",
            {
              configFile: joinPaths(findWorkspaceRoot(), cspellConfigFile),
              autoFix: true
            }
          ]
        }
      },

      // User overrides
      ...(userConfigs as Linter.Config[])
    ].filter(Boolean) as Linter.Config[];

    // Nx
    if (nx) {
      configs.push({
        plugins: { "@nx": nxPlugin as any }
      });
    }

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
      plugins: { tsdoc: tsdoc as any },
      rules: tsdocRules
    });

    // Banner
    configs.push({
      ...banner.configs!["recommended"],
      name: "banner",
      plugins: { banner },
      files: [CODE_FILE],
      rules: {
        "banner/banner": [
          "error",
          {
            commentType: "block",
            numNewlines: 2,
            repositoryName: options.name
          }
        ]
      }
    });

    // React
    // https://www.npmjs.com/package/eslint-plugin-react
    if (react) {
      // TSX - React
      const reactConfigs: Linter.Config[] = [
        {
          ...reactPlugin.configs?.recommended,
          plugins: { react: reactPlugin },
          files: ["**/*.tsx"],
          ...react
        },
        {
          ...reactHooks.configs?.recommended,
          plugins: { "react-hooks": reactHooks },
          files: [TS_FILE]
        }
        // {
        //   files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
        //   ...jsxA11y.flatConfigs?.recommended
        // }
      ];

      if (useReactCompiler) {
        reactConfigs.push({
          files: ["**/*.tsx"],
          plugins: {
            "react-compiler": reactCompiler
          },
          rules: {
            "react-compiler/react-compiler": "error"
          }
        });
      }

      // Storybook
      reactConfigs.push(
        storybook.configs[
          "flat/recommended"
        ] as Linter.Config<Linter.RulesRecord>
      );

      configs.push(...reactConfigs);
    }

    if (options.nextFiles && options.nextFiles.length > 0) {
      configs.push({
        ...next.configs["core-web-vitals"],
        files: options.nextFiles
      });
    }

    // TypeScript
    const typescriptConfig: Linter.Config = {
      files: [TS_FILE],
      languageOptions: {
        globals: {
          ...Object.fromEntries(
            Object.keys(globalsObj).flatMap(group =>
              Object.keys(globalsObj[group as keyof typeof globalsObj]).map(
                key => [key, "readonly"]
              )
            )
          ),
          ...globalsObj.browser,
          ...globalsObj.node,
          ...globals,
          window: "readonly"
        },
        parserOptions: {
          projectService: true,
          ecmaFeatures: {
            jsx: react !== false
          }
        }
      },
      rules: {
        ...getStormRulesConfig({
          ...options,
          typescriptEslintConfigType,
          useUnicorn,
          useNx: nx !== false
        }),
        ...Object.keys(options.rules ?? {})
          .filter(
            ruleId =>
              !useUnicorn ||
              !ruleId.startsWith("unicorn/") ||
              !react ||
              (!ruleId.startsWith("react/") &&
                !ruleId.startsWith("react-hooks/"))
          )
          .reduce((ret, ruleId) => {
            ret[ruleId] = options.rules![ruleId];
            return ret;
          }, {} as Linter.RulesRecord)
      }
    };

    if (parserOptions) {
      typescriptConfig.languageOptions ??= {};
      typescriptConfig.languageOptions.parserOptions = parserOptions;
    }
    if (tsconfig) {
      typescriptConfig.languageOptions ??= {};
      typescriptConfig.languageOptions.parserOptions ??= {};
      typescriptConfig.languageOptions.parserOptions.project = tsconfig;
    }

    configs.push(typescriptConfig);

    // // JavaScript and TypeScript code
    // const codeConfig: Linter.Config = {
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

    writeTrace(formatLogMessage(configs, { skip: ["globals"] }), {
      logLevel
    });

    const result = formatConfig(
      "Preset",
      configs.reduce((ret: Linter.Config[], config: Record<string, any>) => {
        delete config.parserOptions;

        const existingIndex = ret.findIndex(existing =>
          areFilesEqual(existing.files, config.files)
        );
        if (existingIndex >= 0) {
          ret[existingIndex] = defu(ret[existingIndex], config);
        } else {
          ret.push(config);
        }

        return ret;
      }, [] as Linter.Config[])
    );
    result.unshift({
      ignores: ignoredFiles
    });

    writeInfo("⚙️  Completed generated Storm ESLint configuration objects", {
      logLevel
    });
    writeDebug(formatLogMessage(result, { skip: ["globals"] }), {
      logLevel
    });

    return result;
  } catch (error) {
    writeFatal("Error generating Storm ESLint configuration objects", {
      logLevel
    });
    writeError(error, { logLevel });

    throw error;
  }
}

const areFilesEqual = (
  files1: Linter.Config["files"],
  files2: Linter.Config["files"]
): boolean => {
  if (files1 === files2) {
    return true;
  } else if (!files1 || !files2) {
    return false;
  } else if (
    (typeof files1 === "string" && typeof files2 !== "string") ||
    (typeof files1 !== "string" && typeof files2 === "string") ||
    (Array.isArray(files1) && !Array.isArray(files2)) ||
    (!Array.isArray(files1) && Array.isArray(files2))
  ) {
    return false;
  } else if (files1.length !== files2.length) {
    return false;
  }

  return files1.every((file, index) =>
    Array.isArray(file) && Array.isArray(files2?.[index])
      ? areFilesEqual(file, files2?.[index])
      : !Array.isArray(file) && !Array.isArray(files2?.[index])
        ? file?.toLowerCase() === files2?.[index]?.toLowerCase()
        : file === files2
  );
};
