#!/usr/bin/env node

import { StormWorkspaceConfig } from "@storm-software/config";
import { writeInfo } from "@storm-software/config-tools";
import {
  checkPackageVersion,
  isPackageVersionChanged
} from "../utilities/check-package-version";
import { getLockFileName } from "../utilities/package-manager";

export async function preCommitHook(
  config: StormWorkspaceConfig,
  files: string[]
) {
  writeInfo("Running pre-commit hook...", config);

  checkPackageVersion(files, config);
  if (isPackageVersionChanged(files)) {
    throw new Error(
      `Please regenerate the ${getLockFileName(config.packageManager)} before committing...`
    );
  }
}
