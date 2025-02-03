#!/usr/bin/env node

import {
  exitWithError,
  exitWithSuccess,
  getConfig,
  handleProcess,
  writeFatal,
  writeSuccess,
} from "@storm-software/config-tools";
import { createProgram } from "../src/cli";

void (async () => {
  const config = await getConfig();
  try {
    handleProcess(config);

    const program = createProgram(config);
    await program.parseAsync(process.argv);

    writeSuccess(
      `🎉  Git ${process.argv && process.argv.length >= 3 && process.argv[2] ? process.argv[2] : "tool"} processing completed successfully!`,
      config,
    );
    exitWithSuccess(config);
  } catch (error) {
    writeFatal(
      `A fatal error occurred while running the Storm Git tool:
${error?.message ? error.message : JSON.stringify(error)}${
        error?.stack
          ? `
Stack Trace: ${error.stack}`
          : ""
      }`,
      config,
    );

    exitWithError(config);
    process.exit(1);
  }
})();
