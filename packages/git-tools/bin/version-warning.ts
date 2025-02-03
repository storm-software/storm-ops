#!/usr/bin/env node

import {
  exitWithError,
  getConfig,
  handleProcess,
  writeFatal,
} from "@storm-software/config-tools";
import { checkPackageVersion } from "../src/utilities/check-package-version";

void (async () => {
  const config = await getConfig();
  try {
    handleProcess(config);

    checkPackageVersion(process.argv.slice(1));
  } catch (error) {
    writeFatal(
      `A fatal error occurred while running the program: ${error.message}`,
      config,
    );
    exitWithError(config);
    process.exit(1);
  }
})();
