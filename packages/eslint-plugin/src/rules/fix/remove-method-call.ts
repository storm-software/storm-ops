import { getParenthesizedRange } from "../utils/parentheses";
import removeMemberExpressionProperty from "./remove-member-expression-property";

export function* removeMethodCall(fixer, callExpression, sourceCode) {
  const memberExpression = callExpression.callee;

  // `(( (( foo )).bar ))()`
  //              ^^^^
  yield removeMemberExpressionProperty(fixer, memberExpression, sourceCode);

  // `(( (( foo )).bar ))()`
  //                     ^^
  const [, start] = getParenthesizedRange(memberExpression, sourceCode);
  const [, end] = callExpression.range;

  yield fixer.removeRange([start, end]);
}

export default removeMethodCall;
