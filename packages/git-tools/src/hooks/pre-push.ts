#!/usr/bin/env node

import { StormWorkspaceConfig } from "@storm-software/config";
import { writeInfo, writeSuccess } from "@storm-software/config-tools";
import fs from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { checkPackageVersion } from "../utilities/check-package-version";
import {
  getInstallCommand,
  getLockFileName,
  getOtherLockFileNames
} from "../utilities/package-manager";

export async function prePushHook(
  config: StormWorkspaceConfig,
  files: string[]
) {
  writeInfo("Running pre-push hook...", config);
  checkPackageVersion(files, config);

  writeInfo("🔒🔒🔒 Validating lock files 🔒🔒🔒", config);

  const workspaceRoot = config.workspaceRoot ?? "./";
  const lockFileName = getLockFileName(config.packageManager);
  const installCommand = getInstallCommand(config.packageManager);
  const errors = [] as string[];

  for (const otherLockFile of getOtherLockFileNames(config.packageManager)) {
    if (fs.existsSync(path.join(workspaceRoot, otherLockFile))) {
      errors.push(
        `Invalid occurrence of "${otherLockFile}" file. Please remove it and use only "${lockFileName}"`
      );
    }
  }

  try {
    const content = await readFile(path.join(workspaceRoot, lockFileName), {
      encoding: "utf8"
    });

    if (config.packageManager === "pnpm") {
      if (content?.match(/localhost:487/)) {
        errors.push(
          `The "${lockFileName}" has reference to local repository ("localhost:4873"). Please ensure you disable local registry before running "${installCommand}"`
        );
      }
      if (content?.match(/resolution: \{tarball/)) {
        errors.push(
          `The "${lockFileName}" has reference to tarball package. Please use npm registry only`
        );
      }
    }
  } catch {
    errors.push(`The "${lockFileName}" does not exist or cannot be read`);
  }

  if (errors.length > 0) {
    throw new Error(
      "❌ Lock file validation failed" + "\n" + errors.join("\n")
    );
  }

  writeSuccess("✔ Lock file is valid for push", config);

  // run(config, "git lfs pre-push origin");

  // try {
  //   run(config, "git-lfs version");
  // } catch (error) {
  //   throw new Error(
  //     `This repository is configured for Git LFS but 'git-lfs' was not found on your path. If you no longer wish to use Git LFS, remove this hook by deleting .git/hooks/pre-push.\nError: ${
  //       (error as Error)?.message
  //     }`
  //   );
  // }

  // run(config, "git lfs pre-push origin");
}
