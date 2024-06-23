export function isArrowFunctionBody(node) {
  return (
    node.parent.type === "ArrowFunctionExpression" && node.parent.body === node
  );
}

export default isArrowFunctionBody;
