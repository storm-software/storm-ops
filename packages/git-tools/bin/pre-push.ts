#!/usr/bin/env node

import {
  exitWithError,
  exitWithSuccess,
  getConfig,
  handleProcess,
  run,
  writeError,
  writeFatal,
  writeInfo,
  writeSuccess,
} from "@storm-software/config-tools";
import fs from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { checkPackageVersion } from "../src/utilities/check-package-version";

void (async () => {
  const config = await getConfig();
  try {
    handleProcess(config);

    writeInfo("Running pre-push hook...", config);
    checkPackageVersion(process.argv?.slice(1));

    writeInfo("🔒🔒🔒 Validating lock files 🔒🔒🔒\n", config);

    const errors = [] as string[];

    if (
      fs.existsSync(
        path.join(config.workspaceRoot ?? "./", "package-lock.json"),
      )
    ) {
      errors.push(
        'Invalid occurrence of "package-lock.json" file. Please remove it and use only "pnpm-lock.yaml"',
      );
    }
    if (fs.existsSync(path.join(config.workspaceRoot ?? "./", "yarn.lock"))) {
      errors.push(
        'Invalid occurrence of "yarn.lock" file. Please remove it and use only "pnpm-lock.yaml"',
      );
    }

    try {
      const content = await readFile(
        path.join(config.workspaceRoot ?? "./", "pnpm-lock.yaml"),
        {
          encoding: "utf8",
        },
      );
      if (content.match(/localhost:487/)) {
        errors.push(
          'The "pnpm-lock.yaml" has reference to local repository ("localhost:4873"). Please use ensure you disable local registry before running "pnpm i"',
        );
      }
      if (content.match(/resolution: \{tarball/)) {
        errors.push(
          'The "pnpm-lock.yaml" has reference to tarball package. Please use npm registry only',
        );
      }
    } catch {
      errors.push('The "pnpm-lock.yaml" does not exist or cannot be read');
    }

    if (errors.length > 0) {
      writeError("❌ Lock file validation failed", config);
      for (const error of errors) {
        console.error(error);
      }

      exitWithError(config);
    }

    writeSuccess("Lock file is valid ✅", config);
    run(config, "git lfs pre-push origin");

    try {
      run(config, "git-lfs version");
    } catch (error) {
      writeError(
        `This repository is configured for Git LFS but 'git-lfs' was not found on your path. If you no longer wish to use Git LFS, remove this hook by deleting .git/hooks/pre-push.\nError: ${
          (error as Error)?.message
        }`,
        config,
      );
      exitWithError(config);
    }

    run(config, "git lfs pre-push origin");

    exitWithSuccess(config);
  } catch (error) {
    writeFatal(
      `A fatal error occurred while running the program: ${error.message}`,
      config,
    );
    exitWithError(config);
    process.exit(1);
  }
})();
