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
      "packages/linting-tools/**/*.ts",
      "packages/linting-tools/**/*.tsx",
      "packages/linting-tools/**/*.js",
      "packages/linting-tools/**/*.jsx"
    ],
    parserOptions: { project: ["packages/linting-tools/tsconfig.*?.json"] },
    rules: {}
  },
  {
    files: [
      "packages/linting-tools/**/*.ts",
      "packages/linting-tools/**/*.tsx"
    ],
    rules: {}
  },
  {
    files: [
      "packages/linting-tools/**/*.js",
      "packages/linting-tools/**/*.jsx"
    ],
    rules: {}
  },
  ...compat.config({ parser: "jsonc-eslint-parser" }).map(config => ({
    ...config,
    files: ["packages/linting-tools/**/*.json"],
    rules: {
      "@nx/dependency-checks": [
        "error",
        { ignoredFiles: ["{projectRoot}/esbuild.config.{js,ts,mjs,mts}"] }
      ]
    }
  }))
];
