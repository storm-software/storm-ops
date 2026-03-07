#!/usr/bin/env node

import { StormWorkspaceConfig } from "@storm-software/config";
import { writeInfo } from "@storm-software/config-tools";
import {
  checkPackageVersion,
  isPackageVersionChanged
} from "../utilities/check-package-version";

export async function preCommitHook(
  config: StormWorkspaceConfig,
  files: string[]
) {
  writeInfo("Running pre-commit hook...", config);

  checkPackageVersion(files);
  if (isPackageVersionChanged(files)) {
    throw new Error(
      "Please regenerate the package lock file before committing..."
    );
  }
}
