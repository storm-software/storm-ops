import {
  DEFAULT_COMMIT_TYPES,
  DefaultCommitRulesEnum,
  RuleConfigCondition,
  RuleConfigSeverity
} from "../types";

export const DEFAULT_COMMIT_RULES: DefaultCommitRulesEnum = {
  "body-leading-blank": [RuleConfigSeverity.Warning, "always"],
  "body-max-length": [RuleConfigSeverity.Error, "always", 600],
  "footer-leading-blank": [RuleConfigSeverity.Warning, "always"],
  "footer-max-line-length": [RuleConfigSeverity.Error, "always", 150],
  "header-max-length": [RuleConfigSeverity.Error, "always", 150],
  "header-trim": [RuleConfigSeverity.Error, "always"],
  "subject-case": [RuleConfigSeverity.Error, "always", ["sentence-case"]],
  "subject-empty": [RuleConfigSeverity.Error, "never"],
  "subject-full-stop": [RuleConfigSeverity.Error, "never", "."],
  "subject-max-length": [RuleConfigSeverity.Error, "always", 150],
  "subject-min-length": [RuleConfigSeverity.Error, "always", 3],
  "type-case": [RuleConfigSeverity.Error, "always", "kebab-case"],
  "type-empty": [RuleConfigSeverity.Error, "never"],
  "type-enum": [
    RuleConfigSeverity.Error,
    "always",
    Object.keys(DEFAULT_COMMIT_TYPES)
  ] as [RuleConfigSeverity, RuleConfigCondition, string[]],
  "type-max-length": [RuleConfigSeverity.Error, "always", 20],
  "type-min-length": [RuleConfigSeverity.Error, "always", 3],
  "scope-case": [RuleConfigSeverity.Error, "always", ["kebab-case"]],
  "scope-empty": [RuleConfigSeverity.Error, "never"]
};
