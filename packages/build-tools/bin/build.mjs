#!/usr/bin/env node

import {
  exitWithSuccess,
  handleProcess,
  loadStormConfig,
  writeSuccess
} from "@storm-software/config-tools";
import { createProgram } from "../src/cli";

const handle = async () => {
  const config = await loadStormConfig();
  handleProcess(config);

  const program = await createProgram(config);
  program.exitOverride();

  await program.parseAsync(process.argv);

  writeSuccess(config, "The Storm Build process completed successfully!");
};

handle().then(() => {
  loadStormConfig().then(config => exitWithSuccess(config));
});
