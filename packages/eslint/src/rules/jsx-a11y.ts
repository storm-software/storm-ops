import type { Linter } from "eslint";

const config: Linter.RulesRecord = {
  // This rule has been deprecated, but not yet removed.
  "jsx-a11y/no-onchange": "off"
};

export default config;
