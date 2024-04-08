#!/usr/bin/env node

import { createProgram } from "../src/cli";
import {
  exitWithSuccess,
  handleProcess,
  loadStormConfig,
  writeSuccess
} from "@storm-software/config-tools";

const handle = async () => {
  const config = await loadStormConfig();
  handleProcess(config);

  const program = await createProgram(config);
  program.exitOverride();

  await program.parseAsync(process.argv);

  writeSuccess(config, "The Storm Build process completed successfully!");
};

handle().then(() => {
  return loadStormConfig().then(config => exitWithSuccess(config));
});
