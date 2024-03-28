#!/usr/bin/env node

import {
  exitWithError,
  handleProcess,
  loadStormConfig,
  writeFatal
} from "@storm-software/config-tools";
import { checkPackageVersion } from "../src/utilities/check-package-version";

void (async () => {
  const config = await loadStormConfig();
  try {
    handleProcess(config);

    checkPackageVersion(process.argv.slice(1));
  } catch (error) {
    writeFatal(config, `A fatal error occurred while running the program: ${error.message}`);
    exitWithError(config);
    process.exit(1);
  }
})();
