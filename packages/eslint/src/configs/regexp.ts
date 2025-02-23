import { configs } from "eslint-plugin-regexp";
import type {
  OptionsOverrides,
  OptionsRegExp,
  TypedFlatConfigItem
} from "../types";

export async function regexp(
  options: OptionsRegExp & OptionsOverrides = {}
): Promise<TypedFlatConfigItem[]> {
  const config = configs["flat/recommended"] as TypedFlatConfigItem;

  const rules = {
    ...config.rules
  };

  if (options.level === "warn") {
    for (const key in rules) {
      if (rules[key] === "error") rules[key] = "warn";
    }
  }

  return [
    {
      ...config,
      name: "storm/regexp/rules",
      rules: {
        ...rules,

        "regexp/no-unused-capturing-group": [
          "error",
          {
            fixable: true,
            allowNamed: false
          }
        ],

        ...options.overrides
      }
    }
  ];
}
