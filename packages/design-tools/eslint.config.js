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
      "packages/design-tools/**/*.ts",
      "packages/design-tools/**/*.tsx",
      "packages/design-tools/**/*.js",
      "packages/design-tools/**/*.jsx"
    ],
    parserOptions: { project: ["packages/design-tools/tsconfig.*?.json"] },
    rules: {}
  },
  {
    files: ["packages/design-tools/**/*.ts", "packages/design-tools/**/*.tsx"],
    rules: {}
  },
  {
    files: ["packages/design-tools/**/*.js", "packages/design-tools/**/*.jsx"],
    rules: {}
  },
  ...compat.config({ parser: "jsonc-eslint-parser" }).map(config => ({
    ...config,
    "files": ["packages/design-tools/**/*.json"],
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
