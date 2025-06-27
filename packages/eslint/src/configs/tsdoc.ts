import pluginTsdoc from "eslint-plugin-tsdoc";
import type { OptionsFiles, OptionsTSDoc, TypedFlatConfigItem } from "../types";
import { GLOB_TS, GLOB_TSX } from "../utils/constants";

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
        "tsdoc/syntax": [severity, { type, configFile }]
      }
    }
  ];
}
