const { FlatCompat } = require("@eslint/eslintrc");
const baseConfig = require("../../eslint.config.js");
const js = require("@eslint/js");
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended
});
module.exports = [
  ...baseConfig,
  {
    files: [
      "packages/create-storm-workspace/**/*.ts",
      "packages/create-storm-workspace/**/*.tsx",
      "packages/create-storm-workspace/**/*.js",
      "packages/create-storm-workspace/**/*.jsx"
    ],
    parserOptions: {
      project: ["packages/create-storm-workspace/tsconfig.*?.json"]
    },
    rules: {}
  },
  {
    files: [
      "packages/create-storm-workspace/**/*.ts",
      "packages/create-storm-workspace/**/*.tsx"
    ],
    rules: {}
  },
  {
    files: [
      "packages/create-storm-workspace/**/*.js",
      "packages/create-storm-workspace/**/*.jsx"
    ],
    rules: {}
  },
  ...compat.config({ parser: "jsonc-eslint-parser" }).map(config => ({
    ...config,
    files: ["packages/create-storm-workspace/**/*.json"],
    rules: { "@nx/dependency-checks": "error" }
  })),
  ...compat.config({ parser: "jsonc-eslint-parser" }).map(config => ({
    ...config,
    files: [
      "packages/create-storm-workspace/package.json",
      "packages/create-storm-workspace/generators.json"
    ],
    rules: { "@nx/nx-plugin-checks": "error" }
  }))
];
