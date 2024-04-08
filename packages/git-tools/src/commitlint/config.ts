import type {
  RuleConfigCondition,
  RuleConfigSeverity,
  TargetCaseType
} from "@commitlint/types";

export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "chore",
        // Changes that affect the build system or dependency-only changes
        "build",
        // Changes to CI workflows
        "ci",
        // Documentation-only changes
        "docs",
        // A new feature
        "feat",
        //A bug fix
        "fix",
        // A code change that improves performance
        "perf",
        // A code change that neither fixes a bug nor adds a feature
        "refactor",
        // A commit that reverts a previous commit
        "revert",
        // Changes that do not affect the meaning of the code
        "style",
        // Adding missing tests or correcting existing tests
        "test",
        // Used for automated releases-only
        "release"
      ]
    ] as [RuleConfigSeverity, RuleConfigCondition, string[]],
    "subject-case": [2, "always", ["sentence-case"]] as [
      RuleConfigSeverity,
      RuleConfigCondition,
      TargetCaseType[]
    ],
    "scope-empty": [1, "never"] as [RuleConfigSeverity, RuleConfigCondition]
  },
  prompt: {
    settings: {},
    messages: {
      skip: ":skip",
      max: "upper %d chars",
      min: "%d chars at least",
      emptyWarning: "can not be empty",
      upperLimitWarning: "over limit",
      lowerLimitWarning: "below limit"
    },
    questions: {
      type: {
        description: "Select the type of change that you're committing"
      },
      scope: {
        description:
          "Select the scope of this change (package name in the monorepo)"
      },
      subject: {
        description: "Write a short, imperative tense description of the change"
      },
      body: {
        description: "Provide a longer description of the change"
      },
      breaking: {
        description: "List any BREAKING CHANGES"
      },
      issues: {
        description: "Add issue references (e.g. fix #123, re #123.)"
      }
    }
  }
};
