import { CommitQuestionsKeys } from "../types";

export default {
  breakingChangePrefix: "🧨 ",
  closedIssueMessage: "Closes: ",
  closedIssuePrefix: "✅ ",
  format: "{type}({scope}): {emoji}{subject}",
  disableEmoji: true,
  list: [
    "test",
    "feat",
    "fix",
    "chore",
    "docs",
    "refactor",
    "style",
    "ci",
    "perf"
  ],
  maxMessageLength: 75,
  minMessageLength: 3,
  questions: CommitQuestionsKeys,
  scopes: [],
  types: {
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
    docs: {
      description: "Documentation only changes",
      title: "Documentation",
      emoji: "📚"
    },
    style: {
      description:
        "Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)",
      title: "Styling",
      emoji: "💎"
    },
    refactor: {
      description: "A code change that neither fixes a bug nor adds a feature",
      title: "Code Refactoring",
      emoji: "🧪"
    },
    perf: {
      description: "A code change that improves performance",
      title: "Performance Improvements",
      emoji: "🚀"
    },
    test: {
      description: "Adding missing tests or correcting existing tests",
      title: "Testing",
      emoji: "🚨"
    },
    deps: {
      description:
        "Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)",
      title: "Dependency Upgrades",
      emoji: "📦"
    },
    ci: {
      description:
        "Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)",
      title: "Continuous Integrations",
      emoji: "🤖"
    },
    chore: {
      description: "Other changes that don't modify src or test files",
      title: "Chores",
      emoji: "⚙️ "
    },
    revert: {
      description: "Reverts a previous commit",
      title: "Reverts",
      emoji: "🗑️  "
    }
  }
};
