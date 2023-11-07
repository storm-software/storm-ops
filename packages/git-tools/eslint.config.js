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
      "packages/git-tools/**/*.ts",
      "packages/git-tools/**/*.tsx",
      "packages/git-tools/**/*.js",
      "packages/git-tools/**/*.jsx"
    ],
    parserOptions: { project: ["packages/git-tools/tsconfig.*?.json"] },
    rules: {}
  },
  {
    files: ["packages/git-tools/**/*.ts", "packages/git-tools/**/*.tsx"],
    rules: {}
  },
  {
    files: ["packages/git-tools/**/*.js", "packages/git-tools/**/*.jsx"],
    rules: {}
  },
  ...compat.config({ parser: "jsonc-eslint-parser" }).map(config => ({
    ...config,
    files: ["packages/git-tools/**/*.json"],
    rules: {
      "@nx/dependency-checks": [
        "error",
        { ignoredFiles: ["{projectRoot}/esbuild.config.{js,ts,mjs,mts}"] }
      ]
    }
  }))
];
