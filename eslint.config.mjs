import storm from "./dist/packages/eslint/dist/preset.mjs";

export default storm({
  typescript: {
    "unicorn/no-null": 0,
    "react/require-default-props": 0,
    "unicorn/no-useless-switch-case": 0,
    "react/jsx-closing-bracket-location": 0,
    "no-undef": 0,
    "unicorn/consistent-function-scoping": 0,
    "class-methods-use-this": 0
  },
  ignores: ["**/dist", "**/node_modules", "**/.nx"]
});
