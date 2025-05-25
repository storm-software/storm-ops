export { default as pluginTsdoc } from "eslint-plugin-tsdoc";
import type { OptionsFiles, OptionsTSDoc, TypedFlatConfigItem } from "../types";
import { GLOB_TS, GLOB_TSX } from "../utils/constants";

export async function tsdoc(
  options: OptionsFiles & OptionsTSDoc = {}
): Promise<TypedFlatConfigItem[]> {
  const {
    overrides = {},
    severity = "error",
    type = "base",
    configFile
  } = options;

  const files = options.files ?? [GLOB_TS, GLOB_TSX];

  return [
    {
      files,
      name: "storm/tsdoc/rules",
      plugins: {
        tsdoc: pluginTsdoc
      },
      rules: {
        "tsdoc/syntax": [severity, { type, configFile }],

        ...overrides
      }
    }
  ];
}
