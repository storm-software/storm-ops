export function isExpressionStatement(node) {
  return (
    node.type === "ExpressionStatement" ||
    (node.type === "ChainExpression" &&
      node.parent.type === "ExpressionStatement")
  );
}

export default isExpressionStatement;
