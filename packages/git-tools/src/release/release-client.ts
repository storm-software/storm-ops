import { StormWorkspaceConfig } from "@storm-software/config";
import { getWorkspaceConfig } from "@storm-software/config-tools/get-config";
import { writeInfo } from "@storm-software/config-tools/logger/console";
import defu from "defu";
import { ReleaseClient } from "nx/release";
import { GithubRemoteReleaseClient } from "nx/src/command-line/release/utils/remote-release-clients/github";
import { NxReleaseChangelogConfiguration } from "nx/src/config/nx-json";
import { ReleaseConfig } from "../types";
import { omit } from "../utilities/omit";
import StormChangelogRenderer from "./changelog-renderer";
import { DEFAULT_RELEASE_CONFIG, DEFAULT_RELEASE_GROUP_CONFIG } from "./config";
import { createGithubRemoteReleaseClient } from "./github";

/**
 * Extended {@link ReleaseClient} with Storm Software specific release APIs
 */
export class StormReleaseClient extends ReleaseClient {
  public static async create(
    releaseConfig: Partial<ReleaseConfig> = DEFAULT_RELEASE_CONFIG,
    ignoreNxJsonConfig = false,
    workspaceConfig?: StormWorkspaceConfig
  ) {
    if (!workspaceConfig) {
      workspaceConfig = await getWorkspaceConfig();
    }

    const remoteReleaseClient =
      await createGithubRemoteReleaseClient(workspaceConfig);

    return new StormReleaseClient(
      releaseConfig,
      ignoreNxJsonConfig,
      remoteReleaseClient,
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
    remoteReleaseClient: GithubRemoteReleaseClient,
    workspaceConfig: StormWorkspaceConfig
  ) {
    const config = defu(
      Object.fromEntries(
        Object.entries(
          releaseConfig.groups || DEFAULT_RELEASE_CONFIG.groups
        ).map(([name, group]) => [
          name,
          defu(
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
                  workspaceConfig,
                  remoteReleaseClient
                }
              }
            }
          )
        ])
      ),
      omit(releaseConfig, ["groups"]),
      omit(DEFAULT_RELEASE_CONFIG, ["groups"])
    );

    super(config, ignoreNxJsonConfig);

    writeInfo(
      "Executing release with the following configuration",
      workspaceConfig
    );
    writeInfo(config, workspaceConfig);
  }
}
