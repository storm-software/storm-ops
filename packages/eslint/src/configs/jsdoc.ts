import type { OptionsJSDoc, TypedFlatConfigItem } from "../types";
import { interopDefault } from "../utils/helpers";

export async function jsdoc(
  options: OptionsJSDoc = {}
): Promise<TypedFlatConfigItem[]> {
  const { stylistic = true, severity = "warn" } = options;

  return [
    {
      name: "storm/jsdoc/rules",
      plugins: {
        jsdoc: await interopDefault(import("eslint-plugin-jsdoc"))
      },
      rules: {
        "jsdoc/check-access": severity,
        "jsdoc/check-param-names": severity,
        "jsdoc/check-property-names": severity,
        "jsdoc/check-types": "off",
        "jsdoc/empty-tags": severity,
        "jsdoc/implements-on-classes": severity,
        "jsdoc/no-defaults": severity,
        "jsdoc/no-multi-asterisks": severity,
        "jsdoc/require-param-name": severity,
        "jsdoc/require-property": severity,
        "jsdoc/require-property-description": severity,
        "jsdoc/require-property-name": severity,
        "jsdoc/require-returns-check": severity,
        "jsdoc/require-returns-description": severity,
        "jsdoc/require-yields-check": severity,

        ...(stylistic
          ? {
              "jsdoc/check-alignment": severity,
              "jsdoc/multiline-blocks": severity
            }
          : {})
      }
    }
  ];
}
