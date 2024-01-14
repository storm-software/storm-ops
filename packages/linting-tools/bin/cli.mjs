#!/usr/bin/env zx

import { findWorkspaceRootSafe } from "../../config-tools/utilities/find-workspace-root.js";
import { createProgram } from "../cli/index.js";

try {
  const workspaceRoot = findWorkspaceRootSafe();
  cd(workspaceRoot);

  await spinner("Executing code linting and fixing...", async () => {
    const program = createProgram();
    program.exitOverride();

    await program.parseAsync(process.argv.splice(1));
  });
} catch (e) {
  console.error(`Error: ${e.stderr}`);
  console.error(e);
  process.exit(1);
}
