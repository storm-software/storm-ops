import cspellConfig from "@cspell/eslint-plugin/recommended";
import type { OptionsCSpell, TypedFlatConfigItem } from "../types";
import { joinPaths } from "../utils/correct-paths";

/**
 * Config for CSpell spell checking
 */
export async function cspell(
  options: OptionsCSpell = {}
): Promise<TypedFlatConfigItem[]> {
  const { configFile = "./.vscode/cspell.json", overrides = {} } = options;

  let workspaceConfigFile = configFile;
  if (process.env.STORM_WORKSPACE_ROOT || process.env.NX_WORKSPACE_ROOT_PATH) {
    workspaceConfigFile = joinPaths(
      process.env.STORM_WORKSPACE_ROOT ||
        process.env.NX_WORKSPACE_ROOT_PATH ||
        "./",
      configFile
    );
  }

  return [
    {
      name: "storm/cspell/rules",
      ...cspellConfig,
      rules: {
        ...cspellConfig.rules,

        "@cspell/spellchecker": [
          "warn",
          {
            configFile: workspaceConfigFile,
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
