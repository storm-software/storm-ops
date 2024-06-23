import { isParenthesized } from "../utils/parentheses";
import shouldAddParenthesesToNewExpressionCallee from "../utils/should-add-parentheses-to-new-expression-callee";
import fixSpaceAroundKeyword from "./fix-space-around-keywords";

export function* switchCallExpressionToNewExpression(node, sourceCode, fixer) {
  yield* fixSpaceAroundKeyword(fixer, node, sourceCode);
  yield fixer.insertTextBefore(node, "new ");

  const { callee } = node;
  if (
    !isParenthesized(callee, sourceCode) &&
    shouldAddParenthesesToNewExpressionCallee(callee)
  ) {
    yield fixer.insertTextBefore(callee, "(");
    yield fixer.insertTextAfter(callee, ")");
  }
}

export default switchCallExpressionToNewExpression;
