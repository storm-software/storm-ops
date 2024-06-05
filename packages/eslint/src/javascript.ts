import importRules from "./rules/import";
import stormRules from "./rules/storm";
import unicornRules from "./rules/unicorn";

module.exports = {
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
