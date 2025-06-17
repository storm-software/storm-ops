/* eslint-disable no-prototype-builtins */
import { joinPathFragments } from "@nx/devkit";
import jsonParser from "jsonc-parser";
import { readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { NxReleaseChangelogConfiguration } from "nx/src/config/nx-json";
import { ProjectFileMap, ProjectGraph } from "nx/src/config/project-graph.js";
import { readJsonFile } from "nx/src/utils/fileutils.js";
import { findMatchingProjects } from "nx/src/utils/find-matching-projects.js";
import { output } from "nx/src/utils/output.js";
import { PackageJson } from "nx/src/utils/package-json.js";
import { workspaceRoot } from "nx/src/utils/workspace-root.js";
import {
  NxReleaseChangelogConfig,
  NxReleaseConfig,
  NxReleaseConventionalCommitsConfig,
  NxReleaseGroupConfig,
  NxReleaseGroupsConfig,
  NxReleaseVersionConfig
} from "../types";
import {
  DEFAULT_CONVENTIONAL_COMMITS_CONFIG,
  DEFAULT_RELEASE_CONFIG
} from "./config";

export async function resolveNxJsonConfigErrorMessage(
  propPath: string[]
): Promise<string> {
  const errorLines = await getJsonConfigLinesForErrorMessage(
    readFileSync(joinPathFragments(workspaceRoot, "nx.json"), "utf-8"),
    propPath
  );
  let nxJsonMessage = `The relevant config is defined here: ${relative(
    process.cwd(),
    joinPathFragments(workspaceRoot, "nx.json")
  )}`;
  if (errorLines) {
    nxJsonMessage +=
      errorLines.startLine === errorLines.endLine
        ? `, line ${errorLines.startLine}`
        : `, lines ${errorLines.startLine}-${errorLines.endLine}`;
  }
  return nxJsonMessage;
}

async function getJsonConfigLinesForErrorMessage(
  rawConfig: string,
  jsonPath: string[]
): Promise<{ startLine: number; endLine: number } | null> {
  try {
    const rootNode = jsonParser.parseTree(rawConfig);
    const node = jsonParser.findNodeAtLocation(rootNode!, jsonPath);
    if (!node) {
      throw new Error("No node was found in parsed Json file");
    }

    return computeJsonLineNumbers(rawConfig, node.offset, node.length);
  } catch {
    return null;
  }
}

function computeJsonLineNumbers(
  inputText: string,
  startOffset: number,
  characterCount: number
) {
  const lines = inputText.split("\n");
  let totalChars = 0;
  let startLine = 0;
  let endLine = 0;

  for (let i = 0; i < lines.length; i++) {
    totalChars += (lines[i]?.length ?? 0) + 1; // +1 for '\n' character

    if (!startLine && totalChars >= startOffset) {
      startLine = i + 1; // +1 because arrays are 0-based
    }
    if (totalChars >= startOffset + characterCount) {
      endLine = i + 1; // +1 because arrays are 0-based
      break;
    }
  }

  if (!startLine) {
    throw new Error("Start offset exceeds the text length");
  }
  if (!endLine) {
    throw new Error(
      "Character count exceeds the text length after start offset"
    );
  }

  return { startLine, endLine };
}
type DeepRequired<T> = Required<{
  [K in keyof T]: T[K] extends Required<T[K]> ? T[K] : DeepRequired<T[K]>;
}>;

export const IMPLICIT_DEFAULT_RELEASE_GROUP = "__default__";

// export const DEFAULT_CONVENTIONAL_COMMITS_CONFIG = {
//   types: {
//     feat: {
//       semverBump: "minor",
//       changelog: {
//         title: "Features",
//         hidden: false
//       }
//     },
//     fix: {
//       semverBump: "patch",
//       changelog: {
//         title: "Fixes",
//         hidden: false
//       }
//     },
//     perf: {
//       semverBump: "none",
//       changelog: {
//         title: "Performance",
//         hidden: false
//       }
//     },
//     refactor: {
//       semverBump: "none",
//       changelog: {
//         title: "Refactors",
//         hidden: true
//       }
//     },
//     docs: {
//       semverBump: "none",
//       changelog: {
//         title: "Documentation",
//         hidden: true
//       }
//     },
//     build: {
//       semverBump: "none",
//       changelog: {
//         title: "Build",
//         hidden: true
//       }
//     },
//     types: {
//       semverBump: "none",
//       changelog: {
//         title: "Types",
//         hidden: true
//       }
//     },
//     chore: {
//       semverBump: "none",
//       changelog: {
//         title: "Chore",
//         hidden: true
//       }
//     },
//     examples: {
//       semverBump: "none",
//       changelog: {
//         title: "Examples",
//         hidden: true
//       }
//     },
//     test: {
//       semverBump: "none",
//       changelog: {
//         title: "Tests",
//         hidden: true
//       }
//     },
//     style: {
//       semverBump: "none",
//       changelog: {
//         title: "Styles",
//         hidden: true
//       }
//     },
//     ci: {
//       semverBump: "none",
//       changelog: {
//         title: "CI",
//         hidden: true
//       }
//     },
//     revert: {
//       semverBump: "none",
//       changelog: {
//         title: "Revert",
//         hidden: true
//       }
//     }
//   }
// } satisfies NxReleaseConventionalCommitsConfig;

// We explicitly handle some possible errors in order to provide the best possible DX
export interface CreateNxReleaseConfigError {
  code:
    | "PROJECTS_AND_GROUPS_DEFINED"
    | "RELEASE_GROUP_MATCHES_NO_PROJECTS"
    | "RELEASE_GROUP_RELEASE_TAG_PATTERN_VERSION_PLACEHOLDER_MISSING_OR_EXCESSIVE"
    | "PROJECT_MATCHES_MULTIPLE_GROUPS"
    | "CONVENTIONAL_COMMITS_SHORTHAND_MIXED_WITH_OVERLAPPING_GENERATOR_OPTIONS"
    | "GLOBAL_GIT_CONFIG_MIXED_WITH_GRANULAR_GIT_CONFIG";
  data: Record<string, string | string[]>;
}

/**
 * In some cases it is much cleaner and more intuitive for the user to be able to
 * specify `true` in their config when they want to use the default config for a
 * particular property, rather than having to specify an empty object.
 */
function normalizeTrueToEmptyObject<T>(
  value: T | boolean
): T | NonNullable<unknown> {
  return value === true ? {} : value;
}

function normalizeConventionalCommitsConfig(
  userConventionalCommitsConfig: NxReleaseConventionalCommitsConfig
): NxReleaseConventionalCommitsConfig {
  if (!userConventionalCommitsConfig || !userConventionalCommitsConfig.types) {
    return userConventionalCommitsConfig;
  }

  const types: NxReleaseConventionalCommitsConfig["types"] = {};
  for (const [t, typeConfig] of Object.entries(
    userConventionalCommitsConfig.types
  )) {
    if (typeConfig === false) {
      types[t] = {
        semverBump: "none",
        changelog: {
          hidden: true
        }
      };
      continue;
    }
    if (typeConfig === true) {
      types[t] = {};
      continue;
    }
    if (typeConfig.changelog === false) {
      types[t] = {
        ...typeConfig,
        changelog: {
          hidden: true
        }
      };
      continue;
    }
    if (typeConfig.changelog === true) {
      types[t] = {
        ...typeConfig,
        changelog: {}
      };
      continue;
    }

    types[t] = typeConfig;
  }

  return {
    ...userConventionalCommitsConfig,
    types
  };
}

/**
 * New, custom types specified by users will not be given the appropriate
 * defaults with `deepMergeDefaults`, so we need to fill in the gaps here.
 */
function fillUnspecifiedConventionalCommitsProperties(
  config: NxReleaseConventionalCommitsConfig
) {
  if (!config || !config.types) {
    return config;
  }
  const types: NxReleaseConventionalCommitsConfig["types"] = {};
  for (const [t, typeConfig] of Object.entries(config.types)) {
    const defaultTypeConfig = DEFAULT_CONVENTIONAL_COMMITS_CONFIG.types?.[t];

    const semverBump =
      (typeof typeConfig !== "boolean" && typeConfig.semverBump) ||
      // preserve our default semver bump if it's not 'none'
      // this prevents a 'feat' from becoming a 'patch' just
      // because they modified the changelog config for 'feat'
      (defaultTypeConfig?.semverBump !== "none" &&
        defaultTypeConfig?.semverBump) ||
      "patch";
    // don't preserve our default behavior for hidden, ever.
    // we should assume that if users are explicitly enabling a
    // type, then they intend it to be visible in the changelog
    const hidden =
      typeof typeConfig !== "boolean" &&
      typeConfig &&
      typeof typeConfig.changelog !== "boolean" &&
      typeConfig.changelog?.hidden
        ? typeConfig.changelog?.hidden
        : false;
    const title =
      typeof typeConfig !== "boolean" &&
      typeConfig &&
      typeof typeConfig.changelog !== "boolean" &&
      typeConfig.changelog?.title
        ? typeConfig.changelog?.title
        : // our default title is better than just the unmodified type name
          defaultTypeConfig?.changelog.title || t;

    types[t] = {
      semverBump,
      changelog: {
        hidden,
        title
      }
    };
  }
  return {
    ...config,
    types
  };
}

export async function handleNxReleaseConfigError(
  error: CreateNxReleaseConfigError
): Promise<never> {
  switch (error.code) {
    case "PROJECTS_AND_GROUPS_DEFINED":
      {
        const nxJsonMessage = await resolveNxJsonConfigErrorMessage([
          "release",
          "projects"
        ]);
        output.error({
          title: `"projects" is not valid when explicitly defining release groups, and everything should be expressed within "groups" in that case. If you are using "groups" then you should remove the "projects" property`,
          bodyLines: [nxJsonMessage]
        });
      }
      break;
    case "RELEASE_GROUP_MATCHES_NO_PROJECTS":
      {
        const nxJsonMessage = await resolveNxJsonConfigErrorMessage([
          "release",
          "groups"
        ]);
        output.error({
          title: `Release group "${error.data.releaseGroupName}" matches no projects. Please ensure all release groups match at least one project:`,
          bodyLines: [nxJsonMessage]
        });
      }
      break;
    case "PROJECT_MATCHES_MULTIPLE_GROUPS":
      {
        const nxJsonMessage = await resolveNxJsonConfigErrorMessage([
          "release",
          "groups"
        ]);
        output.error({
          title: `Project "${error.data.project}" matches multiple release groups. Please ensure all projects are part of only one release group:`,
          bodyLines: [nxJsonMessage]
        });
      }
      break;
    case "RELEASE_GROUP_RELEASE_TAG_PATTERN_VERSION_PLACEHOLDER_MISSING_OR_EXCESSIVE":
      {
        const nxJsonMessage = await resolveNxJsonConfigErrorMessage([
          "release",
          "groups",
          error.data.releaseGroupName as string,
          "releaseTagPattern"
        ]);
        output.error({
          title: `Release group "${error.data.releaseGroupName}" has an invalid releaseTagPattern. Please ensure the pattern contains exactly one instance of the "{version}" placeholder`,
          bodyLines: [nxJsonMessage]
        });
      }
      break;
    case "CONVENTIONAL_COMMITS_SHORTHAND_MIXED_WITH_OVERLAPPING_GENERATOR_OPTIONS":
      {
        const nxJsonMessage = await resolveNxJsonConfigErrorMessage([
          "release"
        ]);
        output.error({
          title: `You have configured both the shorthand "version.conventionalCommits" and one or more of the related "version.generatorOptions" that it sets for you. Please use one or the other:`,
          bodyLines: [nxJsonMessage]
        });
      }
      break;
    case "GLOBAL_GIT_CONFIG_MIXED_WITH_GRANULAR_GIT_CONFIG":
      {
        const nxJsonMessage = await resolveNxJsonConfigErrorMessage([
          "release",
          "git"
        ]);
        output.error({
          title: `You have duplicate conflicting git configurations. If you are using the top level 'nx release' command, then remove the 'release.version.git' and 'release.changelog.git' properties in favor of 'release.git'. If you are using the subcommands or the programmatic API, then remove the 'release.git' property in favor of 'release.version.git' and 'release.changelog.git':`,
          bodyLines: [nxJsonMessage]
        });
      }
      break;
    default:
      throw new Error(`Unhandled error code: ${error.code}`);
  }

  process.exit(1);
}

function ensureReleaseGroupReleaseTagPatternIsValid(
  releaseTagPattern: string,
  releaseGroupName: string
): null | CreateNxReleaseConfigError {
  // ensure that any provided releaseTagPattern contains exactly one instance of {version}
  return releaseTagPattern.split("{version}").length === 2
    ? null
    : {
        code: "RELEASE_GROUP_RELEASE_TAG_PATTERN_VERSION_PLACEHOLDER_MISSING_OR_EXCESSIVE",
        data: {
          releaseGroupName
        }
      };
}

function ensureProjectsConfigIsArray(
  groups: NxReleaseGroupsConfig
): NxReleaseGroupsConfig {
  const result: NxReleaseGroupsConfig = {};
  for (const [groupName, groupConfig] of Object.entries(groups)) {
    result[groupName] = {
      ...groupConfig,
      projects: ensureArray(groupConfig.projects)
    };
  }
  return result as NxReleaseGroupsConfig;
}

function ensureArray(value: string | string[]): string[] {
  return Array.isArray(value) ? value : [value];
}

function isObject(value: any): value is Record<string, any> {
  return value && typeof value === "object" && !Array.isArray(value);
}

// Helper function to merge two config objects
function mergeConfig<T>(
  objA: DeepRequired<T>,
  objB: Partial<T>
): DeepRequired<T> {
  const merged: any = { ...objA };

  for (const key in objB) {
    if (objB.hasOwnProperty(key)) {
      // If objB[key] is explicitly set to false, null or 0, respect that value
      if (objB[key] === false || objB[key] === null || objB[key] === 0) {
        merged[key] = objB[key];
      }
      // If both objA[key] and objB[key] are objects, recursively merge them
      else if (isObject(merged[key]) && isObject(objB[key])) {
        merged[key] = mergeConfig(merged[key], objB?.[key] ?? {});
      }
      // If objB[key] is defined, use it (this will overwrite any existing value in merged[key])
      else if (objB[key] !== undefined) {
        merged[key] = objB[key];
      }
    }
  }

  return merged as DeepRequired<T>;
}

/**
 * This function takes in a strictly typed collection of all possible default values in a particular section of config,
 * and an optional set of partial user config, and returns a single, deeply merged config object, where the user
 * config takes priority over the defaults in all cases (only an `undefined` value in the user config will be
 * overwritten by the defaults, all other falsey values from the user will be respected).
 */
function deepMergeDefaults<T>(
  defaultConfigs: DeepRequired<T>[],
  userConfig?: Partial<T>
): DeepRequired<T> {
  let result: any;

  // First merge defaultConfigs sequentially (meaning later defaults will override earlier ones)
  for (const defaultConfig of defaultConfigs) {
    if (!result) {
      result = defaultConfig;
      continue;
    }
    result = mergeConfig(result, defaultConfig as Partial<T>);
  }

  // Finally, merge the userConfig
  if (userConfig) {
    result = mergeConfig(result, userConfig);
  }

  return result as DeepRequired<T>;
}

/**
 * We want to prevent users from setting both the conventionalCommits shorthand and any of the related
 * generatorOptions at the same time, since it is at best redundant, and at worst invalid.
 */
function hasInvalidConventionalCommitsConfig(
  userConfig: NxReleaseConfig
): boolean {
  // at the root
  if (
    userConfig.version?.conventionalCommits === true &&
    (userConfig.version?.currentVersionResolver ||
      userConfig.version?.specifierSource)
  ) {
    return true;
  }
  // within any groups
  if (userConfig.groups) {
    for (const group of Object.values(userConfig.groups)) {
      if (
        group.version?.conventionalCommits === true &&
        (group.version?.currentVersionResolver ||
          group.version?.specifierSource)
      ) {
        return true;
      }
    }
  }
  return false;
}

/**
 * We want to prevent users from setting both the global and granular git configurations. Users should prefer the
 * global configuration if using the top level nx release command and the granular configuration if using
 * the subcommands or the programmatic API.
 */
function hasInvalidGitConfig(userConfig: NxReleaseConfig): boolean {
  return (
    !!userConfig.git && !!(userConfig.version?.git || userConfig.changelog?.git)
  );
}

async function getDefaultProjects(
  projectGraph: ProjectGraph,
  projectFileMap: ProjectFileMap
): Promise<string[]> {
  // default to all library projects in the workspace with a package.json file
  return findMatchingProjects(["*"], projectGraph.nodes).filter(
    project =>
      projectGraph.nodes[project]!.type === "lib" &&
      // Exclude all projects with "private": true in their package.json because this is
      // a common indicator that a project is not intended for release.
      // Users can override this behavior by explicitly defining the projects they want to release.
      isProjectPublic(project, projectGraph, projectFileMap)
  );
}

function isProjectPublic(
  project: string,
  projectGraph: ProjectGraph,
  projectFileMap: ProjectFileMap
): boolean {
  const projectNode = projectGraph.nodes[project];
  const packageJsonPath = join(projectNode!.data.root, "package.json");

  if (!projectFileMap[project]?.find(f => f.file === packageJsonPath)) {
    return false;
  }

  try {
    const fullPackageJsonPath = join(workspaceRoot, packageJsonPath);
    const packageJson = readJsonFile<PackageJson>(fullPackageJsonPath);
    return !(packageJson.private === true);
  } catch (e) {
    // do nothing and assume that the project is not public if there is a parsing issue
    // this will result in it being excluded from the default projects list
    return false;
  }
}

// Apply default configuration to any optional user configuration and handle known errors
export async function createNxReleaseConfig(
  projectGraph: ProjectGraph,
  projectFileMap: ProjectFileMap,
  userConfig: NxReleaseConfig = {}
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

  const defaultGeneratorOptions = (
    userConfig.version?.conventionalCommits
      ? {
          currentVersionResolver: "git-tag",
          specifierSource: "conventional-commits"
        }
      : {}
  ) as any;

  // const userGroups = Object.values(userConfig.groups ?? {});
  // const disableWorkspaceChangelog =
  //   userGroups.length > 1 ||
  //   (userGroups.length === 1 &&
  //     userGroups[0]?.projectsRelationship === "independent") ||
  //   (userConfig.projectsRelationship === "independent" &&
  //     !userGroups.some(g => g.projectsRelationship === "fixed"));

  const defaultRendererPath = "nx/release/changelog-renderer";

  /*const stormRendererPath = "@storm-software/git-tools/changelog-renderer";
  const gitDefaults = {
    commit: false as boolean,
    commitMessage: "release(monorepo): Publish workspace release updates",
    tag: false as boolean,
    stageChanges: false as boolean
  } as NxReleaseGitConfig;*/

  const versionGitDefaults = {
    conventionalCommits:
      userConfig.version?.conventionalCommits ||
      DEFAULT_CONVENTIONAL_COMMITS_CONFIG ||
      false,
    generator: "@storm-software/workspace-tools:release-version",
    generatorOptions: { ...defaultGeneratorOptions },
    preVersionCommand: userConfig.version?.preVersionCommand || "",
    useLegacyVersioning: true
  } as any;
  const changelogGitDefaults = {
    createRelease: "github",
    automaticFromRef: true,
    entryWhenNoChanges: false,
    file: "{projectRoot}/CHANGELOG.md",
    renderer: defaultRendererPath,
    renderOptions: {
      authors: false,
      commitReferences: true,
      versionTitleDate: true
    }
  } as Required<NxReleaseChangelogConfiguration>;

  const defaultFixedReleaseTagPattern = "v{version}";
  const defaultIndependentReleaseTagPattern = "{projectName}@{version}";

  const workspaceProjectsRelationship =
    userConfig.projectsRelationship || "fixed";

  const WORKSPACE_DEFAULTS = {
    ...DEFAULT_RELEASE_CONFIG,

    // By default all projects in all groups are released together
    projectsRelationship: workspaceProjectsRelationship,
    version: {
      ...versionGitDefaults
    },
    changelog: {
      ...changelogGitDefaults
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
    userConfig.projectsRelationship ||
    WORKSPACE_DEFAULTS.projectsRelationship ||
    "independent";

  const GROUP_DEFAULTS = {
    projectsRelationship: groupProjectsRelationship,
    version: {
      ...versionGitDefaults
    },
    changelog: {
      ...changelogGitDefaults,
      file: "{projectRoot}/CHANGELOG.md",
      entryWhenNoChanges:
        "This was a version bump only for {projectName} to align it with other projects, there were no code changes."
    },
    releaseTagPattern:
      groupProjectsRelationship === "independent"
        ? defaultIndependentReleaseTagPattern
        : WORKSPACE_DEFAULTS.releaseTagPattern
  } as NxReleaseGroupConfig;

  /**
   * We first process root level config and apply defaults, so that we know how to handle the group level
   * overrides, if applicable.
   */
  // const rootGitConfig: NxReleaseGitConfig = deepMergeDefaults(
  //   [gitDefaults],
  //   userConfig.git as any
  // );
  // const rootVersionConfig: NxReleaseVersionConfig = deepMergeDefaults(
  //   [
  //     WORKSPACE_DEFAULTS.version,
  //     // Merge in the git defaults from the top level
  //     { git: WORKSPACE_DEFAULTS.git } as any,
  //     {
  //       git: userConfig.git
  //     }
  //   ],
  //   userConfig.version as Partial<NxReleaseVersionConfig>
  // );

  const rootVersionConfig = userConfig.version;
  const rootChangelogConfig = userConfig.changelog;

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

  // const rootChangelogConfig = deepMergeDefaults(
  //   [changelogGitDefaults],
  //   userConfig.changelog as NxReleaseChangelogConfiguration
  // );

  const rootConventionalCommitsConfig = deepMergeDefaults(
    [WORKSPACE_DEFAULTS.conventionalCommits],
    fillUnspecifiedConventionalCommitsProperties(
      normalizeConventionalCommitsConfig(
        userConfig.conventionalCommits || DEFAULT_CONVENTIONAL_COMMITS_CONFIG
      )
    )
  );

  // these options are not supported at the group level, only the root/command level
  let rootVersionWithoutGlobalOptions = {} as NxReleaseVersionConfig;
  delete rootVersionWithoutGlobalOptions.git;
  delete rootVersionWithoutGlobalOptions.preVersionCommand;

  // Apply conventionalCommits shorthand to the final group defaults if explicitly configured in the original user config
  if (userConfig.version?.conventionalCommits === true) {
    rootVersionWithoutGlobalOptions = {
      ...rootVersionWithoutGlobalOptions,
      currentVersionResolver: "git-tag",
      specifierSource: "conventional-commits"
    };
  }
  if (userConfig.version?.conventionalCommits === false) {
    delete rootVersionWithoutGlobalOptions?.currentVersionResolver;
    delete rootVersionWithoutGlobalOptions?.specifierSource;
  }

  const groups =
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
            version: GROUP_DEFAULTS.version,
            // If the user has set something custom for releaseTagPattern at the top level, respect it for the implicit default group
            releaseTagPattern:
              userConfig.releaseTagPattern || GROUP_DEFAULTS.releaseTagPattern,
            // Directly inherit the root level config for projectChangelogs, if set
            changelog: userConfig.changelog || false
          } as NxReleaseGroupConfig
        };

  /**
   * Resolve all the project names into their release groups, and check
   * that individual projects are not found in multiple groups.
   */
  const releaseGroups: NxReleaseGroupsConfig = {};
  const alreadyMatchedProjects = new Set<string>();

  for (const [releaseGroupName, releaseGroup] of Object.entries(groups)) {
    // Ensure that the config for the release group can resolve at least one project
    const matchingProjects = findMatchingProjects(
      releaseGroup.projects as string[],
      projectGraph.nodes
    );
    if (!matchingProjects.length) {
      if (releaseGroupName === IMPLICIT_DEFAULT_RELEASE_GROUP) {
        continue;
      }

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
    const groupChangelogDefaults: Array<NxReleaseChangelogConfig> =
      GROUP_DEFAULTS.changelog ? [] : [];
    if (WORKSPACE_DEFAULTS.changelog) {
      groupChangelogDefaults.push(
        WORKSPACE_DEFAULTS.changelog as NxReleaseChangelogConfig
      );
    }

    const projectsRelationship =
      releaseGroup.projectsRelationship || GROUP_DEFAULTS.projectsRelationship;

    if (releaseGroup.changelog) {
      releaseGroup.changelog = normalizeTrueToEmptyObject(
        releaseGroup.changelog
      ) as NxReleaseGroupsConfig["string"]["changelog"];
    }

    const groupDefaults: NxReleaseGroupsConfig["string"] = {
      projectsRelationship,
      projects: matchingProjects,
      version: deepMergeDefaults(
        // First apply any group level defaults, then apply actual root level config, then group level config
        [GROUP_DEFAULTS.version, { ...rootVersionWithoutGlobalOptions } as any],
        releaseGroup.version
      ),
      // If the user has set any changelog config at all, including at the root level, then use one set of defaults, otherwise default to false for the whole feature
      changelog:
        releaseGroup.changelog || WORKSPACE_DEFAULTS.changelog
          ? deepMergeDefaults<NxReleaseGroupsConfig["string"]["changelog"]>(
              groupChangelogDefaults as any,
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

    const finalReleaseGroup = deepMergeDefaults([groupDefaults as any], {
      ...releaseGroup,
      // Ensure that the resolved project names take priority over the original user config (which could have contained unresolved globs etc)
      projects: matchingProjects
    });

    // Apply conventionalCommits shorthand to the final group if explicitly configured in the original group
    if (releaseGroup.version?.conventionalCommits === true) {
      finalReleaseGroup.version = {
        ...finalReleaseGroup.version,
        currentVersionResolver: "git-tag",
        specifierSource: "conventional-commits"
      };
    }
    // if (
    //   releaseGroup.version?.conventionalCommits === false &&
    //   releaseGroupName !== IMPLICIT_DEFAULT_RELEASE_GROUP
    // ) {
    //   delete finalReleaseGroup.version?.currentVersionResolver;
    //   delete finalReleaseGroup.version?.specifierSource;
    // }

    releaseGroups[releaseGroupName] = finalReleaseGroup;
  }

  return {
    error: null,
    nxReleaseConfig: {
      projectsRelationship: WORKSPACE_DEFAULTS.projectsRelationship,
      releaseTagPattern: WORKSPACE_DEFAULTS.releaseTagPattern,
      version: rootVersionConfig,
      changelog: rootChangelogConfig,
      groups: releaseGroups,
      conventionalCommits: rootConventionalCommitsConfig
    }
  };
}
