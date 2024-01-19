#!/usr/bin/env zx

// biome-ignore lint/correctness/noUndeclaredVariables: <explanation>
cd(__dirname);

import { writeFatal, writeSuccess } from "../../config-tools/utilities/logger.js";
import { prepareWorkspace } from "../../config-tools/utilities/prepare-workspace.js";
import { createProgram } from "../cli/index.js";

const _STORM_CONFIG = await prepareWorkspace();

try {
  // biome-ignore lint/correctness/noUndeclaredVariables: <explanation>
  cd(_STORM_CONFIG.workspaceRoot);

  const program = await createProgram();
  program.exitOverride();

  await program.parseAsync(process.argv.splice(1));

  writeSuccess(
    _STORM_CONFIG,
    `Git ${process.argv.splice(1) ?? "tool"} processing completed successfully!`
  );
} catch (e) {
  writeFatal(
    _STORM_CONFIG,
    `A fatal error occurred while running the program: ${e.stderr} \nStacktrace: ${e.stack}`
  );
  process.exit(1);
}
