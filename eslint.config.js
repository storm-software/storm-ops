const { FlatCompat } = require("@eslint/eslintrc");
const nxEslintPlugin = require("@nx/eslint-plugin");
const eslintPlugin = require("./dist/plugins/eslint");

const js = require("@eslint/js");
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended
});

module.exports = [
  { plugins: { "@nx": nxEslintPlugin, "@storm-software": eslintPlugin } },
  ...compat.config({ parser: "jsonc-eslint-parser" }).map(config => ({
    ...config,
    files: ["**/*.json"],
    rules: {}
  })),
  {
    files: ["**/executors/**/schema.json", "**/generators/**/schema.json"],
    rules: {
      "@nx/workspace/valid-schema-description": "error"
    }
  },
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
  }))
];

//   "root": true,
//   "ignorePatterns": ["**/*.ts"],
//   "parser": "@typescript-eslint/parser",
//   "env": {
//     "node": true
//   },
//   "plugins": ["@nx"],
//   "extends": ["plugin:@nx/react-typescript"],
//   "overrides": [
//     {
//       "files": ["*.json"],
//       "parser": "jsonc-eslint-parser",
//       "rules": {}
//     },
//     {
//       "files": ["**/executors/**/schema.json", "**/generators/**/schema.json"],
//       "rules": {
//         "@nx/workspace/valid-schema-description": "error"
//       }
//     },
//     {
//       "files": ["*.ts", "*.tsx"],
//       "extends": ["plugin:@nx/typescript"],
//       "rules": {}
//     },
//     {
//       "files": ["*.js", "*.jsx"],
//       "extends": ["plugin:@nx/javascript"],
//       "rules": {}
//     },
//     {
//       "files": ["*.spec.ts", "*.spec.tsx", "*.spec.js", "*.spec.jsx"],
//       "env": {
//         "jest": true
//       },
//       "rules": {}
//     },
//     {
//       "files": ["*.ts", "*.tsx", "*.js", "*.jsx"],
//       "rules": {
//         "@nx/enforce-module-boundaries": [
//           "error",
//           {
//             "enforceBuildableLibDependency": true,
//             "checkDynamicDependenciesExceptions": [".*"],
//             "allow": [],
//             "depConstraints": [
//               {
//                 "sourceTag": "*",
//                 "onlyDependOnLibsWithTags": ["*"]
//               }
//             ]
//           }
//         ]
//       }
//     }
//   ]
// }
// ]
