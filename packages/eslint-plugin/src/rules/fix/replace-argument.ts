import { getParenthesizedRange } from "../utils/parentheses";

export function replaceArgument(fixer, node, text, sourceCode) {
  return fixer.replaceTextRange(getParenthesizedRange(node, sourceCode), text);
}

export default replaceArgument;
