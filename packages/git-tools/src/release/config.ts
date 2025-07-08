import { COMMIT_TYPES, DEFAULT_COMMIT_QUESTIONS } from "../types";

export const DEFAULT_CONVENTIONAL_COMMITS_CONFIG = {
  questions: DEFAULT_COMMIT_QUESTIONS,
  types: COMMIT_TYPES
};

export const DEFAULT_RELEASE_GROUP_CONFIG = {
  projectsRelationship: "independent",
  releaseTagPattern: "{projectName}@{version}",
  changelog: {
    git: {
      tag: true
    },
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
    groupPreVersionCommand: "pnpm build",
    useLegacyVersioning: true,
    currentVersionResolver: "git-tag",
    specifierSource: "conventional-commits",

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
    git: {
      tag: true
    },
    automaticFromRef: true,
    workspaceChangelog: false,
    projectChangelogs: {
      createRelease: "github",
      entryWhenNoChanges: false,
      file: "{projectRoot}/CHANGELOG.md",
      renderOptions: {
        authors: false,
        commitReferences: true,
        versionTitleDate: true
      }
    }
  },
  version: {
    preVersionCommand: "pnpm build",
    useLegacyVersioning: true,
    currentVersionResolver: "git-tag",
    specifierSource: "conventional-commits",

    generator: "@storm-software/workspace-tools:release-version",
    generatorOptions: {
      currentVersionResolver: "git-tag",
      specifierSource: "conventional-commits"
    }
  }
};
