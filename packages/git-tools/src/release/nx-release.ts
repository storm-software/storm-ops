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
    specifier: options.version,
    dryRun: !!options.dryRun,
    verbose: true,
    preid: config.preMajor,
    stageChanges: true,
    firstRelease: options.firstRelease
  });

  await releaseChangelog({
    versionData: projectsVersionData,
    version: workspaceVersion,
    dryRun: !!options.dryRun,
    verbose: true
  });

  await releasePublish({
    dryRun: !!options.dryRun,
    verbose: true
  });
};
