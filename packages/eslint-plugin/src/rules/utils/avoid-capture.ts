import {
  isIdentifierName,
  isKeyword,
  isStrictReservedWord
} from "@babel/helper-validator-identifier";
import getReferences from "./get-references";
import { resolveVariableName } from "./resolve-variable-name";

// https://github.com/microsoft/TypeScript/issues/2536#issuecomment-87194347
const typescriptReservedWords = new Set([
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "debugger",
  "default",
  "delete",
  "do",
  "else",
  "enum",
  "export",
  "extends",
  "false",
  "finally",
  "for",
  "function",
  "if",
  "import",
  "in",
  "instanceof",
  "new",
  "null",
  "return",
  "super",
  "switch",
  "this",
  "throw",
  "true",
  "try",
  "typeof",
  "var",
  "void",
  "while",
  "with",
  "as",
  "implements",
  "interface",
  "let",
  "package",
  "private",
  "protected",
  "public",
  "static",
  "yield",
  "any",
  "boolean",
  "constructor",
  "declare",
  "get",
  "module",
  "require",
  "number",
  "set",
  "string",
  "symbol",
  "type",
  "from",
  "of"
]);

// Copied from https://github.com/babel/babel/blob/fce35af69101c6b316557e28abf60bdbf77d6a36/packages/babel-types/src/validators/isValidIdentifier.ts#L7
// Use this function instead of `require('@babel/types').isIdentifier`, since `@babel/helper-validator-identifier` package is much smaller
const isValidIdentifier = name =>
  typeof name === "string" &&
  !isKeyword(name) &&
  !isStrictReservedWord(name, true) &&
  isIdentifierName(name) &&
  name !== "arguments" &&
  !typescriptReservedWords.has(name);

/*
Unresolved reference is probably from the global scope. We should avoid using that name.

For example, like `foo` and `bar` below.

```
function storm-software() {
	return foo;
}

function storm-software() {
	return function() {
		return bar;
	};
}
```
*/
const isUnresolvedName = (name, scope) =>
  getReferences(scope).some(
    ({ identifier, resolved }) => identifier?.name === name && !resolved
  );

const isSafeName = (name, scopes) =>
  !scopes.some(
    scope => resolveVariableName(name, scope) || isUnresolvedName(name, scope)
  );

const alwaysTrue = () => true;

/**
 * Rule-specific name check function.
 */
export type IsSafeCallback = (name: string, scopes: string[]) => boolean;

/**
Generates a unique name prefixed with `name` such that:
- it is not defined in any of the `scopes`,
- it is not a reserved word,
- it is not `arguments` in strict scopes (where `arguments` is not allowed),
- it does not collide with the actual `arguments` (which is always defined in function scopes).

Useful when you want to rename a variable (or create a new variable) while being sure not to shadow any other variables in the code.

@param {string} name - The desired name for a new variable.
@param {string[]} scopes - The list of scopes the new variable will be referenced in.
@param {IsSafeCallback} [isSafe] - Rule-specific name check function.
@returns {string} - Either `name` as is, or a string like `${name}_` suffixed with underscores to make the name unique.
*/
export function avoidCapture(
  name: string,
  scopes: string[],
  isSafe = alwaysTrue as IsSafeCallback
) {
  if (!isValidIdentifier(name)) {
    name += "_";

    if (!isValidIdentifier(name)) {
      return;
    }
  }

  while (!isSafeName(name, scopes) || !isSafe(name, scopes)) {
    name += "_";
  }

  return name;
}

export default avoidCapture;
