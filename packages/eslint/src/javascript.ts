import importRules from "./rules/import";
import stormRules from "./rules/storm";
import unicornRules from "./rules/unicorn";

module.exports = {
  overrides: [
    {
      plugins: ["@nx", "unicorn", "import"],
      extends: ["plugin:@nx/javascript"],
      files: ["*.js", "*.jsx"],
      rules: {
        ...importRules,
        ...unicornRules,
        ...stormRules
      }
    }
  ]
};
