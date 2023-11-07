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
      "packages/workspace-tools/**/*.ts",
      "packages/workspace-tools/**/*.tsx",
      "packages/workspace-tools/**/*.js",
      "packages/workspace-tools/**/*.jsx"
    ],
    parserOptions: { project: ["packages/workspace-tools/tsconfig.*?.json"] },
    rules: {}
  },
  {
    files: [
      "packages/workspace-tools/**/*.ts",
      "packages/workspace-tools/**/*.tsx"
    ],
    rules: {}
  },
  {
    files: [
      "packages/workspace-tools/**/*.js",
      "packages/workspace-tools/**/*.jsx"
    ],
    rules: {}
  },
  ...compat.config({ parser: "jsonc-eslint-parser" }).map(config => ({
    ...config,
    files: ["packages/workspace-tools/**/*.json"],
    rules: { "@nx/dependency-checks": "error" }
  })),
  ...compat.config({ parser: "jsonc-eslint-parser" }).map(config => ({
    ...config,
    files: [
      "packages/workspace-tools/package.json",
      "packages/workspace-tools/generators.json",
      "packages/workspace-tools/executors.json"
    ],
    rules: { "@nx/nx-plugin-checks": "error" }
  }))
];
