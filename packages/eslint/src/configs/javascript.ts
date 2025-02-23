import defu from "defu";
import globalsLib from "globals";
import { pluginUnusedImports } from "../plugins";
import type {
  OptionsIsInEditor,
  OptionsJavascript,
  OptionsOverrides,
  TypedFlatConfigItem
} from "../types";
import banner from "../utils/banner-plugin";

export async function javascript(
  options: Partial<OptionsJavascript> &
    OptionsIsInEditor &
    OptionsOverrides = {}
): Promise<TypedFlatConfigItem[]> {
  const {
    isInEditor = false,
    lineEndings = "unix",
    overrides = {},
    name = "",
    globals = {}
  } = options;

  return [
    {
      name: "storm/javascript/setup",
      languageOptions: {
        ecmaVersion: 2022,
        globals: defu(globals, {
          ...globalsLib.browser,
          ...globalsLib.es2021,
          ...globalsLib.node,
          document: "readonly",
          navigator: "readonly",
          window: "readonly"
        }),
        parserOptions: {
          ecmaFeatures: {
            jsx: true
          },
          ecmaVersion: 2022,
          sourceType: "module"
        },
        sourceType: "module"
      },
      linterOptions: {
        reportUnusedDisableDirectives: true
      }
    },
    {
      // Banner
      ...banner.configs?.["recommended"],
      name: "storm/javascript/banner",
      plugins: { banner },
      rules: {
        "banner/banner": [
          "error",
          {
            commentType: "block",
            numNewlines: 1,
            repositoryName: name,
            lineEndings
          }
        ]
      }
    },
    {
      name: "storm/javascript/rules",
      plugins: {
        "unused-imports": pluginUnusedImports
      },
      rules: {
        // disallow use of console
        "no-console": "error",

        // Disallows expressions where the operation doesn't affect the value
        // https://eslint.org/docs/rules/no-constant-binary-expression
        // TODO: semver-major, enable
        "no-constant-binary-expression": "off",

        // disallow use of constant expressions in conditions
        "no-constant-condition": "warn",

        // disallow control characters in regular expressions
        "no-control-regex": "error",

        // disallow use of debugger
        "no-debugger": "warn",

        // disallow duplicate arguments in functions
        "no-dupe-args": "error",

        // Disallow duplicate conditions in if-else-if chains
        // https://eslint.org/docs/rules/no-dupe-else-if
        "no-dupe-else-if": "error",

        // disallow duplicate keys when creating object literals
        "no-dupe-keys": "error",

        // disallow a duplicate case label.
        "no-duplicate-case": "error",

        // disallow empty statements
        "no-empty": "error",

        // disallow the use of empty character classes in regular expressions
        "no-empty-character-class": "error",

        // disallow assigning to the exception in a catch block
        "no-ex-assign": "error",

        // disallow double-negation boolean casts in a boolean context
        // https://eslint.org/docs/rules/no-extra-boolean-cast
        "no-extra-boolean-cast": "error",

        // disallow unnecessary parentheses
        // https://eslint.org/docs/rules/no-extra-parens
        "no-extra-parens": [
          "off",
          "all",
          {
            conditionalAssign: true,
            nestedBinaryExpressions: false,
            returnAssign: false,
            ignoreJSX: "all", // delegate to eslint-plugin-react
            enforceForArrowConditionals: false
          }
        ],

        // disallow unnecessary semicolons
        "no-extra-semi": "error",

        // disallow overwriting functions written as function declarations
        "no-func-assign": "off",

        // https://eslint.org/docs/rules/no-import-assign
        "no-import-assign": "error",

        // disallow function or variable declarations in nested blocks
        "no-inner-declarations": "warn",

        // disallow invalid regular expression strings in the RegExp constructor
        "no-invalid-regexp": "error",

        // disallow irregular whitespace outside of strings and comments
        "no-irregular-whitespace": "error",

        // Disallow Number Literals That Lose Precision
        // https://eslint.org/docs/rules/no-loss-of-precision
        "no-loss-of-precision": "error",

        // Disallow characters which are made with multiple code points in character class syntax
        // https://eslint.org/docs/rules/no-misleading-character-class
        "no-misleading-character-class": "error",

        // disallow the use of object properties of the global object (Math and JSON) as functions
        "no-obj-calls": "error",

        // Disallow new operators with global non-constructor functions
        // https://eslint.org/docs/latest/rules/no-new-native-nonconstructor
        // TODO: semver-major, enable
        "no-new-native-nonconstructor": "off",

        // Disallow returning values from Promise executor functions
        // https://eslint.org/docs/rules/no-promise-executor-return
        "no-promise-executor-return": "error",

        // disallow use of Object.prototypes builtins directly
        // https://eslint.org/docs/rules/no-prototype-builtins
        "no-prototype-builtins": "error",

        // disallow multiple spaces in a regular expression literal
        "no-regex-spaces": "error",

        // Disallow returning values from setters
        // https://eslint.org/docs/rules/no-setter-return
        "no-setter-return": "error",

        // disallow sparse arrays
        "no-sparse-arrays": "error",

        // Disallow template literal placeholder syntax in regular strings
        // https://eslint.org/docs/rules/no-template-curly-in-string
        "no-template-curly-in-string": "error",

        // Avoid code that looks like two expressions but is actually one
        // https://eslint.org/docs/rules/no-unexpected-multiline
        "no-unexpected-multiline": "error",

        // disallow unreachable statements after a return, throw, continue, or break statement
        "no-unreachable": "error",

        // Disallow loops with a body that allows only one iteration
        // https://eslint.org/docs/rules/no-unreachable-loop
        "no-unreachable-loop": [
          "error",
          {
            ignore: [] // WhileStatement, DoWhileStatement, ForStatement, ForInStatement, ForOfStatement
          }
        ],

        // disallow return/throw/break/continue inside finally blocks
        // https://eslint.org/docs/rules/no-unsafe-finally
        "no-unsafe-finally": "error",

        // disallow negating the left operand of relational operators
        // https://eslint.org/docs/rules/no-unsafe-negation
        "no-unsafe-negation": "error",

        // disallow use of optional chaining in contexts where the undefined value is not allowed
        // https://eslint.org/docs/rules/no-unsafe-optional-chaining
        "no-unsafe-optional-chaining": [
          "error",
          { disallowArithmeticOperators: true }
        ],

        // Disallow Unused Private Class Members
        // https://eslint.org/docs/rules/no-unused-private-class-members
        // TODO: enable once eslint 7 is dropped (which is semver-major)
        "no-unused-private-class-members": "off",

        // Disallow useless backreferences in regular expressions
        // https://eslint.org/docs/rules/no-useless-backreference
        "no-useless-backreference": "error",

        // disallow negation of the left operand of an in expression
        // deprecated in favor of no-unsafe-negation
        "no-negated-in-lhs": "off",

        // Disallow assignments that can lead to race conditions due to usage of await or yield
        // https://eslint.org/docs/rules/require-atomic-updates
        // note: not enabled because it is very buggy
        "require-atomic-updates": "off",

        // disallow comparisons with the value NaN
        "use-isnan": "error",

        // ensure JSDoc comments are valid
        // https://eslint.org/docs/rules/valid-jsdoc
        "valid-jsdoc": "off",

        // ensure that the results of typeof are compared against a valid string
        // https://eslint.org/docs/rules/valid-typeof
        "valid-typeof": ["error", { requireStringLiterals: true }],

        /*************************************************************
         *
         *    Stylistic Rules - These rules relate to style guidelines
         *
         **************************************************************/

        // enforce line breaks after opening and before closing array brackets
        // https://eslint.org/docs/rules/array-bracket-newline
        // TODO: enable? semver-major
        "array-bracket-newline": ["off", "consistent"], // object option alternative: { multiline: true, minItems: 3 }

        // enforce line breaks between array elements
        // https://eslint.org/docs/rules/array-element-newline
        // TODO: enable? semver-major
        "array-element-newline": ["off", { multiline: true, minItems: 3 }],

        // enforce spacing inside array brackets
        "array-bracket-spacing": ["error", "never"],

        // enforce spacing inside single-line blocks
        // https://eslint.org/docs/rules/block-spacing
        "block-spacing": ["error", "always"],

        // enforce one true brace style
        "brace-style": ["error", "1tbs", { allowSingleLine: true }],

        // require camel case names
        camelcase: [
          "error",
          { properties: "never", ignoreDestructuring: false }
        ],

        // enforce or disallow capitalization of the first letter of a comment
        // https://eslint.org/docs/rules/capitalized-comments
        "capitalized-comments": [
          "off",
          "never",
          {
            line: {
              ignorePattern: ".*",
              ignoreInlineComments: true,
              ignoreConsecutiveComments: true
            },
            block: {
              ignorePattern: ".*",
              ignoreInlineComments: true,
              ignoreConsecutiveComments: true
            }
          }
        ],

        // require trailing commas in multiline object literals
        "comma-dangle": ["error", "never"],

        // enforce spacing before and after comma
        "comma-spacing": ["error", { before: false, after: true }],

        // enforce one true comma style
        "comma-style": [
          "error",
          "last",
          {
            exceptions: {
              ArrayExpression: false,
              ArrayPattern: false,
              ArrowFunctionExpression: false,
              CallExpression: false,
              FunctionDeclaration: false,
              FunctionExpression: false,
              ImportDeclaration: false,
              ObjectExpression: false,
              ObjectPattern: false,
              VariableDeclaration: false,
              NewExpression: false
            }
          }
        ],

        // disallow padding inside computed properties
        "computed-property-spacing": ["error", "never"],

        // enforces consistent naming when capturing the current execution context
        "consistent-this": "off",

        // enforce newline at the end of file, with no multiple empty lines
        "eol-last": ["error", "always"],

        // https://eslint.org/docs/rules/function-call-argument-newline
        "function-call-argument-newline": ["error", "consistent"],

        // enforce spacing between functions and their invocations
        // https://eslint.org/docs/rules/func-call-spacing
        "func-call-spacing": ["error", "never"],

        // requires function names to match the name of the variable or property to which they are
        // assigned
        // https://eslint.org/docs/rules/func-name-matching
        "func-name-matching": [
          "off",
          "always",
          {
            includeCommonJSModuleExports: false,
            considerPropertyDescriptor: true
          }
        ],

        // require function expressions to have a name
        // https://eslint.org/docs/rules/func-names
        "func-names": "warn",

        // enforces use of function declarations or expressions
        // https://eslint.org/docs/rules/func-style
        // TODO: enable
        "func-style": ["off", "expression"],

        // require line breaks inside function parentheses if there are line breaks between parameters
        // https://eslint.org/docs/rules/function-paren-newline
        "function-paren-newline": "off", // ["error", "multiline-arguments"],

        // disallow specified identifiers
        // https://eslint.org/docs/rules/id-denylist
        "id-denylist": "off",

        // this option enforces minimum and maximum identifier lengths
        // (variable names, property names etc.)
        "id-length": "off",

        // require identifiers to match the provided regular expression
        "id-match": "off",

        // Enforce the location of arrow function bodies with implicit returns
        // https://eslint.org/docs/rules/implicit-arrow-linebreak
        "implicit-arrow-linebreak": "off",

        // this option sets a specific tab width for your code
        // https://eslint.org/docs/rules/indent
        indent: "off", // [
        //   "error",
        //   2,
        //   {
        //     SwitchCase: 1,
        //     VariableDeclarator: 1,
        //     outerIIFEBody: 1,
        //     // MemberExpression: null,
        //     FunctionDeclaration: {
        //       parameters: 1,
        //       body: 1
        //     },
        //     FunctionExpression: {
        //       parameters: 1,
        //       body: 1
        //     },
        //     CallExpression: {
        //       arguments: 1
        //     },
        //     ArrayExpression: 1,
        //     ObjectExpression: 1,
        //     ImportDeclaration: 1,
        //     flatTernaryExpressions: false,
        //     // list derived from https://github.com/benjamn/ast-types/blob/HEAD/def/jsx.js
        //     ignoredNodes: [
        //       "JSXElement",
        //       "JSXElement > *",
        //       "JSXAttribute",
        //       "JSXIdentifier",
        //       "JSXNamespacedName",
        //       "JSXMemberExpression",
        //       "JSXSpreadAttribute",
        //       "JSXExpressionContainer",
        //       "JSXOpeningElement",
        //       "JSXClosingElement",
        //       "JSXFragment",
        //       "JSXOpeningFragment",
        //       "JSXClosingFragment",
        //       "JSXText",
        //       "JSXEmptyExpression",
        //       "JSXSpreadChild"
        //     ],
        //     ignoreComments: false
        //   }
        // ],

        // specify whether double or single quotes should be used in JSX attributes
        // https://eslint.org/docs/rules/jsx-quotes
        "jsx-quotes": ["off", "prefer-double"],

        // enforces spacing between keys and values in object literal properties
        "key-spacing": ["error", { beforeColon: false, afterColon: true }],

        // require a space before & after certain keywords
        "keyword-spacing": [
          "error",
          {
            before: true,
            after: true,
            overrides: {
              return: { after: true },
              throw: { after: true },
              case: { after: true }
            }
          }
        ],

        // enforce position of line comments
        // https://eslint.org/docs/rules/line-comment-position
        // TODO: enable?
        "line-comment-position": [
          "off",
          {
            position: "above",
            ignorePattern: "",
            applyDefaultPatterns: true
          }
        ],

        // disallow mixed 'LF' and 'CRLF' as linebreaks
        // https://eslint.org/docs/rules/linebreak-style
        "linebreak-style": ["error", "unix"],

        // require or disallow an empty line between class members
        // https://eslint.org/docs/rules/lines-between-class-members
        "lines-between-class-members": [
          "error",
          "always",
          { exceptAfterSingleLine: false }
        ],

        // enforces empty lines around comments
        "lines-around-comment": "off",

        // require or disallow newlines around directives
        // https://eslint.org/docs/rules/lines-around-directive
        "lines-around-directive": [
          "error",
          {
            before: "always",
            after: "always"
          }
        ],

        // Require or disallow logical assignment logical operator shorthand
        // https://eslint.org/docs/latest/rules/logical-assignment-operators
        // TODO, semver-major: enable
        "logical-assignment-operators": [
          "off",
          "always",
          {
            enforceForIfStatements: true
          }
        ],

        // specify the maximum depth that blocks can be nested
        "max-depth": ["off", 4],

        // specify the maximum length of a line in your program
        // https://eslint.org/docs/rules/max-len
        "max-len": [
          "error",
          100,
          2,
          {
            ignoreUrls: true,
            ignoreComments: true,
            ignoreRegExpLiterals: true,
            ignoreStrings: true,
            ignoreTemplateLiterals: true
          }
        ],

        // specify the max number of lines in a file
        // https://eslint.org/docs/rules/max-lines
        "max-lines": [
          "off",
          {
            max: 300,
            skipBlankLines: true,
            skipComments: true
          }
        ],

        // enforce a maximum function length
        // https://eslint.org/docs/rules/max-lines-per-function
        "max-lines-per-function": [
          "off",
          {
            max: 50,
            skipBlankLines: true,
            skipComments: true,
            IIFEs: true
          }
        ],

        // specify the maximum depth callbacks can be nested
        "max-nested-callbacks": "off",

        // limits the number of parameters that can be used in the function declaration.
        "max-params": ["off", 3],

        // specify the maximum number of statement allowed in a function
        "max-statements": ["off", 10],

        // restrict the number of statements per line
        // https://eslint.org/docs/rules/max-statements-per-line
        "max-statements-per-line": ["off", { max: 1 }],

        // enforce a particular style for multiline comments
        // https://eslint.org/docs/rules/multiline-comment-style
        "multiline-comment-style": ["off", "starred-block"],

        // require multiline ternary
        // https://eslint.org/docs/rules/multiline-ternary
        // TODO: enable?
        "multiline-ternary": ["off", "never"],

        // require a capital letter for constructors
        "new-cap": [
          "error",
          {
            newIsCap: true,
            newIsCapExceptions: [],
            capIsNew: false,
            capIsNewExceptions: [
              "Immutable.Map",
              "Immutable.Set",
              "Immutable.List"
            ]
          }
        ],

        "no-unused-vars": [
          "error",
          {
            args: "none",
            caughtErrors: "none",
            ignoreRestSiblings: true,
            vars: "all"
          }
        ],

        // disallow the omission of parentheses when invoking a constructor with no arguments
        // https://eslint.org/docs/rules/new-parens
        "new-parens": "error",

        // allow/disallow an empty newline after var statement
        "newline-after-var": "off",

        // Require or disallow padding lines between statements
        // https://eslint.org/docs/rules/padding-line-between-statements
        "padding-line-between-statements": [
          "error",
          { blankLine: "always", prev: ["const", "let", "var"], next: "return" }
        ],

        // enforces new line after each method call in the chain to make it
        // more readable and easy to maintain
        // https://eslint.org/docs/rules/newline-per-chained-call
        "newline-per-chained-call": ["error", { ignoreChainWithDepth: 5 }],

        // disallow use of the Array constructor
        "no-array-constructor": "error",

        // disallow use of bitwise operators
        // https://eslint.org/docs/rules/no-bitwise
        "no-bitwise": "off",

        // disallow use of the continue statement
        // https://eslint.org/docs/rules/no-continue
        "no-continue": "off",

        // disallow comments inline after code
        "no-inline-comments": "off",

        // disallow if as the only statement in an else block
        // https://eslint.org/docs/rules/no-lonely-if
        "no-lonely-if": "error",

        // disallow un-paren'd mixes of different operators
        // https://eslint.org/docs/rules/no-mixed-operators
        "no-mixed-operators": [
          "error",
          {
            // the list of arithmetic groups disallows mixing `%` and `**`
            // with other arithmetic operators.
            groups: [
              ["%", "**"],
              ["%", "+"],
              ["%", "-"],
              ["%", "*"],
              ["%", "/"],
              ["/", "*"],
              ["&", "|", "<<", ">>", ">>>"],
              ["==", "!=", "===", "!=="],
              ["&&", "||"]
            ],
            allowSamePrecedence: false
          }
        ],

        // disallow mixed spaces and tabs for indentation
        "no-mixed-spaces-and-tabs": "error",

        // disallow use of chained assignment expressions
        // https://eslint.org/docs/rules/no-multi-assign
        "no-multi-assign": ["error"],

        // disallow multiple empty lines, only one newline at the end, and no new lines at the beginning
        // https://eslint.org/docs/rules/no-multiple-empty-lines
        "no-multiple-empty-lines": ["error", { max: 1, maxBOF: 0, maxEOF: 0 }],

        // disallow negated conditions
        // https://eslint.org/docs/rules/no-negated-condition
        "no-negated-condition": "off",

        // disallow nested ternary expressions
        "no-nested-ternary": "off",

        // disallow use of the Object constructor
        "no-new-object": "error",

        // disallow use of unary operators, ++ and --
        // https://eslint.org/docs/rules/no-plusplus
        "no-plusplus": "off",

        // disallow certain syntax forms
        // https://eslint.org/docs/rules/no-restricted-syntax
        "no-restricted-syntax": [
          "error",
          // {
          //   selector: "ForInStatement",
          //   message:
          //     "for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array."
          // },
          // {
          //   selector: "ForOfStatement",
          //   message:
          //     "iterators/generators require regenerator-runtime, which is too heavyweight for this guide to allow them. Separately, loops should be avoided in favor of array iterations."
          // },
          "TSEnumDeclaration[const=true]",
          "TSExportAssignment",
          {
            selector: "LabeledStatement",
            message:
              "Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand."
          },
          {
            selector: "WithStatement",
            message:
              "`with` is disallowed in strict mode because it makes code impossible to predict and optimize."
          }
        ],

        // disallow space between function identifier and application
        // deprecated in favor of func-call-spacing
        "no-spaced-func": "off",

        // disallow tab characters entirely
        "no-tabs": "error",

        // disallow the use of ternary operators
        "no-ternary": "off",

        // disallow trailing whitespace at the end of lines
        "no-trailing-spaces": [
          "error",
          {
            skipBlankLines: false,
            ignoreComments: false
          }
        ],

        // disallow dangling underscores in identifiers
        // https://eslint.org/docs/rules/no-underscore-dangle
        "no-underscore-dangle": [
          "off",
          {
            allow: [],
            allowAfterThis: false,
            allowAfterSuper: false,
            enforceInMethodNames: true
          }
        ],

        // disallow the use of Boolean literals in conditional expressions
        // also, prefer `a || b` over `a ? a : b`
        // https://eslint.org/docs/rules/no-unneeded-ternary
        "no-unneeded-ternary": ["error", { defaultAssignment: false }],

        // disallow whitespace before properties
        // https://eslint.org/docs/rules/no-whitespace-before-property
        "no-whitespace-before-property": "error",

        // enforce the location of single-line statements
        // https://eslint.org/docs/rules/nonblock-statement-body-position
        "nonblock-statement-body-position": [
          "error",
          "beside",
          { overrides: {} }
        ],

        // require padding inside curly braces
        "object-curly-spacing": ["error", "always"],

        // enforce line breaks between braces
        // https://eslint.org/docs/rules/object-curly-newline
        "object-curly-newline": [
          "error",
          {
            ObjectExpression: {
              minProperties: 5,
              multiline: true,
              consistent: true
            },
            ObjectPattern: {
              minProperties: 5,
              multiline: true,
              consistent: true
            },
            ImportDeclaration: {
              minProperties: 5,
              multiline: true,
              consistent: true
            },
            ExportDeclaration: {
              minProperties: 5,
              multiline: true,
              consistent: true
            }
          }
        ],

        // enforce "same line" or "multiple line" on object properties.
        // https://eslint.org/docs/rules/object-property-newline
        "object-property-newline": [
          "error",
          {
            allowAllPropertiesOnSameLine: false
          }
        ],

        // allow just one var statement per function
        "one-var": ["error", "never"],

        // require a newline around variable declaration
        // https://eslint.org/docs/rules/one-var-declaration-per-line
        "one-var-declaration-per-line": ["error", "always"],

        // require assignment operator shorthand where possible or prohibit it entirely
        // https://eslint.org/docs/rules/operator-assignment
        "operator-assignment": ["error", "always"],

        // Requires operator at the beginning of the line in multiline statements
        // https://eslint.org/docs/rules/operator-linebreak
        "operator-linebreak": [
          "error",
          "after",
          { overrides: { "=": "none" } }
        ],

        // disallow padding within blocks
        "padded-blocks": [
          "error",
          {
            blocks: "never",
            classes: "never",
            switches: "never"
          },
          {
            allowSingleLineBlocks: true
          }
        ],

        // Disallow the use of Math.pow in favor of the ** operator
        // https://eslint.org/docs/rules/prefer-exponentiation-operator
        "prefer-exponentiation-operator": "error",

        // Prefer use of an object spread over Object.assign
        // https://eslint.org/docs/rules/prefer-object-spread
        "prefer-object-spread": "error",

        // require quotes around object literal property names
        // https://eslint.org/docs/rules/quote-props.html
        "quote-props": [
          "error",
          "as-needed",
          { keywords: false, unnecessary: true, numbers: false }
        ],

        // specify whether double or single quotes should be used
        quotes: ["error", "double", { avoidEscape: true }],

        // do not require jsdoc
        // https://eslint.org/docs/rules/require-jsdoc
        "require-jsdoc": "off",

        // require or disallow use of semicolons instead of ASI
        semi: ["error", "always"],

        // enforce spacing before and after semicolons
        "semi-spacing": ["error", { before: false, after: true }],

        // Enforce location of semicolons
        // https://eslint.org/docs/rules/semi-style
        "semi-style": ["error", "last"],

        // requires object keys to be sorted
        "sort-keys": ["off", "asc", { caseSensitive: false, natural: true }],

        // sort variables within the same declaration block
        "sort-vars": "off",

        // require or disallow space before blocks
        "space-before-blocks": "error",

        // require or disallow space before function opening parenthesis
        // https://eslint.org/docs/rules/space-before-function-paren
        "space-before-function-paren": "off", //[
        //   "error",
        //   {
        //     anonymous: "always",
        //     named: "never",
        //     asyncArrow: "always"
        //   }
        // ],

        // require or disallow spaces inside parentheses
        "space-in-parens": ["error", "never"],

        // require spaces around operators
        "space-infix-ops": "error",

        // Require or disallow spaces before/after unary operators
        // https://eslint.org/docs/rules/space-unary-ops
        "space-unary-ops": [
          "error",
          {
            words: true,
            nonwords: false,
            overrides: {}
          }
        ],

        // require or disallow a space immediately following the // or /* in a comment
        // https://eslint.org/docs/rules/spaced-comment
        "spaced-comment": [
          "error",
          "always",
          {
            line: {
              exceptions: ["-", "+"],
              markers: ["=", "!", "/"] // space here to support sprockets directives, slash for TS /// comments
            },
            block: {
              exceptions: ["-", "+"],
              markers: ["=", "!", ":", "::"], // space here to support sprockets directives and flow comment types
              balanced: true
            }
          }
        ],

        // Enforce spacing around colons of switch statements
        // https://eslint.org/docs/rules/switch-colon-spacing
        "switch-colon-spacing": ["error", { after: true, before: false }],

        // Require or disallow spacing between template tags and their literals
        // https://eslint.org/docs/rules/template-tag-spacing
        "template-tag-spacing": ["error", "never"],

        // require or disallow the Unicode Byte Order Mark
        // https://eslint.org/docs/rules/unicode-bom
        "unicode-bom": ["error", "never"],

        // require regex literals to be wrapped in parentheses
        "wrap-regex": "off",

        "class-methods-use-this": "off",

        "accessor-pairs": [
          "error",
          { enforceForClassMembers: true, setWithoutGet: true }
        ],

        "constructor-super": "error",
        "dot-notation": ["error", { allowKeywords: true }],
        "no-case-declarations": "error",
        "no-class-assign": "error",
        "no-const-assign": "error",
        "no-delete-var": "error",
        "no-dupe-class-members": "error",
        "no-empty-pattern": "error",
        "no-eval": "error",
        "no-extend-native": "error",
        "no-extra-bind": "error",
        "no-fallthrough": "error",
        "no-global-assign": "error",
        "no-implied-eval": "error",
        "no-iterator": "error",
        "no-labels": ["error", { allowLoop: false, allowSwitch: false }],
        "no-lone-blocks": "error",
        "no-multi-str": "error",
        "no-new": "error",
        "no-new-func": "error",
        "no-new-wrappers": "error",
        "no-octal": "error",
        "no-octal-escape": "error",
        "no-proto": "error",
        "no-redeclare": ["error", { builtinGlobals: false }],
        "no-restricted-globals": [
          "error",
          { message: "Use `globalThis` instead.", name: "global" },
          { message: "Use `globalThis` instead.", name: "self" }
        ],
        "no-restricted-properties": [
          "error",
          {
            message:
              "Use `Object.getPrototypeOf` or `Object.setPrototypeOf` instead.",
            property: "__proto__"
          },
          {
            message: "Use `Object.defineProperty` instead.",
            property: "__defineGetter__"
          },
          {
            message: "Use `Object.defineProperty` instead.",
            property: "__defineSetter__"
          },
          {
            message: "Use `Object.getOwnPropertyDescriptor` instead.",
            property: "__lookupGetter__"
          },
          {
            message: "Use `Object.getOwnPropertyDescriptor` instead.",
            property: "__lookupSetter__"
          }
        ],
        "no-self-assign": ["error", { props: true }],
        "no-self-compare": "error",
        "no-sequences": "error",
        "no-shadow-restricted-names": "error",
        "no-this-before-super": "error",
        "no-throw-literal": "error",
        "no-undef": "error",
        "no-undef-init": "error",
        "no-unmodified-loop-condition": "error",
        "no-unused-expressions": [
          "error",
          {
            allowShortCircuit: true,
            allowTaggedTemplates: true,
            allowTernary: true
          }
        ],
        "no-use-before-define": [
          "error",
          { classes: false, functions: false, variables: true }
        ],
        "no-useless-call": "error",
        "no-useless-catch": "error",
        "no-useless-computed-key": "error",
        "no-useless-constructor": "error",
        "no-useless-rename": "error",
        "no-useless-return": "error",
        "no-var": "error",
        "no-with": "error",
        "object-shorthand": [
          "error",
          "always",
          {
            avoidQuotes: true,
            ignoreConstructors: false
          }
        ],
        "prefer-arrow-callback": [
          "error",
          {
            allowNamedFunctions: false,
            allowUnboundThis: true
          }
        ],
        "prefer-const": [
          "error",
          {
            destructuring: "all",
            ignoreReadBeforeAssign: true
          }
        ],
        "prefer-promise-reject-errors": "error",
        "prefer-regex-literals": ["error", { disallowRedundantWrapping: true }],
        "prefer-rest-params": "error",
        "prefer-spread": "error",
        "prefer-template": "error",
        "symbol-description": "error",
        "unused-imports/no-unused-imports": "error",
        "unused-imports/no-unused-vars": [
          "error",
          {
            args: "after-used",
            argsIgnorePattern: "^_",
            ignoreRestSiblings: true,
            vars: "all",
            varsIgnorePattern: "^_"
          }
        ],
        "vars-on-top": "error",
        "yoda": ["error", "never"],

        ...overrides
      }
    }
  ];
}
