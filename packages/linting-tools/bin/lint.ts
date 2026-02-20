#!/usr/bin/env node

import {
  exitWithError,
  exitWithSuccess,
  getConfig,
  handleProcess,
  writeFatal,
  writeSuccess
} from "@storm-software/config-tools";
import { createProgram } from "../src/cli";

Error.stackTraceLimit = Infinity;

void (async () => {
  const config = await getConfig();
  try {
    handleProcess(config);

    const program = await createProgram(config);
    program.exitOverride();

    await program.parseAsync(process.argv);

    writeSuccess("✔  Code linting and fixing completed successfully!", config);
    exitWithSuccess(config);
  } catch (error) {
    writeFatal(
      `A fatal error occurred while running the Storm Lint tool:
${error?.message ? error.message : JSON.stringify(error)}${
        error?.stack
          ? `
Stack Trace: ${error.stack}`
          : ""
      }`,
      config
    );

    exitWithError(config);
    process.exit(1);
  }
})();
