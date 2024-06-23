function getBuiltinRule(id) {
  return require("eslint/use-at-your-own-risk").builtinRules.get(id);
}

export default getBuiltinRule;
