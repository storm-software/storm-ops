#!/usr/bin/env node

import { StormWorkspaceConfig } from "@storm-software/config";
import { run, writeInfo } from "@storm-software/config-tools";
import { checkPackageVersion } from "../utilities/check-package-version";

export async function postCheckoutHook(config: StormWorkspaceConfig) {
  writeInfo("Running post-checkout hook...", config);
  checkPackageVersion(process.argv?.slice(1));

  try {
    run(config, "git-lfs version");
  } catch (error) {
    throw new Error(
      `This repository is configured for Git LFS but 'git-lfs' was not found on your path. If you no longer wish to use Git LFS, remove this hook by deleting .git/hooks/post-checkout.\nError: ${
        (error as Error)?.message
      }`
    );
  }

  run(config, "git lfs post-checkout");
}
