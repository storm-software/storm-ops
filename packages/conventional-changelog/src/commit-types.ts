/**
 * Commit types available for selection in commit messages.
 */
export const COMMIT_TYPES = {
  /* --- Bumps version when selected --- */

  "chore": {
    "description": "Other changes that don't modify src or test files",
    "title": "Chore",
    "emoji": "⚙️  ",
    "semverBump": "patch",
    "changelog": {
      "title": "Miscellaneous",
      "hidden": false
    }
  },
  "fix": {
    "description":
      "A change that resolves an issue previously identified with the package",
    "title": "Bug Fix",
    "emoji": "🪲  ",
    "semverBump": "patch",
    "changelog": {
      "title": "Bug Fixes",
      "hidden": false
    }
  },
  "feat": {
    "description": "A change that adds a new feature to the package",
    "title": "Feature",
    "emoji": "🔑 ",
    "semverBump": "minor",
    "changelog": {
      "title": "Features",
      "hidden": false
    }
  },
  "ci": {
    "description":
      "Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)",
    "title": "Continuous Integration",
    "emoji": "🧰 ",
    "semverBump": "patch",
    "changelog": {
      "title": "Continuous Integration",
      "hidden": false
    }
  },
  "refactor": {
    "description": "A code change that neither fixes a bug nor adds a feature",
    "title": "Code Refactoring",
    "emoji": "🧪 ",
    "semverBump": "patch",
    "changelog": {
      "title": "Source Code Improvements",
      "hidden": false
    }
  },
  "style": {
    "description":
      "Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)",
    "title": "Style Improvements",
    "emoji": "💎 ",
    "semverBump": "patch",
    "changelog": {
      "title": "Style Improvements",
      "hidden": false
    }
  },
  "perf": {
    "description": "A code change that improves performance",
    "title": "Performance Improvement",
    "emoji": "⏱️  ",
    "semverBump": "patch",
    "changelog": {
      "title": "Performance Improvements",
      "hidden": false
    }
  },

  /* --- Does not bump version when selected --- */

  "docs": {
    "description": "A change that only includes documentation updates",
    "title": "Documentation",
    "emoji": "📜 ",
    "semverBump": "none",
    "changelog": {
      "title": "Documentation",
      "hidden": false
    }
  },
  "test": {
    "description": "Adding missing tests or correcting existing tests",
    "title": "Testing",
    "emoji": "🚨 ",
    "semverBump": "none",
    "changelog": {
      "title": "Testing",
      "hidden": true
    }
  },

  /* --- Not included in commitlint but included in changelog --- */

  "deps": {
    "description":
      "Changes that add, update, or remove dependencies. This includes devDependencies and peerDependencies",
    "title": "Dependencies",
    "emoji": "📦 ",
    "hidden": true,
    "semverBump": "patch",
    "changelog": {
      "title": "Dependency Upgrades",
      "hidden": false
    }
  },

  /* --- Not included in commitlint or changelog --- */

  "build": {
    "description":
      "Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)",
    "title": "Build",
    "emoji": "🛠 ",
    "hidden": true,
    "semverBump": "none",
    "changelog": {
      "title": "Build",
      "hidden": true
    }
  },
  "release": {
    "description": "Publishing a commit containing a newly released version",
    "title": "Publish Release",
    "emoji": "🚀 ",
    "hidden": true,
    "semverBump": "none",
    "changelog": {
      "title": "Publish Release",
      "hidden": true
    }
  }
} as const;
