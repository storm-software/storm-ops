import { createNxReleaseConfig } from "nx/src/command-line/release/config/config";
import {
  releaseChangelog,
  releasePublish,
  releaseVersion
} from "nx/src/command-line/release/index.js";
import { readNxJson } from "nx/src/config/nx-json";
import { createProjectGraphAsync } from "nx/src/project-graph/project-graph";
import { type StormConfig, writeInfo } from "@storm-software/config-tools";

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
  const authorName = process.env.GITHUB_ACTOR
    ? process.env.GITHUB_ACTOR
    : process.env.STORM_WORKER
      ? process.env.STORM_WORKER
      : process.env.STORM_OWNER;
  const committerName = process.env.STORM_WORKER
    ? process.env.STORM_WORKER
    : process.env.STORM_OWNER;

  process.env.GIT_AUTHOR_NAME = authorName;
  process.env.GIT_AUTHOR_EMAIL = `${authorName}@users.noreply.github.com`;
  process.env.GIT_COMMITTER_NAME = committerName;
  process.env.GIT_COMMITTER_EMAIL = `${committerName}@users.noreply.github.com`;

  const projectGraph = await createProjectGraphAsync({ exitOnError: true });
  const nxJson = readNxJson();
  const { error: configError /*, nxReleaseConfig*/ } = await createNxReleaseConfig(
    projectGraph,
    nxJson.release,
    "nx-release-publish"
  );
  if (configError) {
    throw new Error(
      `An error occured determining the release configuration: (${configError.code}) ${configError.data}`
    );
  }

  writeInfo(config, "Determining the current release version...");

  const { workspaceVersion, projectsVersionData } = await releaseVersion({
    dryRun: !!options.dryRun,
    verbose: !config.ci,
    preid: config.preMajor ? "canary" : undefined,
    stageChanges: true,
    gitCommit: false,
    gitCommitMessage: `chore(${options.project ? options.project : "repo"}): Release\${version} [skip ci]

\${notes}`
  });

  writeInfo(config, "Generating the release changelog...");

  await releaseChangelog({
    version: workspaceVersion,
    versionData: projectsVersionData,
    dryRun: !!options.dryRun,
    verbose: !config.ci,
    to: options.head,
    from: options.base,
    gitRemote: "origin",
    gitCommit: true,
    workspaceChangelog: workspaceVersion !== undefined
  });

  writeInfo(config, "Publishing the release...");

  await releasePublish({
    dryRun: !!options.dryRun,
    verbose: true
  });
};
