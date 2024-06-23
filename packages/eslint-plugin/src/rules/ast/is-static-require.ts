import callOrNewExpression from "./call-or-new-expression";
import literal from "./literal";

export const isStaticRequire = node =>
  callOrNewExpression.isCallExpression(node, {
    name: "require",
    argumentsLength: 1,
    optional: false
  }) && literal.isStringLiteral(node.arguments[0]);

export default isStaticRequire;
