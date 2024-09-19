/* eslint-disable */
/* prettier-ignore */
import type { Linter } from 'eslint'

export interface RuleOptions {
  /**
   * CSpell spellchecker
   */
  "@cspell/spellchecker"?: Linter.RuleEntry<CspellSpellchecker>;
  /**
   * Checks dependencies in project's package.json for version mismatches
   * @see https://github.com/nrwl/nx/blob/19.6.4/docs/generated/packages/eslint-plugin/documents/dependency-checks.md
   */
  "@nx/dependency-checks"?: Linter.RuleEntry<NxDependencyChecks>;
  /**
   * Ensure that module boundaries are respected within the monorepo
   * @see https://github.com/nrwl/nx/blob/19.6.4/docs/generated/packages/eslint-plugin/documents/enforce-module-boundaries.md
   */
  "@nx/enforce-module-boundaries"?: Linter.RuleEntry<NxEnforceModuleBoundaries>;
  /**
   * Checks common nx-plugin configuration files for validity
   */
  "@nx/nx-plugin-checks"?: Linter.RuleEntry<NxNxPluginChecks>;
  /**
   * Ensures the file has a Storm Software banner
   * @see https://docs.stormsoftware.com/eslint/rules/banner
   */
  "banner/banner"?: Linter.RuleEntry<BannerBanner>;
  /**
   * @see https://github.com/prettier/eslint-plugin-prettier#options
   */
  "prettier/prettier"?: Linter.RuleEntry<PrettierPrettier>;
  /**
   * Validates that TypeScript documentation comments conform to the TSDoc standard
   * @see https://tsdoc.org/pages/packages/eslint-plugin-tsdoc
   */
  "tsdoc/syntax"?: Linter.RuleEntry<[]>;
  /**
   * require or disallow block style mappings.
   * @see https://ota-meshi.github.io/eslint-plugin-yml/rules/block-mapping.html
   */
  "yml/block-mapping"?: Linter.RuleEntry<YmlBlockMapping>;
  /**
   * enforce consistent line breaks after `:` indicator
   * @see https://ota-meshi.github.io/eslint-plugin-yml/rules/block-mapping-colon-indicator-newline.html
   */
  "yml/block-mapping-colon-indicator-newline"?: Linter.RuleEntry<YmlBlockMappingColonIndicatorNewline>;
  /**
   * enforce consistent line breaks after `?` indicator
   * @see https://ota-meshi.github.io/eslint-plugin-yml/rules/block-mapping-question-indicator-newline.html
   */
  "yml/block-mapping-question-indicator-newline"?: Linter.RuleEntry<YmlBlockMappingQuestionIndicatorNewline>;
  /**
   * require or disallow block style sequences.
   * @see https://ota-meshi.github.io/eslint-plugin-yml/rules/block-sequence.html
   */
  "yml/block-sequence"?: Linter.RuleEntry<YmlBlockSequence>;
  /**
   * enforce consistent line breaks after `-` indicator
   * @see https://ota-meshi.github.io/eslint-plugin-yml/rules/block-sequence-hyphen-indicator-newline.html
   */
  "yml/block-sequence-hyphen-indicator-newline"?: Linter.RuleEntry<YmlBlockSequenceHyphenIndicatorNewline>;
  /**
   * enforce YAML file extension
   * @see https://ota-meshi.github.io/eslint-plugin-yml/rules/file-extension.html
   */
  "yml/file-extension"?: Linter.RuleEntry<YmlFileExtension>;
  /**
   * enforce consistent line breaks inside braces
   * @see https://ota-meshi.github.io/eslint-plugin-yml/rules/flow-mapping-curly-newline.html
   */
  "yml/flow-mapping-curly-newline"?: Linter.RuleEntry<YmlFlowMappingCurlyNewline>;
  /**
   * enforce consistent spacing inside braces
   * @see https://ota-meshi.github.io/eslint-plugin-yml/rules/flow-mapping-curly-spacing.html
   */
  "yml/flow-mapping-curly-spacing"?: Linter.RuleEntry<YmlFlowMappingCurlySpacing>;
  /**
   * enforce linebreaks after opening and before closing flow sequence brackets
   * @see https://ota-meshi.github.io/eslint-plugin-yml/rules/flow-sequence-bracket-newline.html
   */
  "yml/flow-sequence-bracket-newline"?: Linter.RuleEntry<YmlFlowSequenceBracketNewline>;
  /**
   * enforce consistent spacing inside flow sequence brackets
   * @see https://ota-meshi.github.io/eslint-plugin-yml/rules/flow-sequence-bracket-spacing.html
   */
  "yml/flow-sequence-bracket-spacing"?: Linter.RuleEntry<YmlFlowSequenceBracketSpacing>;
  /**
   * enforce consistent indentation
   * @see https://ota-meshi.github.io/eslint-plugin-yml/rules/indent.html
   */
  "yml/indent"?: Linter.RuleEntry<YmlIndent>;
  /**
   * enforce naming convention to key names
   * @see https://ota-meshi.github.io/eslint-plugin-yml/rules/key-name-casing.html
   */
  "yml/key-name-casing"?: Linter.RuleEntry<YmlKeyNameCasing>;
  /**
   * enforce consistent spacing between keys and values in mapping pairs
   * @see https://ota-meshi.github.io/eslint-plugin-yml/rules/key-spacing.html
   */
  "yml/key-spacing"?: Linter.RuleEntry<YmlKeySpacing>;
  /**
   * disallow empty document
   * @see https://ota-meshi.github.io/eslint-plugin-yml/rules/no-empty-document.html
   */
  "yml/no-empty-document"?: Linter.RuleEntry<[]>;
  /**
   * disallow empty mapping keys
   * @see https://ota-meshi.github.io/eslint-plugin-yml/rules/no-empty-key.html
   */
  "yml/no-empty-key"?: Linter.RuleEntry<[]>;
  /**
   * disallow empty mapping values
   * @see https://ota-meshi.github.io/eslint-plugin-yml/rules/no-empty-mapping-value.html
   */
  "yml/no-empty-mapping-value"?: Linter.RuleEntry<[]>;
  /**
   * disallow empty sequence entries
   * @see https://ota-meshi.github.io/eslint-plugin-yml/rules/no-empty-sequence-entry.html
   */
  "yml/no-empty-sequence-entry"?: Linter.RuleEntry<[]>;
  /**
   * disallow irregular whitespace
   * @see https://ota-meshi.github.io/eslint-plugin-yml/rules/no-irregular-whitespace.html
   */
  "yml/no-irregular-whitespace"?: Linter.RuleEntry<YmlNoIrregularWhitespace>;
  /**
   * disallow multiple empty lines
   * @see https://ota-meshi.github.io/eslint-plugin-yml/rules/no-multiple-empty-lines.html
   */
  "yml/no-multiple-empty-lines"?: Linter.RuleEntry<YmlNoMultipleEmptyLines>;
  /**
   * disallow tabs for indentation.
   * @see https://ota-meshi.github.io/eslint-plugin-yml/rules/no-tab-indent.html
   */
  "yml/no-tab-indent"?: Linter.RuleEntry<[]>;
  /**
   * disallow trailing zeros for floats
   * @see https://ota-meshi.github.io/eslint-plugin-yml/rules/no-trailing-zeros.html
   */
  "yml/no-trailing-zeros"?: Linter.RuleEntry<[]>;
  /**
   * require or disallow plain style scalar.
   * @see https://ota-meshi.github.io/eslint-plugin-yml/rules/plain-scalar.html
   */
  "yml/plain-scalar"?: Linter.RuleEntry<YmlPlainScalar>;
  /**
   * enforce the consistent use of either double, or single quotes
   * @see https://ota-meshi.github.io/eslint-plugin-yml/rules/quotes.html
   */
  "yml/quotes"?: Linter.RuleEntry<YmlQuotes>;
  /**
   * disallow mapping keys other than strings
   * @see https://ota-meshi.github.io/eslint-plugin-yml/rules/require-string-key.html
   */
  "yml/require-string-key"?: Linter.RuleEntry<[]>;
  /**
   * require mapping keys to be sorted
   * @see https://ota-meshi.github.io/eslint-plugin-yml/rules/sort-keys.html
   */
  "yml/sort-keys"?: Linter.RuleEntry<YmlSortKeys>;
  /**
   * require sequence values to be sorted
   * @see https://ota-meshi.github.io/eslint-plugin-yml/rules/sort-sequence-values.html
   */
  "yml/sort-sequence-values"?: Linter.RuleEntry<YmlSortSequenceValues>;
  /**
   * enforce consistent spacing after the `#` in a comment
   * @see https://ota-meshi.github.io/eslint-plugin-yml/rules/spaced-comment.html
   */
  "yml/spaced-comment"?: Linter.RuleEntry<YmlSpacedComment>;
  /**
   * disallow parsing errors in Vue custom blocks
   * @see https://ota-meshi.github.io/eslint-plugin-yml/rules/vue-custom-block/no-parsing-error.html
   */
  "yml/vue-custom-block/no-parsing-error"?: Linter.RuleEntry<[]>;
}

/* ======= Declarations ======= */
// ----- @cspell/spellchecker -----
type CspellSpellchecker =
  | []
  | [
      {
        autoFix: boolean;

        checkComments?: boolean;

        checkIdentifiers?: boolean;

        checkJSXText?: boolean;

        checkScope?: [string, boolean][];

        checkStringTemplates?: boolean;

        checkStrings?: boolean;

        configFile?: string;

        cspell?: {
          allowCompoundWords?: boolean;

          dictionaries?: (string | string)[];
          dictionaryDefinitions?: {
            description?: string;

            name: string;

            noSuggest?: boolean;

            path: string;

            repMap?: [string, string][];

            type?: "S" | "W" | "C" | "T";

            useCompounds?: boolean;
          }[];

          enabled?: boolean;

          flagWords?: string[];

          ignoreRegExpList?: (
            | string
            | string
            | (
                | "Base64"
                | "Base64MultiLine"
                | "Base64SingleLine"
                | "CStyleComment"
                | "CStyleHexValue"
                | "CSSHexValue"
                | "CommitHash"
                | "CommitHashLink"
                | "Email"
                | "EscapeCharacters"
                | "HexValues"
                | "href"
                | "PhpHereDoc"
                | "PublicKey"
                | "RsaCert"
                | "SshRsa"
                | "SHA"
                | "HashStrings"
                | "SpellCheckerDisable"
                | "SpellCheckerDisableBlock"
                | "SpellCheckerDisableLine"
                | "SpellCheckerDisableNext"
                | "SpellCheckerIgnoreInDocSetting"
                | "string"
                | "UnicodeRef"
                | "Urls"
                | "UUID"
                | "Everything"
              )
          )[];

          ignoreWords?: string[];

          import?: string | string[];

          includeRegExpList?: (
            | string
            | string
            | (
                | "Base64"
                | "Base64MultiLine"
                | "Base64SingleLine"
                | "CStyleComment"
                | "CStyleHexValue"
                | "CSSHexValue"
                | "CommitHash"
                | "CommitHashLink"
                | "Email"
                | "EscapeCharacters"
                | "HexValues"
                | "href"
                | "PhpHereDoc"
                | "PublicKey"
                | "RsaCert"
                | "SshRsa"
                | "SHA"
                | "HashStrings"
                | "SpellCheckerDisable"
                | "SpellCheckerDisableBlock"
                | "SpellCheckerDisableLine"
                | "SpellCheckerDisableNext"
                | "SpellCheckerIgnoreInDocSetting"
                | "string"
                | "UnicodeRef"
                | "Urls"
                | "UUID"
                | "Everything"
              )
          )[];

          language?: string;

          words?: string[];
        };

        cspellOptionsRoot?: string | string;

        customWordListFile?:
          | string
          | {
              path: string;
            };

        debugMode?: boolean;

        generateSuggestions: boolean;

        ignoreImportProperties?: boolean;

        ignoreImports?: boolean;

        numSuggestions: number;
      }
    ];
// ----- @nx/dependency-checks -----
type NxDependencyChecks =
  | []
  | [
      {
        buildTargets?: string[];
        ignoredDependencies?: string[];
        ignoredFiles?: string[];
        checkMissingDependencies?: boolean;
        checkObsoleteDependencies?: boolean;
        checkVersionMismatches?: boolean;
        includeTransitiveDependencies?: boolean;
        useLocalPathsForWorkspaceDependencies?: boolean;
      }
    ];
// ----- @nx/enforce-module-boundaries -----
type NxEnforceModuleBoundaries =
  | []
  | [
      {
        enforceBuildableLibDependency?: boolean;
        allowCircularSelfDependency?: boolean;
        checkDynamicDependenciesExceptions?: string[];
        banTransitiveDependencies?: boolean;
        checkNestedExternalImports?: boolean;
        allow?: string[];
        buildTargets?: string[];
        depConstraints?: (
          | {
              sourceTag?: string;
              onlyDependOnLibsWithTags?: string[];
              allowedExternalImports?: string[];
              bannedExternalImports?: string[];
              notDependOnLibsWithTags?: string[];
            }
          | {
              allSourceTags?: [string, string, ...string[]];
              onlyDependOnLibsWithTags?: string[];
              allowedExternalImports?: string[];
              bannedExternalImports?: string[];
              notDependOnLibsWithTags?: string[];
            }
        )[];
      }
    ];
// ----- @nx/nx-plugin-checks -----
type NxNxPluginChecks =
  | []
  | [
      {
        generatorsJson?: string;

        executorsJson?: string;

        migrationsJson?: string;

        packageJson?: string;

        allowedVersionStrings?: string[];
      }
    ];
// ----- banner/banner -----
type BannerBanner =
  | []
  | [
      {
        banner?: string;

        repositoryName?: string;

        commentType?: string;

        numNewlines?: number;
      }
    ];
// ----- prettier/prettier -----
type PrettierPrettier =
  | []
  | [
      {
        [k: string]: unknown | undefined;
      }
    ]
  | [
      {
        [k: string]: unknown | undefined;
      },
      {
        usePrettierrc?: boolean;
        fileInfoOptions?: {
          [k: string]: unknown | undefined;
        };
        [k: string]: unknown | undefined;
      }
    ];
// ----- yml/block-mapping -----
type YmlBlockMapping =
  | []
  | [
      | ("always" | "never")
      | {
          singleline?: "always" | "never" | "ignore";
          multiline?: "always" | "never" | "ignore";
        }
    ];
// ----- yml/block-mapping-colon-indicator-newline -----
type YmlBlockMappingColonIndicatorNewline = [] | ["always" | "never"];
// ----- yml/block-mapping-question-indicator-newline -----
type YmlBlockMappingQuestionIndicatorNewline = [] | ["always" | "never"];
// ----- yml/block-sequence -----
type YmlBlockSequence =
  | []
  | [
      | ("always" | "never")
      | {
          singleline?: "always" | "never" | "ignore";
          multiline?: "always" | "never" | "ignore";
        }
    ];
// ----- yml/block-sequence-hyphen-indicator-newline -----
type YmlBlockSequenceHyphenIndicatorNewline =
  | []
  | ["always" | "never"]
  | [
      "always" | "never",
      {
        nestedHyphen?: "always" | "never";
        blockMapping?: "always" | "never";
      }
    ];
// ----- yml/file-extension -----
type YmlFileExtension =
  | []
  | [
      {
        extension?: "yaml" | "yml";
        caseSensitive?: boolean;
      }
    ];
// ----- yml/flow-mapping-curly-newline -----
type YmlFlowMappingCurlyNewline =
  | []
  | [
      | ("always" | "never")
      | {
          multiline?: boolean;
          minProperties?: number;
          consistent?: boolean;
        }
    ];
// ----- yml/flow-mapping-curly-spacing -----
type YmlFlowMappingCurlySpacing =
  | []
  | ["always" | "never"]
  | [
      "always" | "never",
      {
        arraysInObjects?: boolean;
        objectsInObjects?: boolean;
      }
    ];
// ----- yml/flow-sequence-bracket-newline -----
type YmlFlowSequenceBracketNewline =
  | []
  | [
      | ("always" | "never" | "consistent")
      | {
          multiline?: boolean;
          minItems?: number | null;
        }
    ];
// ----- yml/flow-sequence-bracket-spacing -----
type YmlFlowSequenceBracketSpacing =
  | []
  | ["always" | "never"]
  | [
      "always" | "never",
      {
        singleValue?: boolean;
        objectsInArrays?: boolean;
        arraysInArrays?: boolean;
      }
    ];
// ----- yml/indent -----
type YmlIndent =
  | []
  | [number]
  | [
      number,
      {
        indentBlockSequences?: boolean;
        indicatorValueIndent?: number;
      }
    ];
// ----- yml/key-name-casing -----
type YmlKeyNameCasing =
  | []
  | [
      {
        camelCase?: boolean;
        PascalCase?: boolean;
        SCREAMING_SNAKE_CASE?: boolean;
        "kebab-case"?: boolean;
        snake_case?: boolean;
        ignores?: string[];
      }
    ];
// ----- yml/key-spacing -----
type YmlKeySpacing =
  | []
  | [
      | {
          align?:
            | ("colon" | "value")
            | {
                on?: "colon" | "value";
                mode?: "strict" | "minimum";
                beforeColon?: boolean;
                afterColon?: boolean;
              };
          mode?: "strict" | "minimum";
          beforeColon?: boolean;
          afterColon?: boolean;
        }
      | {
          singleLine?: {
            mode?: "strict" | "minimum";
            beforeColon?: boolean;
            afterColon?: boolean;
          };
          multiLine?: {
            align?:
              | ("colon" | "value")
              | {
                  on?: "colon" | "value";
                  mode?: "strict" | "minimum";
                  beforeColon?: boolean;
                  afterColon?: boolean;
                };
            mode?: "strict" | "minimum";
            beforeColon?: boolean;
            afterColon?: boolean;
          };
        }
      | {
          singleLine?: {
            mode?: "strict" | "minimum";
            beforeColon?: boolean;
            afterColon?: boolean;
          };
          multiLine?: {
            mode?: "strict" | "minimum";
            beforeColon?: boolean;
            afterColon?: boolean;
          };
          align?: {
            on?: "colon" | "value";
            mode?: "strict" | "minimum";
            beforeColon?: boolean;
            afterColon?: boolean;
          };
        }
    ];
// ----- yml/no-irregular-whitespace -----
type YmlNoIrregularWhitespace =
  | []
  | [
      {
        skipComments?: boolean;
        skipQuotedScalars?: boolean;
      }
    ];
// ----- yml/no-multiple-empty-lines -----
type YmlNoMultipleEmptyLines =
  | []
  | [
      {
        max: number;
        maxEOF?: number;
        maxBOF?: number;
      }
    ];
// ----- yml/plain-scalar -----
type YmlPlainScalar =
  | []
  | ["always" | "never"]
  | [
      "always" | "never",
      {
        ignorePatterns?: string[];
      }
    ];
// ----- yml/quotes -----
type YmlQuotes =
  | []
  | [
      {
        prefer?: "double" | "single";
        avoidEscape?: boolean;
      }
    ];
// ----- yml/sort-keys -----
type YmlSortKeys =
  | [
      {
        pathPattern: string;
        hasProperties?: string[];
        order:
          | (
              | string
              | {
                  keyPattern?: string;
                  order?: {
                    type?: "asc" | "desc";
                    caseSensitive?: boolean;
                    natural?: boolean;
                  };
                }
            )[]
          | {
              type?: "asc" | "desc";
              caseSensitive?: boolean;
              natural?: boolean;
            };
        minKeys?: number;
        allowLineSeparatedGroups?: boolean;
      },
      ...{
        pathPattern: string;
        hasProperties?: string[];
        order:
          | (
              | string
              | {
                  keyPattern?: string;
                  order?: {
                    type?: "asc" | "desc";
                    caseSensitive?: boolean;
                    natural?: boolean;
                  };
                }
            )[]
          | {
              type?: "asc" | "desc";
              caseSensitive?: boolean;
              natural?: boolean;
            };
        minKeys?: number;
        allowLineSeparatedGroups?: boolean;
      }[]
    ]
  | []
  | ["asc" | "desc"]
  | [
      "asc" | "desc",
      {
        caseSensitive?: boolean;
        natural?: boolean;
        minKeys?: number;
        allowLineSeparatedGroups?: boolean;
      }
    ];
// ----- yml/sort-sequence-values -----
type YmlSortSequenceValues = [
  {
    pathPattern: string;
    order:
      | (
          | string
          | {
              valuePattern?: string;
              order?: {
                type?: "asc" | "desc";
                caseSensitive?: boolean;
                natural?: boolean;
              };
            }
        )[]
      | {
          type?: "asc" | "desc";
          caseSensitive?: boolean;
          natural?: boolean;
        };
    minValues?: number;
  },
  ...{
    pathPattern: string;
    order:
      | (
          | string
          | {
              valuePattern?: string;
              order?: {
                type?: "asc" | "desc";
                caseSensitive?: boolean;
                natural?: boolean;
              };
            }
        )[]
      | {
          type?: "asc" | "desc";
          caseSensitive?: boolean;
          natural?: boolean;
        };
    minValues?: number;
  }[]
];
// ----- yml/spaced-comment -----
type YmlSpacedComment =
  | []
  | ["always" | "never"]
  | [
      "always" | "never",
      {
        exceptions?: string[];
        markers?: string[];
      }
    ];
