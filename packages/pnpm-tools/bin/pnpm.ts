#!/usr/bin/env node

import { getConfig } from "@storm-software/config-tools/get-config";
import { writeSuccess } from "@storm-software/config-tools/logger/console";
import {
  exitWithError,
  exitWithSuccess,
  handleProcess
} from "@storm-software/config-tools/utilities/process-handler";
import { createProgram } from "../src/cli";

void (async () => {
  const config = await getConfig();
  try {
    handleProcess(config);

    const program = createProgram(config);
    await program.parseAsync(process.argv);

    writeSuccess(
      `🎉  Storm pnpm ${process.argv && process.argv.length >= 3 && process.argv[2] ? process.argv[2] : "tool"} processing completed successfully!`,
      config
    );
    exitWithSuccess(config);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    exitWithError(config);
    process.exit(1);
  }
})();
