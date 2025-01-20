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

    writeInfo("Running prepare hook...", config);

    if (!process.env.CI && !process.env.STORM_CI) {
      run(config, "lefthook install");
    }

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
