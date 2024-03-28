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

    writeInfo(config, "Running pre-install hook...");

    if (config.ci) {
      writeInfo(config, "Skipping pre-install for CI process...");
      exitWithSuccess(config);
    }

    run(config, "npx -y only-allow pnpm");

    exitWithSuccess(config);
  } catch (error) {
    writeFatal(config, `A fatal error occurred while running the program: ${error.message}`);
    exitWithError(config);
    process.exit(1);
  }
})();
