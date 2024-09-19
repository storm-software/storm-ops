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
