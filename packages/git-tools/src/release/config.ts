import type { NxReleaseConfiguration } from "nx/src/config/nx-json";
import { DEFAULT_COMMIT_TYPES } from "../types";

export const DEFAULT_RELEASE_CONFIG: NxReleaseConfiguration = {
  projectsRelationship: "independent",
  releaseTagPattern: "{projectName}@{version}",
  conventionalCommits: {
    types: DEFAULT_COMMIT_TYPES
  },
  changelog: {
    automaticFromRef: true,
    workspaceChangelog: false,
    projectChangelogs: {
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
    git: {
      tag: false,
      commit: true,
      commitMessage: "release(monorepo): Publish workspace release updates"
    }
  },
  version: {
    preVersionCommand:
      "pnpm nx affected -t build --parallel=3 --configuration=production",
    generator: "@storm-software/workspace-tools:release-version",
    generatorOptions: {
      currentVersionResolver: "git-tag",
      specifierSource: "conventional-commits"
    },
    git: {
      stageChanges: true,
      commit: false,
      tag: false
    }
  }
};
