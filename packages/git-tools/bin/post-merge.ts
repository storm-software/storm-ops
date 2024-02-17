#!/usr/bin/env node

import {
  exitWithError,
  exitWithSuccess,
  handleProcess,
  loadStormConfig,
  run,
  writeError,
  writeInfo
} from "@storm-software/config-tools";
import { checkPackageVersion } from "../src/utilities";

const handle = async () => {
  const config = await loadStormConfig();
  handleProcess(config);

  writeInfo(config, "Running post-merge hook...");
  checkPackageVersion(process.argv?.slice(1));

  try {
    run(config, "git-lfs version");
  } catch (error) {
    writeError(
      config,
      `This repository is configured for Git LFS but 'git-lfs' was not found on your path. If you no longer wish to use Git LFS, remove this hook by deleting .git/hooks/post-merge.\nError: ${
        (error as Error)?.message
      }`
    );
    exitWithError(config);
  }

  run(config, "git lfs post-merge");
};

handle().then(() => {
  loadStormConfig().then((config) => exitWithSuccess(config));
});
