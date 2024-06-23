import { getParenthesizedRange } from "../utils/parentheses";

export function removeMemberExpressionProperty(
  fixer,
  memberExpression,
  sourceCode
) {
  const [, start] = getParenthesizedRange(memberExpression.object, sourceCode);
  const [, end] = memberExpression.range;

  return fixer.removeRange([start, end]);
}

export default removeMemberExpressionProperty;
