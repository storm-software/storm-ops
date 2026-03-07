#!/usr/bin/env node

import { StormWorkspaceConfig } from "@storm-software/config";
import { run, writeInfo } from "@storm-software/config-tools";

export async function preInstallHook(config: StormWorkspaceConfig) {
  writeInfo("Running pre-install hook...", config);

  if (Boolean(process.env.CI) || Boolean(process.env.STORM_CI)) {
    writeInfo("Skipping pre-install for CI process...", config);
    return;
  }

  run(config, "npx -y only-allow pnpm");
}
