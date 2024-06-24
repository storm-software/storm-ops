import type { Linter } from "eslint";
import { FlatCompat, Legacy } from "@eslint/eslintrc";
import { findWorkspaceRoot } from "@storm-software/config-tools";
import base from "@storm-software/eslint/base";
import json from "@storm-software/eslint/json";
import markdown from "@storm-software/eslint/markdown";
import nx from "@storm-software/eslint/nx";
import { ignores } from "@storm-software/eslint/utils";
import { formatConfig } from "@storm-software/eslint/utils/format-config";
import yml from "@storm-software/eslint/yml";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import {
  StormESLintPluginConfigType,
  type StormESLintPlugin,
  type StormESLintPluginConfigs
} from "./types";
import { createRulesConfig } from "./utils/create-rules";

const workspaceRoot = findWorkspaceRoot();
const tsCompat = new FlatCompat({
  baseDirectory: workspaceRoot,
  recommendedConfig: tsPlugin.configs.recommended,
  allConfigs: tsPlugin.configs.all,
  ignores
});

export const createRecommendedConfig = <
  TStormESLintPluginConfigs extends
    StormESLintPluginConfigs = StormESLintPluginConfigs
>(
  plugin: StormESLintPlugin<TStormESLintPluginConfigs>
): Linter.FlatConfig[] => {
  const config: Linter.FlatConfig[] = [
    ...base,
    ...tsCompat
      .extends(
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/stylistic"
      )
      .map(config => ({
        ...config,
        plugins: {
          "@typescript-eslint": tsPlugin
        },
        files: ["**/*.{,c,m}{j,t}s{,x}"],
        ignores,
        languageOptions: {
          ecmaVersion: "latest",
          globals: {
            globals: Legacy.environments.get("es2024")
          }
        },
        settings: {
          "import/resolver": "node"
        }
      })),
    ...nx,
    {
      files: ["**/*.{,c,m}{j,t}s{,x}"],
      ignores,
      name: "storm-software/recommended",
      plugins: { "storm-software": plugin },
      languageOptions: {
        globals: Legacy.environments.get("es2024")
      },
      rules: {
        ...createRulesConfig(),
        /**
         * Require consistent filename case for all linted files.
         *
         * 🚫 Not fixable - https://github.com/storm-software/storm-ops/blob/main/docs/rules/filename-case.md
         */
        "storm-software/filename-case": [
          "error",
          {
            case: "kebabCase"
          }
        ],
        /**
         * Require using the `node:` protocol when importing Node.js built-in modules.
         *
         * 🔧 Fixable - https://github.com/storm-software/storm-ops/blob/main/docs/rules/prefer-node-protocol.md
         */
        "storm-software/prefer-node-protocol": "warn",
        // Enforce the style of numeric separators by correctly grouping digits
        // https://github.com/storm-software/storm-ops/blob/main/docs/rules/numeric-separators-style.md
        "storm-software/numeric-separators-style": "error",
        "storm-software/no-array-push-push": "error",
        "storm-software/no-instanceof-array": "error",
        "storm-software/no-empty-file": "error",
        "storm-software/no-useless-fallback-in-spread": "error",
        "storm-software/prefer-array-find": "error",
        "storm-software/no-useless-spread": "error",
        "storm-software/prefer-includes": "error",
        "storm-software/prefer-export-from": [
          "error",
          { ignoreUsedVariables: true }
        ],
        "storm-software/prefer-logical-operator-over-ternary": "error",
        "storm-software/no-negated-condition": "error", // has autofix
        "storm-software/no-array-for-each": "error",
        "storm-software/prefer-string-trim-start-end": "error"
      },
      settings: {
        "import/resolver": "node"
      }
    }
  ];

  return formatConfig("Plugin", config);
};

export const createConfigs = <
  TStormESLintPluginConfigs extends
    StormESLintPluginConfigs = StormESLintPluginConfigs
>(
  plugin: StormESLintPlugin<TStormESLintPluginConfigs>
) => {
  return {
    [StormESLintPluginConfigType.BASE]: base,
    [StormESLintPluginConfigType.NX]: nx,
    [StormESLintPluginConfigType.JSON]: json,
    [StormESLintPluginConfigType.YML]: yml,
    [StormESLintPluginConfigType.MARKDOWN]: markdown,
    [StormESLintPluginConfigType.RECOMMENDED]: createRecommendedConfig(plugin)
  } as StormESLintPluginConfigs;
};

export default createConfigs;
