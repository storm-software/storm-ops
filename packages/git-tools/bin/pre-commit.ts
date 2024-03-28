#!/usr/bin/env node

import {
  exitWithError,
  exitWithSuccess,
  handleProcess,
  loadStormConfig,
  writeError,
  writeFatal,
  writeInfo
} from "@storm-software/config-tools";
import {
  checkPackageVersion,
  isPackageVersionChanged
} from "../src/utilities/check-package-version";

void (async () => {
  const config = await loadStormConfig();
  try {
    handleProcess(config);

    writeInfo(config, "Running pre-commit hook...");

    checkPackageVersion(process.argv.slice(1));
    if (isPackageVersionChanged(process.argv?.slice(1))) {
      writeError(config, "Please regenerate the package lock file before committing...");
      exitWithError(config);
    }

    exitWithSuccess(config);
  } catch (error) {
    writeFatal(config, `A fatal error occurred while running the program: ${error.message}`);
    exitWithError(config);
    process.exit(1);
  }
})();
