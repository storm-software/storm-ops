import pluginTsdoc from "@storm-software/eslint-plugin-tsdoc";
import { GLOB_TS, GLOB_TSX } from "@storm-software/package-constants/globs";
import type { OptionsFiles, OptionsTSDoc, TypedFlatConfigItem } from "../types";
import { findWorkspaceRoot } from "../utils/find-workspace-root";

export async function tsdoc(
  options: OptionsFiles & OptionsTSDoc = {}
): Promise<TypedFlatConfigItem[]> {
  const {
    severity = "error",
    type = "recommended",
    configFile,
    files = [GLOB_TS, GLOB_TSX]
  } = options;

  return [
    {
      files,
      name: "storm/tsdoc/rules",
      plugins: {
        tsdoc: pluginTsdoc
      },
      rules: {
        "tsdoc/syntax": [
          severity,
          { type, configFile, tsconfigRootDir: findWorkspaceRoot() }
        ]
      }
    }
  ];
}
