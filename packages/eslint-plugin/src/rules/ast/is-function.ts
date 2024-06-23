import functionTypes from "./function-types";

export function isFunction(node) {
  return functionTypes.includes(node.type);
}

export default isFunction;
