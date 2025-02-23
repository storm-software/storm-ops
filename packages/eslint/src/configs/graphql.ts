import type { OptionsGraphQL, TypedFlatConfigItem } from "../types";
import { ensurePackages, interopDefault } from "../utils/helpers";

export async function graphql(
  options: OptionsGraphQL = {}
): Promise<TypedFlatConfigItem[]> {
  const {
    relay = true,
    operations = true,
    schema = true,
    overrides = {}
  } = options;

  await ensurePackages([
    "@graphql-eslint/eslint-plugin",
    "eslint-plugin-relay"
  ]);

  const [pluginGraphQL, pluginRelay] = await Promise.all([
    interopDefault(import("@graphql-eslint/eslint-plugin")),
    interopDefault(import("eslint-plugin-relay"))
  ] as const);

  return [
    {
      name: "storm/graphql/setup",
      files: ["**/*.graphql", "**/*.gql"],
      languageOptions: {
        parser: pluginGraphQL.parser
      },
      plugins: {
        "@graphql-eslint": pluginGraphQL
      }
    },
    {
      name: "storm/graphql/rules",
      plugins: {
        graphql: pluginGraphQL
      },
      rules: {
        ...(schema
          ? {
              "@graphql-eslint/description-style": "error",
              "@graphql-eslint/known-argument-names": "error",
              "@graphql-eslint/known-directives": "error",
              "@graphql-eslint/known-type-names": "error",
              "@graphql-eslint/lone-schema-definition": "error",
              "@graphql-eslint/naming-convention": [
                "error",
                {
                  types: "PascalCase",
                  FieldDefinition: "camelCase",
                  InputValueDefinition: "camelCase",
                  Argument: "camelCase",
                  DirectiveDefinition: "camelCase",
                  EnumValueDefinition: "UPPER_CASE",
                  "FieldDefinition[parent.name.value=Query]": {
                    forbiddenPrefixes: ["query", "get"],
                    forbiddenSuffixes: ["Query"]
                  },
                  "FieldDefinition[parent.name.value=Mutation]": {
                    forbiddenPrefixes: ["mutation"],
                    forbiddenSuffixes: ["Mutation"]
                  },
                  "FieldDefinition[parent.name.value=Subscription]": {
                    forbiddenPrefixes: ["subscription"],
                    forbiddenSuffixes: ["Subscription"]
                  },
                  "EnumTypeDefinition,EnumTypeExtension": {
                    forbiddenPrefixes: ["Enum"],
                    forbiddenSuffixes: ["Enum"]
                  },
                  "InterfaceTypeDefinition,InterfaceTypeExtension": {
                    forbiddenPrefixes: ["Interface"],
                    forbiddenSuffixes: ["Interface"]
                  },
                  "UnionTypeDefinition,UnionTypeExtension": {
                    forbiddenPrefixes: ["Union"],
                    forbiddenSuffixes: ["Union"]
                  },
                  "ObjectTypeDefinition,ObjectTypeExtension": {
                    forbiddenPrefixes: ["Type"],
                    forbiddenSuffixes: ["Type"]
                  }
                }
              ],
              "@graphql-eslint/no-hashtag-description": "error",
              "@graphql-eslint/no-typename-prefix": "error",
              "@graphql-eslint/no-unreachable-types": "error",
              "@graphql-eslint/possible-type-extension": "error",
              "@graphql-eslint/provided-required-arguments": "error",
              "@graphql-eslint/require-deprecation-reason": "error",
              "@graphql-eslint/require-description": [
                "error",
                { types: true, DirectiveDefinition: true, rootField: true }
              ],
              "@graphql-eslint/strict-id-in-types": "error",
              "@graphql-eslint/unique-directive-names": "error",
              "@graphql-eslint/unique-directive-names-per-location": "error",
              "@graphql-eslint/unique-enum-value-names": "error",
              "@graphql-eslint/unique-field-definition-names": "error",
              "@graphql-eslint/unique-operation-types": "error",
              "@graphql-eslint/unique-type-names": "error"
            }
          : {}),
        ...(operations
          ? {
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
                    forbiddenPrefixes: [
                      "Query",
                      "Mutation",
                      "Subscription",
                      "Get"
                    ],
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
              "@graphql-eslint/require-selections": "error",
              "@graphql-eslint/scalar-leafs": "error",
              "@graphql-eslint/selection-set-depth": ["error", { maxDepth: 7 }],
              "@graphql-eslint/unique-argument-names": "error",
              "@graphql-eslint/unique-directive-names-per-location": "error",
              "@graphql-eslint/unique-fragment-name": "error",
              "@graphql-eslint/unique-input-field-names": "error",
              "@graphql-eslint/unique-operation-name": "error",
              "@graphql-eslint/unique-variable-names": "error",
              "@graphql-eslint/value-literals-of-correct-type": "error",
              "@graphql-eslint/variables-are-input-types": "error",
              "@graphql-eslint/variables-in-allowed-position": "error"
            }
          : {}),

        ...overrides
      }
    },
    relay
      ? {
          name: "storm/graphql/relay",
          plugins: { relay: pluginRelay },
          rules: {
            // errors
            "relay/graphql-syntax": "error",
            "relay/graphql-naming": "error",

            // warnings
            "relay/compat-uses-vars": "warn",
            "relay/generated-typescript-types": "warn",
            "relay/no-future-added-value": "warn",
            "relay/unused-fields": "warn",
            "relay/must-colocate-fragment-spreads": "warn",
            "relay/function-required-argument": "warn",
            "relay/hook-required-argument": "warn",

            // @graphql-eslint rules
            "@graphql-eslint/relay-arguments": "error",
            "@graphql-eslint/relay-connection-types": "error",
            "@graphql-eslint/relay-edge-types": "error",
            "@graphql-eslint/relay-page-info": "error"
          }
        }
      : {}
  ];
}
