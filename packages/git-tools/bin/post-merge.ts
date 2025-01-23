#!/usr/bin/env node

import {
  exitWithError,
  exitWithSuccess,
  getConfig,
  handleProcess,
  run,
  writeError,
  writeFatal,
  writeInfo
} from "@storm-software/config-tools";
import { checkPackageVersion } from "../src/utilities/check-package-version";

void (async () => {
  const config = await getConfig();
  try {
    handleProcess(config);

    writeInfo("Running post-merge hook...", config);
    checkPackageVersion(process.argv?.slice(1));

    try {
      run(config, "git-lfs version");
    } catch (error) {
      writeError(
        `This repository is configured for Git LFS but 'git-lfs' was not found on your path. If you no longer wish to use Git LFS, remove this hook by deleting .git/hooks/post-merge.\nError: ${
          (error as Error)?.message
        }`,
        config
      );
      exitWithError(config);
    }

    run(config, "git lfs post-merge");

    exitWithSuccess(config);
  } catch (error) {
    writeFatal(
      `A fatal error occurred while running the program: ${error.message}`,
      config
    );
    exitWithError(config);
    process.exit(1);
  }
})();
