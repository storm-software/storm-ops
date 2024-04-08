#!/usr/bin/env node

import { createProgram } from "../cli";

const handle = async () => {
  const { exitWithSuccess, handleProcess, loadStormConfig, writeSuccess } =
    await import("@storm-software/config-tools");

  const config = await loadStormConfig();
  handleProcess(config);

  const program = await createProgram(config);
  program.exitOverride();

  await program.parseAsync(process.argv);

  writeSuccess(config, "The Storm Build process completed successfully!");
};

handle().then(() => {
  return import("@storm-software/config-tools").then(mod => {
    mod.loadStormConfig().then(config => mod.exitWithSuccess(config));
  });
});
