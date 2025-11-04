import { StormWorkspaceConfig } from "@storm-software/config";
import { joinPaths } from "@storm-software/config-tools";
import { getWorkspaceConfig } from "@storm-software/config-tools/get-config";
import { writeInfo } from "@storm-software/config-tools/logger/console";
import defu from "defu";
import { existsSync } from "node:fs";
import { ReleaseClient } from "nx/release";
import {
  NxJsonConfiguration,
  NxReleaseChangelogConfiguration,
  readNxJson
} from "nx/src/config/nx-json";
import { ReleaseConfig, ReleaseGroupConfig } from "../types";
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

    return new StormReleaseClient(
      releaseConfig,
      ignoreNxJsonConfig,
      workspaceConfig
    );
  }

  /**
   *  Creates an instance of {@link StormReleaseClient}.
   *
   * @param releaseConfig - Release configuration to use for the current release client. By default, it will be combined with any configuration in `nx.json`, but you can choose to use it as the sole source of truth by setting {@link ignoreNxJsonConfig} to true.
   * @param ignoreNxJsonConfig - Whether to ignore the nx.json configuration and use only the provided {@link releaseConfig}. Default is false.
   * @param workspaceConfig - Optional Storm workspace configuration object for logging purposes.
   */
  protected constructor(
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

    writeInfo(
      "Executing release with the following configuration",
      workspaceConfig
    );
    writeInfo(config, workspaceConfig);
  }
}
