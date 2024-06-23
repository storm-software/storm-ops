export function isUndefined(node) {
  return node.type === "Identifier" && node.name === "undefined";
}

export default isUndefined;
