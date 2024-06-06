const { FlatCompat } = require("@eslint/eslintrc");
const nxEslintPlugin = require("@nx/eslint-plugin");
const eslintPluginReact = require("eslint-plugin-react");
const typescriptEslintEslintPlugin = require("@typescript-eslint/eslint-plugin");
const typescriptEslintParser = require("@typescript-eslint/parser");
const js = require("@eslint/js");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended
});

module.exports = [
  ...compat.extends(
    "airbnb",
    "airbnb-typescript",
    "airbnb/hooks",
    "plugin:@typescript-eslint/recommended"
  ),
  {
    plugins: {
      "@nx": nxEslintPlugin,
      "react": eslintPluginReact,
      "@typescript-eslint": typescriptEslintEslintPlugin
    }
  },
  {
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.base.json"
      }
    }
  },
  {
    rules: {
      "react/react-in-jsx-scope": "off",
      "linebreak-style": "error",
      "react/jsx-props-no-spreading": "off",
      "no-console": "error",
      "no-var": "error",
      "react/jsx-sort-props": ["error", { shorthandFirst: true }],
      "@typescript-eslint/no-floating-promises": "off",
      "react/jsx-one-expression-per-line": "off",
      "spaced-comment": ["error", "always"],
      eqeqeq: ["error", "smart"],
      "no-else-return": "error",
      "no-empty-function": "error",
      "react/require-default-props": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/ban-ts-ignore": "off",
      "max-len": ["error", { code: 120 }],
      "consistent-return": "off",
      "array-callback-return": "warn",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/no-loss-of-precision": "off",
      "react/button-has-type": "off",
      "no-plusplus": "off",
      "no-param-reassign": "off",
      "@typescript-eslint/no-misused-promises": [
        2,
        { checksVoidReturn: { attributes: false } }
      ],
      "padding-line-between-statements": [
        "error",
        {
          blankLine: "always",
          prev: "*",
          next: "return"
        },
        {
          blankLine: "always",
          prev: ["const", "let", "import"],
          next: "*"
        },
        {
          blankLine: "any",
          prev: ["import"],
          next: ["import"]
        },
        {
          blankLine: "never",
          prev: ["const", "let"],
          next: ["const", "let"]
        },
        {
          blankLine: "always",
          prev: ["multiline-const", "multiline-let"],
          next: ["*"]
        },
        {
          blankLine: "always",
          prev: ["*"],
          next: ["multiline-const", "multiline-let"]
        },
        {
          blankLine: "always",
          prev: ["*"],
          next: ["if", "switch", "for", "while", "try", "function", "class"]
        },
        {
          blankLine: "always",
          prev: ["if", "switch", "for", "while", "try", "function", "class"],
          next: ["*"]
        },
        {
          blankLine: "never",
          prev: ["case"],
          next: ["case"]
        }
      ],
      "object-curly-spacing": [
        "error",
        "always",
        {
          objectsInObjects: true,
          arraysInObjects: true
        }
      ],
      "array-bracket-spacing": [
        "error",
        "always",
        {
          objectsInArrays: true,
          arraysInArrays: false
        }
      ]
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
    rules: {
      ...config.rules
    }
  })),
  ...compat.config({ extends: ["plugin:@nx/javascript"] }).map(config => ({
    ...config,
    files: ["**/*.js", "**/*.jsx"],
    rules: {
      ...config.rules
    }
  })),
  ...compat.config({ env: { jest: true } }).map(config => ({
    ...config,
    files: ["**/*.spec.ts", "**/*.spec.tsx", "**/*.spec.js", "**/*.spec.jsx"],
    rules: {
      ...config.rules
    }
  }))
];
