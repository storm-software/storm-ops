import eslintPlugin from "./dist/plugins/eslint/index.mjs";

export default [
  ...eslintPlugin.configs.base,
  {
    plugins: {
      "@storm-software": eslintPlugin
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        project: "./tsconfig.eslint.json"
      }
    },
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/tmp/**",
      "**/.nx/**",
      "**/.tamagui/**"
    ]
  }
];
