import { DEFAULT_COMMIT_TYPES } from "conventional-changelog-storm-software/commit-types";
import { DEFAULT_MONOREPO_COMMIT_QUESTIONS } from "../commit/config/monorepo";
import { ReleaseConfig, ReleaseGroupConfig } from "../types";

export const DEFAULT_CONVENTIONAL_COMMITS_CONFIG = {
  questions: DEFAULT_MONOREPO_COMMIT_QUESTIONS,
  types: DEFAULT_COMMIT_TYPES
};

export const DEFAULT_RELEASE_GROUP_CONFIG: ReleaseGroupConfig = {
  projects: ["packages/*"],
  projectsRelationship: "independent",
  changelog: {
    createRelease: "github",
    entryWhenNoChanges: false,
    file: "{projectRoot}/CHANGELOG.md",
    renderer: "@storm-software/git-tools/changelog-renderer",
    renderOptions: {
      authors: false,
      commitReferences: true,
      versionTitleDate: true
    }
  },
  version: {
    currentVersionResolver: "git-tag",
    specifierSource: "conventional-commits",
    groupPreVersionCommand: "pnpm build",
    versionActions:
      "@storm-software/workspace-tools/release/js-release-version",
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
  },
  releaseTag: { pattern: "{projectName}@{version}" }
} as const;

export const DEFAULT_RELEASE_CONFIG: ReleaseConfig = {
  conventionalCommits: DEFAULT_CONVENTIONAL_COMMITS_CONFIG,
  git: {
    tag: true,
    commitArgs: ["--annotate", "--sign"],
    commitMessage: "release(monorepo): Publish workspace release updates"
  },
  groups: {
    packages: DEFAULT_RELEASE_GROUP_CONFIG
  },
  changelog: {
    git: {
      tag: true,
      commit: true,
      commitArgs: ["--annotate", "--sign"],
      commitMessage: "release(monorepo): Publish workspace release updates"
    },
    automaticFromRef: true,
    workspaceChangelog: false,
    projectChangelogs: true
  },
  version: DEFAULT_RELEASE_GROUP_CONFIG.version,
  releaseTag: DEFAULT_RELEASE_GROUP_CONFIG.releaseTag
} as const;
