import { joinPaths } from "@storm-software/config-tools/utilities/correct-paths";
import { StormWorkspaceConfig } from "@storm-software/config/types";
import { DEFAULT_COMMIT_TYPES } from "conventional-changelog-storm-software/commit-types";
import defu from "defu";
import { NxReleaseChangelogConfiguration } from "nx/src/config/nx-json";
import { DEFAULT_MONOREPO_COMMIT_QUESTIONS } from "../commit/config/monorepo";
import { ReleaseConfig, ReleaseGroupConfig } from "../types";
import { omit } from "../utilities/omit";
import StormChangelogRenderer from "./changelog-renderer";

export const DEFAULT_CONVENTIONAL_COMMITS_CONFIG = {
  useCommitScope: true,
  questions: DEFAULT_MONOREPO_COMMIT_QUESTIONS,
  types: DEFAULT_COMMIT_TYPES
};

export const DEFAULT_RELEASE_TAG_PATTERN = "{projectName}@{version}";

export const DEFAULT_RELEASE_GROUP_CONFIG = {
  projectsRelationship: "independent",
  changelog: {
    createRelease: "github",
    entryWhenNoChanges: false,
    file: false,
    renderOptions: {
      authors: false,
      commitReferences: true,
      versionTitleDate: true
    }
  },
  version: {
    currentVersionResolver: "git-tag",
    fallbackCurrentVersionResolver: "disk",
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
    automaticFromRef: true,
    workspaceChangelog: false,
    projectChangelogs: true
  },
  releaseTag: { pattern: DEFAULT_RELEASE_TAG_PATTERN }
} as const;

/**
 * Get the release group configurations, applying defaults where necessary
 *
 * @param releaseConfig - The release configuration to use
 * @param workspaceConfig - The workspace configuration to use
 * @returns The release group configurations
 */
export function getReleaseGroupConfig(
  releaseConfig: Partial<ReleaseConfig>,
  workspaceConfig: StormWorkspaceConfig
) {
  return !releaseConfig?.groups ||
    Object.keys(releaseConfig.groups).length === 0
    ? {}
    : Object.fromEntries(
        Object.entries(releaseConfig.groups).map(([name, group]) => {
          const config = defu(
            {
              ...omit(DEFAULT_RELEASE_GROUP_CONFIG, ["changelog", "version"]),
              ...group
            },
            {
              version: {
                ...(DEFAULT_RELEASE_GROUP_CONFIG.version as NxReleaseChangelogConfiguration)
              }
            },
            {
              changelog: {
                ...(DEFAULT_RELEASE_GROUP_CONFIG.changelog as NxReleaseChangelogConfiguration),
                renderer: StormChangelogRenderer,
                renderOptions: {
                  ...(
                    DEFAULT_RELEASE_GROUP_CONFIG.changelog as NxReleaseChangelogConfiguration
                  ).renderOptions,
                  workspaceConfig
                }
              }
            }
          ) as ReleaseGroupConfig;

          if (workspaceConfig?.workspaceRoot) {
            if (
              (config.changelog as NxReleaseChangelogConfiguration)?.renderer &&
              typeof (config.changelog as NxReleaseChangelogConfiguration)
                ?.renderer === "string" &&
              (config.changelog as NxReleaseChangelogConfiguration)?.renderer
                ?.toString()
                .startsWith("./")
            ) {
              (config.changelog as NxReleaseChangelogConfiguration).renderer =
                joinPaths(
                  workspaceConfig.workspaceRoot,
                  (config.changelog as NxReleaseChangelogConfiguration)
                    .renderer as string
                );
            }

            if (
              config.version?.versionActions &&
              config.version.versionActions.startsWith("./")
            ) {
              config.version.versionActions = joinPaths(
                workspaceConfig.workspaceRoot,
                config.version?.versionActions
              );
            }
          }

          return [name, config];
        })
      );
}
