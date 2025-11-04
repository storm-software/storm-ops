import {
  createProjectGraphAsync,
  ProjectGraph,
  ProjectsConfigurations,
  readCachedProjectGraph,
  readProjectsConfigurationFromProjectGraph
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
import { createAPI as createReleaseChangelogAPI } from "nx/src/command-line/release/changelog";
import { ChangelogOptions } from "nx/src/command-line/release/command-object";
import {
  NxJsonConfiguration,
  NxReleaseChangelogConfiguration,
  readNxJson
} from "nx/src/config/nx-json";
import { ReleaseConfig, ReleaseGroupConfig } from "../types";
import { generateChangelogContent } from "../utilities/changelog-utils";
import { omit } from "../utilities/omit";
import StormChangelogRenderer from "./changelog-renderer";
import { DEFAULT_RELEASE_CONFIG, DEFAULT_RELEASE_GROUP_CONFIG } from "./config";

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
    this.#releaseChangelog = createReleaseChangelogAPI(config, true);

    this.projectConfigurations =
      readProjectsConfigurationFromProjectGraph(projectGraph);
  }

  public override releaseChangelog = async (options: ChangelogOptions) => {
    const result = await this.#releaseChangelog(options);

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

              await generateChangelogContent(
                changelog.releaseVersion,
                filePath,
                changelog.contents,
                currentContent,
                project,
                this.workspaceConfig
              );
            }
          }
        )
      );
    }

    return result;
  };
}
