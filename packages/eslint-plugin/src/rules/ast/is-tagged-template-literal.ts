import utils from "../utils/is-node-matches";

/**
Check if the given node is a tagged template literal.

@param {Node} node - The AST node to check.
@param {string[]} tags - The object name or key paths.
@returns {boolean}
*/
export function isTaggedTemplateLiteral(node, tags) {
  if (
    node.type !== "TemplateLiteral" ||
    node.parent.type !== "TaggedTemplateExpression" ||
    node.parent.quasi !== node
  ) {
    return false;
  }

  if (tags) {
    return utils.isNodeMatches(node.parent.tag, tags);
  }

  return true;
}

export default isTaggedTemplateLiteral;
