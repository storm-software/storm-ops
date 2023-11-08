const { FlatCompat } = require("@eslint/eslintrc");
const nxEslintPlugin = require("@nx/eslint-plugin");
const typescriptConfig = require("@storm-software/linting-tools/eslint/typescript");
const javascriptConfig = require("@storm-software/linting-tools/eslint/javascript");
const graphqlConfig = require("@storm-software/linting-tools/eslint/graphql");
const jestConfig = require("@storm-software/linting-tools/eslint/jest");
const jsonConfig = require("@storm-software/linting-tools/eslint/json");
const reactConfig = require("@storm-software/linting-tools/eslint/react");
const nextConfig = require("@storm-software/linting-tools/eslint/next");

const js = require("@eslint/js");
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended
});

module.exports = [
  { plugins: { "@nx": nxEslintPlugin } },
  ...compat.config({ parser: "jsonc-eslint-parser" }).map(config => ({
    ...config,
    files: ["**/*.json"],
    rules: {}
  })),
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    rules: {
      "@nx/enforce-module-boundaries": [
        "error",
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: "*",
              onlyDependOnLibsWithTags: ["*"]
            }
          ]
        }
      ]
    }
  },
  ...compat.config({ extends: ["plugin:@nx/typescript"] }).map(config => ({
    ...config,
    files: ["**/*.ts", "**/*.tsx"],
    rules: {}
  })),
  ...compat.config({ extends: ["plugin:@nx/javascript"] }).map(config => ({
    ...config,
    files: ["**/*.js", "**/*.jsx"],
    rules: {}
  })),
  ...compat.config(typescriptConfig),
  ...compat.config(javascriptConfig),
  ...compat.config(graphqlConfig),
  ...compat.config(jestConfig),
  ...compat.config(jsonConfig),
  ...compat.config(reactConfig),
  ...compat.config(nextConfig)
];
