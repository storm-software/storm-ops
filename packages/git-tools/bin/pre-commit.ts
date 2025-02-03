#!/usr/bin/env node

import {
  exitWithError,
  exitWithSuccess,
  getConfig,
  handleProcess,
  writeError,
  writeFatal,
  writeInfo,
} from "@storm-software/config-tools";
import {
  checkPackageVersion,
  isPackageVersionChanged,
} from "../src/utilities/check-package-version";

void (async () => {
  const config = await getConfig();
  try {
    handleProcess(config);

    writeInfo("Running pre-commit hook...", config);

    checkPackageVersion(process.argv.slice(1));
    if (isPackageVersionChanged(process.argv?.slice(1))) {
      writeError(
        "Please regenerate the package lock file before committing...",
        config,
      );
      exitWithError(config);
    }

    exitWithSuccess(config);
  } catch (error) {
    writeFatal(
      `A fatal error occurred while running the program: ${error.message}`,
      config,
    );
    exitWithError(config);
    process.exit(1);
  }
})();
