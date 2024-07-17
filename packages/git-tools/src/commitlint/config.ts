import type {
  RuleConfigCondition,
  RuleConfigSeverity,
  TargetCaseType
} from "@commitlint/types";
import { NxReleaseConfig } from "../types";

export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "chore",
        // Changes that affect the build system or dependency-only changes
        "deps",
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

export const DEFAULT_CONVENTIONAL_COMMITS_CONFIG: NxReleaseConfig["conventionalCommits"] =
  {
    types: {
      feat: {
        semverBump: "minor",
        changelog: {
          title: "Features",
          hidden: false
        }
      },
      fix: {
        semverBump: "patch",
        changelog: {
          title: "Bug Fixes",
          hidden: false
        }
      },
      perf: {
        semverBump: "none",
        changelog: {
          title: "Performance Improvements",
          hidden: false
        }
      },
      refactor: {
        semverBump: "patch",
        changelog: {
          title: "Refactoring",
          hidden: false
        }
      },
      docs: {
        semverBump: "none",
        changelog: {
          title: "Documentation",
          hidden: true
        }
      },
      deps: {
        semverBump: "patch",
        changelog: {
          title: "Dependency Upgrades",
          hidden: false
        }
      },
      types: {
        semverBump: "minor",
        changelog: {
          title: "Type Definitions",
          hidden: false
        }
      },
      chore: {
        semverBump: "none",
        changelog: {
          title: "Chores",
          hidden: true
        }
      },
      examples: {
        semverBump: "none",
        changelog: {
          title: "Examples",
          hidden: true
        }
      },
      test: {
        semverBump: "none",
        changelog: {
          title: "Testing",
          hidden: true
        }
      },
      style: {
        semverBump: "minor",
        changelog: {
          title: "Styling",
          hidden: false
        }
      },
      ci: {
        semverBump: "patch",
        changelog: {
          title: "Continuous Integration",
          hidden: false
        }
      },
      revert: {
        semverBump: "patch",
        changelog: {
          title: "Revert",
          hidden: false
        }
      }
    }
  };
