import cleanRegexp from "clean-regexp";
import { optimize } from "regexp-tree";
import { isNewExpression, isRegexLiteral, isStringLiteral } from "./ast/index";
import escapeString from "./utils/escape-string";

const MESSAGE_ID = "better-regex";
const MESSAGE_ID_PARSE_ERROR = "better-regex/parse-error";
const messages = {
  [MESSAGE_ID]: "{{original}} can be optimized to {{optimized}}.",
  [MESSAGE_ID_PARSE_ERROR]: "Problem parsing {{original}}: {{error}}"
};

/** @param {import('eslint').Rule.RuleContext} context */
const create = context => {
  const { sortCharacterClasses } = context.options[0] || {};

  const ignoreList = [] as any[];

  if (sortCharacterClasses === false) {
    ignoreList.push("charClassClassrangesMerge");
  }

  return {
    Literal(node) {
      if (!isRegexLiteral(node)) {
        return;
      }

      const { raw: original, regex } = node;
      // Regular Expressions with `u` and `v` flag are not well handled by `regexp-tree`
      // https://github.com/DmitrySoshnikov/regexp-tree/issues/162
      if (regex.flags.includes("u") || regex.flags.includes("v")) {
        return;
      }

      let optimized = original;

      try {
        optimized = optimize(original, undefined, {
          blacklist: ignoreList
        }).toString();
      } catch (error) {
        return {
          node,
          messageId: MESSAGE_ID_PARSE_ERROR,
          data: {
            original,
            error: error.message
          }
        };
      }

      if (original === optimized) {
        return;
      }

      const problem = {
        node,
        messageId: MESSAGE_ID,
        data: {
          original,
          optimized
        }
      };

      if (
        node.parent.type === "MemberExpression" &&
        node.parent.object === node &&
        !node.parent.optional &&
        !node.parent.computed &&
        node.parent.property.type === "Identifier" &&
        (node.parent.property.name === "toString" ||
          node.parent.property.name === "source")
      ) {
        return problem;
      }

      return Object.assign(problem, {
        fix: fixer => fixer.replaceText(node, optimized)
      });
    },
    NewExpression(node) {
      if (!isNewExpression(node, { name: "RegExp", minimumArguments: 1 })) {
        return;
      }

      const [patternNode, flagsNode] = node.arguments;

      if (!isStringLiteral(patternNode)) {
        return;
      }

      const oldPattern = patternNode.value;
      const flags = isStringLiteral(flagsNode) ? flagsNode.value : "";

      const newPattern = cleanRegexp(oldPattern, flags);

      if (oldPattern !== newPattern) {
        return {
          node,
          messageId: MESSAGE_ID,
          data: {
            original: oldPattern,
            optimized: newPattern
          },
          fix: fixer =>
            fixer.replaceText(
              patternNode,
              escapeString(newPattern, patternNode.raw.charAt(0))
            )
        };
      }
    }
  };
};

const schema = [
  {
    type: "object",
    additionalProperties: false,
    properties: {
      sortCharacterClasses: {
        type: "boolean",
        default: true
      }
    }
  }
];

/** @type {import('eslint').Rule.RuleModule} */
export default {
  create,
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Improve regexes by making them shorter, consistent, and safer.",
      recommended: true,
      tags: ["base"]
    },
    fixable: "code",
    schema,
    messages
  }
};
