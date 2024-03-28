#!/usr/bin/env node

import {
  exitWithError,
  exitWithSuccess,
  handleProcess,
  loadStormConfig,
  run,
  writeFatal,
  writeInfo
} from "@storm-software/config-tools";

void (async () => {
  const config = await loadStormConfig();
  try {
    handleProcess(config);

    writeInfo(config, "Running prepare hook...");

    if (!config.ci) {
      run(config, "lefthook install");
    }

    exitWithSuccess(config);
  } catch (error) {
    writeFatal(config, `A fatal error occurred while running the program: ${error.message}`);
    exitWithError(config);
    process.exit(1);
  }
})();
