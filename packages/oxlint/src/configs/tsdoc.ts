import type { OptionsTSDoc, TypedConfigItem } from "../types";

export function tsdoc(options: OptionsTSDoc): TypedConfigItem {
  const { severity = "error", type = "recommended", configFile } = options;

  return {
    jsPlugins: [
      {
        name: "tsdoc",
        specifier: "@storm-software/eslint-plugin-tsdoc"
      }
    ],
    rules: {
      "tsdoc/syntax": [severity, { type, configFile }]
    }
  };
}
