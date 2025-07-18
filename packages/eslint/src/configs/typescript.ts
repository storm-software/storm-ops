import type {
  OptionsComponentExts,
  OptionsFiles,
  OptionsOverrides,
  OptionsProjectType,
  OptionsTypeScriptParserOptions,
  OptionsTypeScriptWithTypes,
  TypedFlatConfigItem
} from "../types";
import {
  GLOB_ASTRO_TS,
  GLOB_MARKDOWN,
  GLOB_TS,
  GLOB_TSX
} from "../utils/constants";
import { findWorkspaceRoot } from "../utils/find-workspace-root";
import { interopDefault, renameRules } from "../utils/helpers";
import { getTsConfigPath } from "../utils/tsconfig-path";

export async function typescript(
  options: OptionsFiles &
    OptionsComponentExts &
    OptionsOverrides &
    OptionsTypeScriptWithTypes &
    OptionsTypeScriptParserOptions &
    OptionsProjectType = {}
): Promise<TypedFlatConfigItem[]> {
  const {
    componentExts = [],
    overrides = {},
    overridesTypeAware = {},
    parserOptions = {},
    typeImports = "always",
    type = "app"
  } = options;

  const files = options.files ?? [
    GLOB_TS,
    GLOB_TSX,
    ...componentExts.map(ext => `**/*.${ext}`)
  ];

  const filesTypeAware = options.filesTypeAware ?? [GLOB_TS, GLOB_TSX];
  const ignoresTypeAware = options.ignoresTypeAware ?? [
    `${GLOB_MARKDOWN}/**`,
    GLOB_ASTRO_TS
  ];

  const workspaceRoot = findWorkspaceRoot();
  const tsconfigPath = getTsConfigPath(options?.tsconfigPath || workspaceRoot);

  const typeAwareRules: TypedFlatConfigItem["rules"] = {
    "dot-notation": "off",
    "no-implied-eval": "off",
    "ts/await-thenable": "error",
    "ts/dot-notation": ["error", { allowKeywords: true }],
    "ts/no-floating-promises": "error",
    "ts/no-for-in-array": "error",
    "ts/no-implied-eval": "error",
    "ts/no-misused-promises": "error",
    "ts/no-unnecessary-type-assertion": "error",
    "ts/no-unsafe-assignment": "off",
    "ts/no-unsafe-argument": "off",
    "ts/no-unsafe-member-access": "off",
    "ts/no-unsafe-call": "error",
    "ts/no-unsafe-return": "off",
    "ts/promise-function-async": "error",
    "ts/restrict-plus-operands": "error",
    "ts/restrict-template-expressions": "error",
    "ts/return-await": ["error", "in-try-catch"],
    "ts/strict-boolean-expressions": "off",
    "ts/switch-exhaustiveness-check": "error",
    "ts/unbound-method": "error"
  };

  const [pluginTs, parserTs] = await Promise.all([
    interopDefault(import("@typescript-eslint/eslint-plugin")),
    interopDefault(import("@typescript-eslint/parser"))
  ] as const);

  function makeParser(
    typeAware: boolean,
    files: string[],
    ignores?: string[]
  ): TypedFlatConfigItem {
    return {
      files,
      ...(ignores ? { ignores } : {}),
      languageOptions: {
        parser: parserTs,
        parserOptions: {
          extraFileExtensions: componentExts.map(ext => `.${ext}`),
          sourceType: "module",
          projectService: true,
          ...(typeAware
            ? {
                projectService: {
                  allowDefaultProject: ["./*.js", "./*.ts"],
                  defaultProject: tsconfigPath
                },
                tsconfigRootDir: workspaceRoot
              }
            : {}),
          ...(parserOptions as any)
        }
      },
      name: `storm/typescript/${typeAware ? "type-aware-parser" : "parser"}`
    };
  }

  return [
    {
      // Install the plugins without globs, so they can be configured separately.
      name: "storm/typescript/setup",
      plugins: {
        ts: pluginTs as any
      }
    },
    // assign type-aware parser for type-aware files and type-unaware parser for the rest
    ...[
      makeParser(false, files),
      makeParser(true, filesTypeAware, ignoresTypeAware)
    ],
    {
      files,
      name: "storm/typescript/rules",
      rules: {
        ...renameRules(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
          pluginTs.configs["eslint-recommended"]?.overrides?.[0]?.rules!,
          { "@typescript-eslint": "ts" }
        ),
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
        ...renameRules(pluginTs.configs.strict?.rules!, {
          "@typescript-eslint": "ts"
        }),

        /*************************************************************
         *
         *   TypeScript Rules - The following rules are specific to the TypeScript plugin
         *
         **************************************************************/

        "ts/naming-convention": [
          "error",
          {
            selector: "typeLike",
            format: ["PascalCase"],
            filter: { regex: "^(__String|[A-Za-z]+_[A-Za-z]+)$", match: false }
          },
          {
            selector: "interface",
            format: ["PascalCase"],
            custom: { regex: "^I[A-Z]", match: false },
            filter: {
              regex: "^I(Arguments|TextWriter|O([A-Z][a-z]+[A-Za-z]*)?)$",
              match: false
            }
          },
          {
            selector: "variable",
            format: ["camelCase", "PascalCase", "UPPER_CASE"],
            leadingUnderscore: "allow",
            filter: {
              regex: "^(_{1,2}filename|_{1,2}dirname|_+|[A-Za-z]+_[A-Za-z]+)$",
              match: false
            }
          },
          {
            selector: "function",
            format: ["camelCase", "PascalCase"],
            leadingUnderscore: "allow",
            filter: { regex: "^[A-Za-z]+_[A-Za-z]+$", match: false }
          },
          {
            selector: "parameter",
            format: ["camelCase"],
            leadingUnderscore: "allow",
            filter: { regex: "^(_+|[A-Za-z]+_[A-Z][a-z]+)$", match: false }
          },
          {
            selector: "method",
            format: ["camelCase", "PascalCase"],
            leadingUnderscore: "allow",
            filter: { regex: "^([0-9]+|[A-Za-z]+_[A-Za-z]+)$", match: false }
          },
          {
            selector: "memberLike",
            format: ["camelCase"],
            leadingUnderscore: "allow",
            filter: { regex: "^([0-9]+|[A-Za-z]+_[A-Za-z]+)$", match: false }
          },
          {
            selector: "enumMember",
            format: ["camelCase", "PascalCase"],
            leadingUnderscore: "allow",
            filter: { regex: "^[A-Za-z]+_[A-Za-z]+$", match: false }
          },
          // eslint-disable-next-line no-restricted-syntax
          { selector: "property", format: null }
        ],
        "ts/no-explicit-any": "off",
        "ts/no-empty-function": "off",
        "ts/no-var-requires": "off",
        "ts/ban-ts-comment": "off",
        "ts/no-empty-interface": "off",
        "ts/explicit-module-boundary-types": "off",
        "ts/explicit-function-return-type": "off",
        "ts/no-unused-vars": [
          "error",
          { args: "none", varsIgnorePattern: "^_" }
        ],
        "ts/prefer-nullish-coalescing": [
          "error",
          {
            ignorePrimitives: {
              string: true
            }
          }
        ],
        "ts/no-restricted-imports": [
          "error",
          {
            patterns: [
              {
                group: ["nx/src/plugins/js*"],
                message:
                  "Imports from 'nx/src/plugins/js' are not allowed. Use '@nx/js' instead"
              },
              {
                group: ["**/native-bindings", "**/native-bindings.js"],
                message:
                  "Direct imports from native-bindings.js are not allowed. Import from index.js instead."
              },
              {
                group: ["create-storm-workspace"],
                message:
                  "Direct imports from `create-storm-workspace` are not allowed. Instead install this package globally (example: 'npm i create-storm-workspace -g')."
              },
              {
                group: ["create-nx-workspace"],
                message:
                  "Direct imports from `create-nx-workspace` are not allowed. Instead install this package globally (example: 'npm i create-nx-workspace -g')."
              }
            ]
          }
        ],
        "no-dupe-class-members": "off",
        "no-redeclare": "off",
        "no-use-before-define": "off",
        "no-useless-constructor": "off",
        "ts/consistent-type-definitions": ["error", "interface"],
        "ts/consistent-type-imports":
          typeImports === "off"
            ? "off"
            : [
                typeImports === "optional" ? "warn" : "error",
                {
                  disallowTypeAnnotations: typeImports === "never",
                  fixStyle: "separate-type-imports",
                  prefer: "type-imports"
                }
              ],
        "ts/method-signature-style": ["error", "property"], // https://www.totaltypescript.com/method-shorthand-syntax-considered-harmful
        "ts/no-dupe-class-members": "error",
        "ts/no-dynamic-delete": "off",
        "ts/no-empty-object-type": ["error", { allowInterfaces: "always" }],
        "ts/no-extraneous-class": "off",
        "ts/no-import-type-side-effects": "error",
        "ts/no-invalid-void-type": "off",
        "ts/no-non-null-assertion": "off",
        "ts/no-non-null-asserted-optional-chain": "error",
        "ts/no-redeclare": ["error", { builtinGlobals: false }],
        "ts/no-require-imports": "error",
        "ts/no-unused-expressions": [
          "error",
          {
            allowShortCircuit: true,
            allowTaggedTemplates: true,
            allowTernary: true
          }
        ],
        "ts/no-use-before-define": [
          "error",
          { classes: false, functions: false, variables: true }
        ],
        "ts/no-useless-constructor": "off",
        "ts/no-wrapper-object-types": "error",
        "ts/triple-slash-reference": "off",
        "ts/unified-signatures": "off",

        ...(type === "lib"
          ? {
              "ts/explicit-function-return-type": [
                "error",
                {
                  allowExpressions: true,
                  allowHigherOrderFunctions: true,
                  allowIIFEs: true
                }
              ]
            }
          : {}),

        ...overrides
      }
    },
    ...[
      {
        files: filesTypeAware,
        ignores: ignoresTypeAware,
        name: "storm/typescript/rules-type-aware",
        rules: {
          ...typeAwareRules,
          ...overridesTypeAware
        }
      }
    ]
  ].filter(Boolean) as TypedFlatConfigItem[];
}
