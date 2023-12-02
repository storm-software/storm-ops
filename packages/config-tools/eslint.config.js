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
      "packages/config-tools/**/*.ts",
      "packages/config-tools/**/*.tsx",
      "packages/config-tools/**/*.js",
      "packages/config-tools/**/*.jsx"
    ],
    parserOptions: { project: ["packages/config-tools/tsconfig.*?.json"] },
    rules: {}
  },
  {
    files: ["packages/config-tools/**/*.ts", "packages/config-tools/**/*.tsx"],
    rules: {}
  },
  {
    files: ["packages/config-tools/**/*.js", "packages/config-tools/**/*.jsx"],
    rules: {}
  },
  ...compat.config({ parser: "jsonc-eslint-parser" }).map(config => ({
    ...config,
    "files": ["packages/config-tools/**/*.json"],
    "rules": {
      "@nx/dependency-checks": "error"
    }
  }))
];
