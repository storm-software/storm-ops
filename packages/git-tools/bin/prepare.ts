#!/usr/bin/env node

import { exitWithSuccess, handleProcess, loadStormConfig, run } from "@storm-software/config-tools";

const handle = async () => {
  const config = await loadStormConfig();
  handleProcess(config);

  if (!config.ci) {
    run(config, "lefthook install");
  }
};

handle().then(() => {
  loadStormConfig().then((config) => exitWithSuccess(config));
});
