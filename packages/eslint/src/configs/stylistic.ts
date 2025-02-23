import type {
  OptionsOverrides,
  StylisticConfig,
  TypedFlatConfigItem
} from "../types";
import { interopDefault } from "../utils/helpers";

export const StylisticConfigDefaults: StylisticConfig = {
  indent: 2,
  jsx: true,
  quotes: "double",
  semi: true
};

export interface StylisticOptions extends StylisticConfig, OptionsOverrides {
  lessOpinionated?: boolean;
}

export async function stylistic(
  options: StylisticOptions = {}
): Promise<TypedFlatConfigItem[]> {
  const {
    indent = 2,
    jsx = true,
    overrides = {},
    quotes = "double",
    semi = true,
    lineEndings = "unix"
  } = {
    ...StylisticConfigDefaults,
    ...options
  };

  const pluginStylistic = await interopDefault(
    import("@stylistic/eslint-plugin")
  );

  const config = pluginStylistic.configs.customize({
    indent,
    jsx,
    pluginName: "style",
    quotes,
    semi
  });

  return [
    {
      name: "storm/stylistic/rules",
      plugins: {
        style: pluginStylistic
      },
      rules: {
        ...config.rules,

        "style/lines-around-comment": "off",
        "style/linebreak-style": ["error", lineEndings],
        "style/comma-dangle": ["error", "never"],
        "style/comma-style": ["error", "last"],
        "style/quotes": ["error", quotes],
        "style/semi": ["error", semi ? "always" : "never"],
        "style/indent": ["error", indent, { SwitchCase: 1 }],
        "style/operator-linebreak": ["error", "after"],
        "style/jsx-indent": ["error", indent],
        "style/jsx-quotes": [
          "error",
          quotes === "single" ? "prefer-single" : "prefer-double"
        ],

        ...overrides
      }
    }
  ];
}
