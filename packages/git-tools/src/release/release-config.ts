// Apply default configuration to any optional user configuration and handle known errors
export async function createNxReleaseConfig(
  projectGraph: ProjectGraph,
  projectFileMap: ProjectFileMap,
  userConfig: NxJsonConfiguration["release"] = {}
): Promise<{
  error: null | CreateNxReleaseConfigError;
  nxReleaseConfig: NxReleaseConfig | null;
}> {
  if (userConfig.projects && userConfig.groups) {
    return {
      error: {
        code: "PROJECTS_AND_GROUPS_DEFINED",
        data: {}
      },
      nxReleaseConfig: null
    };
  }

  if (hasInvalidGitConfig(userConfig)) {
    return {
      error: {
        code: "GLOBAL_GIT_CONFIG_MIXED_WITH_GRANULAR_GIT_CONFIG",
        data: {}
      },
      nxReleaseConfig: null
    };
  }

  if (hasInvalidConventionalCommitsConfig(userConfig)) {
    return {
      error: {
        code: "CONVENTIONAL_COMMITS_SHORTHAND_MIXED_WITH_OVERLAPPING_GENERATOR_OPTIONS",
        data: {}
      },
      nxReleaseConfig: null
    };
  }

  const gitDefaults = {
    commit: false,
    commitMessage: "chore(release): publish {version}",
    commitArgs: "",
    tag: false,
    tagMessage: "",
    tagArgs: "",
    stageChanges: false
  };
  const versionGitDefaults = {
    ...gitDefaults,
    stageChanges: true
  };
  const changelogGitDefaults = {
    ...gitDefaults,
    commit: true,
    tag: true
  };

  const defaultFixedReleaseTagPattern = "v{version}";
  const defaultIndependentReleaseTagPattern = "{projectName}@{version}";

  const workspaceProjectsRelationship =
    userConfig.projectsRelationship || "fixed";

  const defaultGeneratorOptions = userConfig.version?.conventionalCommits
    ? {
        currentVersionResolver: "git-tag",
        specifierSource: "conventional-commits"
      }
    : {};

  const userGroups = Object.values(userConfig.groups ?? {});
  const disableWorkspaceChangelog =
    userGroups.length > 1 ||
    (userGroups.length === 1 &&
      userGroups[0].projectsRelationship === "independent") ||
    (userConfig.projectsRelationship === "independent" &&
      !userGroups.some(g => g.projectsRelationship === "fixed"));

  const defaultRendererPath = join(__dirname, "./changelog-renderer");
  const WORKSPACE_DEFAULTS: Omit<NxReleaseConfig, "groups"> = {
    // By default all projects in all groups are released together
    projectsRelationship: workspaceProjectsRelationship,
    git: gitDefaults,
    version: {
      git: versionGitDefaults,
      conventionalCommits: userConfig.version?.conventionalCommits || false,
      generator: "@storm-software/workspace-tools:release-version",
      generatorOptions: defaultGeneratorOptions,
      preVersionCommand: userConfig.version?.preVersionCommand || ""
    },
    changelog: {
      git: changelogGitDefaults,
      workspaceChangelog: disableWorkspaceChangelog
        ? false
        : {
            createRelease: false,
            entryWhenNoChanges:
              "This was a version bump only, there were no code changes.",
            file: "{workspaceRoot}/CHANGELOG.md",
            renderer: defaultRendererPath,
            renderOptions: {
              authors: true,
              commitReferences: true,
              versionTitleDate: true
            }
          },
      // For projectChangelogs if the user has set any changelog config at all, then use one set of defaults, otherwise default to false for the whole feature
      projectChangelogs: userConfig.changelog?.projectChangelogs
        ? {
            createRelease: false,
            file: "{projectRoot}/CHANGELOG.md",
            entryWhenNoChanges:
              "This was a version bump only for {projectName} to align it with other projects, there were no code changes.",
            renderer: defaultRendererPath,
            renderOptions: {
              authors: true,
              commitReferences: true,
              versionTitleDate: true
            }
          }
        : false,
      automaticFromRef: false
    },
    releaseTagPattern:
      userConfig.releaseTagPattern ||
      // The appropriate default releaseTagPattern is dependent upon the projectRelationships
      (workspaceProjectsRelationship === "independent"
        ? defaultIndependentReleaseTagPattern
        : defaultFixedReleaseTagPattern),
    conventionalCommits: DEFAULT_CONVENTIONAL_COMMITS_CONFIG
  };

  const groupProjectsRelationship =
    userConfig.projectsRelationship || WORKSPACE_DEFAULTS.projectsRelationship;

  const GROUP_DEFAULTS: Omit<NxReleaseConfig["groups"][string], "projects"> = {
    projectsRelationship: groupProjectsRelationship,
    version: {
      conventionalCommits: false,
      generator: "@storm-software/workspace-tools:release-version",
      generatorOptions: {}
    },
    changelog: {
      createRelease: false,
      entryWhenNoChanges:
        "This was a version bump only for {projectName} to align it with other projects, there were no code changes.",
      file: "{projectRoot}/CHANGELOG.md",
      renderer: defaultRendererPath,
      renderOptions: {
        authors: true,
        commitReferences: true,
        versionTitleDate: true
      }
    },
    releaseTagPattern:
      // The appropriate group default releaseTagPattern is dependent upon the projectRelationships
      groupProjectsRelationship === "independent"
        ? defaultIndependentReleaseTagPattern
        : WORKSPACE_DEFAULTS.releaseTagPattern
  };

  /**
   * We first process root level config and apply defaults, so that we know how to handle the group level
   * overrides, if applicable.
   */
  const rootGitConfig: NxReleaseConfig["git"] = deepMergeDefaults(
    [WORKSPACE_DEFAULTS.git],
    userConfig.git as Partial<NxReleaseConfig["git"]>
  );
  const rootVersionConfig: NxReleaseConfig["version"] = deepMergeDefaults(
    [
      WORKSPACE_DEFAULTS.version,
      // Merge in the git defaults from the top level
      { git: versionGitDefaults } as NxReleaseConfig["version"],
      {
        git: userConfig.git as Partial<NxReleaseConfig["git"]>
      } as NxReleaseConfig["version"]
    ],
    userConfig.version as Partial<NxReleaseConfig["version"]>
  );

  if (userConfig.changelog?.workspaceChangelog) {
    userConfig.changelog.workspaceChangelog = normalizeTrueToEmptyObject(
      userConfig.changelog.workspaceChangelog
    );
  }
  if (userConfig.changelog?.projectChangelogs) {
    userConfig.changelog.projectChangelogs = normalizeTrueToEmptyObject(
      userConfig.changelog.projectChangelogs
    );
  }

  const rootChangelogConfig: NxReleaseConfig["changelog"] = deepMergeDefaults(
    [
      WORKSPACE_DEFAULTS.changelog,
      // Merge in the git defaults from the top level
      { git: changelogGitDefaults } as NxReleaseConfig["changelog"],
      {
        git: userConfig.git as Partial<NxReleaseConfig["git"]>
      } as NxReleaseConfig["changelog"]
    ],
    normalizeTrueToEmptyObject(userConfig.changelog) as Partial<
      NxReleaseConfig["changelog"]
    >
  );

  const rootConventionalCommitsConfig: NxReleaseConfig["conventionalCommits"] =
    deepMergeDefaults(
      [WORKSPACE_DEFAULTS.conventionalCommits],
      fillUnspecifiedConventionalCommitsProperties(
        normalizeConventionalCommitsConfig(
          userConfig.conventionalCommits
        ) as NxReleaseConfig["conventionalCommits"]
      )
    );

  // these options are not supported at the group level, only the root/command level
  const rootVersionWithoutGlobalOptions = { ...rootVersionConfig };
  delete rootVersionWithoutGlobalOptions.git;
  delete rootVersionWithoutGlobalOptions.preVersionCommand;

  // Apply conventionalCommits shorthand to the final group defaults if explicitly configured in the original user config
  if (userConfig.version?.conventionalCommits === true) {
    rootVersionWithoutGlobalOptions.generatorOptions = {
      ...rootVersionWithoutGlobalOptions.generatorOptions,
      currentVersionResolver: "git-tag",
      specifierSource: "conventional-commits"
    };
  }
  if (userConfig.version?.conventionalCommits === false) {
    delete rootVersionWithoutGlobalOptions.generatorOptions
      .currentVersionResolver;
    delete rootVersionWithoutGlobalOptions.generatorOptions.specifierSource;
  }

  const groups: NxReleaseConfig["groups"] =
    userConfig.groups && Object.keys(userConfig.groups).length
      ? ensureProjectsConfigIsArray(userConfig.groups)
      : /**
         * No user specified release groups, so we treat all projects (or any any user-defined subset via the top level "projects" property)
         * as being in one release group together in which the projects are released in lock step.
         */
        {
          [IMPLICIT_DEFAULT_RELEASE_GROUP]: {
            projectsRelationship: GROUP_DEFAULTS.projectsRelationship,
            projects: userConfig.projects
              ? // user-defined top level "projects" config takes priority if set
                findMatchingProjects(
                  ensureArray(userConfig.projects),
                  projectGraph.nodes
                )
              : await getDefaultProjects(projectGraph, projectFileMap),

            /**
             * For properties which are overriding config at the root, we use the root level config as the
             * default values to merge with so that the group that matches a specific project will always
             * be the valid source of truth for that type of config.
             */
            version: deepMergeDefaults(
              [GROUP_DEFAULTS.version],
              rootVersionWithoutGlobalOptions
            ),
            // If the user has set something custom for releaseTagPattern at the top level, respect it for the implicit default group
            releaseTagPattern:
              userConfig.releaseTagPattern || GROUP_DEFAULTS.releaseTagPattern,
            // Directly inherit the root level config for projectChangelogs, if set
            changelog: rootChangelogConfig.projectChangelogs || false
          }
        };

  /**
   * Resolve all the project names into their release groups, and check
   * that individual projects are not found in multiple groups.
   */
  const releaseGroups: NxReleaseConfig["groups"] = {};
  const alreadyMatchedProjects = new Set<string>();

  for (const [releaseGroupName, releaseGroup] of Object.entries(groups)) {
    // Ensure that the config for the release group can resolve at least one project
    const matchingProjects = findMatchingProjects(
      releaseGroup.projects,
      projectGraph.nodes
    );
    if (!matchingProjects.length) {
      return {
        error: {
          code: "RELEASE_GROUP_MATCHES_NO_PROJECTS",
          data: {
            releaseGroupName: releaseGroupName
          }
        },
        nxReleaseConfig: null
      };
    }

    // If provided, ensure release tag pattern is valid
    if (releaseGroup.releaseTagPattern) {
      const error = ensureReleaseGroupReleaseTagPatternIsValid(
        releaseGroup.releaseTagPattern,
        releaseGroupName
      );
      if (error) {
        return {
          error,
          nxReleaseConfig: null
        };
      }
    }

    for (const project of matchingProjects) {
      if (alreadyMatchedProjects.has(project)) {
        return {
          error: {
            code: "PROJECT_MATCHES_MULTIPLE_GROUPS",
            data: {
              project
            }
          },
          nxReleaseConfig: null
        };
      }
      alreadyMatchedProjects.add(project);
    }

    // First apply any group level defaults, then apply actual root level config (if applicable), then group level config
    const groupChangelogDefaults: Array<
      NxReleaseConfig["groups"]["string"]["changelog"]
    > = [GROUP_DEFAULTS.changelog];
    if (rootChangelogConfig.projectChangelogs) {
      groupChangelogDefaults.push(rootChangelogConfig.projectChangelogs);
    }

    const projectsRelationship =
      releaseGroup.projectsRelationship || GROUP_DEFAULTS.projectsRelationship;

    if (releaseGroup.changelog) {
      releaseGroup.changelog = normalizeTrueToEmptyObject(
        releaseGroup.changelog
      ) as NxReleaseConfig["groups"]["string"]["changelog"];
    }

    const groupDefaults: NxReleaseConfig["groups"]["string"] = {
      projectsRelationship,
      projects: matchingProjects,
      version: deepMergeDefaults(
        // First apply any group level defaults, then apply actual root level config, then group level config
        [GROUP_DEFAULTS.version, rootVersionWithoutGlobalOptions],
        releaseGroup.version
      ),
      // If the user has set any changelog config at all, including at the root level, then use one set of defaults, otherwise default to false for the whole feature
      changelog:
        releaseGroup.changelog || rootChangelogConfig.projectChangelogs
          ? deepMergeDefaults<NxReleaseConfig["groups"]["string"]["changelog"]>(
              groupChangelogDefaults,
              releaseGroup.changelog || {}
            )
          : false,

      releaseTagPattern:
        releaseGroup.releaseTagPattern ||
        // The appropriate group default releaseTagPattern is dependent upon the projectRelationships
        (projectsRelationship === "independent"
          ? defaultIndependentReleaseTagPattern
          : userConfig.releaseTagPattern || defaultFixedReleaseTagPattern)
    };

    const finalReleaseGroup = deepMergeDefaults([groupDefaults], {
      ...releaseGroup,
      // Ensure that the resolved project names take priority over the original user config (which could have contained unresolved globs etc)
      projects: matchingProjects
    });

    // Apply conventionalCommits shorthand to the final group if explicitly configured in the original group
    if (releaseGroup.version?.conventionalCommits === true) {
      finalReleaseGroup.version.generatorOptions = {
        ...finalReleaseGroup.version.generatorOptions,
        currentVersionResolver: "git-tag",
        specifierSource: "conventional-commits"
      };
    }
    if (
      releaseGroup.version?.conventionalCommits === false &&
      releaseGroupName !== IMPLICIT_DEFAULT_RELEASE_GROUP
    ) {
      delete finalReleaseGroup.version.generatorOptions.currentVersionResolver;
      delete finalReleaseGroup.version.generatorOptions.specifierSource;
    }

    releaseGroups[releaseGroupName] = finalReleaseGroup;
  }

  return {
    error: null,
    nxReleaseConfig: {
      projectsRelationship: WORKSPACE_DEFAULTS.projectsRelationship,
      releaseTagPattern: WORKSPACE_DEFAULTS.releaseTagPattern,
      git: rootGitConfig,
      version: rootVersionConfig,
      changelog: rootChangelogConfig,
      groups: releaseGroups,
      conventionalCommits: rootConventionalCommitsConfig
    }
  };
}
