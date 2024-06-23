import { getParentheses } from "../utils/parentheses";

export function* removeParentheses(node, fixer, sourceCode) {
  const parentheses = getParentheses(node, sourceCode);
  for (const token of parentheses) {
    yield fixer.remove(token);
  }
}

export default removeParentheses;
