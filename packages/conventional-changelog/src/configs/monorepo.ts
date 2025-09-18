import { DEFAULT_COMMIT_TYPES } from "../commit-types";
import { RuleConfigCondition, RuleConfigSeverity } from "../types/commitlint";
import { CHANGELOG_COMMIT_TYPES } from "../utilities/constants";

export const changelogs = {
  props: {
    ignoreCommits: undefined,
    types: CHANGELOG_COMMIT_TYPES,
    bumpStrict: true,
    scope: ["monorepo"],
    scopeOnly: true
  }
};

export const commitlint = {
  helpUrl: "https://developer.stormsoftware.com/commitlint/monorepo",
  rules: {
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
  },
  settings: {
    enableMultipleScopes: false,
    disableEmoji: true,
    breakingChangePrefix: "💣 ",
    closedIssuePrefix: "✅ ",
    format: "{type}({scope}): {emoji}{subject}"
  }
};

const config = {
  types: DEFAULT_COMMIT_TYPES,
  changelogs,
  commitlint
};

export default config;
