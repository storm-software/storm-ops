#!/usr/bin/env node

import {
  exitWithError,
  exitWithSuccess,
  handleProcess,
  loadStormConfig,
  writeError
} from "@storm-software/config-tools";
import {
  checkPackageVersion,
  isPackageVersionChanged
} from "../src/utilities/check-package-version";

const config = await loadStormConfig();
handleProcess(config);

checkPackageVersion(process.argv.slice(1));
if (isPackageVersionChanged(process.argv?.slice(1))) {
  writeError(config, "Please regenerate the package lock file before committing...");
  exitWithError(config);
}

exitWithSuccess(config);
