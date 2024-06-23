/** @type {import('eslint-doc-generator').GenerateOptions} */
const config = {
  urlRuleDoc(name, page) {
    if (page === "README.md") {
      // Use URLs only in the readme.
      return `https://docs.stormsoftware.com/storm-ops/eslint/rules/${name}`;
    }
  },
  ruleListSplit(rules) {
    return [
      {
        title: "Storm Software - GraphQL Rules",
        rules: rules.filter(([name, rule]) => rule.meta.category === "graphql")
      }
    ];
  }
};

module.exports = config;
