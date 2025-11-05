import {
  createProjectGraphAsync,
  ProjectGraph,
  ProjectsConfigurations,
  readCachedProjectGraph,
  readProjectsConfigurationFromProjectGraph,
  Tree
} from "@nx/devkit";
import { StormWorkspaceConfig } from "@storm-software/config";
import { joinPaths } from "@storm-software/config-tools";
import { getWorkspaceConfig } from "@storm-software/config-tools/get-config";
import {
  writeDebug,
  writeWarning
} from "@storm-software/config-tools/logger/console";
import defu from "defu";
import { existsSync } from "node:fs";
import { ReleaseClient } from "nx/release";
import { DependencyBump } from "nx/release/changelog-renderer";
import {
  ChangelogChange,
  NxReleaseChangelogResult,
  PostGitTask
} from "nx/src/command-line/release/changelog";
import { ChangelogOptions as NxChangelogOptions } from "nx/src/command-line/release/command-object";
import {
  getCommitHash,
  getFirstGitCommit,
  getLatestGitTagForPattern,
  GitCommit,
  gitPush
} from "nx/src/command-line/release/utils/git";
import {
  createCommitMessageValues,
  handleDuplicateGitTags
} from "nx/src/command-line/release/utils/shared";
import { NxJsonConfiguration, readNxJson } from "nx/src/config/nx-json";
import { FsTree } from "nx/src/generators/tree";
import { createFileMapUsingProjectGraph } from "nx/src/project-graph/file-map-utils";
import { ReleaseConfig } from "../types";
import {
  filterHiddenChanges,
  generateChangelogForProjects
} from "../utilities/changelog-utils";
import { createFileToProjectMap } from "../utilities/file-utils";
import {
  commitChanges,
  commitChangesNonProjectFiles,
  createGitTagValues,
  extractPreid,
  filterProjectCommits,
  getCommits,
  getProjectsAffectedByCommit,
  gitTag
} from "../utilities/git-utils";
import { omit } from "../utilities/omit";
import StormChangelogRenderer from "./changelog-renderer";
import { DEFAULT_RELEASE_CONFIG, getReleaseGroupConfig } from "./config";

export type ChangelogOptions = Omit<
  NxChangelogOptions,
  "versionData" | "releaseGraph"
> &
  Required<Pick<NxChangelogOptions, "versionData" | "releaseGraph">>;

/**
 * Extended {@link ReleaseClient} with Storm Software specific release APIs
 */
export class StormReleaseClient extends ReleaseClient {
  public static async create(
    releaseConfig: Partial<ReleaseConfig> = {},
    ignoreNxJsonConfig = false,
    workspaceConfig?: StormWorkspaceConfig
  ) {
    if (!workspaceConfig) {
      workspaceConfig = await getWorkspaceConfig();
    }

    let projectGraph!: ProjectGraph;
    try {
      projectGraph = readCachedProjectGraph();
    } catch {
      projectGraph = await createProjectGraphAsync({
        exitOnError: true,
        resetDaemonClient: true
      });
    }

    if (!projectGraph) {
      throw new Error(
        "Failed to load the project graph. Please run `nx reset`, then run the `storm-git commit` command again."
      );
    }

    return new StormReleaseClient(
      projectGraph,
      releaseConfig,
      ignoreNxJsonConfig,
      workspaceConfig
    );
  }

  /**
   * The release configuration used by this release client.
   */
  protected config: ReleaseConfig;

  /**
   * The workspace configuration used by this release client.
   */
  protected workspaceConfig: StormWorkspaceConfig;

  /**
   * The project graph of the workspace.
   */
  protected projectGraph: ProjectGraph;

  /**
   * The project configurations of the workspace.
   */
  protected projectConfigurations: ProjectsConfigurations;

  /**
   * The file system tree used by this release client.
   */
  protected tree: Tree;

  /**
   *  Creates an instance of {@link StormReleaseClient}.
   *
   * @param projectGraph - The project graph of the workspace.
   * @param releaseConfig - Release configuration to use for the current release client. By default, it will be combined with any configuration in `nx.json`, but you can choose to use it as the sole source of truth by setting {@link ignoreNxJsonConfig} to true.
   * @param ignoreNxJsonConfig - Whether to ignore the nx.json configuration and use only the provided {@link releaseConfig}. Default is false.
   * @param workspaceConfig - Optional Storm workspace configuration object for logging purposes.
   */
  protected constructor(
    projectGraph: ProjectGraph,
    releaseConfig: Partial<ReleaseConfig>,
    ignoreNxJsonConfig: boolean,
    workspaceConfig: StormWorkspaceConfig
  ) {
    let nxJson!: Partial<NxJsonConfiguration>;
    if (
      !ignoreNxJsonConfig &&
      existsSync(joinPaths(workspaceConfig.workspaceRoot, "nx.json"))
    ) {
      nxJson = readNxJson();
    }

    const config = defu(
      {
        changelog: {
          renderOptions: {
            workspaceConfig
          }
        }
      },
      {
        groups: getReleaseGroupConfig(releaseConfig, workspaceConfig)
      },
      {
        groups: getReleaseGroupConfig(
          (nxJson.release ?? {}) as Partial<ReleaseConfig>,
          workspaceConfig
        )
      },
      omit(releaseConfig, ["groups"]),
      nxJson.release ? omit(nxJson.release, ["groups"]) : {},
      omit(DEFAULT_RELEASE_CONFIG, ["groups"])
    ) as ReleaseConfig;

    super(config, true);

    writeDebug(
      "Executing release with the following configuration",
      workspaceConfig
    );
    writeDebug(config, workspaceConfig);

    this.projectGraph = projectGraph;
    this.config = config;
    this.workspaceConfig = workspaceConfig;
    this.tree = new FsTree(workspaceConfig.workspaceRoot, false);

    this.projectConfigurations =
      readProjectsConfigurationFromProjectGraph(projectGraph);
  }

  public override releaseChangelog = async (options: ChangelogOptions) => {
    const to = options.to || "HEAD";
    const toSHA = await getCommitHash(to);

    const postGitTasks = [] as PostGitTask[];
    let projectChangelogs: NxReleaseChangelogResult["projectChangelogs"] = {};

    const projectsPreid: { [projectName: string]: string | undefined } =
      Object.fromEntries(
        Object.entries(options.versionData).map(([projectName, v]) => [
          projectName,
          v.newVersion ? extractPreid(v.newVersion) : undefined
        ])
      );

    /**
     * Compute any additional dependency bumps up front because there could be cases of circular dependencies,
     * and figuring them out during the main iteration would be too late.
     */
    const projectToAdditionalDependencyBumps = new Map<
      string,
      DependencyBump[]
    >();
    for (const releaseGroup of options.releaseGraph.releaseGroups) {
      if (releaseGroup.projectsRelationship !== "independent") {
        continue;
      }
      for (const project of releaseGroup.projects) {
        // If the project does not have any changes, do not process its dependents
        if (
          !options.versionData[project] ||
          options.versionData[project].newVersion === null
        ) {
          continue;
        }

        const dependentProjects = (
          options.versionData[project].dependentProjects || []
        )
          .map(dep => {
            return {
              dependencyName: dep.source,
              newVersion: options.versionData[dep.source]?.newVersion ?? null
            };
          })
          .filter(b => b.newVersion !== null);

        for (const dependent of dependentProjects) {
          const additionalDependencyBumpsForProject = (
            projectToAdditionalDependencyBumps.has(dependent.dependencyName)
              ? projectToAdditionalDependencyBumps.get(dependent.dependencyName)
              : []
          ) as DependencyBump[];
          additionalDependencyBumpsForProject.push({
            dependencyName: project,
            newVersion: options.versionData[project].newVersion
          });
          projectToAdditionalDependencyBumps.set(
            dependent.dependencyName,
            additionalDependencyBumpsForProject
          );
        }
      }
    }

    const allProjectChangelogs: NxReleaseChangelogResult["projectChangelogs"] =
      {};

    for (const releaseGroup of options.releaseGraph.releaseGroups) {
      const config = releaseGroup.changelog;
      // The entire feature is disabled at the release group level, exit early
      if (config === false) {
        continue;
      }

      if (
        !options.releaseGraph.releaseGroupToFilteredProjects.has(releaseGroup)
      ) {
        throw new Error(
          `No filtered projects found for release group ${releaseGroup.name}`
        );
      }

      const projects = options.projects?.length
        ? // If the user has passed a list of projects, we need to use the filtered list of projects within the release group, plus any dependents
          Array.from(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            options.releaseGraph.releaseGroupToFilteredProjects.get(
              releaseGroup
            )!
          ).flatMap(project => {
            return [
              project,
              ...(options.versionData[project]?.dependentProjects.map(
                dep => dep.source
              ) || [])
            ];
          })
        : // Otherwise, we use the full list of projects within the release group
          releaseGroup.projects;
      const projectNodes = projects.map(name => this.projectGraph.nodes[name]);

      if (releaseGroup.projectsRelationship === "independent") {
        for (const project of projectNodes) {
          let changes: ChangelogChange[] | null = null;

          let fromRef =
            options.from ||
            (
              await getLatestGitTagForPattern(
                releaseGroup.releaseTag.pattern,
                {
                  projectName: project.name,
                  releaseGroupName: releaseGroup.name
                },
                {
                  checkAllBranchesWhen:
                    releaseGroup.releaseTag.checkAllBranchesWhen,
                  preid: projectsPreid[project.name],
                  requireSemver: releaseGroup.releaseTag.requireSemver,
                  strictPreid: releaseGroup.releaseTag.strictPreid
                }
              )
            )?.tag;

          let commits: GitCommit[] | undefined = undefined;
          if (!fromRef) {
            const firstCommit = await getFirstGitCommit();
            commits = await filterProjectCommits({
              fromSHA: firstCommit,
              toSHA,
              projectPath: project.data.root
            });

            fromRef = commits[0]?.shortHash;
            if (options.verbose) {
              console.log(
                `Determined --from ref for ${project.name} from the first commit in which it exists: ${fromRef}`
              );
            }
          }

          if (!fromRef && !commits) {
            throw new Error(
              `Unable to determine the previous git tag. If this is the first release of your workspace, use the --first-release option or set the "release.changelog.automaticFromRef" config property in nx.json to generate a changelog from the first commit. Otherwise, be sure to configure the "release.releaseTag.pattern" property in nx.json to match the structure of your repository's git tags.`
            );
          }

          if (!commits) {
            commits = await filterProjectCommits({
              fromSHA: fromRef!,
              toSHA,
              projectPath: project.data.root
            });
          }

          const { fileMap } = await createFileMapUsingProjectGraph(
            this.projectGraph
          );
          const fileToProjectMap = createFileToProjectMap(
            fileMap.projectFileMap
          );

          changes = filterHiddenChanges(
            commits.map(c => ({
              type: c.type,
              scope: c.scope,
              description: c.description,
              body: c.body,
              isBreaking: c.isBreaking,
              githubReferences: c.references,
              authors: c.authors,
              shortHash: c.shortHash,
              revertedHashes: c.revertedHashes,
              affectedProjects: commitChangesNonProjectFiles(
                c,
                fileMap.nonProjectFiles
              )
                ? "*"
                : getProjectsAffectedByCommit(c, fileToProjectMap)
            })),
            this.config.conventionalCommits
          );

          writeDebug(
            `Running changelog generation for the ${releaseGroup.name} release group`,
            this.workspaceConfig
          );

          projectChangelogs = await generateChangelogForProjects({
            tree: this.tree,
            args: options,
            changes,
            projectGraph: this.projectGraph,
            projectsVersionData: options.versionData,
            releaseGroup,
            projects: [project],
            releaseConfig: this.config,
            projectToAdditionalDependencyBumps,
            workspaceConfig: this.workspaceConfig,
            ChangelogRendererClass: StormChangelogRenderer
          });
          if (projectChangelogs) {
            for (const [projectName, projectChangelog] of Object.entries(
              projectChangelogs
            )) {
              // Add the post git task (e.g. create a remote release) for the project changelog, if applicable
              if (projectChangelog.postGitTask) {
                postGitTasks.push(projectChangelog.postGitTask);
              }

              allProjectChangelogs[projectName] = projectChangelog;
            }
          }
        }
      } else {
        let changes: ChangelogChange[] = [];

        let fromRef =
          options.from ||
          (
            await getLatestGitTagForPattern(
              releaseGroup.releaseTag.pattern,
              {},
              {
                checkAllBranchesWhen:
                  releaseGroup.releaseTag.checkAllBranchesWhen,
                preid: Object.keys(projectsPreid)[0]
                  ? projectsPreid?.[Object.keys(projectsPreid)[0]!]
                  : undefined,
                requireSemver: releaseGroup.releaseTag.requireSemver,
                strictPreid: releaseGroup.releaseTag.strictPreid
              }
            )
          )?.tag;
        if (!fromRef) {
          fromRef = await getFirstGitCommit();
          if (options.verbose) {
            console.log(
              `Determined release group --from ref from the first commit in the workspace: ${fromRef}`
            );
          }
        }

        // Make sure that the fromRef is actually resolvable
        const fromSHA = await getCommitHash(fromRef);

        const { fileMap } = await createFileMapUsingProjectGraph(
          this.projectGraph
        );
        const fileToProjectMap = createFileToProjectMap(fileMap.projectFileMap);

        changes = filterHiddenChanges(
          (await getCommits(fromSHA, toSHA)).map(c => ({
            type: c.type,
            scope: c.scope,
            description: c.description,
            body: c.body,
            isBreaking: c.isBreaking,
            githubReferences: c.references,
            authors: c.authors,
            shortHash: c.shortHash,
            revertedHashes: c.revertedHashes,
            affectedProjects: commitChangesNonProjectFiles(
              c,
              fileMap.nonProjectFiles
            )
              ? "*"
              : getProjectsAffectedByCommit(c, fileToProjectMap)
          })),
          this.config.conventionalCommits
        );

        writeDebug(
          `Running changelog generation for the ${releaseGroup.name} release group`,
          this.workspaceConfig
        );

        projectChangelogs = await generateChangelogForProjects({
          tree: this.tree,
          args: options,
          changes,
          projectGraph: this.projectGraph,
          projectsVersionData: options.versionData,
          releaseGroup,
          projects: projectNodes,
          releaseConfig: this.config,
          projectToAdditionalDependencyBumps,
          workspaceConfig: this.workspaceConfig,
          ChangelogRendererClass: StormChangelogRenderer
        });
        if (projectChangelogs) {
          for (const [projectName, projectChangelog] of Object.entries(
            projectChangelogs
          )) {
            // Add the post git task (e.g. create a remote release) for the project changelog, if applicable
            if (projectChangelog.postGitTask) {
              postGitTasks.push(projectChangelog.postGitTask);
            }
            allProjectChangelogs[projectName] = projectChangelog;
          }
        }
      }
    }

    writeDebug(
      `Generated changelogs for ${Object.keys(allProjectChangelogs).length} projects:
${Object.keys(allProjectChangelogs)
  .map(p => `  - ${p}`)
  .join("\n")}
`,
      this.workspaceConfig
    );
    await this.applyChangesAndExit(options, postGitTasks);

    return {
      workspaceChangelog: undefined,
      projectChangelogs: allProjectChangelogs
    };
  };

  protected applyChangesAndExit = async (
    options: ChangelogOptions,
    postGitTasks: PostGitTask[]
  ) => {
    const to = options.to || "HEAD";
    let latestCommit = await getCommitHash(to);

    const gitTagValues: string[] =
      (options.gitTag ?? this.config.changelog?.git?.tag)
        ? createGitTagValues(
            options.releaseGraph.releaseGroups,
            options.releaseGraph.releaseGroupToFilteredProjects,
            options.versionData
          )
        : [];
    handleDuplicateGitTags(gitTagValues);

    const commitMessageValues: string[] = createCommitMessageValues(
      options.releaseGraph.releaseGroups,
      options.releaseGraph.releaseGroupToFilteredProjects,
      options.versionData,
      options.gitCommitMessage ||
        this.config.changelog?.git?.commitMessage ||
        "release(monorepo): Publish workspace release updates"
    );

    const changes = this.tree.listChanges();
    if (!changes.length) {
      writeWarning(
        "No changes were detected for any changelog files, so no changelog entries will be generated.",
        this.workspaceConfig
      );

      if (!postGitTasks.length) {
        // No post git tasks (e.g. remote release creation) to perform so we can just exit
        return;
      }

      for (const postGitTask of postGitTasks) {
        await postGitTask(latestCommit);
      }

      return;
    }

    const changedFiles: string[] = changes.map(f => f.path);
    await commitChanges({
      changedFiles,
      deletedFiles: [],
      isDryRun: !!options.dryRun,
      isVerbose: !!options.verbose,
      gitCommitMessages: commitMessageValues,
      gitCommitArgs:
        options.gitCommitArgs || this.config.changelog?.git?.commitArgs
    });

    // Resolve the commit we just made
    latestCommit = await getCommitHash("HEAD");

    writeDebug(
      `Creating git tags: ${gitTagValues.join(", ")}`,
      this.workspaceConfig
    );

    for (const tag of gitTagValues) {
      await gitTag({
        tag,
        message:
          options.gitTagMessage || this.config.changelog?.git?.tagMessage,
        additionalArgs:
          options.gitTagArgs || this.config.changelog?.git?.tagArgs,
        dryRun: options.dryRun,
        verbose: options.verbose
      });
    }

    if (options.gitPush ?? this.config.changelog?.git?.push) {
      writeDebug(
        `Pushing to git remote "${options.gitRemote ?? "origin"}"`,
        this.workspaceConfig
      );

      await gitPush({
        gitRemote: options.gitRemote,
        dryRun: options.dryRun,
        verbose: options.verbose,
        additionalArgs:
          options.gitPushArgs || this.config.changelog?.git?.pushArgs
      });
    }

    // Run any post-git tasks in series
    for (const postGitTask of postGitTasks) {
      await postGitTask(latestCommit);
    }

    return;
  };
}
