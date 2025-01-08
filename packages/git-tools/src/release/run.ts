import type { StormConfig } from "@storm-software/config";
import {
  isVerbose,
  writeDebug,
  writeError,
  writeFatal,
  writeInfo,
  writeSuccess,
  writeWarning
} from "@storm-software/config-tools";
import defu from "defu";
import { createAPI as createReleaseChangelogAPI } from "nx/src/command-line/release/changelog.js";
import type { ReleaseOptions } from "nx/src/command-line/release/command-object.js";
import { createAPI as createReleasePublishAPI } from "nx/src/command-line/release/publish.js";
import type { ReleaseVersion } from "nx/src/command-line/release/utils/shared.js";
import { NxReleaseConfiguration, readNxJson } from "nx/src/config/nx-json.js";
import { createProjectGraphAsync } from "nx/src/project-graph/project-graph.js";
import { DEFAULT_RELEASE_CONFIG, DEFAULT_RELEASE_GROUP_CONFIG } from "./config";
import { releaseVersion } from "./nx-version";

export interface NxReleaseChangelogResult {
  workspaceChangelog?: {
    releaseVersion: ReleaseVersion;
    contents: string;
  };
  projectChangelogs?: {
    [projectName: string]: {
      releaseVersion: ReleaseVersion;
      contents: string;
    };
  };
}

export type StormReleaseOptions = ReleaseOptions & {
  project?: string;
  head?: string;
  base?: string;
  dryRun?: boolean;
};

export const runRelease = async (
  config: StormConfig,
  options: StormReleaseOptions
) => {
  try {
    process.env.GIT_AUTHOR_NAME = process.env.GITHUB_ACTOR;
    process.env.GIT_AUTHOR_EMAIL = `${process.env.GITHUB_ACTOR}@users.noreply.github.com`;

    process.env.GIT_COMMITTER_NAME = config.bot.name;
    process.env.GIT_COMMITTER_EMAIL = `${config.bot.name}@users.noreply.github.com`;

    process.env.NODE_AUTH_TOKEN = process.env.NPM_TOKEN;
    process.env.NPM_AUTH_TOKEN = process.env.NPM_TOKEN;
    process.env.NPM_CONFIG_PROVENANCE = "true";

    writeDebug("Creating workspace Project Graph data...", config);

    const projectGraph = await createProjectGraphAsync({ exitOnError: true });
    const nxJson = readNxJson();

    writeDebug("Reading in the workspaces release configuration", config);
    //     const { error: configError, nxReleaseConfig } = await createNxReleaseConfig(
    //       projectGraph,
    //       await createProjectFileMapUsingProjectGraph(projectGraph),
    //       defu(nxJson.release, DEFAULT_RELEASE_CONFIG)
    //     );
    //     if (configError) {
    //       throw new Error(
    //         `An error occured determining the release configuration (Error Code: ${
    //           configError.code
    //         }):
    // ${JSON.stringify(configError.data)}

    // Exiting without completing release publish.
    //         `
    //       );
    //     }

    if (nxJson.release?.groups) {
      nxJson.release.groups = Object.keys(nxJson.release.groups).reduce(
        (ret, groupName) => {
          const groupConfig = nxJson.release!.groups![groupName];

          ret[groupName] = defu(groupConfig, DEFAULT_RELEASE_GROUP_CONFIG);
          return ret;
        },
        {}
      );
    }

    const nxReleaseConfig = defu(
      nxJson.release,
      DEFAULT_RELEASE_CONFIG
    ) as NxReleaseConfiguration;

    writeInfo(
      "Using the following `nx.json` release configuration values",
      config
    );
    writeInfo(nxReleaseConfig, config);

    // Apply default configuration to any optional user configuration
    // const { error: configError, nxReleaseConfig } = await createNxReleaseConfig(
    //   projectGraph,
    //   await createProjectFileMapUsingProjectGraph(projectGraph),
    //   nxJson.release
    // );
    // if (configError) {
    //   return await handleNxReleaseConfigError(configError);
    // }
    // if (!nxReleaseConfig) {
    //   throw new Error("No release configuration was found in the workspace.");
    // }

    const releaseChangelog = createReleaseChangelogAPI(nxReleaseConfig);
    const releasePublish = createReleasePublishAPI(nxReleaseConfig);

    writeDebug("Determining the current release versions...", config);

    const { workspaceVersion, projectsVersionData } = await releaseVersion(
      config,
      {
        dryRun: false,
        verbose: isVerbose(config.logLevel),
        preid: config.preid,
        deleteVersionPlans: false,
        stageChanges: true,
        gitCommit: false,
        gitTag: false
      }
    );

    await releaseChangelog({
      ...options,
      version:
        nxReleaseConfig?.projectsRelationship !== "fixed"
          ? undefined
          : workspaceVersion,
      versionData: projectsVersionData,
      dryRun: false,
      verbose: isVerbose(config.logLevel),
      to: options.head ?? process.env.NX_HEAD,
      from: options.base ?? process.env.NX_BASE,
      gitCommit: true,
      gitCommitMessage: "release(monorepo): Publish workspace release updates"
    });

    writeDebug("Tagging commit with git", config);

    if (options.skipPublish) {
      writeWarning(
        "Skipping publishing packages since `skipPublish` was provided as `true` in the release options.",
        config
      );
    } else {
      const changedProjects = Object.keys(projectsVersionData).filter(
        key => projectsVersionData[key]?.newVersion
      );
      if (changedProjects.length > 0) {
        writeInfo(
          `Publishing release for ${changedProjects.length} ${changedProjects.length === 1 ? "project" : "projects"}:
${changedProjects.map(changedProject => `  - ${changedProject}`).join("\n")}
`,
          config
        );

        const result = await releasePublish({
          ...options,
          dryRun: !!options.dryRun,
          verbose: isVerbose(config.logLevel)
        });

        const failedProjects = Object.keys(result).filter(
          key => result[key]?.code && result[key]?.code > 0
        );
        if (failedProjects.length > 0) {
          throw new Error(
            `The Storm release process was not completed successfully! One or more errors occured while running the \`nx-release-publish\` executor tasks.

Please review the workflow details for the following project(s):
${failedProjects.map(failedProject => `  - ${failedProject} (Error Code: ${result[failedProject]?.code})`).join("\n")}
`
          );
        }
      } else {
        writeWarning("Skipped publishing packages.", config);
      }
    }

    writeSuccess("Completed the Storm workspace release process!", config);
  } catch (error) {
    writeFatal(
      "An exception was thrown while running the Storm release workflow.",
      config
    );
    error.message &&
      writeError(
        `${error.name ? `${error.name}: ` : ""}${error.message}${
          error.stack ? `\n${error.stack}` : ""
        }`,
        config
      );

    throw error;
  }
};
