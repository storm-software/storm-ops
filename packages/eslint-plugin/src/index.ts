import base from "@storm-software/eslint/base";
import graphql from "@storm-software/eslint/graphql";
import javascript from "@storm-software/eslint/javascript";
import jest from "@storm-software/eslint/jest";
import json from "@storm-software/eslint/json";
import mdx from "@storm-software/eslint/mdx";
import next from "@storm-software/eslint/next";
import nx from "@storm-software/eslint/nx";
import react from "@storm-software/eslint/react";
import recommended from "@storm-software/eslint/recommended";
import typescript from "@storm-software/eslint/typescript";
import yml from "@storm-software/eslint/yml";

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
