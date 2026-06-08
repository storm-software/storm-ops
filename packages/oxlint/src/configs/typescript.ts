import type { OptionsTypeScript, TypedConfigItem } from "../types";

export function typescript(options: OptionsTypeScript = {}): TypedConfigItem {
  const { typeAware = true, typeCheck = true } = options;

  return {
    options: {
      typeAware,
      typeCheck
    },
    plugins: ["typescript"],
    rules: {
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "none",
          varsIgnorePattern: "^_"
        }
      ]
    }
  };
}
