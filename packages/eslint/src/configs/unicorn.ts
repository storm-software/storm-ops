import { pluginUnicorn } from "../plugins";
import type { OptionsUnicorn, TypedFlatConfigItem } from "../types";

export async function unicorn(
  options: OptionsUnicorn = {}
): Promise<TypedFlatConfigItem[]> {
  return [
    {
      name: "storm/unicorn/rules",
      plugins: {
        unicorn: pluginUnicorn
      },
      rules: {
        ...(options.allRecommended
          ? pluginUnicorn.configs["recommended"].rules
          : {
              "unicorn/consistent-empty-array-spread": "error",
              "unicorn/error-message": "error",
              "unicorn/escape-case": "error",
              "unicorn/new-for-builtins": "error",
              "unicorn/no-instanceof-array": "error",
              "unicorn/no-new-array": "error",
              "unicorn/no-new-buffer": "error",
              "unicorn/number-literal-case": "error",
              "unicorn/prefer-dom-node-text-content": "error",
              "unicorn/prefer-includes": "error",
              "unicorn/prefer-node-protocol": "error",
              "unicorn/prefer-number-properties": "error",
              "unicorn/prefer-string-starts-ends-with": "error",
              "unicorn/prefer-type-error": "error",
              "unicorn/throw-new-error": "error"
            }),

        /*************************************************************
         *
         *  Unicorn Rules - The following rules are specific to the Unicorn plugin
         *
         **************************************************************/

        "unicorn/number-literal-case": "off",
        "unicorn/template-indent": "off",
        "unicorn/prevent-abbreviations": "off",
        "unicorn/no-await-expression-member": "off",
        "unicorn/no-useless-undefined": "off",
        "unicorn/no-array-push-push": "off",
        "unicorn/no-array-reduce": "off",
        "unicorn/no-useless-switch-case": "off",
        "unicorn/prefer-string-replace-all": "off",
        "unicorn/no-abusive-eslint-disable": "off",
        "unicorn/import-style": "off",
        "unicorn/prefer-module": "off",
        "unicorn/consistent-function-scoping": "off",
        "unicorn/no-nested-ternary": "off"
      }
    }
  ];
}
