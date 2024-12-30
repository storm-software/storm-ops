import type { StormConfig } from "@storm-software/config";
import {
  writeError,
  writeFatal,
  writeInfo,
  writeSuccess,
  writeWarning
} from "@storm-software/config-tools";
import {
  releaseChangelog,
  releasePublish
} from "nx/src/command-line/release/index.js";
import type { ReleaseVersion } from "nx/src/command-line/release/utils/shared.js";
import { readNxJson } from "nx/src/config/nx-json.js";
import { createProjectFileMapUsingProjectGraph } from "nx/src/project-graph/file-map-utils.js";
import { createProjectGraphAsync } from "nx/src/project-graph/project-graph.js";
import { releaseVersion } from "./nx-version";
import { createNxReleaseConfig } from "./release-config";

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

export const runRelease = async (
  config: StormConfig,
  options: {
    project?: string;
    firstRelease?: boolean;
    head?: string;
    base?: string;
    dryRun?: boolean;
  }
) => {
  try {
    const authorName = process.env.GITHUB_ACTOR
      ? process.env.GITHUB_ACTOR
      : process.env.STORM_BOT
        ? process.env.STORM_BOT
        : process.env.STORM_OWNER;
    const committerName = process.env.STORM_BOT
      ? process.env.STORM_BOT
      : process.env.STORM_OWNER;

    process.env.GIT_AUTHOR_NAME = authorName;
    process.env.GIT_AUTHOR_EMAIL = `${authorName}@users.noreply.github.com`;
    process.env.GIT_COMMITTER_NAME = committerName;
    process.env.GIT_COMMITTER_EMAIL = `${committerName}@users.noreply.github.com`;

    process.env.NPM_AUTH_TOKEN = process.env.NPM_TOKEN;
    process.env.NODE_AUTH_TOKEN = process.env.NPM_TOKEN;
    process.env.NPM_CONFIG_PROVENANCE = "true";

    writeInfo("Creating workspace Project Graph data...", config);

    const projectGraph = await createProjectGraphAsync({ exitOnError: true });
    const nxJson = readNxJson();

    writeInfo(
      "Reading in the workspaces release configuration from the nx.json file...",
      config
    );
    const { error: configError, nxReleaseConfig } = await createNxReleaseConfig(
      projectGraph,
      await createProjectFileMapUsingProjectGraph(projectGraph),
      nxJson.release
    );
    if (configError) {
      throw new Error(
        `An error occured determining the release configuration: (${
          configError.code
        }) ${JSON.stringify(configError.data)}`
      );
    }

    writeInfo("Determining the current release versions...", config);

    const { workspaceVersion, projectsVersionData } = await releaseVersion(
      config,
      {
        dryRun: false,
        verbose: true,
        preid: config.preid,
        stageChanges: true,
        gitCommit: false,
        gitTag: false
      }
    );

    await releaseChangelog({
      version:
        nxReleaseConfig?.projectsRelationship !== "fixed"
          ? undefined
          : workspaceVersion,
      versionData: projectsVersionData,
      dryRun: false,
      verbose: true,
      to: options.head ?? process.env.NX_HEAD,
      from: options.base ?? process.env.NX_BASE,
      gitCommit: true,
      gitCommitMessage: "chore(release): Publish monorepo release updates",
      createRelease: "github"
    });

    writeInfo("Tagging commit with git", config);

    if (
      Object.values(projectsVersionData).some(
        version => version.newVersion !== null
      )
    ) {
      writeInfo("Publishing the release...", config);
      await releasePublish({
        dryRun: !!options.dryRun,
        verbose: true
      });
    } else {
      writeWarning("Skipped publishing packages.", config);
    }

    writeSuccess("Completed the release process!", config);
  } catch (error) {
    writeFatal(
      "An exception was thrown while running the release version command.",
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
