import type { StormConfig } from "@storm-software/config-tools";
import { releaseChangelog, releasePublish, releaseVersion } from "nx/src/command-line/release";

export const runRelease = async (
  config: StormConfig,
  options: {
    project?: string;
    firstRelease?: boolean;
    head?: string;
    dryRun?: boolean;
  }
) => {
  const { workspaceVersion, projectsVersionData } = await releaseVersion({
    dryRun: !!options.dryRun,
    verbose: !config.ci,
    preid: config.preMajor ? "next" : undefined,
    stageChanges: true,
    gitCommit: true,
    gitCommitMessage: `chore(${options.project ? options.project : "repo"}): Release\${version} [skip ci]

\${notes}`,
    gitTag: true
  });

  await releaseChangelog({
    version: workspaceVersion,
    versionData: projectsVersionData,
    dryRun: !!options.dryRun,
    verbose: !config.ci,
    gitRemote: config.repository
  });

  await releasePublish({
    dryRun: !!options.dryRun,
    verbose: true
  });
};
