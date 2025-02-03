#!/usr/bin/env node

import {
  exitWithError,
  exitWithSuccess,
  getConfig,
  handleProcess,
  run,
  writeFatal,
  writeInfo,
} from "@storm-software/config-tools";

void (async () => {
  const config = await getConfig();
  try {
    handleProcess(config);

    writeInfo("Running pre-install hook...", config);

    if (Boolean(process.env.CI) || Boolean(process.env.STORM_CI)) {
      writeInfo("Skipping pre-install for CI process...", config);
      exitWithSuccess(config);
    }

    run(config, "npx -y only-allow pnpm");

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
