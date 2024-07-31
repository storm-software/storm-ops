/* eslint-disable */
/* prettier-ignore */
import type { Linter } from 'eslint'

export interface RuleOptions {
  /**
   * Checks dependencies in project's package.json for version mismatches
   * @see https://github.com/nrwl/nx/blob/19.5.3/docs/generated/packages/eslint-plugin/documents/dependency-checks.md
   */
  "@nx/dependency-checks"?: Linter.RuleEntry<NxDependencyChecks>;
  /**
   * Ensure that module boundaries are respected within the monorepo
   * @see https://github.com/nrwl/nx/blob/19.5.3/docs/generated/packages/eslint-plugin/documents/enforce-module-boundaries.md
   */
  "@nx/enforce-module-boundaries"?: Linter.RuleEntry<NxEnforceModuleBoundaries>;
  /**
   * Checks common nx-plugin configuration files for validity
   */
  "@nx/nx-plugin-checks"?: Linter.RuleEntry<NxNxPluginChecks>;
  /**
   * Require that function overload signatures be consecutive
   * @see https://typescript-eslint.io/rules/adjacent-overload-signatures
   */
  "@typescript-eslint/adjacent-overload-signatures"?: Linter.RuleEntry<[]>;
  /**
   * Require consistently using either `T[]` or `Array<T>` for arrays
   * @see https://typescript-eslint.io/rules/array-type
   */
  "@typescript-eslint/array-type"?: Linter.RuleEntry<TypescriptEslintArrayType>;
  /**
   * Disallow awaiting a value that is not a Thenable
   * @see https://typescript-eslint.io/rules/await-thenable
   */
  "@typescript-eslint/await-thenable"?: Linter.RuleEntry<[]>;
  /**
   * Disallow `@ts-<directive>` comments or require descriptions after directives
   * @see https://typescript-eslint.io/rules/ban-ts-comment
   */
  "@typescript-eslint/ban-ts-comment"?: Linter.RuleEntry<TypescriptEslintBanTsComment>;
  /**
   * Disallow `// tslint:<rule-flag>` comments
   * @see https://typescript-eslint.io/rules/ban-tslint-comment
   */
  "@typescript-eslint/ban-tslint-comment"?: Linter.RuleEntry<[]>;
  /**
   * Disallow certain types
   * @see https://typescript-eslint.io/rules/ban-types
   */
  "@typescript-eslint/ban-types"?: Linter.RuleEntry<TypescriptEslintBanTypes>;
  /**
   * Disallow or enforce spaces inside of blocks after opening block and before closing block
   * @see https://typescript-eslint.io/rules/block-spacing
   * @deprecated
   */
  "@typescript-eslint/block-spacing"?: Linter.RuleEntry<TypescriptEslintBlockSpacing>;
  /**
   * Enforce consistent brace style for blocks
   * @see https://typescript-eslint.io/rules/brace-style
   * @deprecated
   */
  "@typescript-eslint/brace-style"?: Linter.RuleEntry<TypescriptEslintBraceStyle>;
  /**
   * Enforce that literals on classes are exposed in a consistent style
   * @see https://typescript-eslint.io/rules/class-literal-property-style
   */
  "@typescript-eslint/class-literal-property-style"?: Linter.RuleEntry<TypescriptEslintClassLiteralPropertyStyle>;
  /**
   * Enforce that class methods utilize `this`
   * @see https://typescript-eslint.io/rules/class-methods-use-this
   */
  "@typescript-eslint/class-methods-use-this"?: Linter.RuleEntry<TypescriptEslintClassMethodsUseThis>;
  /**
   * Require or disallow trailing commas
   * @see https://typescript-eslint.io/rules/comma-dangle
   * @deprecated
   */
  "@typescript-eslint/comma-dangle"?: Linter.RuleEntry<TypescriptEslintCommaDangle>;
  /**
   * Enforce consistent spacing before and after commas
   * @see https://typescript-eslint.io/rules/comma-spacing
   * @deprecated
   */
  "@typescript-eslint/comma-spacing"?: Linter.RuleEntry<TypescriptEslintCommaSpacing>;
  /**
   * Enforce specifying generic type arguments on type annotation or constructor name of a constructor call
   * @see https://typescript-eslint.io/rules/consistent-generic-constructors
   */
  "@typescript-eslint/consistent-generic-constructors"?: Linter.RuleEntry<TypescriptEslintConsistentGenericConstructors>;
  /**
   * Require or disallow the `Record` type
   * @see https://typescript-eslint.io/rules/consistent-indexed-object-style
   */
  "@typescript-eslint/consistent-indexed-object-style"?: Linter.RuleEntry<TypescriptEslintConsistentIndexedObjectStyle>;
  /**
   * Require `return` statements to either always or never specify values
   * @see https://typescript-eslint.io/rules/consistent-return
   */
  "@typescript-eslint/consistent-return"?: Linter.RuleEntry<TypescriptEslintConsistentReturn>;
  /**
   * Enforce consistent usage of type assertions
   * @see https://typescript-eslint.io/rules/consistent-type-assertions
   */
  "@typescript-eslint/consistent-type-assertions"?: Linter.RuleEntry<TypescriptEslintConsistentTypeAssertions>;
  /**
   * Enforce type definitions to consistently use either `interface` or `type`
   * @see https://typescript-eslint.io/rules/consistent-type-definitions
   */
  "@typescript-eslint/consistent-type-definitions"?: Linter.RuleEntry<TypescriptEslintConsistentTypeDefinitions>;
  /**
   * Enforce consistent usage of type exports
   * @see https://typescript-eslint.io/rules/consistent-type-exports
   */
  "@typescript-eslint/consistent-type-exports"?: Linter.RuleEntry<TypescriptEslintConsistentTypeExports>;
  /**
   * Enforce consistent usage of type imports
   * @see https://typescript-eslint.io/rules/consistent-type-imports
   */
  "@typescript-eslint/consistent-type-imports"?: Linter.RuleEntry<TypescriptEslintConsistentTypeImports>;
  /**
   * Enforce default parameters to be last
   * @see https://typescript-eslint.io/rules/default-param-last
   */
  "@typescript-eslint/default-param-last"?: Linter.RuleEntry<[]>;
  /**
   * Enforce dot notation whenever possible
   * @see https://typescript-eslint.io/rules/dot-notation
   */
  "@typescript-eslint/dot-notation"?: Linter.RuleEntry<TypescriptEslintDotNotation>;
  /**
   * Require explicit return types on functions and class methods
   * @see https://typescript-eslint.io/rules/explicit-function-return-type
   */
  "@typescript-eslint/explicit-function-return-type"?: Linter.RuleEntry<TypescriptEslintExplicitFunctionReturnType>;
  /**
   * Require explicit accessibility modifiers on class properties and methods
   * @see https://typescript-eslint.io/rules/explicit-member-accessibility
   */
  "@typescript-eslint/explicit-member-accessibility"?: Linter.RuleEntry<TypescriptEslintExplicitMemberAccessibility>;
  /**
   * Require explicit return and argument types on exported functions' and classes' public class methods
   * @see https://typescript-eslint.io/rules/explicit-module-boundary-types
   */
  "@typescript-eslint/explicit-module-boundary-types"?: Linter.RuleEntry<TypescriptEslintExplicitModuleBoundaryTypes>;
  /**
   * Require or disallow spacing between function identifiers and their invocations
   * @see https://typescript-eslint.io/rules/func-call-spacing
   * @deprecated
   */
  "@typescript-eslint/func-call-spacing"?: Linter.RuleEntry<TypescriptEslintFuncCallSpacing>;
  /**
   * Enforce consistent indentation
   * @see https://typescript-eslint.io/rules/indent
   * @deprecated
   */
  "@typescript-eslint/indent"?: Linter.RuleEntry<TypescriptEslintIndent>;
  /**
   * Require or disallow initialization in variable declarations
   * @see https://typescript-eslint.io/rules/init-declarations
   */
  "@typescript-eslint/init-declarations"?: Linter.RuleEntry<TypescriptEslintInitDeclarations>;
  /**
   * Enforce consistent spacing between property names and type annotations in types and interfaces
   * @see https://typescript-eslint.io/rules/key-spacing
   * @deprecated
   */
  "@typescript-eslint/key-spacing"?: Linter.RuleEntry<TypescriptEslintKeySpacing>;
  /**
   * Enforce consistent spacing before and after keywords
   * @see https://typescript-eslint.io/rules/keyword-spacing
   * @deprecated
   */
  "@typescript-eslint/keyword-spacing"?: Linter.RuleEntry<TypescriptEslintKeywordSpacing>;
  /**
   * Require empty lines around comments
   * @see https://typescript-eslint.io/rules/lines-around-comment
   * @deprecated
   */
  "@typescript-eslint/lines-around-comment"?: Linter.RuleEntry<TypescriptEslintLinesAroundComment>;
  /**
   * Require or disallow an empty line between class members
   * @see https://typescript-eslint.io/rules/lines-between-class-members
   * @deprecated
   */
  "@typescript-eslint/lines-between-class-members"?: Linter.RuleEntry<TypescriptEslintLinesBetweenClassMembers>;
  /**
   * Enforce a maximum number of parameters in function definitions
   * @see https://typescript-eslint.io/rules/max-params
   */
  "@typescript-eslint/max-params"?: Linter.RuleEntry<TypescriptEslintMaxParams>;
  /**
   * Require a specific member delimiter style for interfaces and type literals
   * @see https://typescript-eslint.io/rules/member-delimiter-style
   * @deprecated
   */
  "@typescript-eslint/member-delimiter-style"?: Linter.RuleEntry<TypescriptEslintMemberDelimiterStyle>;
  /**
   * Require a consistent member declaration order
   * @see https://typescript-eslint.io/rules/member-ordering
   */
  "@typescript-eslint/member-ordering"?: Linter.RuleEntry<TypescriptEslintMemberOrdering>;
  /**
   * Enforce using a particular method signature syntax
   * @see https://typescript-eslint.io/rules/method-signature-style
   */
  "@typescript-eslint/method-signature-style"?: Linter.RuleEntry<TypescriptEslintMethodSignatureStyle>;
  /**
   * Enforce naming conventions for everything across a codebase
   * @see https://typescript-eslint.io/rules/naming-convention
   */
  "@typescript-eslint/naming-convention"?: Linter.RuleEntry<TypescriptEslintNamingConvention>;
  /**
   * Disallow generic `Array` constructors
   * @see https://typescript-eslint.io/rules/no-array-constructor
   */
  "@typescript-eslint/no-array-constructor"?: Linter.RuleEntry<[]>;
  /**
   * Disallow using the `delete` operator on array values
   * @see https://typescript-eslint.io/rules/no-array-delete
   */
  "@typescript-eslint/no-array-delete"?: Linter.RuleEntry<[]>;
  /**
   * Require `.toString()` to only be called on objects which provide useful information when stringified
   * @see https://typescript-eslint.io/rules/no-base-to-string
   */
  "@typescript-eslint/no-base-to-string"?: Linter.RuleEntry<TypescriptEslintNoBaseToString>;
  /**
   * Disallow non-null assertion in locations that may be confusing
   * @see https://typescript-eslint.io/rules/no-confusing-non-null-assertion
   */
  "@typescript-eslint/no-confusing-non-null-assertion"?: Linter.RuleEntry<[]>;
  /**
   * Require expressions of type void to appear in statement position
   * @see https://typescript-eslint.io/rules/no-confusing-void-expression
   */
  "@typescript-eslint/no-confusing-void-expression"?: Linter.RuleEntry<TypescriptEslintNoConfusingVoidExpression>;
  /**
   * Disallow duplicate class members
   * @see https://typescript-eslint.io/rules/no-dupe-class-members
   */
  "@typescript-eslint/no-dupe-class-members"?: Linter.RuleEntry<[]>;
  /**
   * Disallow duplicate enum member values
   * @see https://typescript-eslint.io/rules/no-duplicate-enum-values
   */
  "@typescript-eslint/no-duplicate-enum-values"?: Linter.RuleEntry<[]>;
  /**
   * Disallow duplicate constituents of union or intersection types
   * @see https://typescript-eslint.io/rules/no-duplicate-type-constituents
   */
  "@typescript-eslint/no-duplicate-type-constituents"?: Linter.RuleEntry<TypescriptEslintNoDuplicateTypeConstituents>;
  /**
   * Disallow using the `delete` operator on computed key expressions
   * @see https://typescript-eslint.io/rules/no-dynamic-delete
   */
  "@typescript-eslint/no-dynamic-delete"?: Linter.RuleEntry<[]>;
  /**
   * Disallow empty functions
   * @see https://typescript-eslint.io/rules/no-empty-function
   */
  "@typescript-eslint/no-empty-function"?: Linter.RuleEntry<TypescriptEslintNoEmptyFunction>;
  /**
   * Disallow the declaration of empty interfaces
   * @see https://typescript-eslint.io/rules/no-empty-interface
   */
  "@typescript-eslint/no-empty-interface"?: Linter.RuleEntry<TypescriptEslintNoEmptyInterface>;
  /**
   * Disallow accidentally using the "empty object" type
   * @see https://typescript-eslint.io/rules/no-empty-object-type
   */
  "@typescript-eslint/no-empty-object-type"?: Linter.RuleEntry<TypescriptEslintNoEmptyObjectType>;
  /**
   * Disallow the `any` type
   * @see https://typescript-eslint.io/rules/no-explicit-any
   */
  "@typescript-eslint/no-explicit-any"?: Linter.RuleEntry<TypescriptEslintNoExplicitAny>;
  /**
   * Disallow extra non-null assertions
   * @see https://typescript-eslint.io/rules/no-extra-non-null-assertion
   */
  "@typescript-eslint/no-extra-non-null-assertion"?: Linter.RuleEntry<[]>;
  /**
   * Disallow unnecessary parentheses
   * @see https://typescript-eslint.io/rules/no-extra-parens
   * @deprecated
   */
  "@typescript-eslint/no-extra-parens"?: Linter.RuleEntry<TypescriptEslintNoExtraParens>;
  /**
   * Disallow unnecessary semicolons
   * @see https://typescript-eslint.io/rules/no-extra-semi
   * @deprecated
   */
  "@typescript-eslint/no-extra-semi"?: Linter.RuleEntry<[]>;
  /**
   * Disallow classes used as namespaces
   * @see https://typescript-eslint.io/rules/no-extraneous-class
   */
  "@typescript-eslint/no-extraneous-class"?: Linter.RuleEntry<TypescriptEslintNoExtraneousClass>;
  /**
   * Require Promise-like statements to be handled appropriately
   * @see https://typescript-eslint.io/rules/no-floating-promises
   */
  "@typescript-eslint/no-floating-promises"?: Linter.RuleEntry<TypescriptEslintNoFloatingPromises>;
  /**
   * Disallow iterating over an array with a for-in loop
   * @see https://typescript-eslint.io/rules/no-for-in-array
   */
  "@typescript-eslint/no-for-in-array"?: Linter.RuleEntry<[]>;
  /**
   * Disallow the use of `eval()`-like methods
   * @see https://typescript-eslint.io/rules/no-implied-eval
   */
  "@typescript-eslint/no-implied-eval"?: Linter.RuleEntry<[]>;
  /**
   * Enforce the use of top-level import type qualifier when an import only has specifiers with inline type qualifiers
   * @see https://typescript-eslint.io/rules/no-import-type-side-effects
   */
  "@typescript-eslint/no-import-type-side-effects"?: Linter.RuleEntry<[]>;
  /**
   * Disallow explicit type declarations for variables or parameters initialized to a number, string, or boolean
   * @see https://typescript-eslint.io/rules/no-inferrable-types
   */
  "@typescript-eslint/no-inferrable-types"?: Linter.RuleEntry<TypescriptEslintNoInferrableTypes>;
  /**
   * Disallow `this` keywords outside of classes or class-like objects
   * @see https://typescript-eslint.io/rules/no-invalid-this
   */
  "@typescript-eslint/no-invalid-this"?: Linter.RuleEntry<TypescriptEslintNoInvalidThis>;
  /**
   * Disallow `void` type outside of generic or return types
   * @see https://typescript-eslint.io/rules/no-invalid-void-type
   */
  "@typescript-eslint/no-invalid-void-type"?: Linter.RuleEntry<TypescriptEslintNoInvalidVoidType>;
  /**
   * Disallow function declarations that contain unsafe references inside loop statements
   * @see https://typescript-eslint.io/rules/no-loop-func
   */
  "@typescript-eslint/no-loop-func"?: Linter.RuleEntry<[]>;
  /**
   * Disallow literal numbers that lose precision
   * @see https://typescript-eslint.io/rules/no-loss-of-precision
   */
  "@typescript-eslint/no-loss-of-precision"?: Linter.RuleEntry<[]>;
  /**
   * Disallow magic numbers
   * @see https://typescript-eslint.io/rules/no-magic-numbers
   */
  "@typescript-eslint/no-magic-numbers"?: Linter.RuleEntry<TypescriptEslintNoMagicNumbers>;
  /**
   * Disallow the `void` operator except when used to discard a value
   * @see https://typescript-eslint.io/rules/no-meaningless-void-operator
   */
  "@typescript-eslint/no-meaningless-void-operator"?: Linter.RuleEntry<TypescriptEslintNoMeaninglessVoidOperator>;
  /**
   * Enforce valid definition of `new` and `constructor`
   * @see https://typescript-eslint.io/rules/no-misused-new
   */
  "@typescript-eslint/no-misused-new"?: Linter.RuleEntry<[]>;
  /**
   * Disallow Promises in places not designed to handle them
   * @see https://typescript-eslint.io/rules/no-misused-promises
   */
  "@typescript-eslint/no-misused-promises"?: Linter.RuleEntry<TypescriptEslintNoMisusedPromises>;
  /**
   * Disallow enums from having both number and string members
   * @see https://typescript-eslint.io/rules/no-mixed-enums
   */
  "@typescript-eslint/no-mixed-enums"?: Linter.RuleEntry<[]>;
  /**
   * Disallow TypeScript namespaces
   * @see https://typescript-eslint.io/rules/no-namespace
   */
  "@typescript-eslint/no-namespace"?: Linter.RuleEntry<TypescriptEslintNoNamespace>;
  /**
   * Disallow non-null assertions in the left operand of a nullish coalescing operator
   * @see https://typescript-eslint.io/rules/no-non-null-asserted-nullish-coalescing
   */
  "@typescript-eslint/no-non-null-asserted-nullish-coalescing"?: Linter.RuleEntry<
    []
  >;
  /**
   * Disallow non-null assertions after an optional chain expression
   * @see https://typescript-eslint.io/rules/no-non-null-asserted-optional-chain
   */
  "@typescript-eslint/no-non-null-asserted-optional-chain"?: Linter.RuleEntry<
    []
  >;
  /**
   * Disallow non-null assertions using the `!` postfix operator
   * @see https://typescript-eslint.io/rules/no-non-null-assertion
   */
  "@typescript-eslint/no-non-null-assertion"?: Linter.RuleEntry<[]>;
  /**
   * Disallow variable redeclaration
   * @see https://typescript-eslint.io/rules/no-redeclare
   */
  "@typescript-eslint/no-redeclare"?: Linter.RuleEntry<TypescriptEslintNoRedeclare>;
  /**
   * Disallow members of unions and intersections that do nothing or override type information
   * @see https://typescript-eslint.io/rules/no-redundant-type-constituents
   */
  "@typescript-eslint/no-redundant-type-constituents"?: Linter.RuleEntry<[]>;
  /**
   * Disallow invocation of `require()`
   * @see https://typescript-eslint.io/rules/no-require-imports
   */
  "@typescript-eslint/no-require-imports"?: Linter.RuleEntry<TypescriptEslintNoRequireImports>;
  /**
   * Disallow specified modules when loaded by `import`
   * @see https://typescript-eslint.io/rules/no-restricted-imports
   */
  "@typescript-eslint/no-restricted-imports"?: Linter.RuleEntry<TypescriptEslintNoRestrictedImports>;
  /**
   * Disallow variable declarations from shadowing variables declared in the outer scope
   * @see https://typescript-eslint.io/rules/no-shadow
   */
  "@typescript-eslint/no-shadow"?: Linter.RuleEntry<TypescriptEslintNoShadow>;
  /**
   * Disallow aliasing `this`
   * @see https://typescript-eslint.io/rules/no-this-alias
   */
  "@typescript-eslint/no-this-alias"?: Linter.RuleEntry<TypescriptEslintNoThisAlias>;
  /**
   * Disallow throwing literals as exceptions
   * @see https://typescript-eslint.io/rules/no-throw-literal
   * @deprecated
   */
  "@typescript-eslint/no-throw-literal"?: Linter.RuleEntry<TypescriptEslintNoThrowLiteral>;
  /**
   * Disallow type aliases
   * @see https://typescript-eslint.io/rules/no-type-alias
   * @deprecated
   */
  "@typescript-eslint/no-type-alias"?: Linter.RuleEntry<TypescriptEslintNoTypeAlias>;
  /**
   * Disallow unnecessary equality comparisons against boolean literals
   * @see https://typescript-eslint.io/rules/no-unnecessary-boolean-literal-compare
   */
  "@typescript-eslint/no-unnecessary-boolean-literal-compare"?: Linter.RuleEntry<TypescriptEslintNoUnnecessaryBooleanLiteralCompare>;
  /**
   * Disallow conditionals where the type is always truthy or always falsy
   * @see https://typescript-eslint.io/rules/no-unnecessary-condition
   */
  "@typescript-eslint/no-unnecessary-condition"?: Linter.RuleEntry<TypescriptEslintNoUnnecessaryCondition>;
  /**
   * Disallow unnecessary assignment of constructor property parameter
   * @see https://typescript-eslint.io/rules/no-unnecessary-parameter-property-assignment
   */
  "@typescript-eslint/no-unnecessary-parameter-property-assignment"?: Linter.RuleEntry<
    []
  >;
  /**
   * Disallow unnecessary namespace qualifiers
   * @see https://typescript-eslint.io/rules/no-unnecessary-qualifier
   */
  "@typescript-eslint/no-unnecessary-qualifier"?: Linter.RuleEntry<[]>;
  /**
   * Disallow unnecessary template expressions
   * @see https://typescript-eslint.io/rules/no-unnecessary-template-expression
   */
  "@typescript-eslint/no-unnecessary-template-expression"?: Linter.RuleEntry<
    []
  >;
  /**
   * Disallow type arguments that are equal to the default
   * @see https://typescript-eslint.io/rules/no-unnecessary-type-arguments
   */
  "@typescript-eslint/no-unnecessary-type-arguments"?: Linter.RuleEntry<[]>;
  /**
   * Disallow type assertions that do not change the type of an expression
   * @see https://typescript-eslint.io/rules/no-unnecessary-type-assertion
   */
  "@typescript-eslint/no-unnecessary-type-assertion"?: Linter.RuleEntry<TypescriptEslintNoUnnecessaryTypeAssertion>;
  /**
   * Disallow unnecessary constraints on generic types
   * @see https://typescript-eslint.io/rules/no-unnecessary-type-constraint
   */
  "@typescript-eslint/no-unnecessary-type-constraint"?: Linter.RuleEntry<[]>;
  /**
   * Disallow type parameters that only appear once
   * @see https://typescript-eslint.io/rules/no-unnecessary-type-parameters
   */
  "@typescript-eslint/no-unnecessary-type-parameters"?: Linter.RuleEntry<[]>;
  /**
   * Disallow calling a function with a value with type `any`
   * @see https://typescript-eslint.io/rules/no-unsafe-argument
   */
  "@typescript-eslint/no-unsafe-argument"?: Linter.RuleEntry<[]>;
  /**
   * Disallow assigning a value with type `any` to variables and properties
   * @see https://typescript-eslint.io/rules/no-unsafe-assignment
   */
  "@typescript-eslint/no-unsafe-assignment"?: Linter.RuleEntry<[]>;
  /**
   * Disallow calling a value with type `any`
   * @see https://typescript-eslint.io/rules/no-unsafe-call
   */
  "@typescript-eslint/no-unsafe-call"?: Linter.RuleEntry<[]>;
  /**
   * Disallow unsafe declaration merging
   * @see https://typescript-eslint.io/rules/no-unsafe-declaration-merging
   */
  "@typescript-eslint/no-unsafe-declaration-merging"?: Linter.RuleEntry<[]>;
  /**
   * Disallow comparing an enum value with a non-enum value
   * @see https://typescript-eslint.io/rules/no-unsafe-enum-comparison
   */
  "@typescript-eslint/no-unsafe-enum-comparison"?: Linter.RuleEntry<[]>;
  /**
   * Disallow member access on a value with type `any`
   * @see https://typescript-eslint.io/rules/no-unsafe-member-access
   */
  "@typescript-eslint/no-unsafe-member-access"?: Linter.RuleEntry<[]>;
  /**
   * Disallow returning a value with type `any` from a function
   * @see https://typescript-eslint.io/rules/no-unsafe-return
   */
  "@typescript-eslint/no-unsafe-return"?: Linter.RuleEntry<[]>;
  /**
   * Require unary negation to take a number
   * @see https://typescript-eslint.io/rules/no-unsafe-unary-minus
   */
  "@typescript-eslint/no-unsafe-unary-minus"?: Linter.RuleEntry<[]>;
  /**
   * Disallow unused expressions
   * @see https://typescript-eslint.io/rules/no-unused-expressions
   */
  "@typescript-eslint/no-unused-expressions"?: Linter.RuleEntry<TypescriptEslintNoUnusedExpressions>;
  /**
   * Disallow unused variables
   * @see https://typescript-eslint.io/rules/no-unused-vars
   */
  "@typescript-eslint/no-unused-vars"?: Linter.RuleEntry<TypescriptEslintNoUnusedVars>;
  /**
   * Disallow the use of variables before they are defined
   * @see https://typescript-eslint.io/rules/no-use-before-define
   */
  "@typescript-eslint/no-use-before-define"?: Linter.RuleEntry<TypescriptEslintNoUseBeforeDefine>;
  /**
   * Disallow unnecessary constructors
   * @see https://typescript-eslint.io/rules/no-useless-constructor
   */
  "@typescript-eslint/no-useless-constructor"?: Linter.RuleEntry<[]>;
  /**
   * Disallow empty exports that don't change anything in a module file
   * @see https://typescript-eslint.io/rules/no-useless-empty-export
   */
  "@typescript-eslint/no-useless-empty-export"?: Linter.RuleEntry<[]>;
  /**
   * Disallow unnecessary template expressions
   * @see https://typescript-eslint.io/rules/no-useless-template-literals
   * @deprecated
   */
  "@typescript-eslint/no-useless-template-literals"?: Linter.RuleEntry<[]>;
  /**
   * Disallow `require` statements except in import statements
   * @see https://typescript-eslint.io/rules/no-var-requires
   */
  "@typescript-eslint/no-var-requires"?: Linter.RuleEntry<TypescriptEslintNoVarRequires>;
  /**
   * Enforce non-null assertions over explicit type casts
   * @see https://typescript-eslint.io/rules/non-nullable-type-assertion-style
   */
  "@typescript-eslint/non-nullable-type-assertion-style"?: Linter.RuleEntry<[]>;
  /**
   * Enforce consistent spacing inside braces
   * @see https://typescript-eslint.io/rules/object-curly-spacing
   * @deprecated
   */
  "@typescript-eslint/object-curly-spacing"?: Linter.RuleEntry<TypescriptEslintObjectCurlySpacing>;
  /**
   * Disallow throwing non-`Error` values as exceptions
   * @see https://typescript-eslint.io/rules/only-throw-error
   */
  "@typescript-eslint/only-throw-error"?: Linter.RuleEntry<TypescriptEslintOnlyThrowError>;
  /**
   * Require or disallow padding lines between statements
   * @see https://typescript-eslint.io/rules/padding-line-between-statements
   * @deprecated
   */
  "@typescript-eslint/padding-line-between-statements"?: Linter.RuleEntry<TypescriptEslintPaddingLineBetweenStatements>;
  /**
   * Require or disallow parameter properties in class constructors
   * @see https://typescript-eslint.io/rules/parameter-properties
   */
  "@typescript-eslint/parameter-properties"?: Linter.RuleEntry<TypescriptEslintParameterProperties>;
  /**
   * Enforce the use of `as const` over literal type
   * @see https://typescript-eslint.io/rules/prefer-as-const
   */
  "@typescript-eslint/prefer-as-const"?: Linter.RuleEntry<[]>;
  /**
   * Require destructuring from arrays and/or objects
   * @see https://typescript-eslint.io/rules/prefer-destructuring
   */
  "@typescript-eslint/prefer-destructuring"?: Linter.RuleEntry<TypescriptEslintPreferDestructuring>;
  /**
   * Require each enum member value to be explicitly initialized
   * @see https://typescript-eslint.io/rules/prefer-enum-initializers
   */
  "@typescript-eslint/prefer-enum-initializers"?: Linter.RuleEntry<[]>;
  /**
   * Enforce the use of Array.prototype.find() over Array.prototype.filter() followed by [0] when looking for a single result
   * @see https://typescript-eslint.io/rules/prefer-find
   */
  "@typescript-eslint/prefer-find"?: Linter.RuleEntry<[]>;
  /**
   * Enforce the use of `for-of` loop over the standard `for` loop where possible
   * @see https://typescript-eslint.io/rules/prefer-for-of
   */
  "@typescript-eslint/prefer-for-of"?: Linter.RuleEntry<[]>;
  /**
   * Enforce using function types instead of interfaces with call signatures
   * @see https://typescript-eslint.io/rules/prefer-function-type
   */
  "@typescript-eslint/prefer-function-type"?: Linter.RuleEntry<[]>;
  /**
   * Enforce `includes` method over `indexOf` method
   * @see https://typescript-eslint.io/rules/prefer-includes
   */
  "@typescript-eslint/prefer-includes"?: Linter.RuleEntry<[]>;
  /**
   * Require all enum members to be literal values
   * @see https://typescript-eslint.io/rules/prefer-literal-enum-member
   */
  "@typescript-eslint/prefer-literal-enum-member"?: Linter.RuleEntry<TypescriptEslintPreferLiteralEnumMember>;
  /**
   * Require using `namespace` keyword over `module` keyword to declare custom TypeScript modules
   * @see https://typescript-eslint.io/rules/prefer-namespace-keyword
   */
  "@typescript-eslint/prefer-namespace-keyword"?: Linter.RuleEntry<[]>;
  /**
   * Enforce using the nullish coalescing operator instead of logical assignments or chaining
   * @see https://typescript-eslint.io/rules/prefer-nullish-coalescing
   */
  "@typescript-eslint/prefer-nullish-coalescing"?: Linter.RuleEntry<TypescriptEslintPreferNullishCoalescing>;
  /**
   * Enforce using concise optional chain expressions instead of chained logical ands, negated logical ors, or empty objects
   * @see https://typescript-eslint.io/rules/prefer-optional-chain
   */
  "@typescript-eslint/prefer-optional-chain"?: Linter.RuleEntry<TypescriptEslintPreferOptionalChain>;
  /**
   * Require using Error objects as Promise rejection reasons
   * @see https://typescript-eslint.io/rules/prefer-promise-reject-errors
   */
  "@typescript-eslint/prefer-promise-reject-errors"?: Linter.RuleEntry<TypescriptEslintPreferPromiseRejectErrors>;
  /**
   * Require private members to be marked as `readonly` if they're never modified outside of the constructor
   * @see https://typescript-eslint.io/rules/prefer-readonly
   */
  "@typescript-eslint/prefer-readonly"?: Linter.RuleEntry<TypescriptEslintPreferReadonly>;
  /**
   * Require function parameters to be typed as `readonly` to prevent accidental mutation of inputs
   * @see https://typescript-eslint.io/rules/prefer-readonly-parameter-types
   */
  "@typescript-eslint/prefer-readonly-parameter-types"?: Linter.RuleEntry<TypescriptEslintPreferReadonlyParameterTypes>;
  /**
   * Enforce using type parameter when calling `Array#reduce` instead of casting
   * @see https://typescript-eslint.io/rules/prefer-reduce-type-parameter
   */
  "@typescript-eslint/prefer-reduce-type-parameter"?: Linter.RuleEntry<[]>;
  /**
   * Enforce `RegExp#exec` over `String#match` if no global flag is provided
   * @see https://typescript-eslint.io/rules/prefer-regexp-exec
   */
  "@typescript-eslint/prefer-regexp-exec"?: Linter.RuleEntry<[]>;
  /**
   * Enforce that `this` is used when only `this` type is returned
   * @see https://typescript-eslint.io/rules/prefer-return-this-type
   */
  "@typescript-eslint/prefer-return-this-type"?: Linter.RuleEntry<[]>;
  /**
   * Enforce using `String#startsWith` and `String#endsWith` over other equivalent methods of checking substrings
   * @see https://typescript-eslint.io/rules/prefer-string-starts-ends-with
   */
  "@typescript-eslint/prefer-string-starts-ends-with"?: Linter.RuleEntry<TypescriptEslintPreferStringStartsEndsWith>;
  /**
   * Enforce using `@ts-expect-error` over `@ts-ignore`
   * @see https://typescript-eslint.io/rules/prefer-ts-expect-error
   * @deprecated
   */
  "@typescript-eslint/prefer-ts-expect-error"?: Linter.RuleEntry<[]>;
  /**
   * Require any function or method that returns a Promise to be marked async
   * @see https://typescript-eslint.io/rules/promise-function-async
   */
  "@typescript-eslint/promise-function-async"?: Linter.RuleEntry<TypescriptEslintPromiseFunctionAsync>;
  /**
   * Enforce the consistent use of either backticks, double, or single quotes
   * @see https://typescript-eslint.io/rules/quotes
   * @deprecated
   */
  "@typescript-eslint/quotes"?: Linter.RuleEntry<TypescriptEslintQuotes>;
  /**
   * Require `Array#sort` and `Array#toSorted` calls to always provide a `compareFunction`
   * @see https://typescript-eslint.io/rules/require-array-sort-compare
   */
  "@typescript-eslint/require-array-sort-compare"?: Linter.RuleEntry<TypescriptEslintRequireArraySortCompare>;
  /**
   * Disallow async functions which do not return promises and have no `await` expression
   * @see https://typescript-eslint.io/rules/require-await
   */
  "@typescript-eslint/require-await"?: Linter.RuleEntry<[]>;
  /**
   * Require both operands of addition to be the same type and be `bigint`, `number`, or `string`
   * @see https://typescript-eslint.io/rules/restrict-plus-operands
   */
  "@typescript-eslint/restrict-plus-operands"?: Linter.RuleEntry<TypescriptEslintRestrictPlusOperands>;
  /**
   * Enforce template literal expressions to be of `string` type
   * @see https://typescript-eslint.io/rules/restrict-template-expressions
   */
  "@typescript-eslint/restrict-template-expressions"?: Linter.RuleEntry<TypescriptEslintRestrictTemplateExpressions>;
  /**
   * Enforce consistent awaiting of returned promises
   * @see https://typescript-eslint.io/rules/return-await
   */
  "@typescript-eslint/return-await"?: Linter.RuleEntry<TypescriptEslintReturnAwait>;
  /**
   * Require or disallow semicolons instead of ASI
   * @see https://typescript-eslint.io/rules/semi
   * @deprecated
   */
  "@typescript-eslint/semi"?: Linter.RuleEntry<TypescriptEslintSemi>;
  /**
   * Enforce constituents of a type union/intersection to be sorted alphabetically
   * @see https://typescript-eslint.io/rules/sort-type-constituents
   * @deprecated
   */
  "@typescript-eslint/sort-type-constituents"?: Linter.RuleEntry<TypescriptEslintSortTypeConstituents>;
  /**
   * Enforce consistent spacing before blocks
   * @see https://typescript-eslint.io/rules/space-before-blocks
   * @deprecated
   */
  "@typescript-eslint/space-before-blocks"?: Linter.RuleEntry<TypescriptEslintSpaceBeforeBlocks>;
  /**
   * Enforce consistent spacing before function parenthesis
   * @see https://typescript-eslint.io/rules/space-before-function-paren
   * @deprecated
   */
  "@typescript-eslint/space-before-function-paren"?: Linter.RuleEntry<TypescriptEslintSpaceBeforeFunctionParen>;
  /**
   * Require spacing around infix operators
   * @see https://typescript-eslint.io/rules/space-infix-ops
   * @deprecated
   */
  "@typescript-eslint/space-infix-ops"?: Linter.RuleEntry<TypescriptEslintSpaceInfixOps>;
  /**
   * Disallow certain types in boolean expressions
   * @see https://typescript-eslint.io/rules/strict-boolean-expressions
   */
  "@typescript-eslint/strict-boolean-expressions"?: Linter.RuleEntry<TypescriptEslintStrictBooleanExpressions>;
  /**
   * Require switch-case statements to be exhaustive
   * @see https://typescript-eslint.io/rules/switch-exhaustiveness-check
   */
  "@typescript-eslint/switch-exhaustiveness-check"?: Linter.RuleEntry<TypescriptEslintSwitchExhaustivenessCheck>;
  /**
   * Disallow certain triple slash directives in favor of ES6-style import declarations
   * @see https://typescript-eslint.io/rules/triple-slash-reference
   */
  "@typescript-eslint/triple-slash-reference"?: Linter.RuleEntry<TypescriptEslintTripleSlashReference>;
  /**
   * Require consistent spacing around type annotations
   * @see https://typescript-eslint.io/rules/type-annotation-spacing
   * @deprecated
   */
  "@typescript-eslint/type-annotation-spacing"?: Linter.RuleEntry<TypescriptEslintTypeAnnotationSpacing>;
  /**
   * Require type annotations in certain places
   * @see https://typescript-eslint.io/rules/typedef
   */
  "@typescript-eslint/typedef"?: Linter.RuleEntry<TypescriptEslintTypedef>;
  /**
   * Enforce unbound methods are called with their expected scope
   * @see https://typescript-eslint.io/rules/unbound-method
   */
  "@typescript-eslint/unbound-method"?: Linter.RuleEntry<TypescriptEslintUnboundMethod>;
  /**
   * Disallow two overloads that could be unified into one with a union or an optional/rest parameter
   * @see https://typescript-eslint.io/rules/unified-signatures
   */
  "@typescript-eslint/unified-signatures"?: Linter.RuleEntry<TypescriptEslintUnifiedSignatures>;
  /**
   * Enforce typing arguments in `.catch()` callbacks as `unknown`
   * @see https://typescript-eslint.io/rules/use-unknown-in-catch-callback-variable
   */
  "@typescript-eslint/use-unknown-in-catch-callback-variable"?: Linter.RuleEntry<
    []
  >;
  /**
   * Ensures the file has a Storm Software banner
   * @see https://docs.stormsoftware.com/eslint-rules/banner
   */
  "banner/banner"?: Linter.RuleEntry<BannerBanner>;
  /**
   * Enforce emojis are wrapped in `<span>` and provide screenreader access.
   * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/tree/HEAD/docs/rules/accessible-emoji.md
   * @deprecated
   */
  "jsx-a11y/accessible-emoji"?: Linter.RuleEntry<JsxA11yAccessibleEmoji>;
  /**
   * Enforce all elements that require alternative text have meaningful information to relay back to end user.
   * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/tree/HEAD/docs/rules/alt-text.md
   */
  "jsx-a11y/alt-text"?: Linter.RuleEntry<JsxA11yAltText>;
  /**
   * Enforce `<a>` text to not exactly match "click here", "here", "link", or "a link".
   * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/tree/HEAD/docs/rules/anchor-ambiguous-text.md
   */
  "jsx-a11y/anchor-ambiguous-text"?: Linter.RuleEntry<JsxA11yAnchorAmbiguousText>;
  /**
   * Enforce all anchors to contain accessible content.
   * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/tree/HEAD/docs/rules/anchor-has-content.md
   */
  "jsx-a11y/anchor-has-content"?: Linter.RuleEntry<JsxA11yAnchorHasContent>;
  /**
   * Enforce all anchors are valid, navigable elements.
   * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/tree/HEAD/docs/rules/anchor-is-valid.md
   */
  "jsx-a11y/anchor-is-valid"?: Linter.RuleEntry<JsxA11yAnchorIsValid>;
  /**
   * Enforce elements with aria-activedescendant are tabbable.
   * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/tree/HEAD/docs/rules/aria-activedescendant-has-tabindex.md
   */
  "jsx-a11y/aria-activedescendant-has-tabindex"?: Linter.RuleEntry<JsxA11yAriaActivedescendantHasTabindex>;
  /**
   * Enforce all `aria-*` props are valid.
   * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/tree/HEAD/docs/rules/aria-props.md
   */
  "jsx-a11y/aria-props"?: Linter.RuleEntry<JsxA11yAriaProps>;
  /**
   * Enforce ARIA state and property values are valid.
   * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/tree/HEAD/docs/rules/aria-proptypes.md
   */
  "jsx-a11y/aria-proptypes"?: Linter.RuleEntry<JsxA11yAriaProptypes>;
  /**
   * Enforce that elements with ARIA roles must use a valid, non-abstract ARIA role.
   * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/tree/HEAD/docs/rules/aria-role.md
   */
  "jsx-a11y/aria-role"?: Linter.RuleEntry<JsxA11yAriaRole>;
  /**
   * Enforce that elements that do not support ARIA roles, states, and properties do not have those attributes.
   * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/tree/HEAD/docs/rules/aria-unsupported-elements.md
   */
  "jsx-a11y/aria-unsupported-elements"?: Linter.RuleEntry<JsxA11yAriaUnsupportedElements>;
  /**
   * Enforce that autocomplete attributes are used correctly.
   * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/tree/HEAD/docs/rules/autocomplete-valid.md
   */
  "jsx-a11y/autocomplete-valid"?: Linter.RuleEntry<JsxA11yAutocompleteValid>;
  /**
   * Enforce a clickable non-interactive element has at least one keyboard event listener.
   * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/tree/HEAD/docs/rules/click-events-have-key-events.md
   */
  "jsx-a11y/click-events-have-key-events"?: Linter.RuleEntry<JsxA11yClickEventsHaveKeyEvents>;
  /**
   * Enforce that a control (an interactive element) has a text label.
   * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/control-has-associated-label.md
   */
  "jsx-a11y/control-has-associated-label"?: Linter.RuleEntry<JsxA11yControlHasAssociatedLabel>;
  /**
   * Enforce heading (`h1`, `h2`, etc) elements contain accessible content.
   * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/tree/HEAD/docs/rules/heading-has-content.md
   */
  "jsx-a11y/heading-has-content"?: Linter.RuleEntry<JsxA11yHeadingHasContent>;
  /**
   * Enforce `<html>` element has `lang` prop.
   * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/tree/HEAD/docs/rules/html-has-lang.md
   */
  "jsx-a11y/html-has-lang"?: Linter.RuleEntry<JsxA11yHtmlHasLang>;
  /**
   * Enforce iframe elements have a title attribute.
   * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/tree/HEAD/docs/rules/iframe-has-title.md
   */
  "jsx-a11y/iframe-has-title"?: Linter.RuleEntry<JsxA11yIframeHasTitle>;
  /**
   * Enforce `<img>` alt prop does not contain the word "image", "picture", or "photo".
   * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/tree/HEAD/docs/rules/img-redundant-alt.md
   */
  "jsx-a11y/img-redundant-alt"?: Linter.RuleEntry<JsxA11yImgRedundantAlt>;
  /**
   * Enforce that elements with interactive handlers like `onClick` must be focusable.
   * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/tree/HEAD/docs/rules/interactive-supports-focus.md
   */
  "jsx-a11y/interactive-supports-focus"?: Linter.RuleEntry<JsxA11yInteractiveSupportsFocus>;
  /**
   * Enforce that a `label` tag has a text label and an associated control.
   * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/label-has-associated-control.md
   */
  "jsx-a11y/label-has-associated-control"?: Linter.RuleEntry<JsxA11yLabelHasAssociatedControl>;
  /**
   * Enforce that `<label>` elements have the `htmlFor` prop.
   * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/tree/HEAD/docs/rules/label-has-for.md
   * @deprecated
   */
  "jsx-a11y/label-has-for"?: Linter.RuleEntry<JsxA11yLabelHasFor>;
  /**
   * Enforce lang attribute has a valid value.
   * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/tree/HEAD/docs/rules/lang.md
   */
  "jsx-a11y/lang"?: Linter.RuleEntry<JsxA11yLang>;
  /**
   * Enforces that `<audio>` and `<video>` elements must have a `<track>` for captions.
   * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/tree/HEAD/docs/rules/media-has-caption.md
   */
  "jsx-a11y/media-has-caption"?: Linter.RuleEntry<JsxA11yMediaHasCaption>;
  /**
   * Enforce that `onMouseOver`/`onMouseOut` are accompanied by `onFocus`/`onBlur` for keyboard-only users.
   * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/tree/HEAD/docs/rules/mouse-events-have-key-events.md
   */
  "jsx-a11y/mouse-events-have-key-events"?: Linter.RuleEntry<JsxA11yMouseEventsHaveKeyEvents>;
  /**
   * Enforce that the `accessKey` prop is not used on any element to avoid complications with keyboard commands used by a screenreader.
   * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/tree/HEAD/docs/rules/no-access-key.md
   */
  "jsx-a11y/no-access-key"?: Linter.RuleEntry<JsxA11yNoAccessKey>;
  /**
   * Disallow `aria-hidden="true"` from being set on focusable elements.
   * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/tree/HEAD/docs/rules/no-aria-hidden-on-focusable.md
   */
  "jsx-a11y/no-aria-hidden-on-focusable"?: Linter.RuleEntry<JsxA11yNoAriaHiddenOnFocusable>;
  /**
   * Enforce autoFocus prop is not used.
   * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/tree/HEAD/docs/rules/no-autofocus.md
   */
  "jsx-a11y/no-autofocus"?: Linter.RuleEntry<JsxA11yNoAutofocus>;
  /**
   * Enforce distracting elements are not used.
   * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/tree/HEAD/docs/rules/no-distracting-elements.md
   */
  "jsx-a11y/no-distracting-elements"?: Linter.RuleEntry<JsxA11yNoDistractingElements>;
  /**
   * Interactive elements should not be assigned non-interactive roles.
   * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/tree/HEAD/docs/rules/no-interactive-element-to-noninteractive-role.md
   */
  "jsx-a11y/no-interactive-element-to-noninteractive-role"?: Linter.RuleEntry<JsxA11yNoInteractiveElementToNoninteractiveRole>;
  /**
   * Non-interactive elements should not be assigned mouse or keyboard event listeners.
   * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/tree/HEAD/docs/rules/no-noninteractive-element-interactions.md
   */
  "jsx-a11y/no-noninteractive-element-interactions"?: Linter.RuleEntry<JsxA11yNoNoninteractiveElementInteractions>;
  /**
   * Non-interactive elements should not be assigned interactive roles.
   * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/tree/HEAD/docs/rules/no-noninteractive-element-to-interactive-role.md
   */
  "jsx-a11y/no-noninteractive-element-to-interactive-role"?: Linter.RuleEntry<JsxA11yNoNoninteractiveElementToInteractiveRole>;
  /**
   * `tabIndex` should only be declared on interactive elements.
   * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/tree/HEAD/docs/rules/no-noninteractive-tabindex.md
   */
  "jsx-a11y/no-noninteractive-tabindex"?: Linter.RuleEntry<JsxA11yNoNoninteractiveTabindex>;
  /**
   * Enforce usage of `onBlur` over `onChange` on select menus for accessibility.
   * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/tree/HEAD/docs/rules/no-onchange.md
   * @deprecated
   */
  "jsx-a11y/no-onchange"?: Linter.RuleEntry<JsxA11yNoOnchange>;
  /**
   * Enforce explicit role property is not the same as implicit/default role property on element.
   * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/tree/HEAD/docs/rules/no-redundant-roles.md
   */
  "jsx-a11y/no-redundant-roles"?: Linter.RuleEntry<JsxA11yNoRedundantRoles>;
  /**
   * Enforce that non-interactive, visible elements (such as `<div>`) that have click handlers use the role attribute.
   * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/tree/HEAD/docs/rules/no-static-element-interactions.md
   */
  "jsx-a11y/no-static-element-interactions"?: Linter.RuleEntry<JsxA11yNoStaticElementInteractions>;
  /**
   * Enforces using semantic DOM elements over the ARIA `role` property.
   * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/tree/HEAD/docs/rules/prefer-tag-over-role.md
   */
  "jsx-a11y/prefer-tag-over-role"?: Linter.RuleEntry<JsxA11yPreferTagOverRole>;
  /**
   * Enforce that elements with ARIA roles must have all required attributes for that role.
   * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/tree/HEAD/docs/rules/role-has-required-aria-props.md
   */
  "jsx-a11y/role-has-required-aria-props"?: Linter.RuleEntry<JsxA11yRoleHasRequiredAriaProps>;
  /**
   * Enforce that elements with explicit or implicit roles defined contain only `aria-*` properties supported by that `role`.
   * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/tree/HEAD/docs/rules/role-supports-aria-props.md
   */
  "jsx-a11y/role-supports-aria-props"?: Linter.RuleEntry<JsxA11yRoleSupportsAriaProps>;
  /**
   * Enforce `scope` prop is only used on `<th>` elements.
   * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/tree/HEAD/docs/rules/scope.md
   */
  "jsx-a11y/scope"?: Linter.RuleEntry<JsxA11yScope>;
  /**
   * Enforce `tabIndex` value is not greater than zero.
   * @see https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/tree/HEAD/docs/rules/tabindex-no-positive.md
   */
  "jsx-a11y/tabindex-no-positive"?: Linter.RuleEntry<JsxA11yTabindexNoPositive>;
  /**
   * @see https://github.com/prettier/eslint-plugin-prettier#options
   */
  "prettier/prettier"?: Linter.RuleEntry<PrettierPrettier>;
  /**
   * verifies the list of dependencies for Hooks like useEffect and similar
   * @see https://github.com/facebook/react/issues/14920
   */
  "react-hooks/exhaustive-deps"?: Linter.RuleEntry<ReactHooksExhaustiveDeps>;
  /**
   * enforces the Rules of Hooks
   * @see https://reactjs.org/docs/hooks-rules.html
   */
  "react-hooks/rules-of-hooks"?: Linter.RuleEntry<[]>;
  /**
   * Enforces consistent naming for boolean props
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/boolean-prop-naming.md
   */
  "react/boolean-prop-naming"?: Linter.RuleEntry<ReactBooleanPropNaming>;
  /**
   * Disallow usage of `button` elements without an explicit `type` attribute
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/button-has-type.md
   */
  "react/button-has-type"?: Linter.RuleEntry<ReactButtonHasType>;
  /**
   * Enforce using `onChange` or `readonly` attribute when `checked` is used
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/checked-requires-onchange-or-readonly.md
   */
  "react/checked-requires-onchange-or-readonly"?: Linter.RuleEntry<ReactCheckedRequiresOnchangeOrReadonly>;
  /**
   * Enforce all defaultProps have a corresponding non-required PropType
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/default-props-match-prop-types.md
   */
  "react/default-props-match-prop-types"?: Linter.RuleEntry<ReactDefaultPropsMatchPropTypes>;
  /**
   * Enforce consistent usage of destructuring assignment of props, state, and context
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/destructuring-assignment.md
   */
  "react/destructuring-assignment"?: Linter.RuleEntry<ReactDestructuringAssignment>;
  /**
   * Disallow missing displayName in a React component definition
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/display-name.md
   */
  "react/display-name"?: Linter.RuleEntry<ReactDisplayName>;
  /**
   * Disallow certain props on components
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/forbid-component-props.md
   */
  "react/forbid-component-props"?: Linter.RuleEntry<ReactForbidComponentProps>;
  /**
   * Disallow certain props on DOM Nodes
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/forbid-dom-props.md
   */
  "react/forbid-dom-props"?: Linter.RuleEntry<ReactForbidDomProps>;
  /**
   * Disallow certain elements
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/forbid-elements.md
   */
  "react/forbid-elements"?: Linter.RuleEntry<ReactForbidElements>;
  /**
   * Disallow using another component's propTypes
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/forbid-foreign-prop-types.md
   */
  "react/forbid-foreign-prop-types"?: Linter.RuleEntry<ReactForbidForeignPropTypes>;
  /**
   * Disallow certain propTypes
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/forbid-prop-types.md
   */
  "react/forbid-prop-types"?: Linter.RuleEntry<ReactForbidPropTypes>;
  /**
   * Enforce a specific function type for function components
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/function-component-definition.md
   */
  "react/function-component-definition"?: Linter.RuleEntry<ReactFunctionComponentDefinition>;
  /**
   * Ensure destructuring and symmetric naming of useState hook value and setter variables
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/hook-use-state.md
   */
  "react/hook-use-state"?: Linter.RuleEntry<ReactHookUseState>;
  /**
   * Enforce sandbox attribute on iframe elements
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/iframe-missing-sandbox.md
   */
  "react/iframe-missing-sandbox"?: Linter.RuleEntry<[]>;
  /**
   * Enforce boolean attributes notation in JSX
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/jsx-boolean-value.md
   */
  "react/jsx-boolean-value"?: Linter.RuleEntry<ReactJsxBooleanValue>;
  /**
   * Enforce or disallow spaces inside of curly braces in JSX attributes and expressions
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/jsx-child-element-spacing.md
   */
  "react/jsx-child-element-spacing"?: Linter.RuleEntry<[]>;
  /**
   * Enforce closing bracket location in JSX
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/jsx-closing-bracket-location.md
   */
  "react/jsx-closing-bracket-location"?: Linter.RuleEntry<ReactJsxClosingBracketLocation>;
  /**
   * Enforce closing tag location for multiline JSX
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/jsx-closing-tag-location.md
   */
  "react/jsx-closing-tag-location"?: Linter.RuleEntry<[]>;
  /**
   * Disallow unnecessary JSX expressions when literals alone are sufficient or enforce JSX expressions on literals in JSX children or attributes
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/jsx-curly-brace-presence.md
   */
  "react/jsx-curly-brace-presence"?: Linter.RuleEntry<ReactJsxCurlyBracePresence>;
  /**
   * Enforce consistent linebreaks in curly braces in JSX attributes and expressions
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/jsx-curly-newline.md
   */
  "react/jsx-curly-newline"?: Linter.RuleEntry<ReactJsxCurlyNewline>;
  /**
   * Enforce or disallow spaces inside of curly braces in JSX attributes and expressions
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/jsx-curly-spacing.md
   */
  "react/jsx-curly-spacing"?: Linter.RuleEntry<ReactJsxCurlySpacing>;
  /**
   * Enforce or disallow spaces around equal signs in JSX attributes
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/jsx-equals-spacing.md
   */
  "react/jsx-equals-spacing"?: Linter.RuleEntry<ReactJsxEqualsSpacing>;
  /**
   * Disallow file extensions that may contain JSX
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/jsx-filename-extension.md
   */
  "react/jsx-filename-extension"?: Linter.RuleEntry<ReactJsxFilenameExtension>;
  /**
   * Enforce proper position of the first property in JSX
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/jsx-first-prop-new-line.md
   */
  "react/jsx-first-prop-new-line"?: Linter.RuleEntry<ReactJsxFirstPropNewLine>;
  /**
   * Enforce shorthand or standard form for React fragments
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/jsx-fragments.md
   */
  "react/jsx-fragments"?: Linter.RuleEntry<ReactJsxFragments>;
  /**
   * Enforce event handler naming conventions in JSX
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/jsx-handler-names.md
   */
  "react/jsx-handler-names"?: Linter.RuleEntry<ReactJsxHandlerNames>;
  /**
   * Enforce JSX indentation
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/jsx-indent.md
   */
  "react/jsx-indent"?: Linter.RuleEntry<ReactJsxIndent>;
  /**
   * Enforce props indentation in JSX
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/jsx-indent-props.md
   */
  "react/jsx-indent-props"?: Linter.RuleEntry<ReactJsxIndentProps>;
  /**
   * Disallow missing `key` props in iterators/collection literals
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/jsx-key.md
   */
  "react/jsx-key"?: Linter.RuleEntry<ReactJsxKey>;
  /**
   * Enforce JSX maximum depth
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/jsx-max-depth.md
   */
  "react/jsx-max-depth"?: Linter.RuleEntry<ReactJsxMaxDepth>;
  /**
   * Enforce maximum of props on a single line in JSX
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/jsx-max-props-per-line.md
   */
  "react/jsx-max-props-per-line"?: Linter.RuleEntry<ReactJsxMaxPropsPerLine>;
  /**
   * Require or prevent a new line after jsx elements and expressions.
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/jsx-newline.md
   */
  "react/jsx-newline"?: Linter.RuleEntry<ReactJsxNewline>;
  /**
   * Disallow `.bind()` or arrow functions in JSX props
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/jsx-no-bind.md
   */
  "react/jsx-no-bind"?: Linter.RuleEntry<ReactJsxNoBind>;
  /**
   * Disallow comments from being inserted as text nodes
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/jsx-no-comment-textnodes.md
   */
  "react/jsx-no-comment-textnodes"?: Linter.RuleEntry<[]>;
  /**
   * Disallows JSX context provider values from taking values that will cause needless rerenders
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/jsx-no-constructed-context-values.md
   */
  "react/jsx-no-constructed-context-values"?: Linter.RuleEntry<[]>;
  /**
   * Disallow duplicate properties in JSX
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/jsx-no-duplicate-props.md
   */
  "react/jsx-no-duplicate-props"?: Linter.RuleEntry<ReactJsxNoDuplicateProps>;
  /**
   * Disallow problematic leaked values from being rendered
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/jsx-no-leaked-render.md
   */
  "react/jsx-no-leaked-render"?: Linter.RuleEntry<ReactJsxNoLeakedRender>;
  /**
   * Disallow usage of string literals in JSX
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/jsx-no-literals.md
   */
  "react/jsx-no-literals"?: Linter.RuleEntry<ReactJsxNoLiterals>;
  /**
   * Disallow usage of `javascript:` URLs
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/jsx-no-script-url.md
   */
  "react/jsx-no-script-url"?: Linter.RuleEntry<ReactJsxNoScriptUrl>;
  /**
   * Disallow `target="_blank"` attribute without `rel="noreferrer"`
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/jsx-no-target-blank.md
   */
  "react/jsx-no-target-blank"?: Linter.RuleEntry<ReactJsxNoTargetBlank>;
  /**
   * Disallow undeclared variables in JSX
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/jsx-no-undef.md
   */
  "react/jsx-no-undef"?: Linter.RuleEntry<ReactJsxNoUndef>;
  /**
   * Disallow unnecessary fragments
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/jsx-no-useless-fragment.md
   */
  "react/jsx-no-useless-fragment"?: Linter.RuleEntry<ReactJsxNoUselessFragment>;
  /**
   * Require one JSX element per line
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/jsx-one-expression-per-line.md
   */
  "react/jsx-one-expression-per-line"?: Linter.RuleEntry<ReactJsxOneExpressionPerLine>;
  /**
   * Enforce PascalCase for user-defined JSX components
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/jsx-pascal-case.md
   */
  "react/jsx-pascal-case"?: Linter.RuleEntry<ReactJsxPascalCase>;
  /**
   * Disallow multiple spaces between inline JSX props
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/jsx-props-no-multi-spaces.md
   */
  "react/jsx-props-no-multi-spaces"?: Linter.RuleEntry<[]>;
  /**
   * Disallow JSX prop spreading
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/jsx-props-no-spreading.md
   */
  "react/jsx-props-no-spreading"?: Linter.RuleEntry<ReactJsxPropsNoSpreading>;
  /**
   * Enforce defaultProps declarations alphabetical sorting
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/jsx-sort-default-props.md
   * @deprecated
   */
  "react/jsx-sort-default-props"?: Linter.RuleEntry<ReactJsxSortDefaultProps>;
  /**
   * Enforce props alphabetical sorting
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/jsx-sort-props.md
   */
  "react/jsx-sort-props"?: Linter.RuleEntry<ReactJsxSortProps>;
  /**
   * Enforce spacing before closing bracket in JSX
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/jsx-space-before-closing.md
   * @deprecated
   */
  "react/jsx-space-before-closing"?: Linter.RuleEntry<ReactJsxSpaceBeforeClosing>;
  /**
   * Enforce whitespace in and around the JSX opening and closing brackets
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/jsx-tag-spacing.md
   */
  "react/jsx-tag-spacing"?: Linter.RuleEntry<ReactJsxTagSpacing>;
  /**
   * Disallow React to be incorrectly marked as unused
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/jsx-uses-react.md
   */
  "react/jsx-uses-react"?: Linter.RuleEntry<[]>;
  /**
   * Disallow variables used in JSX to be incorrectly marked as unused
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/jsx-uses-vars.md
   */
  "react/jsx-uses-vars"?: Linter.RuleEntry<[]>;
  /**
   * Disallow missing parentheses around multiline JSX
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/jsx-wrap-multilines.md
   */
  "react/jsx-wrap-multilines"?: Linter.RuleEntry<ReactJsxWrapMultilines>;
  /**
   * Disallow when this.state is accessed within setState
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/no-access-state-in-setstate.md
   */
  "react/no-access-state-in-setstate"?: Linter.RuleEntry<[]>;
  /**
   * Disallow adjacent inline elements not separated by whitespace.
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/no-adjacent-inline-elements.md
   */
  "react/no-adjacent-inline-elements"?: Linter.RuleEntry<[]>;
  /**
   * Disallow usage of Array index in keys
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/no-array-index-key.md
   */
  "react/no-array-index-key"?: Linter.RuleEntry<[]>;
  /**
   * Lifecycle methods should be methods on the prototype, not class fields
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/no-arrow-function-lifecycle.md
   */
  "react/no-arrow-function-lifecycle"?: Linter.RuleEntry<[]>;
  /**
   * Disallow passing of children as props
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/no-children-prop.md
   */
  "react/no-children-prop"?: Linter.RuleEntry<ReactNoChildrenProp>;
  /**
   * Disallow usage of dangerous JSX properties
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/no-danger.md
   */
  "react/no-danger"?: Linter.RuleEntry<[]>;
  /**
   * Disallow when a DOM element is using both children and dangerouslySetInnerHTML
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/no-danger-with-children.md
   */
  "react/no-danger-with-children"?: Linter.RuleEntry<[]>;
  /**
   * Disallow usage of deprecated methods
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/no-deprecated.md
   */
  "react/no-deprecated"?: Linter.RuleEntry<[]>;
  /**
   * Disallow usage of setState in componentDidMount
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/no-did-mount-set-state.md
   */
  "react/no-did-mount-set-state"?: Linter.RuleEntry<ReactNoDidMountSetState>;
  /**
   * Disallow usage of setState in componentDidUpdate
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/no-did-update-set-state.md
   */
  "react/no-did-update-set-state"?: Linter.RuleEntry<ReactNoDidUpdateSetState>;
  /**
   * Disallow direct mutation of this.state
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/no-direct-mutation-state.md
   */
  "react/no-direct-mutation-state"?: Linter.RuleEntry<[]>;
  /**
   * Disallow usage of findDOMNode
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/no-find-dom-node.md
   */
  "react/no-find-dom-node"?: Linter.RuleEntry<[]>;
  /**
   * Disallow usage of invalid attributes
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/no-invalid-html-attribute.md
   */
  "react/no-invalid-html-attribute"?: Linter.RuleEntry<ReactNoInvalidHtmlAttribute>;
  /**
   * Disallow usage of isMounted
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/no-is-mounted.md
   */
  "react/no-is-mounted"?: Linter.RuleEntry<[]>;
  /**
   * Disallow multiple component definition per file
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/no-multi-comp.md
   */
  "react/no-multi-comp"?: Linter.RuleEntry<ReactNoMultiComp>;
  /**
   * Enforce that namespaces are not used in React elements
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/no-namespace.md
   */
  "react/no-namespace"?: Linter.RuleEntry<[]>;
  /**
   * Disallow usage of referential-type variables as default param in functional component
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/no-object-type-as-default-prop.md
   */
  "react/no-object-type-as-default-prop"?: Linter.RuleEntry<[]>;
  /**
   * Disallow usage of shouldComponentUpdate when extending React.PureComponent
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/no-redundant-should-component-update.md
   */
  "react/no-redundant-should-component-update"?: Linter.RuleEntry<[]>;
  /**
   * Disallow usage of the return value of ReactDOM.render
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/no-render-return-value.md
   */
  "react/no-render-return-value"?: Linter.RuleEntry<[]>;
  /**
   * Disallow usage of setState
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/no-set-state.md
   */
  "react/no-set-state"?: Linter.RuleEntry<[]>;
  /**
   * Disallow using string references
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/no-string-refs.md
   */
  "react/no-string-refs"?: Linter.RuleEntry<ReactNoStringRefs>;
  /**
   * Disallow `this` from being used in stateless functional components
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/no-this-in-sfc.md
   */
  "react/no-this-in-sfc"?: Linter.RuleEntry<[]>;
  /**
   * Disallow common typos
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/no-typos.md
   */
  "react/no-typos"?: Linter.RuleEntry<[]>;
  /**
   * Disallow unescaped HTML entities from appearing in markup
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/no-unescaped-entities.md
   */
  "react/no-unescaped-entities"?: Linter.RuleEntry<ReactNoUnescapedEntities>;
  /**
   * Disallow usage of unknown DOM property
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/no-unknown-property.md
   */
  "react/no-unknown-property"?: Linter.RuleEntry<ReactNoUnknownProperty>;
  /**
   * Disallow usage of unsafe lifecycle methods
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/no-unsafe.md
   */
  "react/no-unsafe"?: Linter.RuleEntry<ReactNoUnsafe>;
  /**
   * Disallow creating unstable components inside components
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/no-unstable-nested-components.md
   */
  "react/no-unstable-nested-components"?: Linter.RuleEntry<ReactNoUnstableNestedComponents>;
  /**
   * Disallow declaring unused methods of component class
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/no-unused-class-component-methods.md
   */
  "react/no-unused-class-component-methods"?: Linter.RuleEntry<[]>;
  /**
   * Disallow definitions of unused propTypes
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/no-unused-prop-types.md
   */
  "react/no-unused-prop-types"?: Linter.RuleEntry<ReactNoUnusedPropTypes>;
  /**
   * Disallow definitions of unused state
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/no-unused-state.md
   */
  "react/no-unused-state"?: Linter.RuleEntry<[]>;
  /**
   * Disallow usage of setState in componentWillUpdate
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/no-will-update-set-state.md
   */
  "react/no-will-update-set-state"?: Linter.RuleEntry<ReactNoWillUpdateSetState>;
  /**
   * Enforce ES5 or ES6 class for React Components
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/prefer-es6-class.md
   */
  "react/prefer-es6-class"?: Linter.RuleEntry<ReactPreferEs6Class>;
  /**
   * Prefer exact proptype definitions
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/prefer-exact-props.md
   */
  "react/prefer-exact-props"?: Linter.RuleEntry<[]>;
  /**
   * Enforce that props are read-only
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/prefer-read-only-props.md
   */
  "react/prefer-read-only-props"?: Linter.RuleEntry<[]>;
  /**
   * Enforce stateless components to be written as a pure function
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/prefer-stateless-function.md
   */
  "react/prefer-stateless-function"?: Linter.RuleEntry<ReactPreferStatelessFunction>;
  /**
   * Disallow missing props validation in a React component definition
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/prop-types.md
   */
  "react/prop-types"?: Linter.RuleEntry<ReactPropTypes>;
  /**
   * Disallow missing React when using JSX
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/react-in-jsx-scope.md
   */
  "react/react-in-jsx-scope"?: Linter.RuleEntry<[]>;
  /**
   * Enforce a defaultProps definition for every prop that is not a required prop
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/require-default-props.md
   */
  "react/require-default-props"?: Linter.RuleEntry<ReactRequireDefaultProps>;
  /**
   * Enforce React components to have a shouldComponentUpdate method
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/require-optimization.md
   */
  "react/require-optimization"?: Linter.RuleEntry<ReactRequireOptimization>;
  /**
   * Enforce ES5 or ES6 class for returning value in render function
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/require-render-return.md
   */
  "react/require-render-return"?: Linter.RuleEntry<[]>;
  /**
   * Disallow extra closing tags for components without children
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/self-closing-comp.md
   */
  "react/self-closing-comp"?: Linter.RuleEntry<ReactSelfClosingComp>;
  /**
   * Enforce component methods order
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/sort-comp.md
   */
  "react/sort-comp"?: Linter.RuleEntry<ReactSortComp>;
  /**
   * Enforce defaultProps declarations alphabetical sorting
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/sort-default-props.md
   */
  "react/sort-default-props"?: Linter.RuleEntry<ReactSortDefaultProps>;
  /**
   * Enforce propTypes declarations alphabetical sorting
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/sort-prop-types.md
   */
  "react/sort-prop-types"?: Linter.RuleEntry<ReactSortPropTypes>;
  /**
   * Enforce class component state initialization style
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/state-in-constructor.md
   */
  "react/state-in-constructor"?: Linter.RuleEntry<ReactStateInConstructor>;
  /**
   * Enforces where React component static properties should be positioned.
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/static-property-placement.md
   */
  "react/static-property-placement"?: Linter.RuleEntry<ReactStaticPropertyPlacement>;
  /**
   * Enforce style prop value is an object
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/style-prop-object.md
   */
  "react/style-prop-object"?: Linter.RuleEntry<ReactStylePropObject>;
  /**
   * Disallow void DOM elements (e.g. `<img />`, `<br />`) from receiving children
   * @see https://github.com/jsx-eslint/eslint-plugin-react/tree/master/docs/rules/void-dom-elements-no-children.md
   */
  "react/void-dom-elements-no-children"?: Linter.RuleEntry<[]>;
  /**
   * Validates that TypeScript documentation comments conform to the TSDoc standard
   * @see https://tsdoc.org/pages/packages/eslint-plugin-tsdoc
   */
  "tsdoc/syntax"?: Linter.RuleEntry<[]>;
  /**
   * Improve regexes by making them shorter, consistent, and safer.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/better-regex.md
   */
  "unicorn/better-regex"?: Linter.RuleEntry<UnicornBetterRegex>;
  /**
   * Enforce a specific parameter name in catch clauses.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/catch-error-name.md
   */
  "unicorn/catch-error-name"?: Linter.RuleEntry<UnicornCatchErrorName>;
  /**
   * Use destructured variables over properties.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/consistent-destructuring.md
   */
  "unicorn/consistent-destructuring"?: Linter.RuleEntry<[]>;
  /**
   * Prefer consistent types when spreading a ternary in an array literal.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/consistent-empty-array-spread.md
   */
  "unicorn/consistent-empty-array-spread"?: Linter.RuleEntry<[]>;
  /**
   * Move function definitions to the highest possible scope.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/consistent-function-scoping.md
   */
  "unicorn/consistent-function-scoping"?: Linter.RuleEntry<UnicornConsistentFunctionScoping>;
  /**
   * Enforce correct `Error` subclassing.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/custom-error-definition.md
   */
  "unicorn/custom-error-definition"?: Linter.RuleEntry<[]>;
  /**
   * Enforce no spaces between braces.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/empty-brace-spaces.md
   */
  "unicorn/empty-brace-spaces"?: Linter.RuleEntry<[]>;
  /**
   * Enforce passing a `message` value when creating a built-in error.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/error-message.md
   */
  "unicorn/error-message"?: Linter.RuleEntry<[]>;
  /**
   * Require escape sequences to use uppercase values.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/escape-case.md
   */
  "unicorn/escape-case"?: Linter.RuleEntry<[]>;
  /**
   * Add expiration conditions to TODO comments.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/expiring-todo-comments.md
   */
  "unicorn/expiring-todo-comments"?: Linter.RuleEntry<UnicornExpiringTodoComments>;
  /**
   * Enforce explicitly comparing the `length` or `size` property of a value.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/explicit-length-check.md
   */
  "unicorn/explicit-length-check"?: Linter.RuleEntry<UnicornExplicitLengthCheck>;
  /**
   * Enforce a case style for filenames.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/filename-case.md
   */
  "unicorn/filename-case"?: Linter.RuleEntry<UnicornFilenameCase>;
  /**
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/deprecated-rules.md#import-index
   * @deprecated
   */
  "unicorn/import-index"?: Linter.RuleEntry<[]>;
  /**
   * Enforce specific import styles per module.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/import-style.md
   */
  "unicorn/import-style"?: Linter.RuleEntry<UnicornImportStyle>;
  /**
   * Enforce the use of `new` for all builtins, except `String`, `Number`, `Boolean`, `Symbol` and `BigInt`.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/new-for-builtins.md
   */
  "unicorn/new-for-builtins"?: Linter.RuleEntry<[]>;
  /**
   * Enforce specifying rules to disable in `eslint-disable` comments.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/no-abusive-eslint-disable.md
   */
  "unicorn/no-abusive-eslint-disable"?: Linter.RuleEntry<[]>;
  /**
   * Disallow anonymous functions and classes as the default export.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/no-anonymous-default-export.md
   */
  "unicorn/no-anonymous-default-export"?: Linter.RuleEntry<[]>;
  /**
   * Prevent passing a function reference directly to iterator methods.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/no-array-callback-reference.md
   */
  "unicorn/no-array-callback-reference"?: Linter.RuleEntry<[]>;
  /**
   * Prefer `for…of` over the `forEach` method.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/no-array-for-each.md
   */
  "unicorn/no-array-for-each"?: Linter.RuleEntry<[]>;
  /**
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/deprecated-rules.md#no-array-instanceof
   * @deprecated
   */
  "unicorn/no-array-instanceof"?: Linter.RuleEntry<[]>;
  /**
   * Disallow using the `this` argument in array methods.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/no-array-method-this-argument.md
   */
  "unicorn/no-array-method-this-argument"?: Linter.RuleEntry<[]>;
  /**
   * Enforce combining multiple `Array#push()` into one call.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/no-array-push-push.md
   */
  "unicorn/no-array-push-push"?: Linter.RuleEntry<UnicornNoArrayPushPush>;
  /**
   * Disallow `Array#reduce()` and `Array#reduceRight()`.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/no-array-reduce.md
   */
  "unicorn/no-array-reduce"?: Linter.RuleEntry<UnicornNoArrayReduce>;
  /**
   * Disallow member access from await expression.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/no-await-expression-member.md
   */
  "unicorn/no-await-expression-member"?: Linter.RuleEntry<[]>;
  /**
   * Disallow using `await` in `Promise` method parameters.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/no-await-in-promise-methods.md
   */
  "unicorn/no-await-in-promise-methods"?: Linter.RuleEntry<[]>;
  /**
   * Do not use leading/trailing space between `console.log` parameters.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/no-console-spaces.md
   */
  "unicorn/no-console-spaces"?: Linter.RuleEntry<[]>;
  /**
   * Do not use `document.cookie` directly.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/no-document-cookie.md
   */
  "unicorn/no-document-cookie"?: Linter.RuleEntry<[]>;
  /**
   * Disallow empty files.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/no-empty-file.md
   */
  "unicorn/no-empty-file"?: Linter.RuleEntry<[]>;
  /**
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/deprecated-rules.md#no-fn-reference-in-iterator
   * @deprecated
   */
  "unicorn/no-fn-reference-in-iterator"?: Linter.RuleEntry<[]>;
  /**
   * Do not use a `for` loop that can be replaced with a `for-of` loop.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/no-for-loop.md
   */
  "unicorn/no-for-loop"?: Linter.RuleEntry<[]>;
  /**
   * Enforce the use of Unicode escapes instead of hexadecimal escapes.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/no-hex-escape.md
   */
  "unicorn/no-hex-escape"?: Linter.RuleEntry<[]>;
  /**
   * Require `Array.isArray()` instead of `instanceof Array`.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/no-instanceof-array.md
   */
  "unicorn/no-instanceof-array"?: Linter.RuleEntry<[]>;
  /**
   * Disallow invalid options in `fetch()` and `new Request()`.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/no-invalid-fetch-options.md
   */
  "unicorn/no-invalid-fetch-options"?: Linter.RuleEntry<[]>;
  /**
   * Prevent calling `EventTarget#removeEventListener()` with the result of an expression.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/no-invalid-remove-event-listener.md
   */
  "unicorn/no-invalid-remove-event-listener"?: Linter.RuleEntry<[]>;
  /**
   * Disallow identifiers starting with `new` or `class`.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/no-keyword-prefix.md
   */
  "unicorn/no-keyword-prefix"?: Linter.RuleEntry<UnicornNoKeywordPrefix>;
  /**
   * Disallow `if` statements as the only statement in `if` blocks without `else`.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/no-lonely-if.md
   */
  "unicorn/no-lonely-if"?: Linter.RuleEntry<[]>;
  /**
   * Disallow a magic number as the `depth` argument in `Array#flat(…).`
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/no-magic-array-flat-depth.md
   */
  "unicorn/no-magic-array-flat-depth"?: Linter.RuleEntry<[]>;
  /**
   * Disallow negated conditions.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/no-negated-condition.md
   */
  "unicorn/no-negated-condition"?: Linter.RuleEntry<[]>;
  /**
   * Disallow negated expression in equality check.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/no-negation-in-equality-check.md
   */
  "unicorn/no-negation-in-equality-check"?: Linter.RuleEntry<[]>;
  /**
   * Disallow nested ternary expressions.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/no-nested-ternary.md
   */
  "unicorn/no-nested-ternary"?: Linter.RuleEntry<[]>;
  /**
   * Disallow `new Array()`.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/no-new-array.md
   */
  "unicorn/no-new-array"?: Linter.RuleEntry<[]>;
  /**
   * Enforce the use of `Buffer.from()` and `Buffer.alloc()` instead of the deprecated `new Buffer()`.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/no-new-buffer.md
   */
  "unicorn/no-new-buffer"?: Linter.RuleEntry<[]>;
  /**
   * Disallow the use of the `null` literal.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/no-null.md
   */
  "unicorn/no-null"?: Linter.RuleEntry<UnicornNoNull>;
  /**
   * Disallow the use of objects as default parameters.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/no-object-as-default-parameter.md
   */
  "unicorn/no-object-as-default-parameter"?: Linter.RuleEntry<[]>;
  /**
   * Disallow `process.exit()`.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/no-process-exit.md
   */
  "unicorn/no-process-exit"?: Linter.RuleEntry<[]>;
  /**
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/deprecated-rules.md#no-reduce
   * @deprecated
   */
  "unicorn/no-reduce"?: Linter.RuleEntry<[]>;
  /**
   * Disallow passing single-element arrays to `Promise` methods.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/no-single-promise-in-promise-methods.md
   */
  "unicorn/no-single-promise-in-promise-methods"?: Linter.RuleEntry<[]>;
  /**
   * Disallow classes that only have static members.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/no-static-only-class.md
   */
  "unicorn/no-static-only-class"?: Linter.RuleEntry<[]>;
  /**
   * Disallow `then` property.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/no-thenable.md
   */
  "unicorn/no-thenable"?: Linter.RuleEntry<[]>;
  /**
   * Disallow assigning `this` to a variable.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/no-this-assignment.md
   */
  "unicorn/no-this-assignment"?: Linter.RuleEntry<[]>;
  /**
   * Disallow comparing `undefined` using `typeof`.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/no-typeof-undefined.md
   */
  "unicorn/no-typeof-undefined"?: Linter.RuleEntry<UnicornNoTypeofUndefined>;
  /**
   * Disallow awaiting non-promise values.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/no-unnecessary-await.md
   */
  "unicorn/no-unnecessary-await"?: Linter.RuleEntry<[]>;
  /**
   * Enforce the use of built-in methods instead of unnecessary polyfills.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/no-unnecessary-polyfills.md
   */
  "unicorn/no-unnecessary-polyfills"?: Linter.RuleEntry<UnicornNoUnnecessaryPolyfills>;
  /**
   * Disallow unreadable array destructuring.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/no-unreadable-array-destructuring.md
   */
  "unicorn/no-unreadable-array-destructuring"?: Linter.RuleEntry<[]>;
  /**
   * Disallow unreadable IIFEs.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/no-unreadable-iife.md
   */
  "unicorn/no-unreadable-iife"?: Linter.RuleEntry<[]>;
  /**
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/deprecated-rules.md#no-unsafe-regex
   * @deprecated
   */
  "unicorn/no-unsafe-regex"?: Linter.RuleEntry<[]>;
  /**
   * Disallow unused object properties.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/no-unused-properties.md
   */
  "unicorn/no-unused-properties"?: Linter.RuleEntry<[]>;
  /**
   * Disallow useless fallback when spreading in object literals.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/no-useless-fallback-in-spread.md
   */
  "unicorn/no-useless-fallback-in-spread"?: Linter.RuleEntry<[]>;
  /**
   * Disallow useless array length check.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/no-useless-length-check.md
   */
  "unicorn/no-useless-length-check"?: Linter.RuleEntry<[]>;
  /**
   * Disallow returning/yielding `Promise.resolve/reject()` in async functions or promise callbacks
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/no-useless-promise-resolve-reject.md
   */
  "unicorn/no-useless-promise-resolve-reject"?: Linter.RuleEntry<[]>;
  /**
   * Disallow unnecessary spread.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/no-useless-spread.md
   */
  "unicorn/no-useless-spread"?: Linter.RuleEntry<[]>;
  /**
   * Disallow useless case in switch statements.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/no-useless-switch-case.md
   */
  "unicorn/no-useless-switch-case"?: Linter.RuleEntry<[]>;
  /**
   * Disallow useless `undefined`.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/no-useless-undefined.md
   */
  "unicorn/no-useless-undefined"?: Linter.RuleEntry<UnicornNoUselessUndefined>;
  /**
   * Disallow number literals with zero fractions or dangling dots.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/no-zero-fractions.md
   */
  "unicorn/no-zero-fractions"?: Linter.RuleEntry<[]>;
  /**
   * Enforce proper case for numeric literals.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/number-literal-case.md
   */
  "unicorn/number-literal-case"?: Linter.RuleEntry<[]>;
  /**
   * Enforce the style of numeric separators by correctly grouping digits.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/numeric-separators-style.md
   */
  "unicorn/numeric-separators-style"?: Linter.RuleEntry<UnicornNumericSeparatorsStyle>;
  /**
   * Prefer `.addEventListener()` and `.removeEventListener()` over `on`-functions.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/prefer-add-event-listener.md
   */
  "unicorn/prefer-add-event-listener"?: Linter.RuleEntry<UnicornPreferAddEventListener>;
  /**
   * Prefer `.find(…)` and `.findLast(…)` over the first or last element from `.filter(…)`.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/prefer-array-find.md
   */
  "unicorn/prefer-array-find"?: Linter.RuleEntry<UnicornPreferArrayFind>;
  /**
   * Prefer `Array#flat()` over legacy techniques to flatten arrays.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/prefer-array-flat.md
   */
  "unicorn/prefer-array-flat"?: Linter.RuleEntry<UnicornPreferArrayFlat>;
  /**
   * Prefer `.flatMap(…)` over `.map(…).flat()`.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/prefer-array-flat-map.md
   */
  "unicorn/prefer-array-flat-map"?: Linter.RuleEntry<[]>;
  /**
   * Prefer `Array#{indexOf,lastIndexOf}()` over `Array#{findIndex,findLastIndex}()` when looking for the index of an item.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/prefer-array-index-of.md
   */
  "unicorn/prefer-array-index-of"?: Linter.RuleEntry<[]>;
  /**
   * Prefer `.some(…)` over `.filter(…).length` check and `.{find,findLast,findIndex,findLastIndex}(…)`.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/prefer-array-some.md
   */
  "unicorn/prefer-array-some"?: Linter.RuleEntry<[]>;
  /**
   * Prefer `.at()` method for index access and `String#charAt()`.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/prefer-at.md
   */
  "unicorn/prefer-at"?: Linter.RuleEntry<UnicornPreferAt>;
  /**
   * Prefer `Blob#arrayBuffer()` over `FileReader#readAsArrayBuffer(…)` and `Blob#text()` over `FileReader#readAsText(…)`.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/prefer-blob-reading-methods.md
   */
  "unicorn/prefer-blob-reading-methods"?: Linter.RuleEntry<[]>;
  /**
   * Prefer `String#codePointAt(…)` over `String#charCodeAt(…)` and `String.fromCodePoint(…)` over `String.fromCharCode(…)`.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/prefer-code-point.md
   */
  "unicorn/prefer-code-point"?: Linter.RuleEntry<[]>;
  /**
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/deprecated-rules.md#prefer-dataset
   * @deprecated
   */
  "unicorn/prefer-dataset"?: Linter.RuleEntry<[]>;
  /**
   * Prefer `Date.now()` to get the number of milliseconds since the Unix Epoch.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/prefer-date-now.md
   */
  "unicorn/prefer-date-now"?: Linter.RuleEntry<[]>;
  /**
   * Prefer default parameters over reassignment.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/prefer-default-parameters.md
   */
  "unicorn/prefer-default-parameters"?: Linter.RuleEntry<[]>;
  /**
   * Prefer `Node#append()` over `Node#appendChild()`.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/prefer-dom-node-append.md
   */
  "unicorn/prefer-dom-node-append"?: Linter.RuleEntry<[]>;
  /**
   * Prefer using `.dataset` on DOM elements over calling attribute methods.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/prefer-dom-node-dataset.md
   */
  "unicorn/prefer-dom-node-dataset"?: Linter.RuleEntry<[]>;
  /**
   * Prefer `childNode.remove()` over `parentNode.removeChild(childNode)`.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/prefer-dom-node-remove.md
   */
  "unicorn/prefer-dom-node-remove"?: Linter.RuleEntry<[]>;
  /**
   * Prefer `.textContent` over `.innerText`.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/prefer-dom-node-text-content.md
   */
  "unicorn/prefer-dom-node-text-content"?: Linter.RuleEntry<[]>;
  /**
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/deprecated-rules.md#prefer-event-key
   * @deprecated
   */
  "unicorn/prefer-event-key"?: Linter.RuleEntry<[]>;
  /**
   * Prefer `EventTarget` over `EventEmitter`.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/prefer-event-target.md
   */
  "unicorn/prefer-event-target"?: Linter.RuleEntry<[]>;
  /**
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/deprecated-rules.md#prefer-exponentiation-operator
   * @deprecated
   */
  "unicorn/prefer-exponentiation-operator"?: Linter.RuleEntry<[]>;
  /**
   * Prefer `export…from` when re-exporting.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/prefer-export-from.md
   */
  "unicorn/prefer-export-from"?: Linter.RuleEntry<UnicornPreferExportFrom>;
  /**
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/deprecated-rules.md#prefer-flat-map
   * @deprecated
   */
  "unicorn/prefer-flat-map"?: Linter.RuleEntry<[]>;
  /**
   * Prefer `.includes()` over `.indexOf()`, `.lastIndexOf()`, and `Array#some()` when checking for existence or non-existence.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/prefer-includes.md
   */
  "unicorn/prefer-includes"?: Linter.RuleEntry<[]>;
  /**
   * Prefer reading a JSON file as a buffer.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/prefer-json-parse-buffer.md
   */
  "unicorn/prefer-json-parse-buffer"?: Linter.RuleEntry<[]>;
  /**
   * Prefer `KeyboardEvent#key` over `KeyboardEvent#keyCode`.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/prefer-keyboard-event-key.md
   */
  "unicorn/prefer-keyboard-event-key"?: Linter.RuleEntry<[]>;
  /**
   * Prefer using a logical operator over a ternary.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/prefer-logical-operator-over-ternary.md
   */
  "unicorn/prefer-logical-operator-over-ternary"?: Linter.RuleEntry<[]>;
  /**
   * Enforce the use of `Math.trunc` instead of bitwise operators.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/prefer-math-trunc.md
   */
  "unicorn/prefer-math-trunc"?: Linter.RuleEntry<[]>;
  /**
   * Prefer `.before()` over `.insertBefore()`, `.replaceWith()` over `.replaceChild()`, prefer one of `.before()`, `.after()`, `.append()` or `.prepend()` over `insertAdjacentText()` and `insertAdjacentElement()`.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/prefer-modern-dom-apis.md
   */
  "unicorn/prefer-modern-dom-apis"?: Linter.RuleEntry<[]>;
  /**
   * Prefer modern `Math` APIs over legacy patterns.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/prefer-modern-math-apis.md
   */
  "unicorn/prefer-modern-math-apis"?: Linter.RuleEntry<[]>;
  /**
   * Prefer JavaScript modules (ESM) over CommonJS.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/prefer-module.md
   */
  "unicorn/prefer-module"?: Linter.RuleEntry<[]>;
  /**
   * Prefer using `String`, `Number`, `BigInt`, `Boolean`, and `Symbol` directly.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/prefer-native-coercion-functions.md
   */
  "unicorn/prefer-native-coercion-functions"?: Linter.RuleEntry<[]>;
  /**
   * Prefer negative index over `.length - index` when possible.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/prefer-negative-index.md
   */
  "unicorn/prefer-negative-index"?: Linter.RuleEntry<[]>;
  /**
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/deprecated-rules.md#prefer-node-append
   * @deprecated
   */
  "unicorn/prefer-node-append"?: Linter.RuleEntry<[]>;
  /**
   * Prefer using the `node:` protocol when importing Node.js builtin modules.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/prefer-node-protocol.md
   */
  "unicorn/prefer-node-protocol"?: Linter.RuleEntry<[]>;
  /**
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/deprecated-rules.md#prefer-node-remove
   * @deprecated
   */
  "unicorn/prefer-node-remove"?: Linter.RuleEntry<[]>;
  /**
   * Prefer `Number` static properties over global ones.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/prefer-number-properties.md
   */
  "unicorn/prefer-number-properties"?: Linter.RuleEntry<UnicornPreferNumberProperties>;
  /**
   * Prefer using `Object.fromEntries(…)` to transform a list of key-value pairs into an object.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/prefer-object-from-entries.md
   */
  "unicorn/prefer-object-from-entries"?: Linter.RuleEntry<UnicornPreferObjectFromEntries>;
  /**
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/deprecated-rules.md#prefer-object-has-own
   * @deprecated
   */
  "unicorn/prefer-object-has-own"?: Linter.RuleEntry<[]>;
  /**
   * Prefer omitting the `catch` binding parameter.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/prefer-optional-catch-binding.md
   */
  "unicorn/prefer-optional-catch-binding"?: Linter.RuleEntry<[]>;
  /**
   * Prefer borrowing methods from the prototype instead of the instance.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/prefer-prototype-methods.md
   */
  "unicorn/prefer-prototype-methods"?: Linter.RuleEntry<[]>;
  /**
   * Prefer `.querySelector()` over `.getElementById()`, `.querySelectorAll()` over `.getElementsByClassName()` and `.getElementsByTagName()`.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/prefer-query-selector.md
   */
  "unicorn/prefer-query-selector"?: Linter.RuleEntry<[]>;
  /**
   * Prefer `Reflect.apply()` over `Function#apply()`.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/prefer-reflect-apply.md
   */
  "unicorn/prefer-reflect-apply"?: Linter.RuleEntry<[]>;
  /**
   * Prefer `RegExp#test()` over `String#match()` and `RegExp#exec()`.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/prefer-regexp-test.md
   */
  "unicorn/prefer-regexp-test"?: Linter.RuleEntry<[]>;
  /**
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/deprecated-rules.md#prefer-replace-all
   * @deprecated
   */
  "unicorn/prefer-replace-all"?: Linter.RuleEntry<[]>;
  /**
   * Prefer `Set#has()` over `Array#includes()` when checking for existence or non-existence.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/prefer-set-has.md
   */
  "unicorn/prefer-set-has"?: Linter.RuleEntry<[]>;
  /**
   * Prefer using `Set#size` instead of `Array#length`.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/prefer-set-size.md
   */
  "unicorn/prefer-set-size"?: Linter.RuleEntry<[]>;
  /**
   * Prefer the spread operator over `Array.from(…)`, `Array#concat(…)`, `Array#{slice,toSpliced}()` and `String#split('')`.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/prefer-spread.md
   */
  "unicorn/prefer-spread"?: Linter.RuleEntry<[]>;
  /**
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/deprecated-rules.md#prefer-starts-ends-with
   * @deprecated
   */
  "unicorn/prefer-starts-ends-with"?: Linter.RuleEntry<[]>;
  /**
   * Prefer using the `String.raw` tag to avoid escaping `\`.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/prefer-string-raw.md
   */
  "unicorn/prefer-string-raw"?: Linter.RuleEntry<[]>;
  /**
   * Prefer `String#replaceAll()` over regex searches with the global flag.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/prefer-string-replace-all.md
   */
  "unicorn/prefer-string-replace-all"?: Linter.RuleEntry<[]>;
  /**
   * Prefer `String#slice()` over `String#substr()` and `String#substring()`.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/prefer-string-slice.md
   */
  "unicorn/prefer-string-slice"?: Linter.RuleEntry<[]>;
  /**
   * Prefer `String#startsWith()` & `String#endsWith()` over `RegExp#test()`.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/prefer-string-starts-ends-with.md
   */
  "unicorn/prefer-string-starts-ends-with"?: Linter.RuleEntry<[]>;
  /**
   * Prefer `String#trimStart()` / `String#trimEnd()` over `String#trimLeft()` / `String#trimRight()`.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/prefer-string-trim-start-end.md
   */
  "unicorn/prefer-string-trim-start-end"?: Linter.RuleEntry<[]>;
  /**
   * Prefer using `structuredClone` to create a deep clone.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/prefer-structured-clone.md
   */
  "unicorn/prefer-structured-clone"?: Linter.RuleEntry<UnicornPreferStructuredClone>;
  /**
   * Prefer `switch` over multiple `else-if`.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/prefer-switch.md
   */
  "unicorn/prefer-switch"?: Linter.RuleEntry<UnicornPreferSwitch>;
  /**
   * Prefer ternary expressions over simple `if-else` statements.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/prefer-ternary.md
   */
  "unicorn/prefer-ternary"?: Linter.RuleEntry<UnicornPreferTernary>;
  /**
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/deprecated-rules.md#prefer-text-content
   * @deprecated
   */
  "unicorn/prefer-text-content"?: Linter.RuleEntry<[]>;
  /**
   * Prefer top-level await over top-level promises and async function calls.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/prefer-top-level-await.md
   */
  "unicorn/prefer-top-level-await"?: Linter.RuleEntry<[]>;
  /**
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/deprecated-rules.md#prefer-trim-start-end
   * @deprecated
   */
  "unicorn/prefer-trim-start-end"?: Linter.RuleEntry<[]>;
  /**
   * Enforce throwing `TypeError` in type checking conditions.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/prefer-type-error.md
   */
  "unicorn/prefer-type-error"?: Linter.RuleEntry<[]>;
  /**
   * Prevent abbreviations.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/prevent-abbreviations.md
   */
  "unicorn/prevent-abbreviations"?: Linter.RuleEntry<UnicornPreventAbbreviations>;
  /**
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/deprecated-rules.md#regex-shorthand
   * @deprecated
   */
  "unicorn/regex-shorthand"?: Linter.RuleEntry<[]>;
  /**
   * Enforce consistent relative URL style.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/relative-url-style.md
   */
  "unicorn/relative-url-style"?: Linter.RuleEntry<UnicornRelativeUrlStyle>;
  /**
   * Enforce using the separator argument with `Array#join()`.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/require-array-join-separator.md
   */
  "unicorn/require-array-join-separator"?: Linter.RuleEntry<[]>;
  /**
   * Enforce using the digits argument with `Number#toFixed()`.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/require-number-to-fixed-digits-argument.md
   */
  "unicorn/require-number-to-fixed-digits-argument"?: Linter.RuleEntry<[]>;
  /**
   * Enforce using the `targetOrigin` argument with `window.postMessage()`.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/require-post-message-target-origin.md
   */
  "unicorn/require-post-message-target-origin"?: Linter.RuleEntry<[]>;
  /**
   * Enforce better string content.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/string-content.md
   */
  "unicorn/string-content"?: Linter.RuleEntry<UnicornStringContent>;
  /**
   * Enforce consistent brace style for `case` clauses.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/switch-case-braces.md
   */
  "unicorn/switch-case-braces"?: Linter.RuleEntry<UnicornSwitchCaseBraces>;
  /**
   * Fix whitespace-insensitive template indentation.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/template-indent.md
   */
  "unicorn/template-indent"?: Linter.RuleEntry<UnicornTemplateIndent>;
  /**
   * Enforce consistent case for text encoding identifiers.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/text-encoding-identifier-case.md
   */
  "unicorn/text-encoding-identifier-case"?: Linter.RuleEntry<[]>;
  /**
   * Require `new` when creating an error.
   * @see https://github.com/sindresorhus/eslint-plugin-unicorn/blob/v54.0.0/docs/rules/throw-new-error.md
   */
  "unicorn/throw-new-error"?: Linter.RuleEntry<[]>;
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
// ----- @typescript-eslint/array-type -----
type TypescriptEslintArrayType =
  | []
  | [
      {
        default?: "array" | "generic" | "array-simple";

        readonly?: "array" | "generic" | "array-simple";
      }
    ];
// ----- @typescript-eslint/ban-ts-comment -----
type TypescriptEslintBanTsComment =
  | []
  | [
      {
        "ts-expect-error"?:
          | boolean
          | "allow-with-description"
          | {
              descriptionFormat?: string;
            };
        "ts-ignore"?:
          | boolean
          | "allow-with-description"
          | {
              descriptionFormat?: string;
            };
        "ts-nocheck"?:
          | boolean
          | "allow-with-description"
          | {
              descriptionFormat?: string;
            };
        "ts-check"?:
          | boolean
          | "allow-with-description"
          | {
              descriptionFormat?: string;
            };
        minimumDescriptionLength?: number;
      }
    ];
// ----- @typescript-eslint/ban-types -----
type TypescriptEslintBanTypes =
  | []
  | [
      {
        types?: {
          [k: string]:
            | (
                | null
                | false
                | true
                | string
                | {
                    message?: string;

                    fixWith?: string;

                    suggest?: string[];
                  }
              )
            | undefined;
        };
        extendDefaults?: boolean;
      }
    ];
// ----- @typescript-eslint/block-spacing -----
type TypescriptEslintBlockSpacing = [] | ["always" | "never"];
// ----- @typescript-eslint/brace-style -----
type TypescriptEslintBraceStyle =
  | []
  | ["1tbs" | "stroustrup" | "allman"]
  | [
      "1tbs" | "stroustrup" | "allman",
      {
        allowSingleLine?: boolean;
      }
    ];
// ----- @typescript-eslint/class-literal-property-style -----
type TypescriptEslintClassLiteralPropertyStyle = [] | ["fields" | "getters"];
// ----- @typescript-eslint/class-methods-use-this -----
type TypescriptEslintClassMethodsUseThis =
  | []
  | [
      {
        exceptMethods?: string[];

        enforceForClassFields?: boolean;

        ignoreOverrideMethods?: boolean;

        ignoreClassesThatImplementAnInterface?: boolean | "public-fields";
      }
    ];
// ----- @typescript-eslint/comma-dangle -----
type TypescriptEslintCommaDangle =
  | []
  | [
      | _TypescriptEslintCommaDangleValue
      | {
          arrays?: _TypescriptEslintCommaDangleValueWithIgnore;
          objects?: _TypescriptEslintCommaDangleValueWithIgnore;
          imports?: _TypescriptEslintCommaDangleValueWithIgnore;
          exports?: _TypescriptEslintCommaDangleValueWithIgnore;
          functions?: _TypescriptEslintCommaDangleValueWithIgnore;
          enums?: _TypescriptEslintCommaDangleValueWithIgnore;
          generics?: _TypescriptEslintCommaDangleValueWithIgnore;
          tuples?: _TypescriptEslintCommaDangleValueWithIgnore;
        }
    ];
type _TypescriptEslintCommaDangleValue =
  | "always-multiline"
  | "always"
  | "never"
  | "only-multiline";
type _TypescriptEslintCommaDangleValueWithIgnore =
  | "always-multiline"
  | "always"
  | "never"
  | "only-multiline"
  | "ignore";
// ----- @typescript-eslint/comma-spacing -----
type TypescriptEslintCommaSpacing =
  | []
  | [
      {
        before?: boolean;
        after?: boolean;
      }
    ];
// ----- @typescript-eslint/consistent-generic-constructors -----
type TypescriptEslintConsistentGenericConstructors =
  | []
  | ["type-annotation" | "constructor"];
// ----- @typescript-eslint/consistent-indexed-object-style -----
type TypescriptEslintConsistentIndexedObjectStyle =
  | []
  | ["record" | "index-signature"];
// ----- @typescript-eslint/consistent-return -----
type TypescriptEslintConsistentReturn =
  | []
  | [
      {
        treatUndefinedAsUnspecified?: boolean;
      }
    ];
// ----- @typescript-eslint/consistent-type-assertions -----
type TypescriptEslintConsistentTypeAssertions =
  | []
  | [
      | {
          assertionStyle: "never";
        }
      | {
          assertionStyle: "as" | "angle-bracket";
          objectLiteralTypeAssertions?:
            | "allow"
            | "allow-as-parameter"
            | "never";
        }
    ];
// ----- @typescript-eslint/consistent-type-definitions -----
type TypescriptEslintConsistentTypeDefinitions = [] | ["interface" | "type"];
// ----- @typescript-eslint/consistent-type-exports -----
type TypescriptEslintConsistentTypeExports =
  | []
  | [
      {
        fixMixedExportsWithInlineTypeSpecifier?: boolean;
      }
    ];
// ----- @typescript-eslint/consistent-type-imports -----
type TypescriptEslintConsistentTypeImports =
  | []
  | [
      {
        disallowTypeAnnotations?: boolean;
        fixStyle?: "separate-type-imports" | "inline-type-imports";
        prefer?: "type-imports" | "no-type-imports";
      }
    ];
// ----- @typescript-eslint/dot-notation -----
type TypescriptEslintDotNotation =
  | []
  | [
      {
        allowKeywords?: boolean;
        allowPattern?: string;
        allowPrivateClassPropertyAccess?: boolean;
        allowProtectedClassPropertyAccess?: boolean;
        allowIndexSignaturePropertyAccess?: boolean;
      }
    ];
// ----- @typescript-eslint/explicit-function-return-type -----
type TypescriptEslintExplicitFunctionReturnType =
  | []
  | [
      {
        allowConciseArrowFunctionExpressionsStartingWithVoid?: boolean;

        allowExpressions?: boolean;

        allowHigherOrderFunctions?: boolean;

        allowTypedFunctionExpressions?: boolean;

        allowDirectConstAssertionInArrowFunctions?: boolean;

        allowFunctionsWithoutTypeParameters?: boolean;

        allowedNames?: string[];

        allowIIFEs?: boolean;
      }
    ];
// ----- @typescript-eslint/explicit-member-accessibility -----
type TypescriptEslintExplicitMemberAccessibility =
  | []
  | [
      {
        accessibility?: "explicit" | "no-public" | "off";
        overrides?: {
          accessors?: "explicit" | "no-public" | "off";
          constructors?: "explicit" | "no-public" | "off";
          methods?: "explicit" | "no-public" | "off";
          properties?: "explicit" | "no-public" | "off";
          parameterProperties?: "explicit" | "no-public" | "off";
        };
        ignoredMethodNames?: string[];
      }
    ];
// ----- @typescript-eslint/explicit-module-boundary-types -----
type TypescriptEslintExplicitModuleBoundaryTypes =
  | []
  | [
      {
        allowArgumentsExplicitlyTypedAsAny?: boolean;

        allowDirectConstAssertionInArrowFunctions?: boolean;

        allowedNames?: string[];

        allowHigherOrderFunctions?: boolean;

        allowTypedFunctionExpressions?: boolean;
      }
    ];
// ----- @typescript-eslint/func-call-spacing -----
type TypescriptEslintFuncCallSpacing =
  | []
  | ["never"]
  | []
  | ["always"]
  | [
      "always",
      {
        allowNewlines?: boolean;
      }
    ];
// ----- @typescript-eslint/indent -----
type TypescriptEslintIndent =
  | []
  | ["tab" | number]
  | [
      "tab" | number,
      {
        SwitchCase?: number;
        VariableDeclarator?:
          | (number | ("first" | "off"))
          | {
              var?: number | ("first" | "off");
              let?: number | ("first" | "off");
              const?: number | ("first" | "off");
            };
        outerIIFEBody?: number | "off";
        MemberExpression?: number | "off";
        FunctionDeclaration?: {
          parameters?: number | ("first" | "off");
          body?: number;
        };
        FunctionExpression?: {
          parameters?: number | ("first" | "off");
          body?: number;
        };
        StaticBlock?: {
          body?: number;
        };
        CallExpression?: {
          arguments?: number | ("first" | "off");
        };
        ArrayExpression?: number | ("first" | "off");
        ObjectExpression?: number | ("first" | "off");
        ImportDeclaration?: number | ("first" | "off");
        flatTernaryExpressions?: boolean;
        offsetTernaryExpressions?: boolean;
        ignoredNodes?: string[];
        ignoreComments?: boolean;
      }
    ];
// ----- @typescript-eslint/init-declarations -----
type TypescriptEslintInitDeclarations =
  | []
  | ["always"]
  | []
  | ["never"]
  | [
      "never",
      {
        ignoreForLoopInit?: boolean;
      }
    ];
// ----- @typescript-eslint/key-spacing -----
type TypescriptEslintKeySpacing =
  | []
  | [
      | {
          align?:
            | ("colon" | "value")
            | {
                mode?: "strict" | "minimum";
                on?: "colon" | "value";
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
                  mode?: "strict" | "minimum";
                  on?: "colon" | "value";
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
            mode?: "strict" | "minimum";
            on?: "colon" | "value";
            beforeColon?: boolean;
            afterColon?: boolean;
          };
        }
    ];
// ----- @typescript-eslint/keyword-spacing -----
type TypescriptEslintKeywordSpacing =
  | []
  | [
      {
        before?: boolean;
        after?: boolean;
        overrides?: {
          abstract?: {
            before?: boolean;
            after?: boolean;
          };
          as?: {
            before?: boolean;
            after?: boolean;
          };
          async?: {
            before?: boolean;
            after?: boolean;
          };
          await?: {
            before?: boolean;
            after?: boolean;
          };
          boolean?: {
            before?: boolean;
            after?: boolean;
          };
          break?: {
            before?: boolean;
            after?: boolean;
          };
          byte?: {
            before?: boolean;
            after?: boolean;
          };
          case?: {
            before?: boolean;
            after?: boolean;
          };
          catch?: {
            before?: boolean;
            after?: boolean;
          };
          char?: {
            before?: boolean;
            after?: boolean;
          };
          class?: {
            before?: boolean;
            after?: boolean;
          };
          const?: {
            before?: boolean;
            after?: boolean;
          };
          continue?: {
            before?: boolean;
            after?: boolean;
          };
          debugger?: {
            before?: boolean;
            after?: boolean;
          };
          default?: {
            before?: boolean;
            after?: boolean;
          };
          delete?: {
            before?: boolean;
            after?: boolean;
          };
          do?: {
            before?: boolean;
            after?: boolean;
          };
          double?: {
            before?: boolean;
            after?: boolean;
          };
          else?: {
            before?: boolean;
            after?: boolean;
          };
          enum?: {
            before?: boolean;
            after?: boolean;
          };
          export?: {
            before?: boolean;
            after?: boolean;
          };
          extends?: {
            before?: boolean;
            after?: boolean;
          };
          false?: {
            before?: boolean;
            after?: boolean;
          };
          final?: {
            before?: boolean;
            after?: boolean;
          };
          finally?: {
            before?: boolean;
            after?: boolean;
          };
          float?: {
            before?: boolean;
            after?: boolean;
          };
          for?: {
            before?: boolean;
            after?: boolean;
          };
          from?: {
            before?: boolean;
            after?: boolean;
          };
          function?: {
            before?: boolean;
            after?: boolean;
          };
          get?: {
            before?: boolean;
            after?: boolean;
          };
          goto?: {
            before?: boolean;
            after?: boolean;
          };
          if?: {
            before?: boolean;
            after?: boolean;
          };
          implements?: {
            before?: boolean;
            after?: boolean;
          };
          import?: {
            before?: boolean;
            after?: boolean;
          };
          in?: {
            before?: boolean;
            after?: boolean;
          };
          instanceof?: {
            before?: boolean;
            after?: boolean;
          };
          int?: {
            before?: boolean;
            after?: boolean;
          };
          interface?: {
            before?: boolean;
            after?: boolean;
          };
          let?: {
            before?: boolean;
            after?: boolean;
          };
          long?: {
            before?: boolean;
            after?: boolean;
          };
          native?: {
            before?: boolean;
            after?: boolean;
          };
          new?: {
            before?: boolean;
            after?: boolean;
          };
          null?: {
            before?: boolean;
            after?: boolean;
          };
          of?: {
            before?: boolean;
            after?: boolean;
          };
          package?: {
            before?: boolean;
            after?: boolean;
          };
          private?: {
            before?: boolean;
            after?: boolean;
          };
          protected?: {
            before?: boolean;
            after?: boolean;
          };
          public?: {
            before?: boolean;
            after?: boolean;
          };
          return?: {
            before?: boolean;
            after?: boolean;
          };
          set?: {
            before?: boolean;
            after?: boolean;
          };
          short?: {
            before?: boolean;
            after?: boolean;
          };
          static?: {
            before?: boolean;
            after?: boolean;
          };
          super?: {
            before?: boolean;
            after?: boolean;
          };
          switch?: {
            before?: boolean;
            after?: boolean;
          };
          synchronized?: {
            before?: boolean;
            after?: boolean;
          };
          this?: {
            before?: boolean;
            after?: boolean;
          };
          throw?: {
            before?: boolean;
            after?: boolean;
          };
          throws?: {
            before?: boolean;
            after?: boolean;
          };
          transient?: {
            before?: boolean;
            after?: boolean;
          };
          true?: {
            before?: boolean;
            after?: boolean;
          };
          try?: {
            before?: boolean;
            after?: boolean;
          };
          typeof?: {
            before?: boolean;
            after?: boolean;
          };
          var?: {
            before?: boolean;
            after?: boolean;
          };
          void?: {
            before?: boolean;
            after?: boolean;
          };
          volatile?: {
            before?: boolean;
            after?: boolean;
          };
          while?: {
            before?: boolean;
            after?: boolean;
          };
          with?: {
            before?: boolean;
            after?: boolean;
          };
          yield?: {
            before?: boolean;
            after?: boolean;
          };
          type?: {
            before?: boolean;
            after?: boolean;
          };
        };
      }
    ];
// ----- @typescript-eslint/lines-around-comment -----
type TypescriptEslintLinesAroundComment =
  | []
  | [
      {
        beforeBlockComment?: boolean;
        afterBlockComment?: boolean;
        beforeLineComment?: boolean;
        afterLineComment?: boolean;
        allowBlockStart?: boolean;
        allowBlockEnd?: boolean;
        allowClassStart?: boolean;
        allowClassEnd?: boolean;
        allowObjectStart?: boolean;
        allowObjectEnd?: boolean;
        allowArrayStart?: boolean;
        allowArrayEnd?: boolean;
        allowInterfaceStart?: boolean;
        allowInterfaceEnd?: boolean;
        allowTypeStart?: boolean;
        allowTypeEnd?: boolean;
        allowEnumStart?: boolean;
        allowEnumEnd?: boolean;
        allowModuleStart?: boolean;
        allowModuleEnd?: boolean;
        ignorePattern?: string;
        applyDefaultIgnorePatterns?: boolean;
      }
    ];
// ----- @typescript-eslint/lines-between-class-members -----
type TypescriptEslintLinesBetweenClassMembers =
  | []
  | [
      | {
          enforce: [
            {
              blankLine: "always" | "never";
              prev: "method" | "field" | "*";
              next: "method" | "field" | "*";
            },
            ...{
              blankLine: "always" | "never";
              prev: "method" | "field" | "*";
              next: "method" | "field" | "*";
            }[]
          ];
        }
      | ("always" | "never")
    ]
  | [
      (
        | {
            enforce: [
              {
                blankLine: "always" | "never";
                prev: "method" | "field" | "*";
                next: "method" | "field" | "*";
              },
              ...{
                blankLine: "always" | "never";
                prev: "method" | "field" | "*";
                next: "method" | "field" | "*";
              }[]
            ];
          }
        | ("always" | "never")
      ),
      {
        exceptAfterSingleLine?: boolean;
        exceptAfterOverload?: boolean;
      }
    ];
// ----- @typescript-eslint/max-params -----
type TypescriptEslintMaxParams =
  | []
  | [
      {
        maximum?: number;
        max?: number;
        countVoidThis?: boolean;
      }
    ];
// ----- @typescript-eslint/member-delimiter-style -----
type TypescriptEslintMemberDelimiterStyle =
  | []
  | [
      {
        multiline?: {
          delimiter?: "none" | "semi" | "comma";
          requireLast?: boolean;
        };
        singleline?: {
          delimiter?: "semi" | "comma";
          requireLast?: boolean;
        };
        overrides?: {
          interface?: _TypescriptEslintMemberDelimiterStyle_DelimiterConfig;
          typeLiteral?: _TypescriptEslintMemberDelimiterStyle_DelimiterConfig;
        };
        multilineDetection?: "brackets" | "last-member";
      }
    ];
interface _TypescriptEslintMemberDelimiterStyle_DelimiterConfig {
  multiline?: {
    delimiter?: "none" | "semi" | "comma";
    requireLast?: boolean;
  };
  singleline?: {
    delimiter?: "semi" | "comma";
    requireLast?: boolean;
  };
}
// ----- @typescript-eslint/member-ordering -----
type TypescriptEslintMemberOrdering =
  | []
  | [
      {
        default?:
          | "never"
          | (
              | (
                  | "readonly-signature"
                  | "signature"
                  | "readonly-field"
                  | "public-readonly-field"
                  | "public-decorated-readonly-field"
                  | "decorated-readonly-field"
                  | "static-readonly-field"
                  | "public-static-readonly-field"
                  | "instance-readonly-field"
                  | "public-instance-readonly-field"
                  | "abstract-readonly-field"
                  | "public-abstract-readonly-field"
                  | "protected-readonly-field"
                  | "protected-decorated-readonly-field"
                  | "protected-static-readonly-field"
                  | "protected-instance-readonly-field"
                  | "protected-abstract-readonly-field"
                  | "private-readonly-field"
                  | "private-decorated-readonly-field"
                  | "private-static-readonly-field"
                  | "private-instance-readonly-field"
                  | "#private-readonly-field"
                  | "#private-static-readonly-field"
                  | "#private-instance-readonly-field"
                  | "field"
                  | "public-field"
                  | "public-decorated-field"
                  | "decorated-field"
                  | "static-field"
                  | "public-static-field"
                  | "instance-field"
                  | "public-instance-field"
                  | "abstract-field"
                  | "public-abstract-field"
                  | "protected-field"
                  | "protected-decorated-field"
                  | "protected-static-field"
                  | "protected-instance-field"
                  | "protected-abstract-field"
                  | "private-field"
                  | "private-decorated-field"
                  | "private-static-field"
                  | "private-instance-field"
                  | "#private-field"
                  | "#private-static-field"
                  | "#private-instance-field"
                  | "method"
                  | "public-method"
                  | "public-decorated-method"
                  | "decorated-method"
                  | "static-method"
                  | "public-static-method"
                  | "instance-method"
                  | "public-instance-method"
                  | "abstract-method"
                  | "public-abstract-method"
                  | "protected-method"
                  | "protected-decorated-method"
                  | "protected-static-method"
                  | "protected-instance-method"
                  | "protected-abstract-method"
                  | "private-method"
                  | "private-decorated-method"
                  | "private-static-method"
                  | "private-instance-method"
                  | "#private-method"
                  | "#private-static-method"
                  | "#private-instance-method"
                  | "call-signature"
                  | "constructor"
                  | "public-constructor"
                  | "protected-constructor"
                  | "private-constructor"
                  | "accessor"
                  | "public-accessor"
                  | "public-decorated-accessor"
                  | "decorated-accessor"
                  | "static-accessor"
                  | "public-static-accessor"
                  | "instance-accessor"
                  | "public-instance-accessor"
                  | "abstract-accessor"
                  | "public-abstract-accessor"
                  | "protected-accessor"
                  | "protected-decorated-accessor"
                  | "protected-static-accessor"
                  | "protected-instance-accessor"
                  | "protected-abstract-accessor"
                  | "private-accessor"
                  | "private-decorated-accessor"
                  | "private-static-accessor"
                  | "private-instance-accessor"
                  | "#private-accessor"
                  | "#private-static-accessor"
                  | "#private-instance-accessor"
                  | "get"
                  | "public-get"
                  | "public-decorated-get"
                  | "decorated-get"
                  | "static-get"
                  | "public-static-get"
                  | "instance-get"
                  | "public-instance-get"
                  | "abstract-get"
                  | "public-abstract-get"
                  | "protected-get"
                  | "protected-decorated-get"
                  | "protected-static-get"
                  | "protected-instance-get"
                  | "protected-abstract-get"
                  | "private-get"
                  | "private-decorated-get"
                  | "private-static-get"
                  | "private-instance-get"
                  | "#private-get"
                  | "#private-static-get"
                  | "#private-instance-get"
                  | "set"
                  | "public-set"
                  | "public-decorated-set"
                  | "decorated-set"
                  | "static-set"
                  | "public-static-set"
                  | "instance-set"
                  | "public-instance-set"
                  | "abstract-set"
                  | "public-abstract-set"
                  | "protected-set"
                  | "protected-decorated-set"
                  | "protected-static-set"
                  | "protected-instance-set"
                  | "protected-abstract-set"
                  | "private-set"
                  | "private-decorated-set"
                  | "private-static-set"
                  | "private-instance-set"
                  | "#private-set"
                  | "#private-static-set"
                  | "#private-instance-set"
                  | "static-initialization"
                  | "static-static-initialization"
                  | "public-static-static-initialization"
                  | "instance-static-initialization"
                  | "public-instance-static-initialization"
                  | "abstract-static-initialization"
                  | "public-abstract-static-initialization"
                  | "protected-static-static-initialization"
                  | "protected-instance-static-initialization"
                  | "protected-abstract-static-initialization"
                  | "private-static-static-initialization"
                  | "private-instance-static-initialization"
                  | "#private-static-static-initialization"
                  | "#private-instance-static-initialization"
                )
              | (
                  | "readonly-signature"
                  | "signature"
                  | "readonly-field"
                  | "public-readonly-field"
                  | "public-decorated-readonly-field"
                  | "decorated-readonly-field"
                  | "static-readonly-field"
                  | "public-static-readonly-field"
                  | "instance-readonly-field"
                  | "public-instance-readonly-field"
                  | "abstract-readonly-field"
                  | "public-abstract-readonly-field"
                  | "protected-readonly-field"
                  | "protected-decorated-readonly-field"
                  | "protected-static-readonly-field"
                  | "protected-instance-readonly-field"
                  | "protected-abstract-readonly-field"
                  | "private-readonly-field"
                  | "private-decorated-readonly-field"
                  | "private-static-readonly-field"
                  | "private-instance-readonly-field"
                  | "#private-readonly-field"
                  | "#private-static-readonly-field"
                  | "#private-instance-readonly-field"
                  | "field"
                  | "public-field"
                  | "public-decorated-field"
                  | "decorated-field"
                  | "static-field"
                  | "public-static-field"
                  | "instance-field"
                  | "public-instance-field"
                  | "abstract-field"
                  | "public-abstract-field"
                  | "protected-field"
                  | "protected-decorated-field"
                  | "protected-static-field"
                  | "protected-instance-field"
                  | "protected-abstract-field"
                  | "private-field"
                  | "private-decorated-field"
                  | "private-static-field"
                  | "private-instance-field"
                  | "#private-field"
                  | "#private-static-field"
                  | "#private-instance-field"
                  | "method"
                  | "public-method"
                  | "public-decorated-method"
                  | "decorated-method"
                  | "static-method"
                  | "public-static-method"
                  | "instance-method"
                  | "public-instance-method"
                  | "abstract-method"
                  | "public-abstract-method"
                  | "protected-method"
                  | "protected-decorated-method"
                  | "protected-static-method"
                  | "protected-instance-method"
                  | "protected-abstract-method"
                  | "private-method"
                  | "private-decorated-method"
                  | "private-static-method"
                  | "private-instance-method"
                  | "#private-method"
                  | "#private-static-method"
                  | "#private-instance-method"
                  | "call-signature"
                  | "constructor"
                  | "public-constructor"
                  | "protected-constructor"
                  | "private-constructor"
                  | "accessor"
                  | "public-accessor"
                  | "public-decorated-accessor"
                  | "decorated-accessor"
                  | "static-accessor"
                  | "public-static-accessor"
                  | "instance-accessor"
                  | "public-instance-accessor"
                  | "abstract-accessor"
                  | "public-abstract-accessor"
                  | "protected-accessor"
                  | "protected-decorated-accessor"
                  | "protected-static-accessor"
                  | "protected-instance-accessor"
                  | "protected-abstract-accessor"
                  | "private-accessor"
                  | "private-decorated-accessor"
                  | "private-static-accessor"
                  | "private-instance-accessor"
                  | "#private-accessor"
                  | "#private-static-accessor"
                  | "#private-instance-accessor"
                  | "get"
                  | "public-get"
                  | "public-decorated-get"
                  | "decorated-get"
                  | "static-get"
                  | "public-static-get"
                  | "instance-get"
                  | "public-instance-get"
                  | "abstract-get"
                  | "public-abstract-get"
                  | "protected-get"
                  | "protected-decorated-get"
                  | "protected-static-get"
                  | "protected-instance-get"
                  | "protected-abstract-get"
                  | "private-get"
                  | "private-decorated-get"
                  | "private-static-get"
                  | "private-instance-get"
                  | "#private-get"
                  | "#private-static-get"
                  | "#private-instance-get"
                  | "set"
                  | "public-set"
                  | "public-decorated-set"
                  | "decorated-set"
                  | "static-set"
                  | "public-static-set"
                  | "instance-set"
                  | "public-instance-set"
                  | "abstract-set"
                  | "public-abstract-set"
                  | "protected-set"
                  | "protected-decorated-set"
                  | "protected-static-set"
                  | "protected-instance-set"
                  | "protected-abstract-set"
                  | "private-set"
                  | "private-decorated-set"
                  | "private-static-set"
                  | "private-instance-set"
                  | "#private-set"
                  | "#private-static-set"
                  | "#private-instance-set"
                  | "static-initialization"
                  | "static-static-initialization"
                  | "public-static-static-initialization"
                  | "instance-static-initialization"
                  | "public-instance-static-initialization"
                  | "abstract-static-initialization"
                  | "public-abstract-static-initialization"
                  | "protected-static-static-initialization"
                  | "protected-instance-static-initialization"
                  | "protected-abstract-static-initialization"
                  | "private-static-static-initialization"
                  | "private-instance-static-initialization"
                  | "#private-static-static-initialization"
                  | "#private-instance-static-initialization"
                )[]
            )[]
          | {
              memberTypes?:
                | (
                    | (
                        | "readonly-signature"
                        | "signature"
                        | "readonly-field"
                        | "public-readonly-field"
                        | "public-decorated-readonly-field"
                        | "decorated-readonly-field"
                        | "static-readonly-field"
                        | "public-static-readonly-field"
                        | "instance-readonly-field"
                        | "public-instance-readonly-field"
                        | "abstract-readonly-field"
                        | "public-abstract-readonly-field"
                        | "protected-readonly-field"
                        | "protected-decorated-readonly-field"
                        | "protected-static-readonly-field"
                        | "protected-instance-readonly-field"
                        | "protected-abstract-readonly-field"
                        | "private-readonly-field"
                        | "private-decorated-readonly-field"
                        | "private-static-readonly-field"
                        | "private-instance-readonly-field"
                        | "#private-readonly-field"
                        | "#private-static-readonly-field"
                        | "#private-instance-readonly-field"
                        | "field"
                        | "public-field"
                        | "public-decorated-field"
                        | "decorated-field"
                        | "static-field"
                        | "public-static-field"
                        | "instance-field"
                        | "public-instance-field"
                        | "abstract-field"
                        | "public-abstract-field"
                        | "protected-field"
                        | "protected-decorated-field"
                        | "protected-static-field"
                        | "protected-instance-field"
                        | "protected-abstract-field"
                        | "private-field"
                        | "private-decorated-field"
                        | "private-static-field"
                        | "private-instance-field"
                        | "#private-field"
                        | "#private-static-field"
                        | "#private-instance-field"
                        | "method"
                        | "public-method"
                        | "public-decorated-method"
                        | "decorated-method"
                        | "static-method"
                        | "public-static-method"
                        | "instance-method"
                        | "public-instance-method"
                        | "abstract-method"
                        | "public-abstract-method"
                        | "protected-method"
                        | "protected-decorated-method"
                        | "protected-static-method"
                        | "protected-instance-method"
                        | "protected-abstract-method"
                        | "private-method"
                        | "private-decorated-method"
                        | "private-static-method"
                        | "private-instance-method"
                        | "#private-method"
                        | "#private-static-method"
                        | "#private-instance-method"
                        | "call-signature"
                        | "constructor"
                        | "public-constructor"
                        | "protected-constructor"
                        | "private-constructor"
                        | "accessor"
                        | "public-accessor"
                        | "public-decorated-accessor"
                        | "decorated-accessor"
                        | "static-accessor"
                        | "public-static-accessor"
                        | "instance-accessor"
                        | "public-instance-accessor"
                        | "abstract-accessor"
                        | "public-abstract-accessor"
                        | "protected-accessor"
                        | "protected-decorated-accessor"
                        | "protected-static-accessor"
                        | "protected-instance-accessor"
                        | "protected-abstract-accessor"
                        | "private-accessor"
                        | "private-decorated-accessor"
                        | "private-static-accessor"
                        | "private-instance-accessor"
                        | "#private-accessor"
                        | "#private-static-accessor"
                        | "#private-instance-accessor"
                        | "get"
                        | "public-get"
                        | "public-decorated-get"
                        | "decorated-get"
                        | "static-get"
                        | "public-static-get"
                        | "instance-get"
                        | "public-instance-get"
                        | "abstract-get"
                        | "public-abstract-get"
                        | "protected-get"
                        | "protected-decorated-get"
                        | "protected-static-get"
                        | "protected-instance-get"
                        | "protected-abstract-get"
                        | "private-get"
                        | "private-decorated-get"
                        | "private-static-get"
                        | "private-instance-get"
                        | "#private-get"
                        | "#private-static-get"
                        | "#private-instance-get"
                        | "set"
                        | "public-set"
                        | "public-decorated-set"
                        | "decorated-set"
                        | "static-set"
                        | "public-static-set"
                        | "instance-set"
                        | "public-instance-set"
                        | "abstract-set"
                        | "public-abstract-set"
                        | "protected-set"
                        | "protected-decorated-set"
                        | "protected-static-set"
                        | "protected-instance-set"
                        | "protected-abstract-set"
                        | "private-set"
                        | "private-decorated-set"
                        | "private-static-set"
                        | "private-instance-set"
                        | "#private-set"
                        | "#private-static-set"
                        | "#private-instance-set"
                        | "static-initialization"
                        | "static-static-initialization"
                        | "public-static-static-initialization"
                        | "instance-static-initialization"
                        | "public-instance-static-initialization"
                        | "abstract-static-initialization"
                        | "public-abstract-static-initialization"
                        | "protected-static-static-initialization"
                        | "protected-instance-static-initialization"
                        | "protected-abstract-static-initialization"
                        | "private-static-static-initialization"
                        | "private-instance-static-initialization"
                        | "#private-static-static-initialization"
                        | "#private-instance-static-initialization"
                      )
                    | (
                        | "readonly-signature"
                        | "signature"
                        | "readonly-field"
                        | "public-readonly-field"
                        | "public-decorated-readonly-field"
                        | "decorated-readonly-field"
                        | "static-readonly-field"
                        | "public-static-readonly-field"
                        | "instance-readonly-field"
                        | "public-instance-readonly-field"
                        | "abstract-readonly-field"
                        | "public-abstract-readonly-field"
                        | "protected-readonly-field"
                        | "protected-decorated-readonly-field"
                        | "protected-static-readonly-field"
                        | "protected-instance-readonly-field"
                        | "protected-abstract-readonly-field"
                        | "private-readonly-field"
                        | "private-decorated-readonly-field"
                        | "private-static-readonly-field"
                        | "private-instance-readonly-field"
                        | "#private-readonly-field"
                        | "#private-static-readonly-field"
                        | "#private-instance-readonly-field"
                        | "field"
                        | "public-field"
                        | "public-decorated-field"
                        | "decorated-field"
                        | "static-field"
                        | "public-static-field"
                        | "instance-field"
                        | "public-instance-field"
                        | "abstract-field"
                        | "public-abstract-field"
                        | "protected-field"
                        | "protected-decorated-field"
                        | "protected-static-field"
                        | "protected-instance-field"
                        | "protected-abstract-field"
                        | "private-field"
                        | "private-decorated-field"
                        | "private-static-field"
                        | "private-instance-field"
                        | "#private-field"
                        | "#private-static-field"
                        | "#private-instance-field"
                        | "method"
                        | "public-method"
                        | "public-decorated-method"
                        | "decorated-method"
                        | "static-method"
                        | "public-static-method"
                        | "instance-method"
                        | "public-instance-method"
                        | "abstract-method"
                        | "public-abstract-method"
                        | "protected-method"
                        | "protected-decorated-method"
                        | "protected-static-method"
                        | "protected-instance-method"
                        | "protected-abstract-method"
                        | "private-method"
                        | "private-decorated-method"
                        | "private-static-method"
                        | "private-instance-method"
                        | "#private-method"
                        | "#private-static-method"
                        | "#private-instance-method"
                        | "call-signature"
                        | "constructor"
                        | "public-constructor"
                        | "protected-constructor"
                        | "private-constructor"
                        | "accessor"
                        | "public-accessor"
                        | "public-decorated-accessor"
                        | "decorated-accessor"
                        | "static-accessor"
                        | "public-static-accessor"
                        | "instance-accessor"
                        | "public-instance-accessor"
                        | "abstract-accessor"
                        | "public-abstract-accessor"
                        | "protected-accessor"
                        | "protected-decorated-accessor"
                        | "protected-static-accessor"
                        | "protected-instance-accessor"
                        | "protected-abstract-accessor"
                        | "private-accessor"
                        | "private-decorated-accessor"
                        | "private-static-accessor"
                        | "private-instance-accessor"
                        | "#private-accessor"
                        | "#private-static-accessor"
                        | "#private-instance-accessor"
                        | "get"
                        | "public-get"
                        | "public-decorated-get"
                        | "decorated-get"
                        | "static-get"
                        | "public-static-get"
                        | "instance-get"
                        | "public-instance-get"
                        | "abstract-get"
                        | "public-abstract-get"
                        | "protected-get"
                        | "protected-decorated-get"
                        | "protected-static-get"
                        | "protected-instance-get"
                        | "protected-abstract-get"
                        | "private-get"
                        | "private-decorated-get"
                        | "private-static-get"
                        | "private-instance-get"
                        | "#private-get"
                        | "#private-static-get"
                        | "#private-instance-get"
                        | "set"
                        | "public-set"
                        | "public-decorated-set"
                        | "decorated-set"
                        | "static-set"
                        | "public-static-set"
                        | "instance-set"
                        | "public-instance-set"
                        | "abstract-set"
                        | "public-abstract-set"
                        | "protected-set"
                        | "protected-decorated-set"
                        | "protected-static-set"
                        | "protected-instance-set"
                        | "protected-abstract-set"
                        | "private-set"
                        | "private-decorated-set"
                        | "private-static-set"
                        | "private-instance-set"
                        | "#private-set"
                        | "#private-static-set"
                        | "#private-instance-set"
                        | "static-initialization"
                        | "static-static-initialization"
                        | "public-static-static-initialization"
                        | "instance-static-initialization"
                        | "public-instance-static-initialization"
                        | "abstract-static-initialization"
                        | "public-abstract-static-initialization"
                        | "protected-static-static-initialization"
                        | "protected-instance-static-initialization"
                        | "protected-abstract-static-initialization"
                        | "private-static-static-initialization"
                        | "private-instance-static-initialization"
                        | "#private-static-static-initialization"
                        | "#private-instance-static-initialization"
                      )[]
                  )[]
                | "never";
              order?:
                | "alphabetically"
                | "alphabetically-case-insensitive"
                | "as-written"
                | "natural"
                | "natural-case-insensitive";
              optionalityOrder?: "optional-first" | "required-first";
            };
        classes?:
          | "never"
          | (
              | (
                  | "readonly-signature"
                  | "signature"
                  | "readonly-field"
                  | "public-readonly-field"
                  | "public-decorated-readonly-field"
                  | "decorated-readonly-field"
                  | "static-readonly-field"
                  | "public-static-readonly-field"
                  | "instance-readonly-field"
                  | "public-instance-readonly-field"
                  | "abstract-readonly-field"
                  | "public-abstract-readonly-field"
                  | "protected-readonly-field"
                  | "protected-decorated-readonly-field"
                  | "protected-static-readonly-field"
                  | "protected-instance-readonly-field"
                  | "protected-abstract-readonly-field"
                  | "private-readonly-field"
                  | "private-decorated-readonly-field"
                  | "private-static-readonly-field"
                  | "private-instance-readonly-field"
                  | "#private-readonly-field"
                  | "#private-static-readonly-field"
                  | "#private-instance-readonly-field"
                  | "field"
                  | "public-field"
                  | "public-decorated-field"
                  | "decorated-field"
                  | "static-field"
                  | "public-static-field"
                  | "instance-field"
                  | "public-instance-field"
                  | "abstract-field"
                  | "public-abstract-field"
                  | "protected-field"
                  | "protected-decorated-field"
                  | "protected-static-field"
                  | "protected-instance-field"
                  | "protected-abstract-field"
                  | "private-field"
                  | "private-decorated-field"
                  | "private-static-field"
                  | "private-instance-field"
                  | "#private-field"
                  | "#private-static-field"
                  | "#private-instance-field"
                  | "method"
                  | "public-method"
                  | "public-decorated-method"
                  | "decorated-method"
                  | "static-method"
                  | "public-static-method"
                  | "instance-method"
                  | "public-instance-method"
                  | "abstract-method"
                  | "public-abstract-method"
                  | "protected-method"
                  | "protected-decorated-method"
                  | "protected-static-method"
                  | "protected-instance-method"
                  | "protected-abstract-method"
                  | "private-method"
                  | "private-decorated-method"
                  | "private-static-method"
                  | "private-instance-method"
                  | "#private-method"
                  | "#private-static-method"
                  | "#private-instance-method"
                  | "call-signature"
                  | "constructor"
                  | "public-constructor"
                  | "protected-constructor"
                  | "private-constructor"
                  | "accessor"
                  | "public-accessor"
                  | "public-decorated-accessor"
                  | "decorated-accessor"
                  | "static-accessor"
                  | "public-static-accessor"
                  | "instance-accessor"
                  | "public-instance-accessor"
                  | "abstract-accessor"
                  | "public-abstract-accessor"
                  | "protected-accessor"
                  | "protected-decorated-accessor"
                  | "protected-static-accessor"
                  | "protected-instance-accessor"
                  | "protected-abstract-accessor"
                  | "private-accessor"
                  | "private-decorated-accessor"
                  | "private-static-accessor"
                  | "private-instance-accessor"
                  | "#private-accessor"
                  | "#private-static-accessor"
                  | "#private-instance-accessor"
                  | "get"
                  | "public-get"
                  | "public-decorated-get"
                  | "decorated-get"
                  | "static-get"
                  | "public-static-get"
                  | "instance-get"
                  | "public-instance-get"
                  | "abstract-get"
                  | "public-abstract-get"
                  | "protected-get"
                  | "protected-decorated-get"
                  | "protected-static-get"
                  | "protected-instance-get"
                  | "protected-abstract-get"
                  | "private-get"
                  | "private-decorated-get"
                  | "private-static-get"
                  | "private-instance-get"
                  | "#private-get"
                  | "#private-static-get"
                  | "#private-instance-get"
                  | "set"
                  | "public-set"
                  | "public-decorated-set"
                  | "decorated-set"
                  | "static-set"
                  | "public-static-set"
                  | "instance-set"
                  | "public-instance-set"
                  | "abstract-set"
                  | "public-abstract-set"
                  | "protected-set"
                  | "protected-decorated-set"
                  | "protected-static-set"
                  | "protected-instance-set"
                  | "protected-abstract-set"
                  | "private-set"
                  | "private-decorated-set"
                  | "private-static-set"
                  | "private-instance-set"
                  | "#private-set"
                  | "#private-static-set"
                  | "#private-instance-set"
                  | "static-initialization"
                  | "static-static-initialization"
                  | "public-static-static-initialization"
                  | "instance-static-initialization"
                  | "public-instance-static-initialization"
                  | "abstract-static-initialization"
                  | "public-abstract-static-initialization"
                  | "protected-static-static-initialization"
                  | "protected-instance-static-initialization"
                  | "protected-abstract-static-initialization"
                  | "private-static-static-initialization"
                  | "private-instance-static-initialization"
                  | "#private-static-static-initialization"
                  | "#private-instance-static-initialization"
                )
              | (
                  | "readonly-signature"
                  | "signature"
                  | "readonly-field"
                  | "public-readonly-field"
                  | "public-decorated-readonly-field"
                  | "decorated-readonly-field"
                  | "static-readonly-field"
                  | "public-static-readonly-field"
                  | "instance-readonly-field"
                  | "public-instance-readonly-field"
                  | "abstract-readonly-field"
                  | "public-abstract-readonly-field"
                  | "protected-readonly-field"
                  | "protected-decorated-readonly-field"
                  | "protected-static-readonly-field"
                  | "protected-instance-readonly-field"
                  | "protected-abstract-readonly-field"
                  | "private-readonly-field"
                  | "private-decorated-readonly-field"
                  | "private-static-readonly-field"
                  | "private-instance-readonly-field"
                  | "#private-readonly-field"
                  | "#private-static-readonly-field"
                  | "#private-instance-readonly-field"
                  | "field"
                  | "public-field"
                  | "public-decorated-field"
                  | "decorated-field"
                  | "static-field"
                  | "public-static-field"
                  | "instance-field"
                  | "public-instance-field"
                  | "abstract-field"
                  | "public-abstract-field"
                  | "protected-field"
                  | "protected-decorated-field"
                  | "protected-static-field"
                  | "protected-instance-field"
                  | "protected-abstract-field"
                  | "private-field"
                  | "private-decorated-field"
                  | "private-static-field"
                  | "private-instance-field"
                  | "#private-field"
                  | "#private-static-field"
                  | "#private-instance-field"
                  | "method"
                  | "public-method"
                  | "public-decorated-method"
                  | "decorated-method"
                  | "static-method"
                  | "public-static-method"
                  | "instance-method"
                  | "public-instance-method"
                  | "abstract-method"
                  | "public-abstract-method"
                  | "protected-method"
                  | "protected-decorated-method"
                  | "protected-static-method"
                  | "protected-instance-method"
                  | "protected-abstract-method"
                  | "private-method"
                  | "private-decorated-method"
                  | "private-static-method"
                  | "private-instance-method"
                  | "#private-method"
                  | "#private-static-method"
                  | "#private-instance-method"
                  | "call-signature"
                  | "constructor"
                  | "public-constructor"
                  | "protected-constructor"
                  | "private-constructor"
                  | "accessor"
                  | "public-accessor"
                  | "public-decorated-accessor"
                  | "decorated-accessor"
                  | "static-accessor"
                  | "public-static-accessor"
                  | "instance-accessor"
                  | "public-instance-accessor"
                  | "abstract-accessor"
                  | "public-abstract-accessor"
                  | "protected-accessor"
                  | "protected-decorated-accessor"
                  | "protected-static-accessor"
                  | "protected-instance-accessor"
                  | "protected-abstract-accessor"
                  | "private-accessor"
                  | "private-decorated-accessor"
                  | "private-static-accessor"
                  | "private-instance-accessor"
                  | "#private-accessor"
                  | "#private-static-accessor"
                  | "#private-instance-accessor"
                  | "get"
                  | "public-get"
                  | "public-decorated-get"
                  | "decorated-get"
                  | "static-get"
                  | "public-static-get"
                  | "instance-get"
                  | "public-instance-get"
                  | "abstract-get"
                  | "public-abstract-get"
                  | "protected-get"
                  | "protected-decorated-get"
                  | "protected-static-get"
                  | "protected-instance-get"
                  | "protected-abstract-get"
                  | "private-get"
                  | "private-decorated-get"
                  | "private-static-get"
                  | "private-instance-get"
                  | "#private-get"
                  | "#private-static-get"
                  | "#private-instance-get"
                  | "set"
                  | "public-set"
                  | "public-decorated-set"
                  | "decorated-set"
                  | "static-set"
                  | "public-static-set"
                  | "instance-set"
                  | "public-instance-set"
                  | "abstract-set"
                  | "public-abstract-set"
                  | "protected-set"
                  | "protected-decorated-set"
                  | "protected-static-set"
                  | "protected-instance-set"
                  | "protected-abstract-set"
                  | "private-set"
                  | "private-decorated-set"
                  | "private-static-set"
                  | "private-instance-set"
                  | "#private-set"
                  | "#private-static-set"
                  | "#private-instance-set"
                  | "static-initialization"
                  | "static-static-initialization"
                  | "public-static-static-initialization"
                  | "instance-static-initialization"
                  | "public-instance-static-initialization"
                  | "abstract-static-initialization"
                  | "public-abstract-static-initialization"
                  | "protected-static-static-initialization"
                  | "protected-instance-static-initialization"
                  | "protected-abstract-static-initialization"
                  | "private-static-static-initialization"
                  | "private-instance-static-initialization"
                  | "#private-static-static-initialization"
                  | "#private-instance-static-initialization"
                )[]
            )[]
          | {
              memberTypes?:
                | (
                    | (
                        | "readonly-signature"
                        | "signature"
                        | "readonly-field"
                        | "public-readonly-field"
                        | "public-decorated-readonly-field"
                        | "decorated-readonly-field"
                        | "static-readonly-field"
                        | "public-static-readonly-field"
                        | "instance-readonly-field"
                        | "public-instance-readonly-field"
                        | "abstract-readonly-field"
                        | "public-abstract-readonly-field"
                        | "protected-readonly-field"
                        | "protected-decorated-readonly-field"
                        | "protected-static-readonly-field"
                        | "protected-instance-readonly-field"
                        | "protected-abstract-readonly-field"
                        | "private-readonly-field"
                        | "private-decorated-readonly-field"
                        | "private-static-readonly-field"
                        | "private-instance-readonly-field"
                        | "#private-readonly-field"
                        | "#private-static-readonly-field"
                        | "#private-instance-readonly-field"
                        | "field"
                        | "public-field"
                        | "public-decorated-field"
                        | "decorated-field"
                        | "static-field"
                        | "public-static-field"
                        | "instance-field"
                        | "public-instance-field"
                        | "abstract-field"
                        | "public-abstract-field"
                        | "protected-field"
                        | "protected-decorated-field"
                        | "protected-static-field"
                        | "protected-instance-field"
                        | "protected-abstract-field"
                        | "private-field"
                        | "private-decorated-field"
                        | "private-static-field"
                        | "private-instance-field"
                        | "#private-field"
                        | "#private-static-field"
                        | "#private-instance-field"
                        | "method"
                        | "public-method"
                        | "public-decorated-method"
                        | "decorated-method"
                        | "static-method"
                        | "public-static-method"
                        | "instance-method"
                        | "public-instance-method"
                        | "abstract-method"
                        | "public-abstract-method"
                        | "protected-method"
                        | "protected-decorated-method"
                        | "protected-static-method"
                        | "protected-instance-method"
                        | "protected-abstract-method"
                        | "private-method"
                        | "private-decorated-method"
                        | "private-static-method"
                        | "private-instance-method"
                        | "#private-method"
                        | "#private-static-method"
                        | "#private-instance-method"
                        | "call-signature"
                        | "constructor"
                        | "public-constructor"
                        | "protected-constructor"
                        | "private-constructor"
                        | "accessor"
                        | "public-accessor"
                        | "public-decorated-accessor"
                        | "decorated-accessor"
                        | "static-accessor"
                        | "public-static-accessor"
                        | "instance-accessor"
                        | "public-instance-accessor"
                        | "abstract-accessor"
                        | "public-abstract-accessor"
                        | "protected-accessor"
                        | "protected-decorated-accessor"
                        | "protected-static-accessor"
                        | "protected-instance-accessor"
                        | "protected-abstract-accessor"
                        | "private-accessor"
                        | "private-decorated-accessor"
                        | "private-static-accessor"
                        | "private-instance-accessor"
                        | "#private-accessor"
                        | "#private-static-accessor"
                        | "#private-instance-accessor"
                        | "get"
                        | "public-get"
                        | "public-decorated-get"
                        | "decorated-get"
                        | "static-get"
                        | "public-static-get"
                        | "instance-get"
                        | "public-instance-get"
                        | "abstract-get"
                        | "public-abstract-get"
                        | "protected-get"
                        | "protected-decorated-get"
                        | "protected-static-get"
                        | "protected-instance-get"
                        | "protected-abstract-get"
                        | "private-get"
                        | "private-decorated-get"
                        | "private-static-get"
                        | "private-instance-get"
                        | "#private-get"
                        | "#private-static-get"
                        | "#private-instance-get"
                        | "set"
                        | "public-set"
                        | "public-decorated-set"
                        | "decorated-set"
                        | "static-set"
                        | "public-static-set"
                        | "instance-set"
                        | "public-instance-set"
                        | "abstract-set"
                        | "public-abstract-set"
                        | "protected-set"
                        | "protected-decorated-set"
                        | "protected-static-set"
                        | "protected-instance-set"
                        | "protected-abstract-set"
                        | "private-set"
                        | "private-decorated-set"
                        | "private-static-set"
                        | "private-instance-set"
                        | "#private-set"
                        | "#private-static-set"
                        | "#private-instance-set"
                        | "static-initialization"
                        | "static-static-initialization"
                        | "public-static-static-initialization"
                        | "instance-static-initialization"
                        | "public-instance-static-initialization"
                        | "abstract-static-initialization"
                        | "public-abstract-static-initialization"
                        | "protected-static-static-initialization"
                        | "protected-instance-static-initialization"
                        | "protected-abstract-static-initialization"
                        | "private-static-static-initialization"
                        | "private-instance-static-initialization"
                        | "#private-static-static-initialization"
                        | "#private-instance-static-initialization"
                      )
                    | (
                        | "readonly-signature"
                        | "signature"
                        | "readonly-field"
                        | "public-readonly-field"
                        | "public-decorated-readonly-field"
                        | "decorated-readonly-field"
                        | "static-readonly-field"
                        | "public-static-readonly-field"
                        | "instance-readonly-field"
                        | "public-instance-readonly-field"
                        | "abstract-readonly-field"
                        | "public-abstract-readonly-field"
                        | "protected-readonly-field"
                        | "protected-decorated-readonly-field"
                        | "protected-static-readonly-field"
                        | "protected-instance-readonly-field"
                        | "protected-abstract-readonly-field"
                        | "private-readonly-field"
                        | "private-decorated-readonly-field"
                        | "private-static-readonly-field"
                        | "private-instance-readonly-field"
                        | "#private-readonly-field"
                        | "#private-static-readonly-field"
                        | "#private-instance-readonly-field"
                        | "field"
                        | "public-field"
                        | "public-decorated-field"
                        | "decorated-field"
                        | "static-field"
                        | "public-static-field"
                        | "instance-field"
                        | "public-instance-field"
                        | "abstract-field"
                        | "public-abstract-field"
                        | "protected-field"
                        | "protected-decorated-field"
                        | "protected-static-field"
                        | "protected-instance-field"
                        | "protected-abstract-field"
                        | "private-field"
                        | "private-decorated-field"
                        | "private-static-field"
                        | "private-instance-field"
                        | "#private-field"
                        | "#private-static-field"
                        | "#private-instance-field"
                        | "method"
                        | "public-method"
                        | "public-decorated-method"
                        | "decorated-method"
                        | "static-method"
                        | "public-static-method"
                        | "instance-method"
                        | "public-instance-method"
                        | "abstract-method"
                        | "public-abstract-method"
                        | "protected-method"
                        | "protected-decorated-method"
                        | "protected-static-method"
                        | "protected-instance-method"
                        | "protected-abstract-method"
                        | "private-method"
                        | "private-decorated-method"
                        | "private-static-method"
                        | "private-instance-method"
                        | "#private-method"
                        | "#private-static-method"
                        | "#private-instance-method"
                        | "call-signature"
                        | "constructor"
                        | "public-constructor"
                        | "protected-constructor"
                        | "private-constructor"
                        | "accessor"
                        | "public-accessor"
                        | "public-decorated-accessor"
                        | "decorated-accessor"
                        | "static-accessor"
                        | "public-static-accessor"
                        | "instance-accessor"
                        | "public-instance-accessor"
                        | "abstract-accessor"
                        | "public-abstract-accessor"
                        | "protected-accessor"
                        | "protected-decorated-accessor"
                        | "protected-static-accessor"
                        | "protected-instance-accessor"
                        | "protected-abstract-accessor"
                        | "private-accessor"
                        | "private-decorated-accessor"
                        | "private-static-accessor"
                        | "private-instance-accessor"
                        | "#private-accessor"
                        | "#private-static-accessor"
                        | "#private-instance-accessor"
                        | "get"
                        | "public-get"
                        | "public-decorated-get"
                        | "decorated-get"
                        | "static-get"
                        | "public-static-get"
                        | "instance-get"
                        | "public-instance-get"
                        | "abstract-get"
                        | "public-abstract-get"
                        | "protected-get"
                        | "protected-decorated-get"
                        | "protected-static-get"
                        | "protected-instance-get"
                        | "protected-abstract-get"
                        | "private-get"
                        | "private-decorated-get"
                        | "private-static-get"
                        | "private-instance-get"
                        | "#private-get"
                        | "#private-static-get"
                        | "#private-instance-get"
                        | "set"
                        | "public-set"
                        | "public-decorated-set"
                        | "decorated-set"
                        | "static-set"
                        | "public-static-set"
                        | "instance-set"
                        | "public-instance-set"
                        | "abstract-set"
                        | "public-abstract-set"
                        | "protected-set"
                        | "protected-decorated-set"
                        | "protected-static-set"
                        | "protected-instance-set"
                        | "protected-abstract-set"
                        | "private-set"
                        | "private-decorated-set"
                        | "private-static-set"
                        | "private-instance-set"
                        | "#private-set"
                        | "#private-static-set"
                        | "#private-instance-set"
                        | "static-initialization"
                        | "static-static-initialization"
                        | "public-static-static-initialization"
                        | "instance-static-initialization"
                        | "public-instance-static-initialization"
                        | "abstract-static-initialization"
                        | "public-abstract-static-initialization"
                        | "protected-static-static-initialization"
                        | "protected-instance-static-initialization"
                        | "protected-abstract-static-initialization"
                        | "private-static-static-initialization"
                        | "private-instance-static-initialization"
                        | "#private-static-static-initialization"
                        | "#private-instance-static-initialization"
                      )[]
                  )[]
                | "never";
              order?:
                | "alphabetically"
                | "alphabetically-case-insensitive"
                | "as-written"
                | "natural"
                | "natural-case-insensitive";
              optionalityOrder?: "optional-first" | "required-first";
            };
        classExpressions?:
          | "never"
          | (
              | (
                  | "readonly-signature"
                  | "signature"
                  | "readonly-field"
                  | "public-readonly-field"
                  | "public-decorated-readonly-field"
                  | "decorated-readonly-field"
                  | "static-readonly-field"
                  | "public-static-readonly-field"
                  | "instance-readonly-field"
                  | "public-instance-readonly-field"
                  | "abstract-readonly-field"
                  | "public-abstract-readonly-field"
                  | "protected-readonly-field"
                  | "protected-decorated-readonly-field"
                  | "protected-static-readonly-field"
                  | "protected-instance-readonly-field"
                  | "protected-abstract-readonly-field"
                  | "private-readonly-field"
                  | "private-decorated-readonly-field"
                  | "private-static-readonly-field"
                  | "private-instance-readonly-field"
                  | "#private-readonly-field"
                  | "#private-static-readonly-field"
                  | "#private-instance-readonly-field"
                  | "field"
                  | "public-field"
                  | "public-decorated-field"
                  | "decorated-field"
                  | "static-field"
                  | "public-static-field"
                  | "instance-field"
                  | "public-instance-field"
                  | "abstract-field"
                  | "public-abstract-field"
                  | "protected-field"
                  | "protected-decorated-field"
                  | "protected-static-field"
                  | "protected-instance-field"
                  | "protected-abstract-field"
                  | "private-field"
                  | "private-decorated-field"
                  | "private-static-field"
                  | "private-instance-field"
                  | "#private-field"
                  | "#private-static-field"
                  | "#private-instance-field"
                  | "method"
                  | "public-method"
                  | "public-decorated-method"
                  | "decorated-method"
                  | "static-method"
                  | "public-static-method"
                  | "instance-method"
                  | "public-instance-method"
                  | "abstract-method"
                  | "public-abstract-method"
                  | "protected-method"
                  | "protected-decorated-method"
                  | "protected-static-method"
                  | "protected-instance-method"
                  | "protected-abstract-method"
                  | "private-method"
                  | "private-decorated-method"
                  | "private-static-method"
                  | "private-instance-method"
                  | "#private-method"
                  | "#private-static-method"
                  | "#private-instance-method"
                  | "call-signature"
                  | "constructor"
                  | "public-constructor"
                  | "protected-constructor"
                  | "private-constructor"
                  | "accessor"
                  | "public-accessor"
                  | "public-decorated-accessor"
                  | "decorated-accessor"
                  | "static-accessor"
                  | "public-static-accessor"
                  | "instance-accessor"
                  | "public-instance-accessor"
                  | "abstract-accessor"
                  | "public-abstract-accessor"
                  | "protected-accessor"
                  | "protected-decorated-accessor"
                  | "protected-static-accessor"
                  | "protected-instance-accessor"
                  | "protected-abstract-accessor"
                  | "private-accessor"
                  | "private-decorated-accessor"
                  | "private-static-accessor"
                  | "private-instance-accessor"
                  | "#private-accessor"
                  | "#private-static-accessor"
                  | "#private-instance-accessor"
                  | "get"
                  | "public-get"
                  | "public-decorated-get"
                  | "decorated-get"
                  | "static-get"
                  | "public-static-get"
                  | "instance-get"
                  | "public-instance-get"
                  | "abstract-get"
                  | "public-abstract-get"
                  | "protected-get"
                  | "protected-decorated-get"
                  | "protected-static-get"
                  | "protected-instance-get"
                  | "protected-abstract-get"
                  | "private-get"
                  | "private-decorated-get"
                  | "private-static-get"
                  | "private-instance-get"
                  | "#private-get"
                  | "#private-static-get"
                  | "#private-instance-get"
                  | "set"
                  | "public-set"
                  | "public-decorated-set"
                  | "decorated-set"
                  | "static-set"
                  | "public-static-set"
                  | "instance-set"
                  | "public-instance-set"
                  | "abstract-set"
                  | "public-abstract-set"
                  | "protected-set"
                  | "protected-decorated-set"
                  | "protected-static-set"
                  | "protected-instance-set"
                  | "protected-abstract-set"
                  | "private-set"
                  | "private-decorated-set"
                  | "private-static-set"
                  | "private-instance-set"
                  | "#private-set"
                  | "#private-static-set"
                  | "#private-instance-set"
                  | "static-initialization"
                  | "static-static-initialization"
                  | "public-static-static-initialization"
                  | "instance-static-initialization"
                  | "public-instance-static-initialization"
                  | "abstract-static-initialization"
                  | "public-abstract-static-initialization"
                  | "protected-static-static-initialization"
                  | "protected-instance-static-initialization"
                  | "protected-abstract-static-initialization"
                  | "private-static-static-initialization"
                  | "private-instance-static-initialization"
                  | "#private-static-static-initialization"
                  | "#private-instance-static-initialization"
                )
              | (
                  | "readonly-signature"
                  | "signature"
                  | "readonly-field"
                  | "public-readonly-field"
                  | "public-decorated-readonly-field"
                  | "decorated-readonly-field"
                  | "static-readonly-field"
                  | "public-static-readonly-field"
                  | "instance-readonly-field"
                  | "public-instance-readonly-field"
                  | "abstract-readonly-field"
                  | "public-abstract-readonly-field"
                  | "protected-readonly-field"
                  | "protected-decorated-readonly-field"
                  | "protected-static-readonly-field"
                  | "protected-instance-readonly-field"
                  | "protected-abstract-readonly-field"
                  | "private-readonly-field"
                  | "private-decorated-readonly-field"
                  | "private-static-readonly-field"
                  | "private-instance-readonly-field"
                  | "#private-readonly-field"
                  | "#private-static-readonly-field"
                  | "#private-instance-readonly-field"
                  | "field"
                  | "public-field"
                  | "public-decorated-field"
                  | "decorated-field"
                  | "static-field"
                  | "public-static-field"
                  | "instance-field"
                  | "public-instance-field"
                  | "abstract-field"
                  | "public-abstract-field"
                  | "protected-field"
                  | "protected-decorated-field"
                  | "protected-static-field"
                  | "protected-instance-field"
                  | "protected-abstract-field"
                  | "private-field"
                  | "private-decorated-field"
                  | "private-static-field"
                  | "private-instance-field"
                  | "#private-field"
                  | "#private-static-field"
                  | "#private-instance-field"
                  | "method"
                  | "public-method"
                  | "public-decorated-method"
                  | "decorated-method"
                  | "static-method"
                  | "public-static-method"
                  | "instance-method"
                  | "public-instance-method"
                  | "abstract-method"
                  | "public-abstract-method"
                  | "protected-method"
                  | "protected-decorated-method"
                  | "protected-static-method"
                  | "protected-instance-method"
                  | "protected-abstract-method"
                  | "private-method"
                  | "private-decorated-method"
                  | "private-static-method"
                  | "private-instance-method"
                  | "#private-method"
                  | "#private-static-method"
                  | "#private-instance-method"
                  | "call-signature"
                  | "constructor"
                  | "public-constructor"
                  | "protected-constructor"
                  | "private-constructor"
                  | "accessor"
                  | "public-accessor"
                  | "public-decorated-accessor"
                  | "decorated-accessor"
                  | "static-accessor"
                  | "public-static-accessor"
                  | "instance-accessor"
                  | "public-instance-accessor"
                  | "abstract-accessor"
                  | "public-abstract-accessor"
                  | "protected-accessor"
                  | "protected-decorated-accessor"
                  | "protected-static-accessor"
                  | "protected-instance-accessor"
                  | "protected-abstract-accessor"
                  | "private-accessor"
                  | "private-decorated-accessor"
                  | "private-static-accessor"
                  | "private-instance-accessor"
                  | "#private-accessor"
                  | "#private-static-accessor"
                  | "#private-instance-accessor"
                  | "get"
                  | "public-get"
                  | "public-decorated-get"
                  | "decorated-get"
                  | "static-get"
                  | "public-static-get"
                  | "instance-get"
                  | "public-instance-get"
                  | "abstract-get"
                  | "public-abstract-get"
                  | "protected-get"
                  | "protected-decorated-get"
                  | "protected-static-get"
                  | "protected-instance-get"
                  | "protected-abstract-get"
                  | "private-get"
                  | "private-decorated-get"
                  | "private-static-get"
                  | "private-instance-get"
                  | "#private-get"
                  | "#private-static-get"
                  | "#private-instance-get"
                  | "set"
                  | "public-set"
                  | "public-decorated-set"
                  | "decorated-set"
                  | "static-set"
                  | "public-static-set"
                  | "instance-set"
                  | "public-instance-set"
                  | "abstract-set"
                  | "public-abstract-set"
                  | "protected-set"
                  | "protected-decorated-set"
                  | "protected-static-set"
                  | "protected-instance-set"
                  | "protected-abstract-set"
                  | "private-set"
                  | "private-decorated-set"
                  | "private-static-set"
                  | "private-instance-set"
                  | "#private-set"
                  | "#private-static-set"
                  | "#private-instance-set"
                  | "static-initialization"
                  | "static-static-initialization"
                  | "public-static-static-initialization"
                  | "instance-static-initialization"
                  | "public-instance-static-initialization"
                  | "abstract-static-initialization"
                  | "public-abstract-static-initialization"
                  | "protected-static-static-initialization"
                  | "protected-instance-static-initialization"
                  | "protected-abstract-static-initialization"
                  | "private-static-static-initialization"
                  | "private-instance-static-initialization"
                  | "#private-static-static-initialization"
                  | "#private-instance-static-initialization"
                )[]
            )[]
          | {
              memberTypes?:
                | (
                    | (
                        | "readonly-signature"
                        | "signature"
                        | "readonly-field"
                        | "public-readonly-field"
                        | "public-decorated-readonly-field"
                        | "decorated-readonly-field"
                        | "static-readonly-field"
                        | "public-static-readonly-field"
                        | "instance-readonly-field"
                        | "public-instance-readonly-field"
                        | "abstract-readonly-field"
                        | "public-abstract-readonly-field"
                        | "protected-readonly-field"
                        | "protected-decorated-readonly-field"
                        | "protected-static-readonly-field"
                        | "protected-instance-readonly-field"
                        | "protected-abstract-readonly-field"
                        | "private-readonly-field"
                        | "private-decorated-readonly-field"
                        | "private-static-readonly-field"
                        | "private-instance-readonly-field"
                        | "#private-readonly-field"
                        | "#private-static-readonly-field"
                        | "#private-instance-readonly-field"
                        | "field"
                        | "public-field"
                        | "public-decorated-field"
                        | "decorated-field"
                        | "static-field"
                        | "public-static-field"
                        | "instance-field"
                        | "public-instance-field"
                        | "abstract-field"
                        | "public-abstract-field"
                        | "protected-field"
                        | "protected-decorated-field"
                        | "protected-static-field"
                        | "protected-instance-field"
                        | "protected-abstract-field"
                        | "private-field"
                        | "private-decorated-field"
                        | "private-static-field"
                        | "private-instance-field"
                        | "#private-field"
                        | "#private-static-field"
                        | "#private-instance-field"
                        | "method"
                        | "public-method"
                        | "public-decorated-method"
                        | "decorated-method"
                        | "static-method"
                        | "public-static-method"
                        | "instance-method"
                        | "public-instance-method"
                        | "abstract-method"
                        | "public-abstract-method"
                        | "protected-method"
                        | "protected-decorated-method"
                        | "protected-static-method"
                        | "protected-instance-method"
                        | "protected-abstract-method"
                        | "private-method"
                        | "private-decorated-method"
                        | "private-static-method"
                        | "private-instance-method"
                        | "#private-method"
                        | "#private-static-method"
                        | "#private-instance-method"
                        | "call-signature"
                        | "constructor"
                        | "public-constructor"
                        | "protected-constructor"
                        | "private-constructor"
                        | "accessor"
                        | "public-accessor"
                        | "public-decorated-accessor"
                        | "decorated-accessor"
                        | "static-accessor"
                        | "public-static-accessor"
                        | "instance-accessor"
                        | "public-instance-accessor"
                        | "abstract-accessor"
                        | "public-abstract-accessor"
                        | "protected-accessor"
                        | "protected-decorated-accessor"
                        | "protected-static-accessor"
                        | "protected-instance-accessor"
                        | "protected-abstract-accessor"
                        | "private-accessor"
                        | "private-decorated-accessor"
                        | "private-static-accessor"
                        | "private-instance-accessor"
                        | "#private-accessor"
                        | "#private-static-accessor"
                        | "#private-instance-accessor"
                        | "get"
                        | "public-get"
                        | "public-decorated-get"
                        | "decorated-get"
                        | "static-get"
                        | "public-static-get"
                        | "instance-get"
                        | "public-instance-get"
                        | "abstract-get"
                        | "public-abstract-get"
                        | "protected-get"
                        | "protected-decorated-get"
                        | "protected-static-get"
                        | "protected-instance-get"
                        | "protected-abstract-get"
                        | "private-get"
                        | "private-decorated-get"
                        | "private-static-get"
                        | "private-instance-get"
                        | "#private-get"
                        | "#private-static-get"
                        | "#private-instance-get"
                        | "set"
                        | "public-set"
                        | "public-decorated-set"
                        | "decorated-set"
                        | "static-set"
                        | "public-static-set"
                        | "instance-set"
                        | "public-instance-set"
                        | "abstract-set"
                        | "public-abstract-set"
                        | "protected-set"
                        | "protected-decorated-set"
                        | "protected-static-set"
                        | "protected-instance-set"
                        | "protected-abstract-set"
                        | "private-set"
                        | "private-decorated-set"
                        | "private-static-set"
                        | "private-instance-set"
                        | "#private-set"
                        | "#private-static-set"
                        | "#private-instance-set"
                        | "static-initialization"
                        | "static-static-initialization"
                        | "public-static-static-initialization"
                        | "instance-static-initialization"
                        | "public-instance-static-initialization"
                        | "abstract-static-initialization"
                        | "public-abstract-static-initialization"
                        | "protected-static-static-initialization"
                        | "protected-instance-static-initialization"
                        | "protected-abstract-static-initialization"
                        | "private-static-static-initialization"
                        | "private-instance-static-initialization"
                        | "#private-static-static-initialization"
                        | "#private-instance-static-initialization"
                      )
                    | (
                        | "readonly-signature"
                        | "signature"
                        | "readonly-field"
                        | "public-readonly-field"
                        | "public-decorated-readonly-field"
                        | "decorated-readonly-field"
                        | "static-readonly-field"
                        | "public-static-readonly-field"
                        | "instance-readonly-field"
                        | "public-instance-readonly-field"
                        | "abstract-readonly-field"
                        | "public-abstract-readonly-field"
                        | "protected-readonly-field"
                        | "protected-decorated-readonly-field"
                        | "protected-static-readonly-field"
                        | "protected-instance-readonly-field"
                        | "protected-abstract-readonly-field"
                        | "private-readonly-field"
                        | "private-decorated-readonly-field"
                        | "private-static-readonly-field"
                        | "private-instance-readonly-field"
                        | "#private-readonly-field"
                        | "#private-static-readonly-field"
                        | "#private-instance-readonly-field"
                        | "field"
                        | "public-field"
                        | "public-decorated-field"
                        | "decorated-field"
                        | "static-field"
                        | "public-static-field"
                        | "instance-field"
                        | "public-instance-field"
                        | "abstract-field"
                        | "public-abstract-field"
                        | "protected-field"
                        | "protected-decorated-field"
                        | "protected-static-field"
                        | "protected-instance-field"
                        | "protected-abstract-field"
                        | "private-field"
                        | "private-decorated-field"
                        | "private-static-field"
                        | "private-instance-field"
                        | "#private-field"
                        | "#private-static-field"
                        | "#private-instance-field"
                        | "method"
                        | "public-method"
                        | "public-decorated-method"
                        | "decorated-method"
                        | "static-method"
                        | "public-static-method"
                        | "instance-method"
                        | "public-instance-method"
                        | "abstract-method"
                        | "public-abstract-method"
                        | "protected-method"
                        | "protected-decorated-method"
                        | "protected-static-method"
                        | "protected-instance-method"
                        | "protected-abstract-method"
                        | "private-method"
                        | "private-decorated-method"
                        | "private-static-method"
                        | "private-instance-method"
                        | "#private-method"
                        | "#private-static-method"
                        | "#private-instance-method"
                        | "call-signature"
                        | "constructor"
                        | "public-constructor"
                        | "protected-constructor"
                        | "private-constructor"
                        | "accessor"
                        | "public-accessor"
                        | "public-decorated-accessor"
                        | "decorated-accessor"
                        | "static-accessor"
                        | "public-static-accessor"
                        | "instance-accessor"
                        | "public-instance-accessor"
                        | "abstract-accessor"
                        | "public-abstract-accessor"
                        | "protected-accessor"
                        | "protected-decorated-accessor"
                        | "protected-static-accessor"
                        | "protected-instance-accessor"
                        | "protected-abstract-accessor"
                        | "private-accessor"
                        | "private-decorated-accessor"
                        | "private-static-accessor"
                        | "private-instance-accessor"
                        | "#private-accessor"
                        | "#private-static-accessor"
                        | "#private-instance-accessor"
                        | "get"
                        | "public-get"
                        | "public-decorated-get"
                        | "decorated-get"
                        | "static-get"
                        | "public-static-get"
                        | "instance-get"
                        | "public-instance-get"
                        | "abstract-get"
                        | "public-abstract-get"
                        | "protected-get"
                        | "protected-decorated-get"
                        | "protected-static-get"
                        | "protected-instance-get"
                        | "protected-abstract-get"
                        | "private-get"
                        | "private-decorated-get"
                        | "private-static-get"
                        | "private-instance-get"
                        | "#private-get"
                        | "#private-static-get"
                        | "#private-instance-get"
                        | "set"
                        | "public-set"
                        | "public-decorated-set"
                        | "decorated-set"
                        | "static-set"
                        | "public-static-set"
                        | "instance-set"
                        | "public-instance-set"
                        | "abstract-set"
                        | "public-abstract-set"
                        | "protected-set"
                        | "protected-decorated-set"
                        | "protected-static-set"
                        | "protected-instance-set"
                        | "protected-abstract-set"
                        | "private-set"
                        | "private-decorated-set"
                        | "private-static-set"
                        | "private-instance-set"
                        | "#private-set"
                        | "#private-static-set"
                        | "#private-instance-set"
                        | "static-initialization"
                        | "static-static-initialization"
                        | "public-static-static-initialization"
                        | "instance-static-initialization"
                        | "public-instance-static-initialization"
                        | "abstract-static-initialization"
                        | "public-abstract-static-initialization"
                        | "protected-static-static-initialization"
                        | "protected-instance-static-initialization"
                        | "protected-abstract-static-initialization"
                        | "private-static-static-initialization"
                        | "private-instance-static-initialization"
                        | "#private-static-static-initialization"
                        | "#private-instance-static-initialization"
                      )[]
                  )[]
                | "never";
              order?:
                | "alphabetically"
                | "alphabetically-case-insensitive"
                | "as-written"
                | "natural"
                | "natural-case-insensitive";
              optionalityOrder?: "optional-first" | "required-first";
            };
        interfaces?:
          | "never"
          | (
              | (
                  | "readonly-signature"
                  | "signature"
                  | "readonly-field"
                  | "field"
                  | "method"
                  | "constructor"
                )
              | (
                  | "readonly-signature"
                  | "signature"
                  | "readonly-field"
                  | "field"
                  | "method"
                  | "constructor"
                )[]
            )[]
          | {
              memberTypes?:
                | (
                    | (
                        | "readonly-signature"
                        | "signature"
                        | "readonly-field"
                        | "field"
                        | "method"
                        | "constructor"
                      )
                    | (
                        | "readonly-signature"
                        | "signature"
                        | "readonly-field"
                        | "field"
                        | "method"
                        | "constructor"
                      )[]
                  )[]
                | "never";
              order?:
                | "alphabetically"
                | "alphabetically-case-insensitive"
                | "as-written"
                | "natural"
                | "natural-case-insensitive";
              optionalityOrder?: "optional-first" | "required-first";
            };
        typeLiterals?:
          | "never"
          | (
              | (
                  | "readonly-signature"
                  | "signature"
                  | "readonly-field"
                  | "field"
                  | "method"
                  | "constructor"
                )
              | (
                  | "readonly-signature"
                  | "signature"
                  | "readonly-field"
                  | "field"
                  | "method"
                  | "constructor"
                )[]
            )[]
          | {
              memberTypes?:
                | (
                    | (
                        | "readonly-signature"
                        | "signature"
                        | "readonly-field"
                        | "field"
                        | "method"
                        | "constructor"
                      )
                    | (
                        | "readonly-signature"
                        | "signature"
                        | "readonly-field"
                        | "field"
                        | "method"
                        | "constructor"
                      )[]
                  )[]
                | "never";
              order?:
                | "alphabetically"
                | "alphabetically-case-insensitive"
                | "as-written"
                | "natural"
                | "natural-case-insensitive";
              optionalityOrder?: "optional-first" | "required-first";
            };
      }
    ];
// ----- @typescript-eslint/method-signature-style -----
type TypescriptEslintMethodSignatureStyle = [] | ["property" | "method"];
// ----- @typescript-eslint/naming-convention -----
type _TypescriptEslintNamingConventionFormatOptionsConfig =
  | _TypescriptEslintNamingConventionPredefinedFormats[]
  | null;
type _TypescriptEslintNamingConventionPredefinedFormats =
  | "camelCase"
  | "strictCamelCase"
  | "PascalCase"
  | "StrictPascalCase"
  | "snake_case"
  | "UPPER_CASE";
type _TypescriptEslintNamingConventionUnderscoreOptions =
  | "forbid"
  | "allow"
  | "require"
  | "requireDouble"
  | "allowDouble"
  | "allowSingleOrDouble";
type _TypescriptEslintNamingConvention_PrefixSuffixConfig = string[];
type _TypescriptEslintNamingConventionTypeModifiers =
  | "boolean"
  | "string"
  | "number"
  | "function"
  | "array";
type TypescriptEslintNamingConvention = (
  | {
      format: _TypescriptEslintNamingConventionFormatOptionsConfig;
      custom?: _TypescriptEslintNamingConvention_MatchRegexConfig;
      leadingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      trailingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      prefix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      suffix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      failureMessage?: string;
      filter?: string | _TypescriptEslintNamingConvention_MatchRegexConfig;
      selector: (
        | "default"
        | "variableLike"
        | "memberLike"
        | "typeLike"
        | "method"
        | "property"
        | "accessor"
        | "variable"
        | "function"
        | "parameter"
        | "parameterProperty"
        | "classicAccessor"
        | "enumMember"
        | "classMethod"
        | "objectLiteralMethod"
        | "typeMethod"
        | "classProperty"
        | "objectLiteralProperty"
        | "typeProperty"
        | "autoAccessor"
        | "class"
        | "interface"
        | "typeAlias"
        | "enum"
        | "typeParameter"
        | "import"
      )[];
      modifiers?: (
        | "const"
        | "readonly"
        | "static"
        | "public"
        | "protected"
        | "private"
        | "#private"
        | "abstract"
        | "destructured"
        | "global"
        | "exported"
        | "unused"
        | "requiresQuotes"
        | "override"
        | "async"
        | "default"
        | "namespace"
      )[];
      types?: _TypescriptEslintNamingConventionTypeModifiers[];
    }
  | {
      format: _TypescriptEslintNamingConventionFormatOptionsConfig;
      custom?: _TypescriptEslintNamingConvention_MatchRegexConfig;
      leadingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      trailingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      prefix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      suffix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      failureMessage?: string;
      filter?: string | _TypescriptEslintNamingConvention_MatchRegexConfig;
      selector: "default";
      modifiers?: (
        | "const"
        | "readonly"
        | "static"
        | "public"
        | "protected"
        | "private"
        | "#private"
        | "abstract"
        | "destructured"
        | "global"
        | "exported"
        | "unused"
        | "requiresQuotes"
        | "override"
        | "async"
        | "default"
        | "namespace"
      )[];
    }
  | {
      format: _TypescriptEslintNamingConventionFormatOptionsConfig;
      custom?: _TypescriptEslintNamingConvention_MatchRegexConfig;
      leadingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      trailingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      prefix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      suffix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      failureMessage?: string;
      filter?: string | _TypescriptEslintNamingConvention_MatchRegexConfig;
      selector: "variableLike";
      modifiers?: ("unused" | "async")[];
    }
  | {
      format: _TypescriptEslintNamingConventionFormatOptionsConfig;
      custom?: _TypescriptEslintNamingConvention_MatchRegexConfig;
      leadingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      trailingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      prefix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      suffix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      failureMessage?: string;
      filter?: string | _TypescriptEslintNamingConvention_MatchRegexConfig;
      selector: "variable";
      modifiers?: (
        | "const"
        | "destructured"
        | "exported"
        | "global"
        | "unused"
        | "async"
      )[];
      types?: _TypescriptEslintNamingConventionTypeModifiers[];
    }
  | {
      format: _TypescriptEslintNamingConventionFormatOptionsConfig;
      custom?: _TypescriptEslintNamingConvention_MatchRegexConfig;
      leadingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      trailingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      prefix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      suffix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      failureMessage?: string;
      filter?: string | _TypescriptEslintNamingConvention_MatchRegexConfig;
      selector: "function";
      modifiers?: ("exported" | "global" | "unused" | "async")[];
    }
  | {
      format: _TypescriptEslintNamingConventionFormatOptionsConfig;
      custom?: _TypescriptEslintNamingConvention_MatchRegexConfig;
      leadingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      trailingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      prefix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      suffix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      failureMessage?: string;
      filter?: string | _TypescriptEslintNamingConvention_MatchRegexConfig;
      selector: "parameter";
      modifiers?: ("destructured" | "unused")[];
      types?: _TypescriptEslintNamingConventionTypeModifiers[];
    }
  | {
      format: _TypescriptEslintNamingConventionFormatOptionsConfig;
      custom?: _TypescriptEslintNamingConvention_MatchRegexConfig;
      leadingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      trailingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      prefix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      suffix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      failureMessage?: string;
      filter?: string | _TypescriptEslintNamingConvention_MatchRegexConfig;
      selector: "memberLike";
      modifiers?: (
        | "abstract"
        | "private"
        | "#private"
        | "protected"
        | "public"
        | "readonly"
        | "requiresQuotes"
        | "static"
        | "override"
        | "async"
      )[];
    }
  | {
      format: _TypescriptEslintNamingConventionFormatOptionsConfig;
      custom?: _TypescriptEslintNamingConvention_MatchRegexConfig;
      leadingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      trailingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      prefix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      suffix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      failureMessage?: string;
      filter?: string | _TypescriptEslintNamingConvention_MatchRegexConfig;
      selector: "classProperty";
      modifiers?: (
        | "abstract"
        | "private"
        | "#private"
        | "protected"
        | "public"
        | "readonly"
        | "requiresQuotes"
        | "static"
        | "override"
      )[];
      types?: _TypescriptEslintNamingConventionTypeModifiers[];
    }
  | {
      format: _TypescriptEslintNamingConventionFormatOptionsConfig;
      custom?: _TypescriptEslintNamingConvention_MatchRegexConfig;
      leadingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      trailingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      prefix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      suffix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      failureMessage?: string;
      filter?: string | _TypescriptEslintNamingConvention_MatchRegexConfig;
      selector: "objectLiteralProperty";
      modifiers?: ("public" | "requiresQuotes")[];
      types?: _TypescriptEslintNamingConventionTypeModifiers[];
    }
  | {
      format: _TypescriptEslintNamingConventionFormatOptionsConfig;
      custom?: _TypescriptEslintNamingConvention_MatchRegexConfig;
      leadingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      trailingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      prefix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      suffix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      failureMessage?: string;
      filter?: string | _TypescriptEslintNamingConvention_MatchRegexConfig;
      selector: "typeProperty";
      modifiers?: ("public" | "readonly" | "requiresQuotes")[];
      types?: _TypescriptEslintNamingConventionTypeModifiers[];
    }
  | {
      format: _TypescriptEslintNamingConventionFormatOptionsConfig;
      custom?: _TypescriptEslintNamingConvention_MatchRegexConfig;
      leadingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      trailingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      prefix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      suffix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      failureMessage?: string;
      filter?: string | _TypescriptEslintNamingConvention_MatchRegexConfig;
      selector: "parameterProperty";
      modifiers?: ("private" | "protected" | "public" | "readonly")[];
      types?: _TypescriptEslintNamingConventionTypeModifiers[];
    }
  | {
      format: _TypescriptEslintNamingConventionFormatOptionsConfig;
      custom?: _TypescriptEslintNamingConvention_MatchRegexConfig;
      leadingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      trailingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      prefix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      suffix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      failureMessage?: string;
      filter?: string | _TypescriptEslintNamingConvention_MatchRegexConfig;
      selector: "property";
      modifiers?: (
        | "abstract"
        | "private"
        | "#private"
        | "protected"
        | "public"
        | "readonly"
        | "requiresQuotes"
        | "static"
        | "override"
        | "async"
      )[];
      types?: _TypescriptEslintNamingConventionTypeModifiers[];
    }
  | {
      format: _TypescriptEslintNamingConventionFormatOptionsConfig;
      custom?: _TypescriptEslintNamingConvention_MatchRegexConfig;
      leadingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      trailingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      prefix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      suffix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      failureMessage?: string;
      filter?: string | _TypescriptEslintNamingConvention_MatchRegexConfig;
      selector: "classMethod";
      modifiers?: (
        | "abstract"
        | "private"
        | "#private"
        | "protected"
        | "public"
        | "requiresQuotes"
        | "static"
        | "override"
        | "async"
      )[];
    }
  | {
      format: _TypescriptEslintNamingConventionFormatOptionsConfig;
      custom?: _TypescriptEslintNamingConvention_MatchRegexConfig;
      leadingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      trailingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      prefix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      suffix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      failureMessage?: string;
      filter?: string | _TypescriptEslintNamingConvention_MatchRegexConfig;
      selector: "objectLiteralMethod";
      modifiers?: ("public" | "requiresQuotes" | "async")[];
    }
  | {
      format: _TypescriptEslintNamingConventionFormatOptionsConfig;
      custom?: _TypescriptEslintNamingConvention_MatchRegexConfig;
      leadingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      trailingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      prefix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      suffix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      failureMessage?: string;
      filter?: string | _TypescriptEslintNamingConvention_MatchRegexConfig;
      selector: "typeMethod";
      modifiers?: ("public" | "requiresQuotes")[];
    }
  | {
      format: _TypescriptEslintNamingConventionFormatOptionsConfig;
      custom?: _TypescriptEslintNamingConvention_MatchRegexConfig;
      leadingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      trailingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      prefix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      suffix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      failureMessage?: string;
      filter?: string | _TypescriptEslintNamingConvention_MatchRegexConfig;
      selector: "method";
      modifiers?: (
        | "abstract"
        | "private"
        | "#private"
        | "protected"
        | "public"
        | "requiresQuotes"
        | "static"
        | "override"
        | "async"
      )[];
    }
  | {
      format: _TypescriptEslintNamingConventionFormatOptionsConfig;
      custom?: _TypescriptEslintNamingConvention_MatchRegexConfig;
      leadingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      trailingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      prefix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      suffix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      failureMessage?: string;
      filter?: string | _TypescriptEslintNamingConvention_MatchRegexConfig;
      selector: "classicAccessor";
      modifiers?: (
        | "abstract"
        | "private"
        | "protected"
        | "public"
        | "requiresQuotes"
        | "static"
        | "override"
      )[];
      types?: _TypescriptEslintNamingConventionTypeModifiers[];
    }
  | {
      format: _TypescriptEslintNamingConventionFormatOptionsConfig;
      custom?: _TypescriptEslintNamingConvention_MatchRegexConfig;
      leadingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      trailingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      prefix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      suffix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      failureMessage?: string;
      filter?: string | _TypescriptEslintNamingConvention_MatchRegexConfig;
      selector: "autoAccessor";
      modifiers?: (
        | "abstract"
        | "private"
        | "protected"
        | "public"
        | "requiresQuotes"
        | "static"
        | "override"
      )[];
      types?: _TypescriptEslintNamingConventionTypeModifiers[];
    }
  | {
      format: _TypescriptEslintNamingConventionFormatOptionsConfig;
      custom?: _TypescriptEslintNamingConvention_MatchRegexConfig;
      leadingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      trailingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      prefix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      suffix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      failureMessage?: string;
      filter?: string | _TypescriptEslintNamingConvention_MatchRegexConfig;
      selector: "accessor";
      modifiers?: (
        | "abstract"
        | "private"
        | "protected"
        | "public"
        | "requiresQuotes"
        | "static"
        | "override"
      )[];
      types?: _TypescriptEslintNamingConventionTypeModifiers[];
    }
  | {
      format: _TypescriptEslintNamingConventionFormatOptionsConfig;
      custom?: _TypescriptEslintNamingConvention_MatchRegexConfig;
      leadingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      trailingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      prefix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      suffix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      failureMessage?: string;
      filter?: string | _TypescriptEslintNamingConvention_MatchRegexConfig;
      selector: "enumMember";
      modifiers?: "requiresQuotes"[];
    }
  | {
      format: _TypescriptEslintNamingConventionFormatOptionsConfig;
      custom?: _TypescriptEslintNamingConvention_MatchRegexConfig;
      leadingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      trailingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      prefix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      suffix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      failureMessage?: string;
      filter?: string | _TypescriptEslintNamingConvention_MatchRegexConfig;
      selector: "typeLike";
      modifiers?: ("abstract" | "exported" | "unused")[];
    }
  | {
      format: _TypescriptEslintNamingConventionFormatOptionsConfig;
      custom?: _TypescriptEslintNamingConvention_MatchRegexConfig;
      leadingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      trailingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      prefix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      suffix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      failureMessage?: string;
      filter?: string | _TypescriptEslintNamingConvention_MatchRegexConfig;
      selector: "class";
      modifiers?: ("abstract" | "exported" | "unused")[];
    }
  | {
      format: _TypescriptEslintNamingConventionFormatOptionsConfig;
      custom?: _TypescriptEslintNamingConvention_MatchRegexConfig;
      leadingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      trailingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      prefix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      suffix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      failureMessage?: string;
      filter?: string | _TypescriptEslintNamingConvention_MatchRegexConfig;
      selector: "interface";
      modifiers?: ("exported" | "unused")[];
    }
  | {
      format: _TypescriptEslintNamingConventionFormatOptionsConfig;
      custom?: _TypescriptEslintNamingConvention_MatchRegexConfig;
      leadingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      trailingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      prefix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      suffix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      failureMessage?: string;
      filter?: string | _TypescriptEslintNamingConvention_MatchRegexConfig;
      selector: "typeAlias";
      modifiers?: ("exported" | "unused")[];
    }
  | {
      format: _TypescriptEslintNamingConventionFormatOptionsConfig;
      custom?: _TypescriptEslintNamingConvention_MatchRegexConfig;
      leadingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      trailingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      prefix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      suffix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      failureMessage?: string;
      filter?: string | _TypescriptEslintNamingConvention_MatchRegexConfig;
      selector: "enum";
      modifiers?: ("exported" | "unused")[];
    }
  | {
      format: _TypescriptEslintNamingConventionFormatOptionsConfig;
      custom?: _TypescriptEslintNamingConvention_MatchRegexConfig;
      leadingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      trailingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      prefix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      suffix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      failureMessage?: string;
      filter?: string | _TypescriptEslintNamingConvention_MatchRegexConfig;
      selector: "typeParameter";
      modifiers?: "unused"[];
    }
  | {
      format: _TypescriptEslintNamingConventionFormatOptionsConfig;
      custom?: _TypescriptEslintNamingConvention_MatchRegexConfig;
      leadingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      trailingUnderscore?: _TypescriptEslintNamingConventionUnderscoreOptions;
      prefix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      suffix?: _TypescriptEslintNamingConvention_PrefixSuffixConfig;
      failureMessage?: string;
      filter?: string | _TypescriptEslintNamingConvention_MatchRegexConfig;
      selector: "import";
      modifiers?: ("default" | "namespace")[];
    }
)[];
interface _TypescriptEslintNamingConvention_MatchRegexConfig {
  match: boolean;
  regex: string;
}
// ----- @typescript-eslint/no-base-to-string -----
type TypescriptEslintNoBaseToString =
  | []
  | [
      {
        ignoredTypeNames?: string[];
      }
    ];
// ----- @typescript-eslint/no-confusing-void-expression -----
type TypescriptEslintNoConfusingVoidExpression =
  | []
  | [
      {
        ignoreArrowShorthand?: boolean;
        ignoreVoidOperator?: boolean;
      }
    ];
// ----- @typescript-eslint/no-duplicate-type-constituents -----
type TypescriptEslintNoDuplicateTypeConstituents =
  | []
  | [
      {
        ignoreIntersections?: boolean;
        ignoreUnions?: boolean;
      }
    ];
// ----- @typescript-eslint/no-empty-function -----
type TypescriptEslintNoEmptyFunction =
  | []
  | [
      {
        allow?: (
          | "functions"
          | "arrowFunctions"
          | "generatorFunctions"
          | "methods"
          | "generatorMethods"
          | "getters"
          | "setters"
          | "constructors"
          | "private-constructors"
          | "protected-constructors"
          | "asyncFunctions"
          | "asyncMethods"
          | "decoratedFunctions"
          | "overrideMethods"
        )[];
      }
    ];
// ----- @typescript-eslint/no-empty-interface -----
type TypescriptEslintNoEmptyInterface =
  | []
  | [
      {
        allowSingleExtends?: boolean;
      }
    ];
// ----- @typescript-eslint/no-empty-object-type -----
type TypescriptEslintNoEmptyObjectType =
  | []
  | [
      {
        allowInterfaces?: "always" | "never" | "with-single-extends";
        allowObjectTypes?: "always" | "in-type-alias-with-name" | "never";
        allowWithName?: string;
      }
    ];
// ----- @typescript-eslint/no-explicit-any -----
type TypescriptEslintNoExplicitAny =
  | []
  | [
      {
        fixToUnknown?: boolean;

        ignoreRestArgs?: boolean;
      }
    ];
// ----- @typescript-eslint/no-extra-parens -----
type TypescriptEslintNoExtraParens =
  | []
  | ["functions"]
  | []
  | ["all"]
  | [
      "all",
      {
        conditionalAssign?: boolean;
        ternaryOperandBinaryExpressions?: boolean;
        nestedBinaryExpressions?: boolean;
        returnAssign?: boolean;
        ignoreJSX?: "none" | "all" | "single-line" | "multi-line";
        enforceForArrowConditionals?: boolean;
        enforceForSequenceExpressions?: boolean;
        enforceForNewInMemberExpressions?: boolean;
        enforceForFunctionPrototypeMethods?: boolean;
        allowParensAfterCommentPattern?: string;
      }
    ];
// ----- @typescript-eslint/no-extraneous-class -----
type TypescriptEslintNoExtraneousClass =
  | []
  | [
      {
        allowConstructorOnly?: boolean;

        allowEmpty?: boolean;

        allowStaticOnly?: boolean;

        allowWithDecorator?: boolean;
      }
    ];
// ----- @typescript-eslint/no-floating-promises -----
type TypescriptEslintNoFloatingPromises =
  | []
  | [
      {
        allowForKnownSafePromises?: (
          | string
          | {
              from: "file";
              name: string | [string, ...string[]];
              path?: string;
            }
          | {
              from: "lib";
              name: string | [string, ...string[]];
            }
          | {
              from: "package";
              name: string | [string, ...string[]];
              package: string;
            }
        )[];

        checkThenables?: boolean;

        ignoreVoid?: boolean;

        ignoreIIFE?: boolean;
      }
    ];
// ----- @typescript-eslint/no-inferrable-types -----
type TypescriptEslintNoInferrableTypes =
  | []
  | [
      {
        ignoreParameters?: boolean;
        ignoreProperties?: boolean;
      }
    ];
// ----- @typescript-eslint/no-invalid-this -----
type TypescriptEslintNoInvalidThis =
  | []
  | [
      {
        capIsConstructor?: boolean;
      }
    ];
// ----- @typescript-eslint/no-invalid-void-type -----
type TypescriptEslintNoInvalidVoidType =
  | []
  | [
      {
        allowInGenericTypeArguments?: boolean | [string, ...string[]];
        allowAsThisParameter?: boolean;
      }
    ];
// ----- @typescript-eslint/no-magic-numbers -----
type TypescriptEslintNoMagicNumbers =
  | []
  | [
      {
        detectObjects?: boolean;
        enforceConst?: boolean;
        ignore?: (number | string)[];
        ignoreArrayIndexes?: boolean;
        ignoreDefaultValues?: boolean;
        ignoreClassFieldInitialValues?: boolean;
        ignoreNumericLiteralTypes?: boolean;
        ignoreEnums?: boolean;
        ignoreReadonlyClassProperties?: boolean;
        ignoreTypeIndexes?: boolean;
      }
    ];
// ----- @typescript-eslint/no-meaningless-void-operator -----
type TypescriptEslintNoMeaninglessVoidOperator =
  | []
  | [
      {
        checkNever?: boolean;
      }
    ];
// ----- @typescript-eslint/no-misused-promises -----
type TypescriptEslintNoMisusedPromises =
  | []
  | [
      {
        checksConditionals?: boolean;
        checksVoidReturn?:
          | boolean
          | {
              arguments?: boolean;
              attributes?: boolean;
              properties?: boolean;
              returns?: boolean;
              variables?: boolean;
            };
        checksSpreads?: boolean;
      }
    ];
// ----- @typescript-eslint/no-namespace -----
type TypescriptEslintNoNamespace =
  | []
  | [
      {
        allowDeclarations?: boolean;

        allowDefinitionFiles?: boolean;
      }
    ];
// ----- @typescript-eslint/no-redeclare -----
type TypescriptEslintNoRedeclare =
  | []
  | [
      {
        builtinGlobals?: boolean;
        ignoreDeclarationMerge?: boolean;
      }
    ];
// ----- @typescript-eslint/no-require-imports -----
type TypescriptEslintNoRequireImports =
  | []
  | [
      {
        allow?: string[];
      }
    ];
// ----- @typescript-eslint/no-restricted-imports -----
type TypescriptEslintNoRestrictedImports =
  | (
      | string
      | {
          name: string;
          message?: string;
          importNames?: string[];
          allowImportNames?: string[];

          allowTypeImports?: boolean;
        }
    )[]
  | []
  | [
      {
        paths?: (
          | string
          | {
              name: string;
              message?: string;
              importNames?: string[];
              allowImportNames?: string[];

              allowTypeImports?: boolean;
            }
        )[];
        patterns?:
          | string[]
          | {
              importNames?: [string, ...string[]];

              allowImportNames?: [string, ...string[]];

              group: [string, ...string[]];
              importNamePattern?: string;
              allowImportNamePattern?: string;
              message?: string;
              caseSensitive?: boolean;

              allowTypeImports?: boolean;
            }[];
      }
    ];
// ----- @typescript-eslint/no-shadow -----
type TypescriptEslintNoShadow =
  | []
  | [
      {
        builtinGlobals?: boolean;
        hoist?: "all" | "functions" | "never";
        allow?: string[];
        ignoreOnInitialization?: boolean;
        ignoreTypeValueShadow?: boolean;
        ignoreFunctionTypeParameterNameValueShadow?: boolean;
      }
    ];
// ----- @typescript-eslint/no-this-alias -----
type TypescriptEslintNoThisAlias =
  | []
  | [
      {
        allowDestructuring?: boolean;

        allowedNames?: string[];
      }
    ];
// ----- @typescript-eslint/no-throw-literal -----
type TypescriptEslintNoThrowLiteral =
  | []
  | [
      {
        allowThrowingAny?: boolean;
        allowThrowingUnknown?: boolean;
      }
    ];
// ----- @typescript-eslint/no-type-alias -----
type TypescriptEslintNoTypeAlias =
  | []
  | [
      {
        allowAliases?:
          | "always"
          | "never"
          | "in-unions"
          | "in-intersections"
          | "in-unions-and-intersections";

        allowCallbacks?: "always" | "never";

        allowConditionalTypes?: "always" | "never";

        allowConstructors?: "always" | "never";

        allowLiterals?:
          | "always"
          | "never"
          | "in-unions"
          | "in-intersections"
          | "in-unions-and-intersections";

        allowMappedTypes?:
          | "always"
          | "never"
          | "in-unions"
          | "in-intersections"
          | "in-unions-and-intersections";

        allowTupleTypes?:
          | "always"
          | "never"
          | "in-unions"
          | "in-intersections"
          | "in-unions-and-intersections";

        allowGenerics?: "always" | "never";
      }
    ];
// ----- @typescript-eslint/no-unnecessary-boolean-literal-compare -----
type TypescriptEslintNoUnnecessaryBooleanLiteralCompare =
  | []
  | [
      {
        allowComparingNullableBooleansToTrue?: boolean;

        allowComparingNullableBooleansToFalse?: boolean;
      }
    ];
// ----- @typescript-eslint/no-unnecessary-condition -----
type TypescriptEslintNoUnnecessaryCondition =
  | []
  | [
      {
        allowConstantLoopConditions?: boolean;

        allowRuleToRunWithoutStrictNullChecksIKnowWhatIAmDoing?: boolean;
      }
    ];
// ----- @typescript-eslint/no-unnecessary-type-assertion -----
type TypescriptEslintNoUnnecessaryTypeAssertion =
  | []
  | [
      {
        typesToIgnore?: string[];
      }
    ];
// ----- @typescript-eslint/no-unused-expressions -----
type TypescriptEslintNoUnusedExpressions =
  | []
  | [
      {
        allowShortCircuit?: boolean;
        allowTernary?: boolean;
        allowTaggedTemplates?: boolean;
        enforceForJSX?: boolean;
      }
    ];
// ----- @typescript-eslint/no-unused-vars -----
type TypescriptEslintNoUnusedVars =
  | []
  | [
      | ("all" | "local")
      | {
          vars?: "all" | "local";
          varsIgnorePattern?: string;
          args?: "all" | "after-used" | "none";
          ignoreRestSiblings?: boolean;
          argsIgnorePattern?: string;
          caughtErrors?: "all" | "none";
          caughtErrorsIgnorePattern?: string;
          destructuredArrayIgnorePattern?: string;
        }
    ];
// ----- @typescript-eslint/no-use-before-define -----
type TypescriptEslintNoUseBeforeDefine =
  | []
  | [
      | "nofunc"
      | {
          functions?: boolean;
          classes?: boolean;
          enums?: boolean;
          variables?: boolean;
          typedefs?: boolean;
          ignoreTypeReferences?: boolean;
          allowNamedExports?: boolean;
        }
    ];
// ----- @typescript-eslint/no-var-requires -----
type TypescriptEslintNoVarRequires =
  | []
  | [
      {
        allow?: string[];
      }
    ];
// ----- @typescript-eslint/object-curly-spacing -----
type TypescriptEslintObjectCurlySpacing =
  | []
  | ["always" | "never"]
  | [
      "always" | "never",
      {
        arraysInObjects?: boolean;
        objectsInObjects?: boolean;
      }
    ];
// ----- @typescript-eslint/only-throw-error -----
type TypescriptEslintOnlyThrowError =
  | []
  | [
      {
        allowThrowingAny?: boolean;
        allowThrowingUnknown?: boolean;
      }
    ];
// ----- @typescript-eslint/padding-line-between-statements -----
type _TypescriptEslintPaddingLineBetweenStatementsPaddingType =
  | "any"
  | "never"
  | "always";
type _TypescriptEslintPaddingLineBetweenStatementsStatementType =
  | (
      | "*"
      | "block-like"
      | "exports"
      | "require"
      | "directive"
      | "expression"
      | "iife"
      | "multiline-block-like"
      | "multiline-expression"
      | "multiline-const"
      | "multiline-let"
      | "multiline-var"
      | "singleline-const"
      | "singleline-let"
      | "singleline-var"
      | "block"
      | "empty"
      | "function"
      | "break"
      | "case"
      | "class"
      | "const"
      | "continue"
      | "debugger"
      | "default"
      | "do"
      | "export"
      | "for"
      | "if"
      | "import"
      | "let"
      | "return"
      | "switch"
      | "throw"
      | "try"
      | "var"
      | "while"
      | "with"
      | "interface"
      | "type"
    )
  | [
      (
        | "*"
        | "block-like"
        | "exports"
        | "require"
        | "directive"
        | "expression"
        | "iife"
        | "multiline-block-like"
        | "multiline-expression"
        | "multiline-const"
        | "multiline-let"
        | "multiline-var"
        | "singleline-const"
        | "singleline-let"
        | "singleline-var"
        | "block"
        | "empty"
        | "function"
        | "break"
        | "case"
        | "class"
        | "const"
        | "continue"
        | "debugger"
        | "default"
        | "do"
        | "export"
        | "for"
        | "if"
        | "import"
        | "let"
        | "return"
        | "switch"
        | "throw"
        | "try"
        | "var"
        | "while"
        | "with"
        | "interface"
        | "type"
      ),
      ...(
        | "*"
        | "block-like"
        | "exports"
        | "require"
        | "directive"
        | "expression"
        | "iife"
        | "multiline-block-like"
        | "multiline-expression"
        | "multiline-const"
        | "multiline-let"
        | "multiline-var"
        | "singleline-const"
        | "singleline-let"
        | "singleline-var"
        | "block"
        | "empty"
        | "function"
        | "break"
        | "case"
        | "class"
        | "const"
        | "continue"
        | "debugger"
        | "default"
        | "do"
        | "export"
        | "for"
        | "if"
        | "import"
        | "let"
        | "return"
        | "switch"
        | "throw"
        | "try"
        | "var"
        | "while"
        | "with"
        | "interface"
        | "type"
      )[]
    ];
type TypescriptEslintPaddingLineBetweenStatements = {
  blankLine: _TypescriptEslintPaddingLineBetweenStatementsPaddingType;
  prev: _TypescriptEslintPaddingLineBetweenStatementsStatementType;
  next: _TypescriptEslintPaddingLineBetweenStatementsStatementType;
}[];
// ----- @typescript-eslint/parameter-properties -----
type TypescriptEslintParameterProperties =
  | []
  | [
      {
        allow?: (
          | "readonly"
          | "private"
          | "protected"
          | "public"
          | "private readonly"
          | "protected readonly"
          | "public readonly"
        )[];
        prefer?: "class-property" | "parameter-property";
      }
    ];
// ----- @typescript-eslint/prefer-destructuring -----
type TypescriptEslintPreferDestructuring =
  | []
  | [
      | {
          VariableDeclarator?: {
            array?: boolean;
            object?: boolean;
          };
          AssignmentExpression?: {
            array?: boolean;
            object?: boolean;
          };
        }
      | {
          array?: boolean;
          object?: boolean;
        }
    ]
  | [
      (
        | {
            VariableDeclarator?: {
              array?: boolean;
              object?: boolean;
            };
            AssignmentExpression?: {
              array?: boolean;
              object?: boolean;
            };
          }
        | {
            array?: boolean;
            object?: boolean;
          }
      ),
      {
        enforceForRenamedProperties?: boolean;
        enforceForDeclarationWithTypeAnnotation?: boolean;
        [k: string]: unknown | undefined;
      }
    ];
// ----- @typescript-eslint/prefer-literal-enum-member -----
type TypescriptEslintPreferLiteralEnumMember =
  | []
  | [
      {
        allowBitwiseExpressions?: boolean;
      }
    ];
// ----- @typescript-eslint/prefer-nullish-coalescing -----
type TypescriptEslintPreferNullishCoalescing =
  | []
  | [
      {
        allowRuleToRunWithoutStrictNullChecksIKnowWhatIAmDoing?: boolean;
        ignoreConditionalTests?: boolean;
        ignoreMixedLogicalExpressions?: boolean;
        ignorePrimitives?:
          | {
              bigint?: boolean;
              boolean?: boolean;
              number?: boolean;
              string?: boolean;
              [k: string]: unknown | undefined;
            }
          | true;
        ignoreTernaryTests?: boolean;
      }
    ];
// ----- @typescript-eslint/prefer-optional-chain -----
type TypescriptEslintPreferOptionalChain =
  | []
  | [
      {
        checkAny?: boolean;

        checkUnknown?: boolean;

        checkString?: boolean;

        checkNumber?: boolean;

        checkBoolean?: boolean;

        checkBigInt?: boolean;

        requireNullish?: boolean;

        allowPotentiallyUnsafeFixesThatModifyTheReturnTypeIKnowWhatImDoing?: boolean;
      }
    ];
// ----- @typescript-eslint/prefer-promise-reject-errors -----
type TypescriptEslintPreferPromiseRejectErrors =
  | []
  | [
      {
        allowEmptyReject?: boolean;
      }
    ];
// ----- @typescript-eslint/prefer-readonly -----
type TypescriptEslintPreferReadonly =
  | []
  | [
      {
        onlyInlineLambdas?: boolean;
      }
    ];
// ----- @typescript-eslint/prefer-readonly-parameter-types -----
type TypescriptEslintPreferReadonlyParameterTypes =
  | []
  | [
      {
        allow?: (
          | string
          | {
              from: "file";
              name: string | [string, ...string[]];
              path?: string;
            }
          | {
              from: "lib";
              name: string | [string, ...string[]];
            }
          | {
              from: "package";
              name: string | [string, ...string[]];
              package: string;
            }
        )[];
        checkParameterProperties?: boolean;
        ignoreInferredTypes?: boolean;
        treatMethodsAsReadonly?: boolean;
      }
    ];
// ----- @typescript-eslint/prefer-string-starts-ends-with -----
type TypescriptEslintPreferStringStartsEndsWith =
  | []
  | [
      {
        allowSingleElementEquality?: "always" | "never";
      }
    ];
// ----- @typescript-eslint/promise-function-async -----
type TypescriptEslintPromiseFunctionAsync =
  | []
  | [
      {
        allowAny?: boolean;

        allowedPromiseNames?: string[];
        checkArrowFunctions?: boolean;
        checkFunctionDeclarations?: boolean;
        checkFunctionExpressions?: boolean;
        checkMethodDeclarations?: boolean;
      }
    ];
// ----- @typescript-eslint/quotes -----
type TypescriptEslintQuotes =
  | []
  | ["single" | "double" | "backtick"]
  | [
      "single" | "double" | "backtick",
      (
        | "avoid-escape"
        | {
            avoidEscape?: boolean;
            allowTemplateLiterals?: boolean;
          }
      )
    ];
// ----- @typescript-eslint/require-array-sort-compare -----
type TypescriptEslintRequireArraySortCompare =
  | []
  | [
      {
        ignoreStringArrays?: boolean;
      }
    ];
// ----- @typescript-eslint/restrict-plus-operands -----
type TypescriptEslintRestrictPlusOperands =
  | []
  | [
      {
        allowAny?: boolean;

        allowBoolean?: boolean;

        allowNullish?: boolean;

        allowNumberAndString?: boolean;

        allowRegExp?: boolean;

        skipCompoundAssignments?: boolean;
      }
    ];
// ----- @typescript-eslint/restrict-template-expressions -----
type TypescriptEslintRestrictTemplateExpressions =
  | []
  | [
      {
        allowAny?: boolean;

        allowArray?: boolean;

        allowBoolean?: boolean;

        allowNullish?: boolean;

        allowNumber?: boolean;

        allowRegExp?: boolean;

        allowNever?: boolean;
      }
    ];
// ----- @typescript-eslint/return-await -----
type TypescriptEslintReturnAwait = [] | ["in-try-catch" | "always" | "never"];
// ----- @typescript-eslint/semi -----
type TypescriptEslintSemi =
  | []
  | ["never"]
  | [
      "never",
      {
        beforeStatementContinuationChars?: "always" | "any" | "never";
      }
    ]
  | []
  | ["always"]
  | [
      "always",
      {
        omitLastInOneLineBlock?: boolean;
        omitLastInOneLineClassBody?: boolean;
      }
    ];
// ----- @typescript-eslint/sort-type-constituents -----
type TypescriptEslintSortTypeConstituents =
  | []
  | [
      {
        checkIntersections?: boolean;

        checkUnions?: boolean;

        caseSensitive?: boolean;

        groupOrder?: (
          | "conditional"
          | "function"
          | "import"
          | "intersection"
          | "keyword"
          | "nullish"
          | "literal"
          | "named"
          | "object"
          | "operator"
          | "tuple"
          | "union"
        )[];
      }
    ];
// ----- @typescript-eslint/space-before-blocks -----
type TypescriptEslintSpaceBeforeBlocks =
  | []
  | [
      | ("always" | "never")
      | {
          keywords?: "always" | "never" | "off";
          functions?: "always" | "never" | "off";
          classes?: "always" | "never" | "off";
        }
    ];
// ----- @typescript-eslint/space-before-function-paren -----
type TypescriptEslintSpaceBeforeFunctionParen =
  | []
  | [
      | ("always" | "never")
      | {
          anonymous?: "always" | "never" | "ignore";
          named?: "always" | "never" | "ignore";
          asyncArrow?: "always" | "never" | "ignore";
        }
    ];
// ----- @typescript-eslint/space-infix-ops -----
type TypescriptEslintSpaceInfixOps =
  | []
  | [
      {
        int32Hint?: boolean;
      }
    ];
// ----- @typescript-eslint/strict-boolean-expressions -----
type TypescriptEslintStrictBooleanExpressions =
  | []
  | [
      {
        allowString?: boolean;
        allowNumber?: boolean;
        allowNullableObject?: boolean;
        allowNullableBoolean?: boolean;
        allowNullableString?: boolean;
        allowNullableNumber?: boolean;
        allowNullableEnum?: boolean;
        allowAny?: boolean;
        allowRuleToRunWithoutStrictNullChecksIKnowWhatIAmDoing?: boolean;
      }
    ];
// ----- @typescript-eslint/switch-exhaustiveness-check -----
type TypescriptEslintSwitchExhaustivenessCheck =
  | []
  | [
      {
        allowDefaultCaseForExhaustiveSwitch?: boolean;

        requireDefaultForNonUnion?: boolean;
      }
    ];
// ----- @typescript-eslint/triple-slash-reference -----
type TypescriptEslintTripleSlashReference =
  | []
  | [
      {
        lib?: "always" | "never";
        path?: "always" | "never";
        types?: "always" | "never" | "prefer-import";
      }
    ];
// ----- @typescript-eslint/type-annotation-spacing -----
type TypescriptEslintTypeAnnotationSpacing =
  | []
  | [
      {
        before?: boolean;
        after?: boolean;
        overrides?: {
          colon?: _TypescriptEslintTypeAnnotationSpacing_SpacingConfig;
          arrow?: _TypescriptEslintTypeAnnotationSpacing_SpacingConfig;
          variable?: _TypescriptEslintTypeAnnotationSpacing_SpacingConfig;
          parameter?: _TypescriptEslintTypeAnnotationSpacing_SpacingConfig;
          property?: _TypescriptEslintTypeAnnotationSpacing_SpacingConfig;
          returnType?: _TypescriptEslintTypeAnnotationSpacing_SpacingConfig;
        };
      }
    ];
interface _TypescriptEslintTypeAnnotationSpacing_SpacingConfig {
  before?: boolean;
  after?: boolean;
}
// ----- @typescript-eslint/typedef -----
type TypescriptEslintTypedef =
  | []
  | [
      {
        arrayDestructuring?: boolean;
        arrowParameter?: boolean;
        memberVariableDeclaration?: boolean;
        objectDestructuring?: boolean;
        parameter?: boolean;
        propertyDeclaration?: boolean;
        variableDeclaration?: boolean;
        variableDeclarationIgnoreFunction?: boolean;
      }
    ];
// ----- @typescript-eslint/unbound-method -----
type TypescriptEslintUnboundMethod =
  | []
  | [
      {
        ignoreStatic?: boolean;
      }
    ];
// ----- @typescript-eslint/unified-signatures -----
type TypescriptEslintUnifiedSignatures =
  | []
  | [
      {
        ignoreDifferentlyNamedParameters?: boolean;
      }
    ];
// ----- banner/banner -----
type BannerBanner =
  | []
  | [
      {
        banner?: string;

        commentType?: string;

        numNewlines?: number;
      }
    ];
// ----- jsx-a11y/accessible-emoji -----
type _JsxA11YAccessibleEmoji_JsxA11YAccessibleEmoji =
  | []
  | [
      {
        [k: string]: unknown | undefined;
      }
    ];
// ----- jsx-a11y/alt-text -----
type _JsxA11YAltText_JsxA11YAltText =
  | []
  | [
      {
        elements?: string[];
        img?: string[];
        object?: string[];
        area?: string[];
        'input[type="image"]'?: string[];
        [k: string]: unknown | undefined;
      }
    ];
// ----- jsx-a11y/anchor-ambiguous-text -----
type _JsxA11YAnchorAmbiguousText_JsxA11YAnchorAmbiguousText =
  | []
  | [
      {
        words?: string[];
        [k: string]: unknown | undefined;
      }
    ];
// ----- jsx-a11y/anchor-has-content -----
type _JsxA11YAnchorHasContent_JsxA11YAnchorHasContent =
  | []
  | [
      {
        components?: string[];
        [k: string]: unknown | undefined;
      }
    ];
// ----- jsx-a11y/anchor-is-valid -----
type _JsxA11YAnchorIsValid_JsxA11YAnchorIsValid =
  | []
  | [
      {
        components?: string[];
        specialLink?: string[];

        aspects?: [
          "noHref" | "invalidHref" | "preferButton",
          ...("noHref" | "invalidHref" | "preferButton")[]
        ];
        [k: string]: unknown | undefined;
      }
    ];
// ----- jsx-a11y/aria-activedescendant-has-tabindex -----
type _JsxA11YAriaActivedescendantHasTabindex_JsxA11YAriaActivedescendantHasTabindex =

    | []
    | [
        {
          [k: string]: unknown | undefined;
        }
      ];
// ----- jsx-a11y/aria-props -----
type _JsxA11YAriaProps_JsxA11YAriaProps =
  | []
  | [
      {
        [k: string]: unknown | undefined;
      }
    ];
// ----- jsx-a11y/aria-proptypes -----
type _JsxA11YAriaProptypes_JsxA11YAriaProptypes =
  | []
  | [
      {
        [k: string]: unknown | undefined;
      }
    ];
// ----- jsx-a11y/aria-role -----
type _JsxA11YAriaRole_JsxA11YAriaRole =
  | []
  | [
      {
        allowedInvalidRoles?: string[];
        ignoreNonDOM?: boolean;
        [k: string]: unknown | undefined;
      }
    ];
// ----- jsx-a11y/aria-unsupported-elements -----
type _JsxA11YAriaUnsupportedElements_JsxA11YAriaUnsupportedElements =
  | []
  | [
      {
        [k: string]: unknown | undefined;
      }
    ];
// ----- jsx-a11y/autocomplete-valid -----
type _JsxA11YAutocompleteValid_JsxA11YAutocompleteValid =
  | []
  | [
      {
        inputComponents?: string[];
        [k: string]: unknown | undefined;
      }
    ];
// ----- jsx-a11y/click-events-have-key-events -----
type _JsxA11YClickEventsHaveKeyEvents_JsxA11YClickEventsHaveKeyEvents =
  | []
  | [
      {
        [k: string]: unknown | undefined;
      }
    ];
// ----- jsx-a11y/control-has-associated-label -----
type _JsxA11YControlHasAssociatedLabel_JsxA11YControlHasAssociatedLabel =
  | []
  | [
      {
        labelAttributes?: string[];
        controlComponents?: string[];
        ignoreElements?: string[];
        ignoreRoles?: string[];

        depth?: number;
        [k: string]: unknown | undefined;
      }
    ];
// ----- jsx-a11y/heading-has-content -----
type _JsxA11YHeadingHasContent_JsxA11YHeadingHasContent =
  | []
  | [
      {
        components?: string[];
        [k: string]: unknown | undefined;
      }
    ];
// ----- jsx-a11y/html-has-lang -----
type _JsxA11YHtmlHasLang_JsxA11YHtmlHasLang =
  | []
  | [
      {
        [k: string]: unknown | undefined;
      }
    ];
// ----- jsx-a11y/iframe-has-title -----
type _JsxA11YIframeHasTitle_JsxA11YIframeHasTitle =
  | []
  | [
      {
        [k: string]: unknown | undefined;
      }
    ];
// ----- jsx-a11y/img-redundant-alt -----
type _JsxA11YImgRedundantAlt_JsxA11YImgRedundantAlt =
  | []
  | [
      {
        components?: string[];
        words?: string[];
        [k: string]: unknown | undefined;
      }
    ];
// ----- jsx-a11y/interactive-supports-focus -----
type _JsxA11YInteractiveSupportsFocus_JsxA11YInteractiveSupportsFocus =
  | []
  | [
      {
        tabbable?: (
          | "button"
          | "checkbox"
          | "columnheader"
          | "combobox"
          | "grid"
          | "gridcell"
          | "link"
          | "listbox"
          | "menu"
          | "menubar"
          | "menuitem"
          | "menuitemcheckbox"
          | "menuitemradio"
          | "option"
          | "progressbar"
          | "radio"
          | "radiogroup"
          | "row"
          | "rowheader"
          | "scrollbar"
          | "searchbox"
          | "slider"
          | "spinbutton"
          | "switch"
          | "tab"
          | "tablist"
          | "textbox"
          | "tree"
          | "treegrid"
          | "treeitem"
          | "doc-backlink"
          | "doc-biblioref"
          | "doc-glossref"
          | "doc-noteref"
        )[];
        [k: string]: unknown | undefined;
      }
    ];
// ----- jsx-a11y/label-has-associated-control -----
type _JsxA11YLabelHasAssociatedControl_JsxA11YLabelHasAssociatedControl =
  | []
  | [
      {
        labelComponents?: string[];
        labelAttributes?: string[];
        controlComponents?: string[];

        assert?: "htmlFor" | "nesting" | "both" | "either";

        depth?: number;
        [k: string]: unknown | undefined;
      }
    ];
// ----- jsx-a11y/label-has-for -----
type _JsxA11YLabelHasFor_JsxA11YLabelHasFor =
  | []
  | [
      {
        components?: string[];
        required?:
          | ("nesting" | "id")
          | {
              some: ("nesting" | "id")[];
              [k: string]: unknown | undefined;
            }
          | {
              every: ("nesting" | "id")[];
              [k: string]: unknown | undefined;
            };
        allowChildren?: boolean;
        [k: string]: unknown | undefined;
      }
    ];
// ----- jsx-a11y/lang -----
type _JsxA11YLang_JsxA11YLang =
  | []
  | [
      {
        [k: string]: unknown | undefined;
      }
    ];
// ----- jsx-a11y/media-has-caption -----
type _JsxA11YMediaHasCaption_JsxA11YMediaHasCaption =
  | []
  | [
      {
        audio?: string[];
        video?: string[];
        track?: string[];
        [k: string]: unknown | undefined;
      }
    ];
// ----- jsx-a11y/mouse-events-have-key-events -----
type _JsxA11YMouseEventsHaveKeyEvents_JsxA11YMouseEventsHaveKeyEvents =
  | []
  | [
      {
        hoverInHandlers?: string[];

        hoverOutHandlers?: string[];
        [k: string]: unknown | undefined;
      }
    ];
// ----- jsx-a11y/no-access-key -----
type _JsxA11YNoAccessKey_JsxA11YNoAccessKey =
  | []
  | [
      {
        [k: string]: unknown | undefined;
      }
    ];
// ----- jsx-a11y/no-aria-hidden-on-focusable -----
type _JsxA11YNoAriaHiddenOnFocusable_JsxA11YNoAriaHiddenOnFocusable =
  | []
  | [
      {
        [k: string]: unknown | undefined;
      }
    ];
// ----- jsx-a11y/no-autofocus -----
type _JsxA11YNoAutofocus_JsxA11YNoAutofocus =
  | []
  | [
      {
        ignoreNonDOM?: boolean;
        [k: string]: unknown | undefined;
      }
    ];
// ----- jsx-a11y/no-distracting-elements -----
type _JsxA11YNoDistractingElements_JsxA11YNoDistractingElements =
  | []
  | [
      {
        elements?: ("marquee" | "blink")[];
        [k: string]: unknown | undefined;
      }
    ];
// ----- jsx-a11y/no-interactive-element-to-noninteractive-role -----
type _JsxA11YNoInteractiveElementToNoninteractiveRole_JsxA11YNoInteractiveElementToNoninteractiveRole =

    | []
    | [
        {
          [k: string]: string[] | undefined;
        }
      ];
// ----- jsx-a11y/no-noninteractive-element-interactions -----
type _JsxA11YNoNoninteractiveElementInteractions_JsxA11YNoNoninteractiveElementInteractions =

    | []
    | [
        {
          handlers?: string[];
          [k: string]: unknown | undefined;
        }
      ];
// ----- jsx-a11y/no-noninteractive-element-to-interactive-role -----
type _JsxA11YNoNoninteractiveElementToInteractiveRole_JsxA11YNoNoninteractiveElementToInteractiveRole =

    | []
    | [
        {
          [k: string]: string[] | undefined;
        }
      ];
// ----- jsx-a11y/no-noninteractive-tabindex -----
type _JsxA11YNoNoninteractiveTabindex_JsxA11YNoNoninteractiveTabindex =
  | []
  | [
      {
        roles?: string[];

        tags?: string[];
        [k: string]: unknown | undefined;
      }
    ];
// ----- jsx-a11y/no-onchange -----
type _JsxA11YNoOnchange_JsxA11YNoOnchange =
  | []
  | [
      {
        [k: string]: unknown | undefined;
      }
    ];
// ----- jsx-a11y/no-redundant-roles -----
type _JsxA11YNoRedundantRoles_JsxA11YNoRedundantRoles =
  | []
  | [
      {
        [k: string]: string[] | undefined;
      }
    ];
// ----- jsx-a11y/no-static-element-interactions -----
type _JsxA11YNoStaticElementInteractions_JsxA11YNoStaticElementInteractions =
  | []
  | [
      {
        handlers?: string[];
        [k: string]: unknown | undefined;
      }
    ];
// ----- jsx-a11y/prefer-tag-over-role -----
type _JsxA11YPreferTagOverRole_JsxA11YPreferTagOverRole =
  | []
  | [
      {
        [k: string]: unknown | undefined;
      }
    ];
// ----- jsx-a11y/role-has-required-aria-props -----
type _JsxA11YRoleHasRequiredAriaProps_JsxA11YRoleHasRequiredAriaProps =
  | []
  | [
      {
        [k: string]: unknown | undefined;
      }
    ];
// ----- jsx-a11y/role-supports-aria-props -----
type _JsxA11YRoleSupportsAriaProps_JsxA11YRoleSupportsAriaProps =
  | []
  | [
      {
        [k: string]: unknown | undefined;
      }
    ];
// ----- jsx-a11y/scope -----
type _JsxA11YScope_JsxA11YScope =
  | []
  | [
      {
        [k: string]: unknown | undefined;
      }
    ];
// ----- jsx-a11y/tabindex-no-positive -----
type _JsxA11YTabindexNoPositive_JsxA11YTabindexNoPositive =
  | []
  | [
      {
        [k: string]: unknown | undefined;
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
// ----- react-hooks/exhaustive-deps -----
type ReactHooksExhaustiveDeps =
  | []
  | [
      {
        additionalHooks?: string;
        enableDangerousAutofixThisMayCauseInfiniteLoops?: boolean;
      }
    ];
// ----- react/boolean-prop-naming -----
type ReactBooleanPropNaming =
  | []
  | [
      {
        propTypeNames?: [string, ...string[]];
        rule?: string;
        message?: string;
        validateNested?: boolean;
      }
    ];
// ----- react/button-has-type -----
type ReactButtonHasType =
  | []
  | [
      {
        button?: boolean;
        submit?: boolean;
        reset?: boolean;
      }
    ];
// ----- react/checked-requires-onchange-or-readonly -----
type ReactCheckedRequiresOnchangeOrReadonly =
  | []
  | [
      {
        ignoreMissingProperties?: boolean;
        ignoreExclusiveCheckedAttribute?: boolean;
      }
    ];
// ----- react/default-props-match-prop-types -----
type ReactDefaultPropsMatchPropTypes =
  | []
  | [
      {
        allowRequiredDefaults?: boolean;
      }
    ];
// ----- react/destructuring-assignment -----
type ReactDestructuringAssignment =
  | []
  | ["always" | "never"]
  | [
      "always" | "never",
      {
        ignoreClassFields?: boolean;
        destructureInSignature?: "always" | "ignore";
      }
    ];
// ----- react/display-name -----
type ReactDisplayName =
  | []
  | [
      {
        ignoreTranspilerName?: boolean;
        checkContextObjects?: boolean;
      }
    ];
// ----- react/forbid-component-props -----
type ReactForbidComponentProps =
  | []
  | [
      {
        forbid?: (
          | string
          | {
              propName?: string;
              allowedFor?: string[];
              message?: string;
            }
          | {
              propName?: string;

              disallowedFor: [string, ...string[]];
              message?: string;
            }
        )[];
        [k: string]: unknown | undefined;
      }
    ];
// ----- react/forbid-dom-props -----
type ReactForbidDomProps =
  | []
  | [
      {
        forbid?: (
          | string
          | {
              propName?: string;
              disallowedFor?: string[];
              message?: string;
              [k: string]: unknown | undefined;
            }
        )[];
      }
    ];
// ----- react/forbid-elements -----
type ReactForbidElements =
  | []
  | [
      {
        forbid?: (
          | string
          | {
              element: string;
              message?: string;
            }
        )[];
      }
    ];
// ----- react/forbid-foreign-prop-types -----
type ReactForbidForeignPropTypes =
  | []
  | [
      {
        allowInPropTypes?: boolean;
      }
    ];
// ----- react/forbid-prop-types -----
type ReactForbidPropTypes =
  | []
  | [
      {
        forbid?: string[];
        checkContextTypes?: boolean;
        checkChildContextTypes?: boolean;
        [k: string]: unknown | undefined;
      }
    ];
// ----- react/function-component-definition -----
type ReactFunctionComponentDefinition =
  | []
  | [
      {
        namedComponents?:
          | ("function-declaration" | "arrow-function" | "function-expression")
          | (
              | "function-declaration"
              | "arrow-function"
              | "function-expression"
            )[];
        unnamedComponents?:
          | ("arrow-function" | "function-expression")
          | ("arrow-function" | "function-expression")[];
        [k: string]: unknown | undefined;
      }
    ];
// ----- react/hook-use-state -----
type ReactHookUseState =
  | []
  | [
      {
        allowDestructuredState?: boolean;
      }
    ];
// ----- react/jsx-boolean-value -----
type ReactJsxBooleanValue =
  | []
  | ["always" | "never"]
  | []
  | ["always"]
  | [
      "always",
      {
        never?: string[];
        assumeUndefinedIsFalse?: boolean;
      }
    ]
  | []
  | ["never"]
  | [
      "never",
      {
        always?: string[];
        assumeUndefinedIsFalse?: boolean;
      }
    ];
// ----- react/jsx-closing-bracket-location -----
type ReactJsxClosingBracketLocation =
  | []
  | [
      | ("after-props" | "props-aligned" | "tag-aligned" | "line-aligned")
      | {
          location?:
            | "after-props"
            | "props-aligned"
            | "tag-aligned"
            | "line-aligned";
        }
      | {
          nonEmpty?:
            | "after-props"
            | "props-aligned"
            | "tag-aligned"
            | "line-aligned"
            | false;
          selfClosing?:
            | "after-props"
            | "props-aligned"
            | "tag-aligned"
            | "line-aligned"
            | false;
        }
    ];
// ----- react/jsx-curly-brace-presence -----
type ReactJsxCurlyBracePresence =
  | []
  | [
      | {
          props?: "always" | "never" | "ignore";
          children?: "always" | "never" | "ignore";
          propElementValues?: "always" | "never" | "ignore";
        }
      | ("always" | "never" | "ignore")
    ];
// ----- react/jsx-curly-newline -----
type ReactJsxCurlyNewline =
  | []
  | [
      | ("consistent" | "never")
      | {
          singleline?: "consistent" | "require" | "forbid";
          multiline?: "consistent" | "require" | "forbid";
        }
    ];
// ----- react/jsx-curly-spacing -----
type ReactJsxCurlySpacing =
  | []
  | [
      | (_ReactJsxCurlySpacing_BasicConfig & {
          attributes?: _ReactJsxCurlySpacingBasicConfigOrBoolean;
          children?: _ReactJsxCurlySpacingBasicConfigOrBoolean;
          [k: string]: unknown | undefined;
        })
      | ("always" | "never")
    ]
  | [
      (
        | (_ReactJsxCurlySpacing_BasicConfig & {
            attributes?: _ReactJsxCurlySpacingBasicConfigOrBoolean;
            children?: _ReactJsxCurlySpacingBasicConfigOrBoolean;
            [k: string]: unknown | undefined;
          })
        | ("always" | "never")
      ),
      {
        allowMultiline?: boolean;
        spacing?: {
          objectLiterals?: "always" | "never";
          [k: string]: unknown | undefined;
        };
      }
    ];
type _ReactJsxCurlySpacingBasicConfigOrBoolean =
  | _ReactJsxCurlySpacing_BasicConfig
  | boolean;
interface _ReactJsxCurlySpacing_BasicConfig {
  when?: "always" | "never";
  allowMultiline?: boolean;
  spacing?: {
    objectLiterals?: "always" | "never";
    [k: string]: unknown | undefined;
  };
  [k: string]: unknown | undefined;
}
// ----- react/jsx-equals-spacing -----
type ReactJsxEqualsSpacing = [] | ["always" | "never"];
// ----- react/jsx-filename-extension -----
type ReactJsxFilenameExtension =
  | []
  | [
      {
        allow?: "always" | "as-needed";
        extensions?: string[];
        ignoreFilesWithoutCode?: boolean;
      }
    ];
// ----- react/jsx-first-prop-new-line -----
type ReactJsxFirstPropNewLine =
  | []
  | ["always" | "never" | "multiline" | "multiline-multiprop" | "multiprop"];
// ----- react/jsx-fragments -----
type ReactJsxFragments = [] | ["syntax" | "element"];
// ----- react/jsx-handler-names -----
type ReactJsxHandlerNames =
  | []
  | [
      | {
          eventHandlerPrefix?: string;
          eventHandlerPropPrefix?: string;
          checkLocalVariables?: boolean;
          checkInlineFunction?: boolean;
        }
      | {
          eventHandlerPrefix?: string;
          eventHandlerPropPrefix?: false;
          checkLocalVariables?: boolean;
          checkInlineFunction?: boolean;
        }
      | {
          eventHandlerPrefix?: false;
          eventHandlerPropPrefix?: string;
          checkLocalVariables?: boolean;
          checkInlineFunction?: boolean;
        }
      | {
          checkLocalVariables?: boolean;
        }
      | {
          checkInlineFunction?: boolean;
        }
    ];
// ----- react/jsx-indent -----
type ReactJsxIndent =
  | []
  | ["tab" | number]
  | [
      "tab" | number,
      {
        checkAttributes?: boolean;
        indentLogicalExpressions?: boolean;
      }
    ];
// ----- react/jsx-indent-props -----
type ReactJsxIndentProps =
  | []
  | [
      | ("tab" | "first")
      | number
      | {
          indentMode?: ("tab" | "first") | number;
          ignoreTernaryOperator?: boolean;
          [k: string]: unknown | undefined;
        }
    ];
// ----- react/jsx-key -----
type ReactJsxKey =
  | []
  | [
      {
        checkFragmentShorthand?: boolean;
        checkKeyMustBeforeSpread?: boolean;
        warnOnDuplicates?: boolean;
      }
    ];
// ----- react/jsx-max-depth -----
type ReactJsxMaxDepth =
  | []
  | [
      {
        max?: number;
      }
    ];
// ----- react/jsx-max-props-per-line -----
type ReactJsxMaxPropsPerLine =
  | []
  | [
      | {
          maximum?: {
            single?: number;
            multi?: number;
            [k: string]: unknown | undefined;
          };
        }
      | {
          maximum?: number;
          when?: "always" | "multiline";
        }
    ];
// ----- react/jsx-newline -----
type ReactJsxNewline =
  | []
  | [
      {
        prevent?: boolean;
        allowMultilines?: boolean;
      }
    ];
// ----- react/jsx-no-bind -----
type ReactJsxNoBind =
  | []
  | [
      {
        allowArrowFunctions?: boolean;
        allowBind?: boolean;
        allowFunctions?: boolean;
        ignoreRefs?: boolean;
        ignoreDOMComponents?: boolean;
      }
    ];
// ----- react/jsx-no-duplicate-props -----
type ReactJsxNoDuplicateProps =
  | []
  | [
      {
        ignoreCase?: boolean;
      }
    ];
// ----- react/jsx-no-leaked-render -----
type ReactJsxNoLeakedRender =
  | []
  | [
      {
        validStrategies?: ("ternary" | "coerce")[];
      }
    ];
// ----- react/jsx-no-literals -----
type ReactJsxNoLiterals =
  | []
  | [
      {
        noStrings?: boolean;
        allowedStrings?: string[];
        ignoreProps?: boolean;
        noAttributeStrings?: boolean;
      }
    ];
// ----- react/jsx-no-script-url -----
type ReactJsxNoScriptUrl =
  | []
  | [
      {
        name: string;
        props: string[];
      }[]
    ]
  | [
      {
        name: string;
        props: string[];
      }[],
      {
        includeFromSettings?: boolean;
        [k: string]: unknown | undefined;
      }
    ]
  | []
  | [
      {
        includeFromSettings?: boolean;
        [k: string]: unknown | undefined;
      }
    ];
// ----- react/jsx-no-target-blank -----
type ReactJsxNoTargetBlank =
  | []
  | [
      {
        allowReferrer?: boolean;
        enforceDynamicLinks?: "always" | "never";
        warnOnSpreadAttributes?: boolean;
        links?: boolean;
        forms?: boolean;
      }
    ];
// ----- react/jsx-no-undef -----
type ReactJsxNoUndef =
  | []
  | [
      {
        allowGlobals?: boolean;
      }
    ];
// ----- react/jsx-no-useless-fragment -----
type ReactJsxNoUselessFragment =
  | []
  | [
      {
        allowExpressions?: boolean;
        [k: string]: unknown | undefined;
      }
    ];
// ----- react/jsx-one-expression-per-line -----
type ReactJsxOneExpressionPerLine =
  | []
  | [
      {
        allow?: "none" | "literal" | "single-child" | "non-jsx";
      }
    ];
// ----- react/jsx-pascal-case -----
type ReactJsxPascalCase =
  | []
  | [
      {
        allowAllCaps?: boolean;
        allowLeadingUnderscore?: boolean;
        allowNamespace?: boolean;

        ignore?: [] | [string];
      }
    ];
// ----- react/jsx-props-no-spreading -----
type ReactJsxPropsNoSpreading =
  | []
  | [
      {
        html?: "enforce" | "ignore";
        custom?: "enforce" | "ignore";
        exceptions?: string[];
        [k: string]: unknown | undefined;
      } & {
        [k: string]: unknown | undefined;
      }
    ];
// ----- react/jsx-sort-default-props -----
type ReactJsxSortDefaultProps =
  | []
  | [
      {
        ignoreCase?: boolean;
      }
    ];
// ----- react/jsx-sort-props -----
type ReactJsxSortProps =
  | []
  | [
      {
        callbacksLast?: boolean;
        shorthandFirst?: boolean;
        shorthandLast?: boolean;
        multiline?: "ignore" | "first" | "last";
        ignoreCase?: boolean;
        noSortAlphabetically?: boolean;
        reservedFirst?: unknown[] | boolean;
        locale?: string;
      }
    ];
// ----- react/jsx-space-before-closing -----
type ReactJsxSpaceBeforeClosing = [] | ["always" | "never"];
// ----- react/jsx-tag-spacing -----
type ReactJsxTagSpacing =
  | []
  | [
      {
        closingSlash?: "always" | "never" | "allow";
        beforeSelfClosing?:
          | "always"
          | "proportional-always"
          | "never"
          | "allow";
        afterOpening?: "always" | "allow-multiline" | "never" | "allow";
        beforeClosing?: "always" | "proportional-always" | "never" | "allow";
      }
    ];
// ----- react/jsx-wrap-multilines -----
type ReactJsxWrapMultilines =
  | []
  | [
      {
        declaration?:
          | true
          | false
          | "ignore"
          | "parens"
          | "parens-new-line"
          | "never";
        assignment?:
          | true
          | false
          | "ignore"
          | "parens"
          | "parens-new-line"
          | "never";
        return?:
          | true
          | false
          | "ignore"
          | "parens"
          | "parens-new-line"
          | "never";
        arrow?:
          | true
          | false
          | "ignore"
          | "parens"
          | "parens-new-line"
          | "never";
        condition?:
          | true
          | false
          | "ignore"
          | "parens"
          | "parens-new-line"
          | "never";
        logical?:
          | true
          | false
          | "ignore"
          | "parens"
          | "parens-new-line"
          | "never";
        prop?: true | false | "ignore" | "parens" | "parens-new-line" | "never";
      }
    ];
// ----- react/no-children-prop -----
type ReactNoChildrenProp =
  | []
  | [
      {
        allowFunctions?: boolean;
      }
    ];
// ----- react/no-did-mount-set-state -----
type ReactNoDidMountSetState = [] | ["disallow-in-func"];
// ----- react/no-did-update-set-state -----
type ReactNoDidUpdateSetState = [] | ["disallow-in-func"];
// ----- react/no-invalid-html-attribute -----
type ReactNoInvalidHtmlAttribute = [] | ["rel"[]];
// ----- react/no-multi-comp -----
type ReactNoMultiComp =
  | []
  | [
      {
        ignoreStateless?: boolean;
      }
    ];
// ----- react/no-string-refs -----
type ReactNoStringRefs =
  | []
  | [
      {
        noTemplateLiterals?: boolean;
      }
    ];
// ----- react/no-unescaped-entities -----
type ReactNoUnescapedEntities =
  | []
  | [
      {
        forbid?: (
          | string
          | {
              char?: string;
              alternatives?: string[];
              [k: string]: unknown | undefined;
            }
        )[];
      }
    ];
// ----- react/no-unknown-property -----
type ReactNoUnknownProperty =
  | []
  | [
      {
        ignore?: string[];
        requireDataLowercase?: boolean;
      }
    ];
// ----- react/no-unsafe -----
type ReactNoUnsafe =
  | []
  | [
      {
        checkAliases?: boolean;
      }
    ];
// ----- react/no-unstable-nested-components -----
type ReactNoUnstableNestedComponents =
  | []
  | [
      {
        customValidators?: string[];
        allowAsProps?: boolean;
      }
    ];
// ----- react/no-unused-prop-types -----
type ReactNoUnusedPropTypes =
  | []
  | [
      {
        ignore?: string[];
        customValidators?: string[];
        skipShapeProps?: boolean;
      }
    ];
// ----- react/no-will-update-set-state -----
type ReactNoWillUpdateSetState = [] | ["disallow-in-func"];
// ----- react/prefer-es6-class -----
type ReactPreferEs6Class = [] | ["always" | "never"];
// ----- react/prefer-stateless-function -----
type ReactPreferStatelessFunction =
  | []
  | [
      {
        ignorePureComponents?: boolean;
      }
    ];
// ----- react/prop-types -----
type ReactPropTypes =
  | []
  | [
      {
        ignore?: string[];
        customValidators?: string[];
        skipUndeclared?: boolean;
      }
    ];
// ----- react/require-default-props -----
type ReactRequireDefaultProps =
  | []
  | [
      {
        forbidDefaultForRequired?: boolean;
        classes?: "defaultProps" | "ignore";
        functions?: "defaultArguments" | "defaultProps" | "ignore";
        ignoreFunctionalComponents?: boolean;
      }
    ];
// ----- react/require-optimization -----
type ReactRequireOptimization =
  | []
  | [
      {
        allowDecorators?: string[];
      }
    ];
// ----- react/self-closing-comp -----
type ReactSelfClosingComp =
  | []
  | [
      {
        component?: boolean;
        html?: boolean;
      }
    ];
// ----- react/sort-comp -----
type ReactSortComp =
  | []
  | [
      {
        order?: string[];
        groups?: {
          [k: string]: string[];
        };
      }
    ];
// ----- react/sort-default-props -----
type ReactSortDefaultProps =
  | []
  | [
      {
        ignoreCase?: boolean;
      }
    ];
// ----- react/sort-prop-types -----
type ReactSortPropTypes =
  | []
  | [
      {
        requiredFirst?: boolean;
        callbacksLast?: boolean;
        ignoreCase?: boolean;
        noSortAlphabetically?: boolean;
        sortShapeProp?: boolean;
        checkTypes?: boolean;
      }
    ];
// ----- react/state-in-constructor -----
type ReactStateInConstructor = [] | ["always" | "never"];
// ----- react/static-property-placement -----
type ReactStaticPropertyPlacement =
  | []
  | ["static public field" | "static getter" | "property assignment"]
  | [
      "static public field" | "static getter" | "property assignment",
      {
        propTypes?:
          | "static public field"
          | "static getter"
          | "property assignment";
        defaultProps?:
          | "static public field"
          | "static getter"
          | "property assignment";
        childContextTypes?:
          | "static public field"
          | "static getter"
          | "property assignment";
        contextTypes?:
          | "static public field"
          | "static getter"
          | "property assignment";
        contextType?:
          | "static public field"
          | "static getter"
          | "property assignment";
        displayName?:
          | "static public field"
          | "static getter"
          | "property assignment";
      }
    ];
// ----- react/style-prop-object -----
type ReactStylePropObject =
  | []
  | [
      {
        allow?: string[];
        [k: string]: unknown | undefined;
      }
    ];
// ----- unicorn/better-regex -----
type UnicornBetterRegex =
  | []
  | [
      {
        sortCharacterClasses?: boolean;
      }
    ];
// ----- unicorn/catch-error-name -----
type UnicornCatchErrorName =
  | []
  | [
      {
        name?: string;
        ignore?: unknown[];
      }
    ];
// ----- unicorn/consistent-function-scoping -----
type UnicornConsistentFunctionScoping =
  | []
  | [
      {
        checkArrowFunctions?: boolean;
      }
    ];
// ----- unicorn/expiring-todo-comments -----
type UnicornExpiringTodoComments =
  | []
  | [
      {
        terms?: string[];
        ignore?: unknown[];
        ignoreDatesOnPullRequests?: boolean;
        allowWarningComments?: boolean;
        date?: string;
      }
    ];
// ----- unicorn/explicit-length-check -----
type UnicornExplicitLengthCheck =
  | []
  | [
      {
        "non-zero"?: "greater-than" | "not-equal";
      }
    ];
// ----- unicorn/filename-case -----
type UnicornFilenameCase =
  | []
  | [
      | {
          case?: "camelCase" | "snakeCase" | "kebabCase" | "pascalCase";
          ignore?: unknown[];
          multipleFileExtensions?: boolean;
        }
      | {
          cases?: {
            camelCase?: boolean;
            snakeCase?: boolean;
            kebabCase?: boolean;
            pascalCase?: boolean;
          };
          ignore?: unknown[];
          multipleFileExtensions?: boolean;
        }
    ];
// ----- unicorn/import-style -----
type UnicornImportStyle =
  | []
  | [
      {
        checkImport?: boolean;
        checkDynamicImport?: boolean;
        checkExportFrom?: boolean;
        checkRequire?: boolean;
        extendDefaultStyles?: boolean;
        styles?: _UnicornImportStyle_ModuleStyles;
      }
    ];
type _UnicornImportStyleStyles =
  | (false | _UnicornImportStyle_BooleanObject)
  | undefined;
interface _UnicornImportStyle_ModuleStyles {
  [k: string]: _UnicornImportStyleStyles | undefined;
}
interface _UnicornImportStyle_BooleanObject {
  [k: string]: boolean | undefined;
}
// ----- unicorn/no-array-push-push -----
type UnicornNoArrayPushPush =
  | []
  | [
      {
        ignore?: unknown[];
      }
    ];
// ----- unicorn/no-array-reduce -----
type UnicornNoArrayReduce =
  | []
  | [
      {
        allowSimpleOperations?: boolean;
      }
    ];
// ----- unicorn/no-keyword-prefix -----
type UnicornNoKeywordPrefix =
  | []
  | [
      {
        disallowedPrefixes?: [] | [string];
        checkProperties?: boolean;
        onlyCamelCase?: boolean;
      }
    ];
// ----- unicorn/no-null -----
type UnicornNoNull =
  | []
  | [
      {
        checkStrictEquality?: boolean;
      }
    ];
// ----- unicorn/no-typeof-undefined -----
type UnicornNoTypeofUndefined =
  | []
  | [
      {
        checkGlobalVariables?: boolean;
      }
    ];
// ----- unicorn/no-unnecessary-polyfills -----
type UnicornNoUnnecessaryPolyfills =
  | []
  | [
      {
        targets:
          | string
          | unknown[]
          | {
              [k: string]: unknown | undefined;
            };
      }
    ];
// ----- unicorn/no-useless-undefined -----
type UnicornNoUselessUndefined =
  | []
  | [
      {
        checkArguments?: boolean;
        checkArrowFunctionBody?: boolean;
      }
    ];
// ----- unicorn/numeric-separators-style -----
type UnicornNumericSeparatorsStyle =
  | []
  | [
      {
        binary?: {
          onlyIfContainsSeparator?: boolean;
          minimumDigits?: number;
          groupLength?: number;
        };
        octal?: {
          onlyIfContainsSeparator?: boolean;
          minimumDigits?: number;
          groupLength?: number;
        };
        hexadecimal?: {
          onlyIfContainsSeparator?: boolean;
          minimumDigits?: number;
          groupLength?: number;
        };
        number?: {
          onlyIfContainsSeparator?: boolean;
          minimumDigits?: number;
          groupLength?: number;
        };
        onlyIfContainsSeparator?: boolean;
      }
    ];
// ----- unicorn/prefer-add-event-listener -----
type UnicornPreferAddEventListener =
  | []
  | [
      {
        excludedPackages?: string[];
      }
    ];
// ----- unicorn/prefer-array-find -----
type UnicornPreferArrayFind =
  | []
  | [
      {
        checkFromLast?: boolean;
      }
    ];
// ----- unicorn/prefer-array-flat -----
type UnicornPreferArrayFlat =
  | []
  | [
      {
        functions?: unknown[];
      }
    ];
// ----- unicorn/prefer-at -----
type UnicornPreferAt =
  | []
  | [
      {
        getLastElementFunctions?: unknown[];
        checkAllIndexAccess?: boolean;
      }
    ];
// ----- unicorn/prefer-export-from -----
type UnicornPreferExportFrom =
  | []
  | [
      {
        ignoreUsedVariables?: boolean;
      }
    ];
// ----- unicorn/prefer-number-properties -----
type UnicornPreferNumberProperties =
  | []
  | [
      {
        checkInfinity?: boolean;
        checkNaN?: boolean;
      }
    ];
// ----- unicorn/prefer-object-from-entries -----
type UnicornPreferObjectFromEntries =
  | []
  | [
      {
        functions?: unknown[];
      }
    ];
// ----- unicorn/prefer-structured-clone -----
type UnicornPreferStructuredClone =
  | []
  | [
      {
        functions?: unknown[];
      }
    ];
// ----- unicorn/prefer-switch -----
type UnicornPreferSwitch =
  | []
  | [
      {
        minimumCases?: number;
        emptyDefaultCase?:
          | "no-default-comment"
          | "do-nothing-comment"
          | "no-default-case";
      }
    ];
// ----- unicorn/prefer-ternary -----
type UnicornPreferTernary = [] | ["always" | "only-single-line"];
// ----- unicorn/prevent-abbreviations -----
type UnicornPreventAbbreviations =
  | []
  | [
      {
        checkProperties?: boolean;
        checkVariables?: boolean;
        checkDefaultAndNamespaceImports?: boolean | string;
        checkShorthandImports?: boolean | string;
        checkShorthandProperties?: boolean;
        checkFilenames?: boolean;
        extendDefaultReplacements?: boolean;
        replacements?: _UnicornPreventAbbreviations_Abbreviations;
        extendDefaultAllowList?: boolean;
        allowList?: _UnicornPreventAbbreviations_BooleanObject;
        ignore?: unknown[];
      }
    ];
type _UnicornPreventAbbreviationsReplacements =
  | (false | _UnicornPreventAbbreviations_BooleanObject)
  | undefined;
interface _UnicornPreventAbbreviations_Abbreviations {
  [k: string]: _UnicornPreventAbbreviationsReplacements | undefined;
}
interface _UnicornPreventAbbreviations_BooleanObject {
  [k: string]: boolean | undefined;
}
// ----- unicorn/relative-url-style -----
type UnicornRelativeUrlStyle = [] | ["never" | "always"];
// ----- unicorn/string-content -----
type UnicornStringContent =
  | []
  | [
      {
        patterns?: {
          [k: string]:
            | (
                | string
                | {
                    suggest: string;
                    fix?: boolean;
                    message?: string;
                  }
              )
            | undefined;
        };
      }
    ];
// ----- unicorn/switch-case-braces -----
type UnicornSwitchCaseBraces = [] | ["always" | "avoid"];
// ----- unicorn/template-indent -----
type UnicornTemplateIndent =
  | []
  | [
      {
        indent?: string | number;
        tags?: string[];
        functions?: string[];
        selectors?: string[];
        comments?: string[];
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
