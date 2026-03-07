#!/usr/bin/env node

import { getConfig } from "@storm-software/config-tools/get-config";
import { writeFatal } from "@storm-software/config-tools/logger/console";
import {
  exitWithError,
  exitWithSuccess
} from "@storm-software/config-tools/utilities/process-handler";
import { prepareHook } from "../src/hooks/prepare";

void (async () => {
  const config = await getConfig();
  try {
    await prepareHook(config);

    exitWithSuccess(config);
  } catch (error) {
    writeFatal(
      `A fatal error occurred while running the program: ${error.message}`,
      config
    );
    exitWithError(config);
    process.exit(1);
  }
})();
