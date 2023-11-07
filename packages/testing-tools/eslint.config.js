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
      "packages/testing-tools/**/*.ts",
      "packages/testing-tools/**/*.tsx",
      "packages/testing-tools/**/*.js",
      "packages/testing-tools/**/*.jsx"
    ],
    parserOptions: { project: ["packages/testing-tools/tsconfig.*?.json"] },
    rules: {}
  },
  {
    files: [
      "packages/testing-tools/**/*.ts",
      "packages/testing-tools/**/*.tsx"
    ],
    rules: {}
  },
  {
    files: [
      "packages/testing-tools/**/*.js",
      "packages/testing-tools/**/*.jsx"
    ],
    rules: {}
  },
  ...compat.config({ parser: "jsonc-eslint-parser" }).map(config => ({
    ...config,
    "files": ["packages/testing-tools/**/*.json"],
    "rules": {
      "@nx/dependency-checks": [
        "error",
        {
          "ignoredFiles": ["{projectRoot}/esbuild.config.{js,ts,mjs,mts}"]
        }
      ]
    }
  }))
];
