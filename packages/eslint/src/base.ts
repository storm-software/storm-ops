import type { Linter } from "eslint";
import esXPlugin from "eslint-plugin-es-x";
import importPlugin from "eslint-plugin-import";
import nPlugin from "eslint-plugin-n";
import prettierPlugin from "eslint-plugin-prettier";
import promisePlugin from "eslint-plugin-promise";
import sonarjsPlugin from "eslint-plugin-sonarjs";
import { FlatCompat } from "@eslint/eslintrc";
import { findWorkspaceRoot } from "@storm-software/config-tools";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import typescriptEslintParser from "@typescript-eslint/parser";
import importRules from "./rules/import";
import stormRules from "./rules/storm";
import {
  CODE_FILE,
  RESTRICTED_GLOBALS,
  RESTRICTED_MODULES,
  RESTRICTED_SYNTAX,
  TS_FILE
} from "./utils/constants";
import { formatConfig } from "./utils/format-config";
import { ignores } from "./utils/ignores";

const workspaceRoot = findWorkspaceRoot();
// const importCompat = new FlatCompat({
//   baseDirectory: workspaceRoot,
//   recommendedConfig: importPlugin.configs.recommended,
//   ignores
// });
// ...importCompat
// .config({
//   extends: [
//     "plugin:import/errors",
//     "plugin:import/warnings",
//     "plugin:import/typescript",
//     "plugin:import/recommended"
//   ]
// })
// .map(config => ({
//   ...config,
//   files: [CODE_FILE],
//   ignores,
//   rules: {
//     ...config.rules,
//     ...importRules
//   }
// })),

// const jsCompat = new FlatCompat({
//   baseDirectory: workspaceRoot,
//   recommendedConfig: js.configs.recommended,
//   allConfigs: js.configs.all,
//   ignores
// });

const prettierCompat = new FlatCompat({
  baseDirectory: workspaceRoot,
  recommendedConfig: prettierPlugin.configs!.recommended,
  ignores
});

const tsCompat = new FlatCompat({
  baseDirectory: workspaceRoot,
  recommendedConfig: tsPlugin.configs.recommended,
  allConfigs: tsPlugin.configs.all,
  ignores
});

const config: Linter.FlatConfig[] = [
  ...tsCompat
    .extends(
      "plugin:@typescript-eslint/recommended",
      "plugin:@typescript-eslint/stylistic"
    )
    .map(config => ({
      ...config,
      plugins: {
        "@typescript-eslint": tsPlugin
      },
      files: [TS_FILE],
      ignores,
      languageOptions: {
        parser: typescriptEslintParser,
        ecmaVersion: "latest",
        globals: {
          "BigInt": true
        },
        parserOptions: {
          ecmaVersion: "latest",
          project: "./tsconfig.base.json"
        }
      },
      settings: {
        "import/resolver": "node"
      }
    })),
  // ...jsCompat
  //   .config({
  //     plugins: ["import"],
  //     extends: [
  //       "plugin:import/errors",
  //       "plugin:import/warnings",
  //       "plugin:import/typescript",
  //       "plugin:import/recommended"
  //     ]
  //   })
  //   .map(config => ({
  //     ...config,
  //     files: [JS_FILE],
  //     ignores
  //   })),
  ...prettierCompat.extends("plugin:prettier/recommended").map(config => ({
    ...config,
    plugins: {
      prettier: prettierPlugin
    },
    files: [CODE_FILE],
    ignores
  })),
  sonarjsPlugin.configs.recommended,
  esXPlugin.configs["flat/restrict-to-es2022"],
  nPlugin.configs["flat/recommended"],
  {
    files: [CODE_FILE],
    ignores,
    languageOptions: {
      parser: typescriptEslintParser,
      ecmaVersion: "latest",
      globals: {
        "BigInt": true
      },
      parserOptions: {
        ecmaVersion: "latest",
        project: "./tsconfig.base.json"
      }
    },
    plugins: {
      import: importPlugin,
      promise: promisePlugin
    },
    rules: {
      // Disallows if statements as the only statement in else blocks
      // https://eslint.org/docs/rules/no-lonely-if
      // "no-lonely-if": "error",
      // Disallows the use of console
      // https://eslint.org/docs/rules/no-console
      "no-console": "error",
      // Requires method and property shorthand syntax for object literals
      // https://eslint.org/docs/rules/object-shorthand
      "object-shorthand": ["error", "always"],
      // Disallows loops with a body that allows only one iteration
      // https://eslint.org/docs/rules/no-unreachable-loop
      "no-unreachable-loop": "error",
      "sonarjs/no-one-iteration-loop": "off", // similar to 'no-unreachable-loop' but reports less cases
      "prefer-arrow-callback": ["error", { allowNamedFunctions: true }],

      "sonarjs/no-unused-collection": "error",
      "sonarjs/no-identical-conditions": "error",
      "sonarjs/no-inverted-boolean-check": "error",
      "sonarjs/no-use-of-empty-return-value": "error",
      "sonarjs/no-gratuitous-expressions": "error",
      "sonarjs/no-nested-switch": "error",
      "sonarjs/no-collapsible-if": "off", // same as 'unicorn/no-lonely-if'

      // Disallows specified syntax
      // https://eslint.org/docs/rules/no-restricted-syntax
      "no-restricted-syntax": ["error", ...RESTRICTED_SYNTAX],
      "no-else-return": ["error", { allowElseIf: false }],
      "promise/no-nesting": "error",

      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_" // allow underscores in destructuring
        }
      ],

      // Disallow shorthand type conversions
      // https://eslint.org/docs/latest/rules/no-implicit-coercion
      "no-implicit-coercion": [
        "error",
        {
          disallowTemplateShorthand: true,
          // in TypeScript `!!` is preferable https://www.typescriptlang.org/docs/handbook/2/narrowing.html#truthiness-narrowing
          boolean: false
        }
      ],
      // Disallow specified modules when loaded by `import` declarations
      // https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-restricted-import.md
      "n/no-restricted-import": ["error", RESTRICTED_MODULES],
      // Disallow specified modules when loaded by require
      // https://github.com/eslint-community/eslint-plugin-n/blob/master/docs/rules/no-restricted-require.md
      "n/no-restricted-require": ["error", RESTRICTED_MODULES],
      "no-restricted-modules": "off", // deprecated in favor of corresponding rules from `eslint-plugin-n`
      // Disallow specified global variables
      // https://eslint.org/docs/latest/rules/no-restricted-globals
      "no-restricted-globals": ["error", ...RESTRICTED_GLOBALS],
      "@typescript-eslint/no-explicit-any": "error",
      "prefer-const": ["error", { destructuring: "all" }],
      "prefer-object-has-own": "error",
      "logical-assignment-operators": [
        "error",
        "always",
        { enforceForIfStatements: true }
      ],
      yoda: "error",
      "promise/no-multiple-resolved": "error",
      "no-unused-expressions": "off",
      "@typescript-eslint/no-unused-expressions": "error",
      "no-negated-condition": "off",
      "no-self-compare": "error",
      eqeqeq: ["error", "always", { null: "ignore" }],
      // 'prefer-destructuring': [ // TODO: Rediscuss later
      //   'error',
      //   {
      //     VariableDeclarator: { array: false, object: true },
      //     AssignmentExpression: { array: true, object: false },
      //   },
      //   { enforceForRenamedProperties: false },
      // ],
      // "require-await": "off",
      // Disallow async functions which have no await expression
      // https://typescript-eslint.io/rules/require-await/
      "@typescript-eslint/require-await": "error",
      // "no-return-await": "off"
      // Enforce consistent returning of awaited values.
      // https://typescript-eslint.io/rules/return-await/
      "@typescript-eslint/return-await": "error",
      ...importRules,
      ...stormRules
    }
  }
];

export default formatConfig("Base", config);
