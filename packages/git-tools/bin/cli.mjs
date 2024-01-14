#!/usr/bin/env zx

import { findWorkspaceRootSafe } from "../../config-tools/utilities/find-workspace-root.js";
import { createProgram } from "../cli/index.js";

try {
  const workspaceRoot = findWorkspaceRootSafe();
  cd(workspaceRoot);

  const program = await createProgram();
  program.exitOverride();

  await program.parseAsync(process.argv.splice(1));
} catch (p) {
  console.error(`Error: ${p.stderr}`);
  process.exit(1);
}
