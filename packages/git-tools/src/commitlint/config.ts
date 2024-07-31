import { RuleConfigCondition, RuleConfigSeverity } from "@commitlint/types";
import { NxReleaseConfig } from "../types";
import { getScopeEnum } from "./get-scope-enum";

export default {
  utils: { getScopeEnum },
  parserPreset: "conventional-changelog-conventionalcommits",
  rules: {
    "body-leading-blank": [RuleConfigSeverity.Warning, "always"],
    "body-max-line-length": [RuleConfigSeverity.Error, "always", 150],
    "footer-leading-blank": [RuleConfigSeverity.Warning, "always"],
    "footer-max-line-length": [RuleConfigSeverity.Error, "always", 150],
    "header-max-length": [RuleConfigSeverity.Error, "always", 150],
    "header-trim": [RuleConfigSeverity.Error, "always"],
    "subject-case": [RuleConfigSeverity.Error, "always", ["sentence-case"]],
    "subject-empty": [RuleConfigSeverity.Error, "never"],
    "subject-full-stop": [RuleConfigSeverity.Error, "never", "."],
    "type-case": [RuleConfigSeverity.Error, "always", "lower-case"],
    "type-empty": [RuleConfigSeverity.Error, "never"],
    "type-enum": [
      RuleConfigSeverity.Error,
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
        // Changes that affect the project's type definitions
        "types",
        // Changes to the repository's example projects
        // "examples",
        // Used for automated releases-only
        "release"
      ]
    ] as [RuleConfigSeverity, RuleConfigCondition, string[]],
    "scope-empty": [RuleConfigSeverity.Error, "never"],
    "scope-enum": ctx =>
      Promise.resolve([RuleConfigSeverity.Error, "always", getScopeEnum(ctx)])
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
        description: "Select the type of change that you're committing",
        enum: {
          feat: {
            description: "A new feature",
            title: "Features",
            emoji: "✨"
          },
          fix: {
            description: "A bug fix",
            title: "Bug Fixes",
            emoji: "🐛"
          },
          types: {
            description: "Changes that affect the project's type definitions",
            title: "Type Definitions",
            emoji: "📓"
          },
          docs: {
            description: "Documentation only changes",
            title: "Documentation",
            emoji: "📚"
          },
          style: {
            description:
              "Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)",
            title: "Styles",
            emoji: "💎"
          },
          refactor: {
            description:
              "A code change that neither fixes a bug nor adds a feature",
            title: "Code Refactoring",
            emoji: "📦"
          },
          perf: {
            description: "A code change that improves performance",
            title: "Performance Improvements",
            emoji: "🚀"
          },
          test: {
            description: "Adding missing tests or correcting existing tests",
            title: "Tests",
            emoji: "🚨"
          },
          deps: {
            description:
              "Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)",
            title: "Dependency Upgrades",
            emoji: "🛠"
          },
          ci: {
            description:
              "Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)",
            title: "Continuous Integrations",
            emoji: "⚙️"
          },
          chore: {
            description: "Other changes that don't modify src or test files",
            title: "Chores",
            emoji: "♻️"
          },
          revert: {
            description: "Reverts a previous commit",
            title: "Reverts",
            emoji: "🗑"
          }
        }
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
      isBreaking: {
        description: "Are there any breaking changes?"
      },
      breakingBody: {
        description:
          "A BREAKING CHANGE commit requires a body. Please enter a longer description of the commit itself"
      },
      breaking: {
        description: "Describe the breaking changes"
      },
      isIssueAffected: {
        description: "Does this change affect any open issues?"
      },
      issuesBody: {
        description:
          "If issues are closed, the commit requires a body. Please enter a longer description of the commit itself"
      },
      issues: {
        description: 'Add issue references (e.g. "fix #123", "re #123".)'
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
        semverBump: "patch",
        changelog: {
          title: "Chores",
          hidden: false
        }
      },
      release: {
        semverBump: "none",
        changelog: {
          title: "Release",
          hidden: true
        }
      },

      // examples: {
      //   semverBump: "none",
      //   changelog: {
      //     title: "Examples",
      //     hidden: true
      //   }
      // },
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
