import type { Linter } from "eslint";
import importRules from "../rules/import";
import stormRules from "../rules/storm";
import unicornRules from "../rules/unicorn";

const config: Linter.Config = {
  root: true,
  overrides: [
    {
      files: ["*.js", "*.jsx"],
      extends: ["plugin:@nx/javascript"],
      plugins: ["unicorn", "import"],
      rules: {
        ...importRules,
        ...unicornRules,
        ...stormRules
      }
    }
  ]
};

export default config;
