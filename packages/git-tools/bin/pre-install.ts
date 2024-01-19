#!/usr/bin/env node

import {
  exitWithSuccess,
  handleProcess,
  loadStormConfig,
  writeInfo
} from "@storm-software/config-tools";

const config = await loadStormConfig();
handleProcess(config);

if (config.ci) {
  writeInfo(config, "Skipping pre-install for CI process...");
  exitWithSuccess(config);
}

exitWithSuccess(config);
