import {
  createProjectGraphAsync,
  output,
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
import { readFile } from "node:fs/promises";
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
import { printAndFlushChanges } from "nx/src/command-line/release/utils/print-changes";
import {
  createCommitMessageValues,
  handleDuplicateGitTags,
  noDiffInChangelogMessage
} from "nx/src/command-line/release/utils/shared";
import { NxJsonConfiguration, readNxJson } from "nx/src/config/nx-json";
import { FsTree } from "nx/src/generators/tree";
import { createFileMapUsingProjectGraph } from "nx/src/project-graph/file-map-utils";
import { ReleaseConfig } from "../types";
import {
  filterHiddenChanges,
  generateChangelogContent,
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

          projectChangelogs = await generateChangelogForProjects({
            tree: this.tree,
            args: options,
            changes,
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

        projectChangelogs = await generateChangelogForProjects({
          tree: this.tree,
          args: options,
          changes,
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

    if (projectChangelogs) {
      await Promise.all(
        Object.entries(projectChangelogs).map(async ([project, changelog]) => {
          if (!this.projectGraph.nodes[project]?.data.root) {
            writeWarning(
              `A changelog was generated for ${
                project
              }, but it could not be found in the project graph. Skipping writing changelog file.`,
              this.workspaceConfig
            );
          } else if (changelog.contents) {
            const filePath = joinPaths(
              this.projectGraph.nodes[project].data.root,
              "CHANGELOG.md"
            );

            let currentContent: string | undefined;
            if (existsSync(filePath)) {
              currentContent = await readFile(filePath, "utf8");
            }

            writeDebug(
              `✍️  Writing changelog for project ${project} to ${filePath}`,
              this.workspaceConfig
            );

            const content = await generateChangelogContent(
              changelog.releaseVersion,
              filePath,
              changelog.contents,
              currentContent,
              project,
              this.workspaceConfig
            );

            this.tree.write(filePath, content);

            printAndFlushChanges(
              this.tree,
              !!options.dryRun,
              3,
              false,
              noDiffInChangelogMessage,
              // Only print the change for the current changelog file at this point
              f => f.path === filePath
            );
          }
        })
      );

      this.applyChangesAndExit(options, postGitTasks);
    }

    return {
      workspaceChangelog: undefined,
      projectChangelogs: allProjectChangelogs
    };
  };

  protected checkChangelogFilesEnabled(): boolean {
    if (
      this.config.changelog?.workspaceChangelog &&
      (this.config.changelog?.workspaceChangelog === true ||
        this.config.changelog?.workspaceChangelog.file)
    ) {
      return true;
    }
    for (const releaseGroup of Object.values(this.config.groups)) {
      if (
        releaseGroup.changelog &&
        releaseGroup.changelog !== true &&
        releaseGroup.changelog.file
      ) {
        return true;
      }
    }
    return false;
  }

  protected isCI = () => {
    if (process.env.CI === "false") {
      return false;
    }
    return (
      process.env.CI ||
      process.env.TF_BUILD === "true" ||
      process.env.GITHUB_ACTIONS === "true" ||
      process.env.BUILDKITE === "true" ||
      process.env.CIRCLECI === "true" ||
      process.env.CIRRUS_CI === "true" ||
      process.env.TRAVIS === "true" ||
      !!process.env["bamboo.buildKey"] ||
      !!process.env["bamboo_buildKey"] ||
      !!process.env.CODEBUILD_BUILD_ID ||
      !!process.env.GITLAB_CI ||
      !!process.env.HEROKU_TEST_RUN_ID ||
      !!process.env.BUILD_ID ||
      !!process.env.BUILD_NUMBER ||
      !!process.env.BUILD_BUILDID ||
      !!process.env.TEAMCITY_VERSION ||
      !!process.env.JENKINS_URL ||
      !!process.env.HUDSON_URL
    );
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

    /**
     * In the case where we are expecting changelog file updates, but there is nothing
     * to flush from the tree, we exit early. This could happen we using conventional
     * commits, for example.
     */
    if (this.checkChangelogFilesEnabled() && !changes.length) {
      output.warn({
        title: `No changes detected for changelogs`,
        bodyLines: [
          `No changes were detected for any changelog files, so no changelog entries will be generated.`
        ]
      });

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

    // Generate a new commit for the changes, if configured to do so

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

    // Generate a one or more git tags for the changes, if configured to do so
    output.logSingleLine(`Tagging commit with git`);
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
      output.logSingleLine(
        `Pushing to git remote "${options.gitRemote ?? "origin"}"`
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
