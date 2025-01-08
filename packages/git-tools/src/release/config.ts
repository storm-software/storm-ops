import type { NxReleaseConfiguration } from "nx/src/config/nx-json";
import { DEFAULT_COMMIT_TYPES } from "../types";

export const DEFAULT_RELEASE_GROUP_CONFIG = {
  projectsRelationship: "independent",
  releaseTagPattern: "{projectName}@{version}",
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
    groupPreVersionCommand: "pnpm build",
    generator: "@storm-software/workspace-tools:release-version",
    generatorOptions: {
      currentVersionResolver: "git-tag",
      specifierSource: "conventional-commits"
    }
  }
};

export const DEFAULT_RELEASE_CONFIG: NxReleaseConfiguration = {
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
      // renderer: "@storm-software/git-tools/changelog-renderer",
      renderOptions: {
        authors: false,
        commitReferences: true,
        versionTitleDate: true
      }
    }
  },
  version: {
    preVersionCommand:
      "pnpm nx affected -t build --parallel=3 --configuration=production",
    generator: "@storm-software/workspace-tools:release-version",
    generatorOptions: {
      currentVersionResolver: "git-tag",
      specifierSource: "conventional-commits"
    }
  }
};
