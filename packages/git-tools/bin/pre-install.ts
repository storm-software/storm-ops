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

    writeInfo("Running pre-install hook...", config);

    if (config.ci) {
      writeInfo("Skipping pre-install for CI process...", config);
      exitWithSuccess(config);
    }

    run(config, "npx -y only-allow pnpm");

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
