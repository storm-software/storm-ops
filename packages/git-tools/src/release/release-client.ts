import {
  createProjectGraphAsync,
  ProjectGraph,
  ProjectsConfigurations,
  readProjectsConfigurationFromProjectGraph,
  Tree
} from "@nx/devkit";
import { StormWorkspaceConfig } from "@storm-software/config";
import { isVerbose, runAsync } from "@storm-software/config-tools";
import { getWorkspaceConfig } from "@storm-software/config-tools/get-config";
import {
  writeDebug,
  writeWarning
} from "@storm-software/config-tools/logger/console";
import { ReleaseClient } from "nx/release";
import { DependencyBump } from "nx/release/changelog-renderer";
import {
  ChangelogChange,
  NxReleaseChangelogResult,
  PostGitTask
} from "nx/src/command-line/release/changelog";
import {
  ChangelogOptions as NxChangelogOptions,
  VersionOptions
} from "nx/src/command-line/release/command-object";
import { NxReleaseConfig } from "nx/src/command-line/release/config/config";
import {
  readRawVersionPlans,
  setResolvedVersionPlansOnGroups
} from "nx/src/command-line/release/config/version-plans";
import {
  getCommitHash,
  getFirstGitCommit,
  getLatestGitTagForPattern,
  gitAdd,
  GitCommit,
  gitPush
} from "nx/src/command-line/release/utils/git";
import { printAndFlushChanges } from "nx/src/command-line/release/utils/print-changes.js";
import {
  createReleaseGraph,
  ReleaseGraph
} from "nx/src/command-line/release/utils/release-graph";
import {
  createCommitMessageValues,
  createGitTagValues,
  handleDuplicateGitTags
} from "nx/src/command-line/release/utils/shared";
import { validateResolvedVersionPlansAgainstFilter } from "nx/src/command-line/release/utils/version-plan-utils";
import { NxReleaseVersionResult } from "nx/src/command-line/release/version";
import { NxReleaseVersionConfiguration } from "nx/src/config/nx-json";
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
  extractPreid,
  filterProjectCommits,
  getCommits,
  getProjectsAffectedByCommit,
  gitTag
} from "../utilities/git-utils";
import { formatNxLog } from "../utilities/logs";
import { formatChangedFiles } from "../utilities/prettier";
import StormChangelogRenderer from "./changelog-renderer";
import { DEFAULT_COMMIT_MESSAGE, getReleaseConfig } from "./config";
import { StormReleaseGroupProcessor } from "./release-group-processor";

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

    const projectGraph = await createProjectGraphAsync({
      exitOnError: true,
      resetDaemonClient: true
    });
    if (!projectGraph) {
      throw new Error(
        "Failed to load the project graph. Please run `nx reset`, then run the `storm-git commit` command again."
      );
    }

    return new StormReleaseClient(
      projectGraph,
      getReleaseConfig(
        projectGraph,
        releaseConfig,
        workspaceConfig,
        ignoreNxJsonConfig
      ),
      workspaceConfig
    );
  }

  /**
   * The normalized release configuration used by this release client.
   */
  protected releaseConfig: NxReleaseConfig;

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
    releaseConfig: NxReleaseConfig,
    workspaceConfig: StormWorkspaceConfig
  ) {
    super(releaseConfig, true);

    writeDebug(
      "Executing release with the following configuration",
      workspaceConfig
    );
    writeDebug(releaseConfig, workspaceConfig);

    this.projectGraph = projectGraph;
    this.releaseConfig = releaseConfig;
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

    // Use pre-built release graph if provided, otherwise create a new one
    const releaseGraph: ReleaseGraph =
      options.releaseGraph ??
      (await createReleaseGraph({
        tree: this.tree,
        projectGraph: this.projectGraph,
        nxReleaseConfig: this.releaseConfig,
        filters: {
          projects: options.projects,
          groups: options.groups
        },
        firstRelease: !!options.firstRelease,
        verbose: isVerbose(this.workspaceConfig.logLevel)
      }));

    /**
     * Compute any additional dependency bumps up front because there could be cases of circular dependencies,
     * and figuring them out during the main iteration would be too late.
     */
    const projectToAdditionalDependencyBumps = new Map<
      string,
      DependencyBump[]
    >();
    for (const releaseGroup of releaseGraph.releaseGroups) {
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

    for (const releaseGroup of releaseGraph.releaseGroups) {
      const config = releaseGroup.changelog;
      // The entire feature is disabled at the release group level, exit early
      if (config === false) {
        continue;
      }

      if (!releaseGraph.releaseGroupToFilteredProjects.has(releaseGroup)) {
        throw new Error(
          `No filtered projects found for release group ${releaseGroup.name}`
        );
      }

      const projects = options.projects?.length
        ? // If the user has passed a list of projects, we need to use the filtered list of projects within the release group, plus any dependents
          Array.from(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            releaseGraph.releaseGroupToFilteredProjects.get(releaseGroup)!
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
                releaseGraph.resolveRepositoryTags.bind(releaseGraph),
                {
                  checkAllBranchesWhen:
                    releaseGroup.releaseTag.checkAllBranchesWhen,
                  preid:
                    projectsPreid[project.name] || this.workspaceConfig.preid,
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
            this.releaseConfig.conventionalCommits
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
            releaseConfig: this.releaseConfig as ReleaseConfig,
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
              {
                releaseGroupName: releaseGroup.name
              },
              releaseGraph.resolveRepositoryTags.bind(releaseGraph),
              {
                checkAllBranchesWhen:
                  releaseGroup.releaseTag.checkAllBranchesWhen,
                preid:
                  Object.keys(projectsPreid)[0] &&
                  projectsPreid?.[Object.keys(projectsPreid)[0]!]
                    ? projectsPreid?.[Object.keys(projectsPreid)[0]!]
                    : this.workspaceConfig.preid,
                requireSemver: releaseGroup.releaseTag.requireSemver,
                strictPreid:
                  releaseGroup.releaseTag.strictPreid ||
                  this.workspaceConfig.preid !== undefined
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
          this.releaseConfig.conventionalCommits
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
          releaseConfig: this.releaseConfig as ReleaseConfig,
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

    const gitTagValues: string[] = createGitTagValues(
      options.releaseGraph.releaseGroups,
      options.releaseGraph.releaseGroupToFilteredProjects,
      options.versionData
    );
    handleDuplicateGitTags(gitTagValues);

    const commitMessageValues: string[] = createCommitMessageValues(
      options.releaseGraph.releaseGroups,
      options.releaseGraph.releaseGroupToFilteredProjects,
      options.versionData,
      options.gitCommitMessage ||
        this.releaseConfig.changelog?.git?.commitMessage ||
        DEFAULT_COMMIT_MESSAGE
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
        options.gitCommitArgs || this.releaseConfig.changelog?.git?.commitArgs
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
          options.gitTagMessage ||
          this.releaseConfig.changelog?.git?.tagMessage,
        additionalArgs:
          options.gitTagArgs || this.releaseConfig.changelog?.git?.tagArgs,
        dryRun: options.dryRun,
        verbose: options.verbose
      });
    }

    writeDebug(
      `Pushing to git remote "${options.gitRemote ?? "origin"}"`,
      this.workspaceConfig
    );

    await gitPush({
      gitRemote: options.gitRemote,
      dryRun: options.dryRun,
      verbose: options.verbose,
      additionalArgs:
        options.gitPushArgs || this.releaseConfig.changelog?.git?.pushArgs
    });

    // Run any post-git tasks in series
    for (const postGitTask of postGitTasks) {
      await postGitTask(latestCommit);
    }

    return;
  };

  public override releaseVersion = async (
    options: VersionOptions
  ): Promise<NxReleaseVersionResult> => {
    const verbose = options.verbose || isVerbose(this.workspaceConfig.logLevel);

    this.projectGraph = await createProjectGraphAsync({
      exitOnError: true,
      resetDaemonClient: true
    });
    if (!this.projectGraph) {
      throw new Error(
        "Failed to load the project graph. Please run `nx reset`, then run the `storm-git commit` command again."
      );
    }

    // Use pre-built release graph if provided, otherwise create a new one
    const releaseGraph: ReleaseGraph =
      options.releaseGraph ??
      (await createReleaseGraph({
        tree: this.tree,
        projectGraph: this.projectGraph,
        nxReleaseConfig: this.releaseConfig,
        filters: {
          projects: options.projects,
          groups: options.groups
        },
        firstRelease: !!options.firstRelease,
        verbose,
        preid: options.preid ?? this.workspaceConfig.preid,
        versionActionsOptionsOverrides: options.versionActionsOptionsOverrides
      }));

    // Display filter log if filters were applied
    if (
      releaseGraph.filterLog &&
      process.env.NX_RELEASE_INTERNAL_SUPPRESS_FILTER_LOG !== "true"
    ) {
      writeDebug(formatNxLog(releaseGraph.filterLog), this.workspaceConfig);
    }

    if (!options.specifier) {
      const rawVersionPlans = await readRawVersionPlans();
      await setResolvedVersionPlansOnGroups(
        rawVersionPlans,
        releaseGraph.releaseGroups,
        Object.keys(this.projectGraph.nodes),
        verbose
      );

      // Validate version plans against the filter after resolution
      const versionPlanValidationError =
        validateResolvedVersionPlansAgainstFilter(
          releaseGraph.releaseGroups,
          releaseGraph.releaseGroupToFilteredProjects
        );
      if (versionPlanValidationError) {
        throw new Error(formatNxLog(versionPlanValidationError));
      }
    } else {
      if (verbose && releaseGraph.releaseGroups.some(g => !!g.versionPlans)) {
        writeDebug(
          `Skipping version plan discovery as a specifier was provided`,
          this.workspaceConfig
        );
      }
    }

    if (options.deleteVersionPlans === undefined) {
      // default to not delete version plans after versioning as they may be needed for changelog generation
      options.deleteVersionPlans = false;
    }

    /**
     * Run any configured top level pre-version command
     */
    if (this.releaseConfig.version?.preVersionCommand) {
      writeDebug(
        "Executing the following pre-version command: \n" +
          this.releaseConfig.version.preVersionCommand,
        this.workspaceConfig
      );

      try {
        const childProcess = runAsync(
          this.workspaceConfig,
          this.releaseConfig.version.preVersionCommand,
          this.workspaceConfig.workspaceRoot,
          {
            ...process.env,
            NX_DRY_RUN: options.dryRun ? "true" : "false"
          }
        );
        if (options.verbose) {
          childProcess.stdout?.pipe(process.stdout);
          childProcess.stderr?.pipe(process.stderr);
        }

        await childProcess;
      } catch (e) {
        throw new Error(
          formatNxLog({
            title: `The pre-version command failed. See the full output above.`,
            bodyLines: [this.releaseConfig.version.preVersionCommand, e]
          })
        );
      }
    }

    /**
     * Run any configured pre-version command for the selected release groups
     * in topological order
     */
    for (const groupName of releaseGraph.sortedReleaseGroups) {
      const releaseGroup = releaseGraph.releaseGroups.find(
        g => g.name === groupName
      );
      if (!releaseGroup) {
        // Release group was filtered out, skip
        continue;
      }

      if (releaseGroup.version?.groupPreVersionCommand) {
        writeDebug(
          `Executing the ${releaseGroup.name} release group's pre-version command: \n` +
            releaseGroup.version?.groupPreVersionCommand,
          this.workspaceConfig
        );

        try {
          const childProcess = runAsync(
            this.workspaceConfig,
            releaseGroup.version?.groupPreVersionCommand,
            this.workspaceConfig.workspaceRoot,
            {
              ...process.env,
              NX_DRY_RUN: options.dryRun ? "true" : "false"
            }
          );
          if (options.verbose) {
            childProcess.stdout?.pipe(process.stdout);
            childProcess.stderr?.pipe(process.stderr);
          }

          await childProcess;
        } catch (e) {
          throw new Error(
            formatNxLog({
              title: `The ${releaseGroup.name} release group's pre-version command failed. See the full output above.`,
              bodyLines: [releaseGroup.version?.groupPreVersionCommand, e]
            })
          );
        }
      }
    }

    /**
     * Validate the resolved data for the release graph, e.g. that manifest files exist for all projects that will be processed.
     * This happens after preVersionCommands run, as those commands may create manifest files needed for versioning.
     */
    await releaseGraph.validate(this.tree);

    const commitMessage: string | undefined =
      options.gitCommitMessage ||
      this.releaseConfig.version?.git?.commitMessage;

    /**
     * additionalChangedFiles are files which need to be updated as a side-effect of versioning (such as package manager lock files),
     * and need to get staged and committed as part of the existing commit, if applicable.
     */
    const additionalChangedFiles = new Set<string>();
    const additionalDeletedFiles = new Set<string>();

    const processor = new StormReleaseGroupProcessor(
      this.tree,
      this.workspaceConfig,
      this.projectGraph,
      this.releaseConfig as NxReleaseConfig,
      releaseGraph,
      options
    );

    try {
      await processor.processGroups();

      // Delete processed version plan files if applicable
      if (options.deleteVersionPlans) {
        processor.deleteProcessedVersionPlanFiles();
      }
    } catch (err: any) {
      // Flush any pending project logs before printing the error to make troubleshooting easier
      processor.flushAllProjectLoggers();
      // Bubble up the error so that the CLI can print the error and exit, or the programmatic API can handle it
      throw err;
    }

    /**
     * Ensure that formatting is applied so that version bump diffs are as minimal as possible
     * within the context of the user's workspace.
     */
    await formatChangedFiles(this.tree);

    printAndFlushChanges(this.tree, !!options.dryRun);

    const { changedFiles: changed, deletedFiles: deleted } =
      await processor.afterAllProjectsVersioned({
        ...(this.releaseConfig.version as NxReleaseVersionConfiguration)
          .versionActionsOptions,
        ...(options.versionActionsOptionsOverrides ?? {})
      });
    changed.forEach(f => additionalChangedFiles.add(f));
    deleted.forEach(f => additionalDeletedFiles.add(f));

    // After all version actions have run, process docker projects as a layer above
    if (
      this.releaseConfig.docker &&
      typeof this.releaseConfig.docker === "object" &&
      this.releaseConfig.docker?.preVersionCommand
    ) {
      /**
       * Run any configured top level docker pre-version command
       */
      writeDebug(
        `Executing the docker pre-version command: \n` +
          this.releaseConfig.docker.preVersionCommand,
        this.workspaceConfig
      );

      try {
        const childProcess = runAsync(
          this.workspaceConfig,
          this.releaseConfig.docker.preVersionCommand,
          this.workspaceConfig.workspaceRoot,
          {
            ...process.env,
            NX_DRY_RUN: options.dryRun ? "true" : "false"
          }
        );
        if (options.verbose) {
          childProcess.stdout?.pipe(process.stdout);
          childProcess.stderr?.pipe(process.stderr);
        }

        await childProcess;
      } catch (e) {
        throw new Error(
          formatNxLog({
            title: `The docker pre-version command failed. See the full output above.`,
            bodyLines: [this.releaseConfig.docker.preVersionCommand, e]
          })
        );
      }
    }

    /**
     * Run any configured docker pre-version command for the selected release groups
     * in topological order (dependencies before dependents)
     */
    for (const groupName of releaseGraph.sortedReleaseGroups) {
      const releaseGroup = releaseGraph.releaseGroups.find(
        g => g.name === groupName
      );
      if (!releaseGroup) {
        // Release group was filtered out, skip
        continue;
      }
      if (releaseGroup.docker?.groupPreVersionCommand) {
        writeDebug(
          `Executing the ${releaseGroup.name} release group's docker pre-version command: \n` +
            releaseGroup.docker?.groupPreVersionCommand,
          this.workspaceConfig
        );

        try {
          const childProcess = runAsync(
            this.workspaceConfig,
            releaseGroup.docker?.groupPreVersionCommand,
            this.workspaceConfig.workspaceRoot,
            {
              ...process.env,
              NX_DRY_RUN: options.dryRun ? "true" : "false"
            }
          );
          if (options.verbose) {
            childProcess.stdout?.pipe(process.stdout);
            childProcess.stderr?.pipe(process.stderr);
          }

          await childProcess;
        } catch (e) {
          throw new Error(
            formatNxLog({
              title: `The ${releaseGroup.name} release group's docker pre-version command failed. See the full output above.`,
              bodyLines: [releaseGroup.docker?.groupPreVersionCommand, e]
            })
          );
        }
      }
    }

    if (
      this.releaseConfig.docker ||
      releaseGraph.releaseGroups.some(rg => rg.docker)
    ) {
      writeWarning(
        formatNxLog({
          title: "Warning",
          bodyLines: [
            `Docker support is experimental. Breaking changes may occur and not adhere to semver versioning.`
          ]
        })
      );
    }
    await processor.processDockerProjects(
      options.dockerVersionScheme,
      options.dockerVersion
    );

    const versionData = processor.getVersionData();

    // Resolve any git tags as early as possible so that we can hard error in case of any duplicates before reaching the actual git command
    const gitTagValues: string[] =
      (options.gitTag ?? this.releaseConfig.version?.git?.tag)
        ? createGitTagValues(
            releaseGraph.releaseGroups,
            releaseGraph.releaseGroupToFilteredProjects,
            versionData
          )
        : [];
    handleDuplicateGitTags(gitTagValues);

    // Only applicable when there is a single release group with a fixed relationship
    let workspaceVersion: string | null | undefined = undefined;
    if (releaseGraph.releaseGroups.length === 1) {
      const releaseGroup = releaseGraph.releaseGroups[0];
      if (releaseGroup?.projectsRelationship === "fixed") {
        const releaseGroupProjectNames = Array.from(
          releaseGraph.releaseGroupToFilteredProjects.get(releaseGroup)!
        );
        workspaceVersion =
          versionData[releaseGroupProjectNames[0]!]!.newVersion; // all projects have the same version so we can just grab the first
      }
    }

    const changedFiles = [
      ...this.tree.listChanges().map(f => f.path),
      ...additionalChangedFiles
    ];
    const deletedFiles = Array.from(additionalDeletedFiles);

    // No further actions are necessary in this scenario (e.g. if conventional commits detected no changes)
    if (!changedFiles.length && !deletedFiles.length) {
      return {
        workspaceVersion,
        projectsVersionData: versionData,
        releaseGraph
      };
    }

    if (options.gitCommit ?? this.releaseConfig.version?.git?.commit) {
      await commitChanges({
        changedFiles,
        deletedFiles,
        isDryRun: !!options.dryRun,
        isVerbose: !!options.verbose,
        gitCommitMessages: createCommitMessageValues(
          releaseGraph.releaseGroups,
          releaseGraph.releaseGroupToFilteredProjects,
          versionData,
          commitMessage!
        ),
        gitCommitArgs:
          options.gitCommitArgs || this.releaseConfig.version?.git?.commitArgs
      });
    } else if (
      options.stageChanges ??
      this.releaseConfig.version?.git?.stageChanges
    ) {
      writeDebug(`Staging changed files with git`);
      await gitAdd({
        changedFiles,
        deletedFiles,
        dryRun: options.dryRun,
        verbose
      });
    }

    if (options.gitTag ?? this.releaseConfig.version?.git?.tag) {
      writeDebug(`Tagging commit with git`);
      for (const tag of gitTagValues) {
        await gitTag({
          tag,
          message:
            options.gitTagMessage ||
            this.releaseConfig.version?.git?.tagMessage,
          additionalArgs:
            options.gitTagArgs || this.releaseConfig.version?.git?.tagArgs,
          dryRun: options.dryRun,
          verbose: options.verbose
        });
      }
    }

    if (options.gitPush ?? this.releaseConfig.version?.git?.push) {
      writeDebug(`Pushing to git remote "${options.gitRemote ?? "origin"}"`);
      await gitPush({
        gitRemote: options.gitRemote,
        dryRun: options.dryRun,
        verbose: options.verbose,
        additionalArgs:
          options.gitPushArgs || this.releaseConfig.version?.git?.pushArgs
      });
    }

    return {
      workspaceVersion,
      projectsVersionData: versionData,
      releaseGraph
    };
  };
}
