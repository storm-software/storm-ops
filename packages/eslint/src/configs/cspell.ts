import cspellConfig from "@cspell/eslint-plugin/recommended";
import type { OptionsCSpell, TypedFlatConfigItem } from "../types";
import { joinPaths } from "../utils/correct-paths";
import { findWorkspaceRoot } from "../utils/find-workspace-root";

/**
 * Config for CSpell spell checking
 */
export async function cspell(
  options: OptionsCSpell = {}
): Promise<TypedFlatConfigItem[]> {
  const { configFile = "./.vscode/cspell.json", overrides = {} } = options;

  return [
    {
      name: "storm/cspell/rules",
      ...cspellConfig,
      rules: {
        ...cspellConfig.rules,

        "@cspell/spellchecker": [
          "warn",
          {
            configFile: joinPaths(findWorkspaceRoot(), configFile),
            generateSuggestions: true,
            numSuggestions: 10,
            autoFix: true
          }
        ],

        ...overrides
      }
    }
  ];
}
