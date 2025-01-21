import * as graphqlPlugin from "@graphql-eslint/eslint-plugin";
import type { Linter } from "eslint";
import relayPlugin from "eslint-plugin-relay";
import base from "./base";
import { CODE_FILE } from "./utils/constants";
import { formatConfig } from "./utils/format-config";
import { DEFAULT_IGNORES } from "./utils/ignores";

const config: Linter.FlatConfig[] = [
  ...base,
  graphqlPlugin.flatConfigs["operations-recommended"],
  graphqlPlugin.flatConfigs["schema-recommended"],
  graphqlPlugin.flatConfigs["relay"],
  relayPlugin.configs.recommended,
  {
    files: [CODE_FILE],
    ignores: DEFAULT_IGNORES,
    plugins: {
      "@graphql-eslint": graphqlPlugin,
      "relay": relayPlugin
    },
    languageOptions: {
      parser: graphqlPlugin.parseForESLint
    },
    rules: {
      "@graphql-eslint/relay-arguments": "error",
      "@graphql-eslint/relay-connection-types": "error",
      "@graphql-eslint/relay-edge-types": "error",
      "@graphql-eslint/relay-page-info": "error",
      "@graphql-eslint/executable-definitions": "error",
      "@graphql-eslint/fields-on-correct-type": "error",
      "@graphql-eslint/fragments-on-composite-type": "error",
      "@graphql-eslint/known-argument-names": "error",
      "@graphql-eslint/known-directives": "error",
      "@graphql-eslint/known-fragment-names": "error",
      "@graphql-eslint/known-type-names": "error",
      "@graphql-eslint/lone-anonymous-operation": "error",
      "@graphql-eslint/naming-convention": [
        "error",
        {
          VariableDefinition: "camelCase",
          OperationDefinition: {
            style: "PascalCase",
            forbiddenPrefixes: ["Query", "Mutation", "Subscription", "Get"],
            forbiddenSuffixes: ["Query", "Mutation", "Subscription"]
          },
          FragmentDefinition: {
            style: "PascalCase",
            forbiddenPrefixes: ["Fragment"],
            forbiddenSuffixes: ["Fragment"]
          }
        }
      ],
      "@graphql-eslint/no-anonymous-operations": "error",
      "@graphql-eslint/no-deprecated": "error",
      "@graphql-eslint/no-duplicate-fields": "error",
      "@graphql-eslint/no-fragment-cycles": "error",
      "@graphql-eslint/no-undefined-variables": "error",
      "@graphql-eslint/no-unused-fragments": "error",
      "@graphql-eslint/no-unused-variables": "error",
      "@graphql-eslint/one-field-subscriptions": "error",
      "@graphql-eslint/overlapping-fields-can-be-merged": "error",
      "@graphql-eslint/possible-fragment-spread": "error",
      "@graphql-eslint/provided-required-arguments": "error",
      "@graphql-eslint/require-id-when-available": "error",
      "@graphql-eslint/scalar-leafs": "error",
      "@graphql-eslint/selection-set-depth": ["error", { maxDepth: 7 }],
      "@graphql-eslint/unique-argument-names": "error",
      "@graphql-eslint/unique-directive-names-per-location": "error",
      "@graphql-eslint/unique-input-field-names": "error",
      "@graphql-eslint/unique-variable-names": "error",
      "@graphql-eslint/value-literals-of-correct-type": "error",
      "@graphql-eslint/variables-are-input-types": "error",
      "@graphql-eslint/variables-in-allowed-position": "error",
      "relay/generated-flow-types": "off"
    }
  },
  {
    files: ["**/*.graphql", "**/*.gql"],
    ignores: DEFAULT_IGNORES,
    plugins: {
      "@graphql-eslint": graphqlPlugin,
      "relay": relayPlugin
    },
    processor: graphqlPlugin.processors.graphql,
    rules: {
      "@graphql-eslint/relay-arguments": "error",
      "@graphql-eslint/relay-connection-types": "error",
      "@graphql-eslint/relay-edge-types": "error",
      "@graphql-eslint/relay-page-info": "error",
      "@graphql-eslint/executable-definitions": "error",
      "@graphql-eslint/fields-on-correct-type": "error",
      "@graphql-eslint/fragments-on-composite-type": "error",
      "@graphql-eslint/known-argument-names": "error",
      "@graphql-eslint/known-directives": "error",
      "@graphql-eslint/known-fragment-names": "error",
      "@graphql-eslint/known-type-names": "error",
      "@graphql-eslint/lone-anonymous-operation": "error",
      "@graphql-eslint/naming-convention": [
        "error",
        {
          VariableDefinition: "camelCase",
          OperationDefinition: {
            style: "PascalCase",
            forbiddenPrefixes: ["Query", "Mutation", "Subscription", "Get"],
            forbiddenSuffixes: ["Query", "Mutation", "Subscription"]
          },
          FragmentDefinition: {
            style: "PascalCase",
            forbiddenPrefixes: ["Fragment"],
            forbiddenSuffixes: ["Fragment"]
          }
        }
      ],
      "@graphql-eslint/no-anonymous-operations": "error",
      "@graphql-eslint/no-deprecated": "error",
      "@graphql-eslint/no-duplicate-fields": "error",
      "@graphql-eslint/no-fragment-cycles": "error",
      "@graphql-eslint/no-undefined-variables": "error",
      "@graphql-eslint/no-unused-fragments": "error",
      "@graphql-eslint/no-unused-variables": "error",
      "@graphql-eslint/one-field-subscriptions": "error",
      "@graphql-eslint/overlapping-fields-can-be-merged": "error",
      "@graphql-eslint/possible-fragment-spread": "error",
      "@graphql-eslint/provided-required-arguments": "error",
      "@graphql-eslint/require-id-when-available": "error",
      "@graphql-eslint/scalar-leafs": "error",
      "@graphql-eslint/selection-set-depth": ["error", { maxDepth: 7 }],
      "@graphql-eslint/unique-argument-names": "error",
      "@graphql-eslint/unique-directive-names-per-location": "error",
      "@graphql-eslint/unique-input-field-names": "error",
      "@graphql-eslint/unique-variable-names": "error",
      "@graphql-eslint/value-literals-of-correct-type": "error",
      "@graphql-eslint/variables-are-input-types": "error",
      "@graphql-eslint/variables-in-allowed-position": "error",
      "relay/generated-flow-types": "off"
    }
  }
];

export default formatConfig("GraphQL", config);
