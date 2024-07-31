#!/usr/bin/env node

import {
  exitWithError,
  exitWithSuccess,
  handleProcess,
  loadStormConfig,
  writeFatal,
  writeSuccess
} from "@storm-software/config-tools";
import { readJsonSync } from "fs-extra";
import { join } from "node:path";
import { register as registerTsConfigPaths } from "tsconfig-paths";
import { createProgram } from "../src/cli";

void (async () => {
  const config = await loadStormConfig();
  try {
    handleProcess(config);

    const compilerOptions = readJsonSync(
      join(config.workspaceRoot ?? "./", "tsconfig.base.json")
    ).compilerOptions;
    registerTsConfigPaths(compilerOptions);

    const program = createProgram(config);
    // program.exitOverride();
    await program.parseAsync(process.argv);

    writeSuccess(
      `🎉  Git ${process.argv.join(" ") ?? "tool"} processing completed successfully!`,
      config
    );
    exitWithSuccess(config);
  } catch (error) {
    writeFatal(
      `A fatal error occurred while running the Git tool: \n\n${error.message}`,
      config
    );
    exitWithError(config);
    process.exit(1);
  }
})();
