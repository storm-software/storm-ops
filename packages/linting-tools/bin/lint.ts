#!/usr/bin/env node

import {
  exitWithError,
  exitWithSuccess,
  handleProcess,
  loadStormConfig,
  writeFatal,
  writeSuccess
} from "@storm-software/config-tools";
import { createProgram } from "../src/cli";

Error.stackTraceLimit = Infinity;

void (async () => {
  const config = await loadStormConfig();
  try {
    handleProcess(config);

    const program = await createProgram(config);
    program.exitOverride();

    await program.parseAsync(process.argv);

    writeSuccess("🎉  Code linting and fixing completed successfully!", config);
    exitWithSuccess(config);
  } catch (error) {
    writeFatal(
      `A fatal error occurred while linting the workspace: ${error.message}`,
      config
    );

    exitWithError(config);
    process.exit(1);
  }
})();
