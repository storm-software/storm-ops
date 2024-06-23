export const isChainElement = node =>
  node.type === "MemberExpression" || node.type === "CallExpression";

export function hasOptionalChainElement(node) {
  if (!isChainElement(node)) {
    return false;
  }

  if (node.optional) {
    return true;
  }

  if (node.type === "MemberExpression") {
    return hasOptionalChainElement(node.object);
  }

  return false;
}

export default hasOptionalChainElement;
