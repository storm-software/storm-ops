#!/usr/bin/env node

import { getWorkspaceConfig } from "@storm-software/config-tools/get-config";
import {
  writeFatal,
  writeSuccess
} from "@storm-software/config-tools/logger/console";
import { formatErrorMessage } from "@storm-software/config-tools/utilities/format-error-message";
import {
  exitWithError,
  exitWithSuccess,
  handleProcess
} from "@storm-software/config-tools/utilities/process-handler";
import { createProgram } from "../src/cli";

void (async () => {
  const config = await getWorkspaceConfig();
  try {
    handleProcess(config);

    const program = createProgram(config);
    await program.parseAsync(process.argv);

    writeSuccess(
      `✔ Storm bun ${process.argv && process.argv.length >= 3 && process.argv[2] ? process.argv[2] : "tool"} processing completed successfully!`,
      config
    );
    exitWithSuccess(config);
  } catch (error) {
    writeFatal(
      `A fatal error occurred while running storm-bun: \n${formatErrorMessage(error)}`,
      config
    );
    exitWithError(config);
    process.exit(1);
  }
})();
