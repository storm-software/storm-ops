#!/usr/bin/env node

import {
  exitWithError,
  exitWithSuccess,
  handleProcess,
  loadStormConfig,
  run,
  writeError,
  writeFatal,
  writeInfo
} from "@storm-software/config-tools";
import { checkPackageVersion } from "../src/utilities";

void (async () => {
  const config = await loadStormConfig();
  try {
    handleProcess(config);

    writeInfo(config, "Running post-commit hook...");
    checkPackageVersion(process.argv?.slice(1));

    try {
      run(config, "git-lfs version");
    } catch (error) {
      writeError(
        config,
        `This repository is configured for Git LFS but 'git-lfs' was not found on your path. If you no longer wish to use Git LFS, remove this hook by deleting .git/hooks/post-commit.\nError: ${
          (error as Error)?.message
        }`
      );
      exitWithError(config);
    }

    run(config, "git lfs post-commit");

    exitWithSuccess(config);
  } catch (error) {
    writeFatal(config, `A fatal error occurred while running the program: ${error.message}`);
    exitWithError(config);
    process.exit(1);
  }
})();
