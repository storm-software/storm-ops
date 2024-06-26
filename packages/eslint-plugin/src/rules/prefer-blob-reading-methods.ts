import { isMethodCall } from "./ast/index";

const MESSAGE_ID = "error";
const messages = {
  [MESSAGE_ID]:
    "Prefer `Blob#{{replacement}}()` over `FileReader#{{method}}(blob)`."
};

/** @param {import('eslint').Rule.RuleContext} context */
const create = () => ({
  CallExpression(node) {
    if (
      !isMethodCall(node, {
        methods: ["readAsText", "readAsArrayBuffer"],
        argumentsLength: 1,
        optionalCall: false,
        optionalMember: false
      })
    ) {
      return;
    }

    const method = node.callee.property;
    const methodName = method.name;

    return {
      node: method,
      messageId: MESSAGE_ID,
      data: {
        method: methodName,
        replacement: methodName === "readAsArrayBuffer" ? "arrayBuffer" : "text"
      }
    };
  }
});

/** @type {import('eslint').Rule.RuleModule} */
export default {
  create,
  meta: {
    type: "suggestion",
    docs: {
      description:
        "Prefer `Blob#arrayBuffer()` over `FileReader#readAsArrayBuffer(…)` and `Blob#text()` over `FileReader#readAsText(…)`.",
      recommended: true
    },
    messages
  }
};
