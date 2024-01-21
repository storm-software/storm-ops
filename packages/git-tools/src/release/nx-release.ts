import { type StormConfig, writeDebug } from "@storm-software/config-tools";
import {
  releaseChangelog,
  releasePublish,
  releaseVersion
} from "nx/src/command-line/release/index.js";

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

  writeDebug(config, "Determining the current release version...");

  const { workspaceVersion, projectsVersionData } = await releaseVersion({
    dryRun: !!options.dryRun,
    verbose: !config.ci,
    preid: config.preMajor ? "canary" : undefined,
    stageChanges: true,
    gitCommit: false,
    gitCommitMessage: `chore(${options.project ? options.project : "repo"}): Release\${version} [skip ci]

\${notes}`,
    gitTag: true
  });

  writeDebug(config, "Generating the release changelog...");

  await releaseChangelog({
    version: workspaceVersion,
    versionData: projectsVersionData,
    dryRun: !!options.dryRun,
    verbose: !config.ci,
    to: options.head,
    from: options.base,
    gitRemote: config.repository,
    gitCommit: true,
    workspaceChangelog: workspaceVersion !== undefined
  });

  writeDebug(config, "Publishing the release...");

  await releasePublish({
    dryRun: !!options.dryRun,
    verbose: true
  });
};
