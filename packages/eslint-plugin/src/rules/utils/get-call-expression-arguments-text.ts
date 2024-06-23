import getCallExpressionTokens from "./get-call-expression-tokens";

/** @typedef {import('estree').CallExpression} CallExpression */

/**
Get the text of the arguments list of `CallExpression`.

@param {import('eslint').SourceCode} sourceCode - The source code object.
@param {CallExpression} callExpression - The `CallExpression` node.
@param {SourceCode} sourceCode - The source code object.
@returns {string}
*/
export function getCallExpressionArgumentsText(sourceCode, callExpression) {
  const { openingParenthesisToken, closingParenthesisToken } =
    getCallExpressionTokens(sourceCode, callExpression);

  return sourceCode.text.slice(
    openingParenthesisToken.range[1],
    closingParenthesisToken.range[0]
  );
}

export default getCallExpressionArgumentsText;
