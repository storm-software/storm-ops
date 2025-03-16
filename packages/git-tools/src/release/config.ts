import { DEFAULT_COMMIT_QUESTIONS, DEFAULT_COMMIT_TYPES } from "../types";

export const DEFAULT_CONVENTIONAL_COMMITS_CONFIG = {
  questions: DEFAULT_COMMIT_QUESTIONS,
  types: DEFAULT_COMMIT_TYPES
};

export const DEFAULT_RELEASE_GROUP_CONFIG = {
  projectsRelationship: "independent",
  releaseTagPattern: "{projectName}@{version}",
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
    groupPreVersionCommand: "pnpm build",
    generator: "@storm-software/workspace-tools:release-version",
    generatorOptions: {
      currentVersionResolver: "git-tag",
      specifierSource: "conventional-commits"
    }
  }
};

export const DEFAULT_RELEASE_CONFIG = {
  conventionalCommits: DEFAULT_CONVENTIONAL_COMMITS_CONFIG,
  changelog: {
    automaticFromRef: true,
    workspaceChangelog: false,
    projectChangelogs: {
      createRelease: "github",
      entryWhenNoChanges: false,
      file: "{projectRoot}/CHANGELOG.md",
      // renderer: "@storm-software/git-tools/changelog-renderer",
      renderOptions: {
        authors: false,
        commitReferences: true,
        versionTitleDate: true
      }
    }
  },
  version: {
    preVersionCommand: "pnpm build",
    generator: "@storm-software/workspace-tools:release-version",
    generatorOptions: {
      currentVersionResolver: "git-tag",
      specifierSource: "conventional-commits"
    }
  }
};
