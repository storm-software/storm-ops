#!/usr/bin/env node

import { StormWorkspaceConfig } from "@storm-software/config";
import { run, writeInfo } from "@storm-software/config-tools";

export async function prepareHook(config: StormWorkspaceConfig) {
  writeInfo("Running prepare hook...", config);

  if (!process.env.CI && !process.env.STORM_CI) {
    run(config, "pnpm lefthook install");
  }
}
