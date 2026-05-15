import { ProjectGraph } from "@nx/devkit";
import { joinPaths } from "@storm-software/config-tools/utilities/correct-paths";
import { StormWorkspaceConfig } from "@storm-software/config/types";
import {
  isEqualProjectTag,
  ProjectTagConstants
} from "@storm-software/package-constants/tags";
import { DEFAULT_COMMIT_TYPES } from "conventional-changelog-storm-software/commit-types";
import defu from "defu";
import { existsSync } from "fs";
import { NxReleaseConfig } from "nx/src/command-line/release/config/config.js";
import {
  NxJsonConfiguration,
  NxReleaseChangelogConfiguration,
  NxReleaseVersionConfiguration,
  readNxJson
} from "nx/src/config/nx-json";
import { findMatchingProjects } from "nx/src/utils/find-matching-projects";
import { DEFAULT_MONOREPO_COMMIT_QUESTIONS } from "../commit/config/monorepo";
import { ReleaseConfig, ReleaseGroupConfig } from "../types";
import { omit } from "../utilities/omit";
import StormChangelogRenderer from "./changelog-renderer";

export const DEFAULT_CONVENTIONAL_COMMITS_CONFIG = {
  useCommitScope: true,
  questions: DEFAULT_MONOREPO_COMMIT_QUESTIONS,
  types: DEFAULT_COMMIT_TYPES
};

export const DEFAULT_INDEPENDENT_RELEASE_TAG_PATTERN =
  "{projectName}@{version}";
export const DEFAULT_FIXED_RELEASE_TAG_PATTERN = "{releaseGroupName}@{version}";

export const DEFAULT_COMMIT_MESSAGE =
  "release(monorepo): Publish v{version} release updates";

export const DEFAULT_RELEASE_GROUP_GIT_CONFIG = {
  commit: false,
  commitMessage: DEFAULT_COMMIT_MESSAGE,
  commitArgs: "",
  tag: false,
  tagMessage: "",
  tagArgs: "",
  stageChanges: false,
  pushArgs: ""
};

export const DEFAULT_VERSION_RELEASE_CONFIG = {
  currentVersionResolver: "git-tag",
  fallbackCurrentVersionResolver: "disk",
  specifierSource: "conventional-commits",
  groupPreVersionCommand: "pnpm build",
  preserveLocalDependencyProtocols: true,
  preserveMatchingDependencyRanges: true,
  logUnchangedProjects: true,
  updateDependents: "always",
  git: {
    ...DEFAULT_RELEASE_GROUP_GIT_CONFIG,
    stageChanges: true
  }
} as const;

export const DEFAULT_CHANGELOG_RELEASE_CONFIG = {
  createRelease: "github",
  renderOptions: {
    authors: false,
    commitReferences: true,
    versionTitleDate: true
  },
  git: {
    ...DEFAULT_RELEASE_GROUP_GIT_CONFIG,
    commit: true,
    tag: true,
    push: true
  }
} as const;

export const DEFAULT_RELEASE_GROUP_CONFIG = {
  projectsRelationship: "independent",
  changelog: {
    ...DEFAULT_CHANGELOG_RELEASE_CONFIG
  },
  version: {
    ...DEFAULT_VERSION_RELEASE_CONFIG
  },
  releaseTag: {
    pattern: DEFAULT_INDEPENDENT_RELEASE_TAG_PATTERN,
    preferDockerVersion: false
  },
  versionPlans: false
} as const;

export const DEFAULT_INDEPENDENT_RELEASE_GROUP_CONFIG = {
  projectsRelationship: "independent",
  releaseTag: {
    pattern: DEFAULT_INDEPENDENT_RELEASE_TAG_PATTERN
  }
} as const;

export const DEFAULT_FIXED_RELEASE_GROUP_CONFIG = {
  projectsRelationship: "fixed",
  releaseTag: {
    pattern: DEFAULT_FIXED_RELEASE_TAG_PATTERN
  }
} as const;

export const DEFAULT_JS_RELEASE_GROUP_CONFIG = {
  version: {
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
} as Omit<ReleaseGroupConfig, "projects">;

export const DEFAULT_RUST_RELEASE_GROUP_CONFIG = {
  version: {
    versionActions:
      "@storm-software/workspace-tools/release/rust-version-actions",
    versionActionsOptions: {
      currentVersionResolver: "git-tag",
      specifierSource: "conventional-commits"
    },
    manifestRootsToUpdate: ["{projectRoot}"]
  }
} as Omit<ReleaseGroupConfig, "projects">;

export const DEFAULT_RELEASE_CONFIG: ReleaseConfig = {
  conventionalCommits: DEFAULT_CONVENTIONAL_COMMITS_CONFIG,
  groups: {
    packages: defu(
      {
        projects: ["packages/*"]
      },
      DEFAULT_JS_RELEASE_GROUP_CONFIG,
      DEFAULT_RELEASE_GROUP_CONFIG
    ),
    crates: defu(
      {
        projects: ["crates/*"]
      },
      DEFAULT_RUST_RELEASE_GROUP_CONFIG,
      DEFAULT_RELEASE_GROUP_CONFIG
    )
  },
  changelog: {
    ...DEFAULT_CHANGELOG_RELEASE_CONFIG,
    automaticFromRef: true,
    workspaceChangelog: false,
    projectChangelogs: true
  },
  releaseTag: {
    pattern: DEFAULT_INDEPENDENT_RELEASE_TAG_PATTERN,
    preferDockerVersion: false
  },
  version: {
    ...DEFAULT_VERSION_RELEASE_CONFIG
  }
} as const;

export function mergeReleaseGroupConfig(
  config: Partial<ReleaseGroupConfig>,
  defaultConfig: Partial<ReleaseGroupConfig>,
  workspaceConfig: StormWorkspaceConfig
) {
  return defu(
    {
      ...omit(defaultConfig, ["changelog", "version"]),
      ...config
    },
    {
      version: {
        ...defaultConfig.version
      } as NxReleaseVersionConfiguration
    },
    {
      changelog: {
        ...(typeof defaultConfig.changelog === "object"
          ? defaultConfig.changelog
          : {}),
        renderer: StormChangelogRenderer,
        renderOptions: {
          ...((typeof defaultConfig.changelog === "object" &&
            defaultConfig.changelog.renderOptions) ||
            {}),
          workspaceConfig
        }
      } as NxReleaseChangelogConfiguration
    }
  ) as ReleaseGroupConfig;
}

/**
 * Get the release group configurations, applying defaults where necessary
 *
 * @param releaseConfig - The release configuration to use
 * @param workspaceConfig - The workspace configuration to use
 * @returns The release group configurations
 */
export function getReleaseGroupConfig(
  projectGraph: ProjectGraph,
  releaseConfig: Partial<ReleaseConfig>,
  workspaceConfig: StormWorkspaceConfig
) {
  const alreadyMatchedProjects = new Set<string>();
  return !releaseConfig?.groups ||
    Object.keys(releaseConfig.groups).length === 0
    ? {}
    : Object.fromEntries(
        Object.entries(releaseConfig.groups).map(([name, group]) => {
          const matchingProjects = findMatchingProjects(
            typeof group.projects === "string"
              ? [group.projects]
              : group.projects,
            projectGraph.nodes
          );
          if (!matchingProjects.length) {
            throw new Error(
              `Release group "${name}" does not have any matching projects.`
            );
          }

          for (const project of matchingProjects) {
            if (alreadyMatchedProjects.has(project)) {
              throw new Error(
                `Project "${project}" is included in more than one release group. Please ensure that each project is only included in one release group, or remove the "projects" property from the release group configuration to allow it to be included in the same release group as other projects with overlapping globs.`
              );
            }
            alreadyMatchedProjects.add(project);
          }

          let languageDefaultConfig: Partial<ReleaseGroupConfig> = {};
          if (
            matchingProjects.every(
              project =>
                projectGraph.nodes[project]?.data &&
                (projectGraph.nodes[project]?.data.metadata?.js ||
                  isEqualProjectTag(
                    projectGraph.nodes[project]?.data,
                    ProjectTagConstants.Language.TAG_ID,
                    ProjectTagConstants.Language.TYPESCRIPT
                  ) ||
                  (projectGraph.nodes[project]?.data.metadata?.root &&
                    existsSync(
                      joinPaths(
                        projectGraph.nodes[project]?.data.metadata?.root,
                        "package.json"
                      )
                    )))
            )
          ) {
            languageDefaultConfig = defu(
              DEFAULT_JS_RELEASE_GROUP_CONFIG,
              DEFAULT_RELEASE_GROUP_CONFIG
            );
          } else if (
            matchingProjects.every(
              project =>
                projectGraph.nodes[project]?.data &&
                (projectGraph.nodes[project]?.data.metadata?.rust ||
                  projectGraph.nodes[project]?.data.metadata?.cargo ||
                  isEqualProjectTag(
                    projectGraph.nodes[project]?.data,
                    ProjectTagConstants.Language.TAG_ID,
                    ProjectTagConstants.Language.RUST
                  ) ||
                  (projectGraph.nodes[project]?.data.metadata?.root &&
                    existsSync(
                      joinPaths(
                        projectGraph.nodes[project]?.data.metadata?.root,
                        "Cargo.toml"
                      )
                    )))
            )
          ) {
            languageDefaultConfig = defu(
              DEFAULT_RUST_RELEASE_GROUP_CONFIG,
              DEFAULT_RELEASE_GROUP_CONFIG
            );
          }

          const config = mergeReleaseGroupConfig(
            group,
            defu(
              languageDefaultConfig,
              group.projectsRelationship === "fixed"
                ? DEFAULT_FIXED_RELEASE_GROUP_CONFIG
                : DEFAULT_INDEPENDENT_RELEASE_GROUP_CONFIG,
              DEFAULT_RELEASE_GROUP_CONFIG
            ),
            workspaceConfig
          );

          config.projects = matchingProjects;

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

export function getReleaseConfig(
  projectGraph: ProjectGraph,
  releaseConfig: Partial<ReleaseConfig>,
  workspaceConfig: StormWorkspaceConfig,
  ignoreNxJsonConfig = false
): NxReleaseConfig {
  let nxJson: Partial<NxJsonConfiguration> = {};
  if (
    !ignoreNxJsonConfig &&
    existsSync(joinPaths(workspaceConfig.workspaceRoot, "nx.json"))
  ) {
    nxJson = readNxJson();
  }

  const baseConfig = defu(
    {
      changelog: {
        renderOptions: {
          workspaceConfig
        }
      },
      groups: {}
    },
    omit(releaseConfig, ["groups"]),
    nxJson.release ? omit(nxJson.release, ["groups"]) : {},
    omit(DEFAULT_RELEASE_CONFIG, ["groups"])
  ) as NxReleaseConfig;

  let groups = {} as Record<string, ReleaseGroupConfig>;
  if (releaseConfig?.groups && Object.keys(releaseConfig.groups).length > 0) {
    groups = releaseConfig.groups;
    if (
      nxJson.release?.groups &&
      Object.keys(nxJson.release.groups).length > 0
    ) {
      groups = defu(
        groups,
        nxJson.release.groups as Record<string, ReleaseGroupConfig>
      );
    }
  } else if (
    nxJson.release?.groups &&
    Object.keys(nxJson.release.groups).length > 0
  ) {
    groups = nxJson.release.groups as Record<string, ReleaseGroupConfig>;
  } else {
    groups = DEFAULT_RELEASE_CONFIG.groups;
  }

  return {
    ...baseConfig,
    groups: getReleaseGroupConfig(
      projectGraph,
      { ...baseConfig, groups },
      workspaceConfig
    )
  } as NxReleaseConfig;
}
