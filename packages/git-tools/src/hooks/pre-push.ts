#!/usr/bin/env node

import { StormWorkspaceConfig } from "@storm-software/config";
import { writeInfo, writeSuccess } from "@storm-software/config-tools";
import fs from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { checkPackageVersion } from "../utilities/check-package-version";

export async function prePushHook(
  config: StormWorkspaceConfig,
  files: string[]
) {
  writeInfo("Running pre-push hook...", config);
  checkPackageVersion(files);

  writeInfo("🔒🔒🔒 Validating lock files 🔒🔒🔒\n", config);

  const errors = [] as string[];
  if (
    fs.existsSync(path.join(config.workspaceRoot ?? "./", "package-lock.json"))
  ) {
    errors.push(
      'Invalid occurrence of "package-lock.json" file. Please remove it and use only "pnpm-lock.yaml"'
    );
  }
  if (fs.existsSync(path.join(config.workspaceRoot ?? "./", "yarn.lock"))) {
    errors.push(
      'Invalid occurrence of "yarn.lock" file. Please remove it and use only "pnpm-lock.yaml"'
    );
  }

  try {
    const content = await readFile(
      path.join(config.workspaceRoot ?? "./", "pnpm-lock.yaml"),
      {
        encoding: "utf8"
      }
    );
    if (content?.match(/localhost:487/)) {
      errors.push(
        'The "pnpm-lock.yaml" has reference to local repository ("localhost:4873"). Please use ensure you disable local registry before running "pnpm i"'
      );
    }
    if (content?.match(/resolution: \{tarball/)) {
      errors.push(
        'The "pnpm-lock.yaml" has reference to tarball package. Please use npm registry only'
      );
    }
  } catch {
    errors.push('The "pnpm-lock.yaml" does not exist or cannot be read');
  }

  if (errors.length > 0) {
    throw new Error(
      "❌ Lock file validation failed" + "\n" + errors.join("\n")
    );
  }

  writeSuccess(" ✔ Lock file is valid for push", config);

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
