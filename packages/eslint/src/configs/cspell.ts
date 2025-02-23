import cspellConfig from "@cspell/eslint-plugin/recommended";
import { findWorkspaceRoot, joinPaths } from "@storm-software/config-tools";
import type { OptionsCSpell, TypedFlatConfigItem } from "../types";

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
            autoFix: true
          }
        ],

        ...overrides
      }
    }
  ];
}
