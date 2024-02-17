#!/usr/bin/env node

import {
  exitWithSuccess,
  handleProcess,
  loadStormConfig,
  run,
  writeInfo
} from "@storm-software/config-tools";

const handle = async () => {
  const config = await loadStormConfig();
  handleProcess(config);

  if (config.ci) {
    writeInfo(config, "Skipping pre-install for CI process...");
    exitWithSuccess(config);
  }

  run(config, "npx -y only-allow pnpm");
};

handle().then(() => {
  loadStormConfig().then((config) => exitWithSuccess(config));
});
