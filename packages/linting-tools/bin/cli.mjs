#!/usr/bin/env zx

import { writeFatal, writeSuccess } from "../../config-tools/utilities/logger.js";
import { prepareWorkspace } from "../../config-tools/utilities/prepare-workspace.js";
import { createProgram } from "../cli/index.js";

const _STORM_CONFIG = await prepareWorkspace();

try {
  // biome-ignore lint/correctness/noUndeclaredVariables: <explanation>
  cd(_STORM_CONFIG.workspaceRoot);

  // biome-ignore lint/correctness/noUndeclaredVariables: <explanation>
  await spinner("Executing code linting and fixing...", async () => {
    const program = createProgram();
    program.exitOverride();

    await program.parseAsync(process.argv.splice(1));
  });

  writeSuccess(_STORM_CONFIG, "Code linting and fixing completed successfully!");
} catch (e) {
  writeFatal(
    _STORM_CONFIG,
    `A fatal error occurred while running the program: ${e.stderr} \nStacktrace: ${e.stack}`
  );
  process.exit(1);
}