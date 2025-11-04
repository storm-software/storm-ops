import { DEFAULT_COMMIT_TYPES } from "conventional-changelog-storm-software/commit-types";
import { DEFAULT_MONOREPO_COMMIT_QUESTIONS } from "../commit/config/monorepo";
import { ReleaseConfig, ReleaseGroupConfig } from "../types";

export const DEFAULT_CONVENTIONAL_COMMITS_CONFIG = {
  questions: DEFAULT_MONOREPO_COMMIT_QUESTIONS,
  types: DEFAULT_COMMIT_TYPES
};

export const DEFAULT_RELEASE_TAG_PATTERN = "{projectName}@{version}";

export const DEFAULT_RELEASE_GROUP_CONFIG = {
  projectsRelationship: "independent",
  changelog: {
    createRelease: "github",
    entryWhenNoChanges: false,
    file: "{projectRoot}/CHANGELOG.md",
    renderOptions: {
      authors: false,
      commitReferences: true,
      versionTitleDate: true
    }
  },
  version: {
    currentVersionResolver: "git-tag",
    specifierSource: "conventional-commits",
    groupPreVersionCommand: "pnpm build"
  },
  releaseTag: { pattern: DEFAULT_RELEASE_TAG_PATTERN }
} as const;

export const DEFAULT_JS_RELEASE_GROUP_CONFIG: ReleaseGroupConfig = {
  ...DEFAULT_RELEASE_GROUP_CONFIG,
  projects: ["packages/*"],
  version: {
    ...DEFAULT_RELEASE_GROUP_CONFIG.version,
    versionActions:
      "@storm-software/workspace-tools/release/js-version-actions",
    versionActionsOptions: {
      currentVersionResolver: "git-tag",
      specifierSource: "conventional-commits"
    },
    manifestRootsToUpdate: [
      "{projectRoot}",
      {
        path: "dist/{projectRoot}",
        preserveLocalDependencyProtocols: false
      }
    ]
  }
} as const;

export const DEFAULT_RUST_RELEASE_GROUP_CONFIG: ReleaseGroupConfig = {
  ...DEFAULT_RELEASE_GROUP_CONFIG,
  projects: ["crates/*"],
  version: {
    ...DEFAULT_RELEASE_GROUP_CONFIG.version,
    versionActions:
      "@storm-software/workspace-tools/release/rust-version-actions",
    versionActionsOptions: {
      currentVersionResolver: "git-tag",
      specifierSource: "conventional-commits"
    },
    manifestRootsToUpdate: ["{projectRoot}"]
  }
} as const;

export const DEFAULT_RELEASE_CONFIG: ReleaseConfig = {
  conventionalCommits: DEFAULT_CONVENTIONAL_COMMITS_CONFIG,
  groups: {
    packages: DEFAULT_JS_RELEASE_GROUP_CONFIG,
    crates: DEFAULT_RUST_RELEASE_GROUP_CONFIG
  },
  changelog: {
    git: {
      tag: true,
      commit: true,
      commitMessage: "release(monorepo): Publish workspace release updates"
    },
    automaticFromRef: true,
    workspaceChangelog: false,
    projectChangelogs: true
  },
  releaseTag: { pattern: DEFAULT_RELEASE_TAG_PATTERN }
} as const;
