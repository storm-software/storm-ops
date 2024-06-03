import type { Linter } from "eslint";

const config: Linter.RulesRecord = {
  /**
   * Require TSDoc comments conform to the TSDoc specification.
   *
   * 🚫 Not fixable - https://github.com/microsoft/tsdoc/tree/master/eslint-plugin
   */
  "tsdoc/syntax": "error"
};

export default config;
