import { isNumberLiteral } from "../ast";
import isSameReference from "../utils/is-same-reference";
import { getParenthesizedRange } from "../utils/parentheses";

export const isLengthMemberExpression = node =>
  node.type === "MemberExpression" &&
  !node.computed &&
  !node.optional &&
  node.property.type === "Identifier" &&
  node.property.name === "length";
export const isLiteralPositiveNumber = node =>
  isNumberLiteral(node) && node.value > 0;

export function getNegativeIndexLengthNode(node, objectNode) {
  if (!node) {
    return;
  }

  const { type, operator, left, right } = node;

  if (
    type !== "BinaryExpression" ||
    operator !== "-" ||
    !isLiteralPositiveNumber(right)
  ) {
    return;
  }

  if (
    isLengthMemberExpression(left) &&
    isSameReference(left.object, objectNode)
  ) {
    return left;
  }

  // Nested BinaryExpression
  return getNegativeIndexLengthNode(left, objectNode);
}

export function removeLengthNode(node, fixer, sourceCode) {
  const [start, end] = getParenthesizedRange(node, sourceCode);
  return fixer.removeRange([
    start,
    end + sourceCode.text.slice(end).match(/\S|$/).index
  ]);
}

export default {
  getNegativeIndexLengthNode,
  removeLengthNode
};
