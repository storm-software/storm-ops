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
import {
  createAPI as createReleaseChangelogAPI,
  NxReleaseChangelogResult,
  PostGitTask
} from "nx/src/command-line/release/changelog";
import { ChangelogOptions as NxChangelogOptions } from "nx/src/command-line/release/command-object";
import { getCommitHash, gitPush } from "nx/src/command-line/release/utils/git";
import { printAndFlushChanges } from "nx/src/command-line/release/utils/print-changes";
import {
  createCommitMessageValues,
  handleDuplicateGitTags,
  noDiffInChangelogMessage
} from "nx/src/command-line/release/utils/shared";
import {
  NxJsonConfiguration,
  NxReleaseChangelogConfiguration,
  readNxJson
} from "nx/src/config/nx-json";
import { FsTree } from "nx/src/generators/tree";
import { ReleaseConfig, ReleaseGroupConfig } from "../types";
import { generateChangelogContent } from "../utilities/changelog-utils";
import {
  commitChanges,
  createGitTagValues,
  gitTag
} from "../utilities/git-utils";
import { omit } from "../utilities/omit";
import StormChangelogRenderer from "./changelog-renderer";
import { DEFAULT_RELEASE_CONFIG, DEFAULT_RELEASE_GROUP_CONFIG } from "./config";

export type ChangelogOptions = Omit<
  NxChangelogOptions,
  "versionData" | "releaseGraph"
> &
  Required<Pick<NxChangelogOptions, "versionData" | "releaseGraph">>;

function getReleaseGroupConfig(
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
              ...omit(DEFAULT_RELEASE_GROUP_CONFIG, ["changelog"]),
              ...group
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

  #releaseChangelog: ReturnType<typeof createReleaseChangelogAPI>;

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
        groups: getReleaseGroupConfig(nxJson.release ?? {}, workspaceConfig)
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

    this.#releaseChangelog = createReleaseChangelogAPI(config, true);

    this.projectConfigurations =
      readProjectsConfigurationFromProjectGraph(projectGraph);
  }

  public override releaseChangelog = async (options: ChangelogOptions) => {
    const result = await this.#releaseChangelog({
      ...options,
      gitCommit: false,
      gitTag: false
    });

    if (result.projectChangelogs) {
      await Promise.all(
        Object.entries(result.projectChangelogs).map(
          async ([project, changelog]) => {
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
          }
        )
      );

      this.applyChangesAndExit(options, result);
    }

    return result;
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
    result: NxReleaseChangelogResult
  ) => {
    const postGitTasks = Object.values(result.projectChangelogs || {})
      .map(project => project.postGitTask)
      .filter(Boolean) as PostGitTask[];

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
