// TODO: Support more types
export function getPredicate(options) {
  if (typeof options === "string") {
    return node => node.type === options;
  }
}

export function getAncestor(node, options) {
  const predicate = getPredicate(options);

  for (; node.parent; node = node.parent) {
    if (predicate?.(node)) {
      return node;
    }
  }
}

export default getAncestor;
