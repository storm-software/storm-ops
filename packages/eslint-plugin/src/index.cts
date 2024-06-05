import * as base from "../../eslint/src/base";
import * as graphql from "../../eslint/src/graphql";
import * as javascript from "../../eslint/src/javascript";
import * as jest from "../../eslint/src/jest";
import * as json from "../../eslint/src/json";
import * as mdx from "../../eslint/src/mdx";
import * as next from "../../eslint/src/next";
import * as nx from "../../eslint/src/nx";
import * as react from "../../eslint/src/react";
import * as recommended from "../../eslint/src/recommended";
import * as typescript from "../../eslint/src/typescript";
import * as yml from "../../eslint/src/yml";

// import importRules from "./rules/import";
// import jsxA11yRules from "./rules/jsx-a11y";
// import reactRules from "./rules/react";
// import stormRules from "./rules/storm";
// import tsdocsRules from "./rules/ts-docs";
// import unicornRules from "./rules/unicorn";

module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "@nx"],
  extends: [
    "plugin:@nx/react-base",
    "plugin:@nx/react-typescript",
    "plugin:@nx/react-jsx",
    "plugin:@nx/typescript",
    "plugin:@nx/javascript"
  ],
  ignores: [
    "**/package.json/**",
    "**/.wrangler/**",
    "**/tamagui.css",
    "**/workbox*.js",
    "**/sw*.js",
    "**/service-worker.js",
    "**/fallback*.js",
    "**/node_modules/**",
    "**/dist/**",
    "**/ios/**",
    "**/.git/**",
    "**/.android/**",
    "**/.DS_Store/**",
    "**/Thumbs.db/**",
    "**/.tamagui*",
    ".next/**",
    "CODEOWNERS",
    "dist/**",
    "coverage/**",
    ".nx/cache/**",
    "**/src/generators/**/files/**/*"
  ],
  configs: {
    base,
    nx,
    recommended,
    json,
    yml,
    javascript,
    typescript,
    react,
    next,
    mdx,
    graphql,
    jest
  },
  env: {
    node: true
  },
  rules: {
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "no-restricted-imports": ["error", "create-nx-workspace"],
    "@typescript-eslint/no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["nx/src/plugins/js*"],
            message:
              "Imports from 'nx/src/plugins/js' are not allowed. Use '@nx/js' instead"
          },
          {
            group: ["**/native-bindings", "**/native-bindings.js", ""],
            message:
              "Direct imports from native-bindings.js are not allowed. Import from index.js instead."
          }
        ]
      }
    ]
  },
  override: [
    {
      "files": ["*.ts", "*.tsx", "*.js", "*.jsx"],
      "rules": {
        "@nx/enforce-module-boundaries": [
          "error",
          {
            "enforceBuildableLibDependency": true,
            "checkDynamicDependenciesExceptions": [".*"],
            "allow": [],
            "depConstraints": [
              {
                "sourceTag": "*",
                "onlyDependOnLibsWithTags": ["*"]
              }
            ]
          }
        ]
      }
    }
  ]
};
