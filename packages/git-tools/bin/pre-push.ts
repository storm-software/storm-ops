#!/usr/bin/env node

import fs from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import {
  exitWithError,
  exitWithSuccess,
  findWorkspaceRootSafe,
  handleProcess,
  loadStormConfig,
  run,
  writeError,
  writeInfo,
  writeSuccess
} from "@storm-software/config-tools";
import { checkPackageVersion } from "../src/utilities";

const config = await loadStormConfig();
handleProcess(config);

writeInfo(config, "Running pre-push hook...");
checkPackageVersion(process.argv?.slice(1));

writeInfo(config, "🔒🔒🔒 Validating lock files 🔒🔒🔒\n");

const workspaceRoot = findWorkspaceRootSafe();
const errors = [];

if (fs.existsSync(path.join(workspaceRoot, "package-lock.json"))) {
  errors.push(
    'Invalid occurrence of "package-lock.json" file. Please remove it and use only "pnpm-lock.yaml"'
  );
}
if (fs.existsSync(path.join(workspaceRoot, "yarn.lock"))) {
  errors.push(
    'Invalid occurrence of "yarn.lock" file. Please remove it and use only "pnpm-lock.yaml"'
  );
}

try {
  const content = await readFile(path.join(workspaceRoot, "pnpm-lock.yaml"), {
    encoding: "utf8"
  });
  if (content.match(/localhost:487/)) {
    errors.push(
      'The "pnpm-lock.yaml" has reference to local repository ("localhost:4873"). Please use ensure you disable local registry before running "pnpm i"'
    );
  }
  if (content.match(/resolution: \{tarball/)) {
    errors.push(
      'The "pnpm-lock.yaml" has reference to tarball package. Please use npm registry only'
    );
  }
} catch {
  errors.push('The "pnpm-lock.yaml" does not exist or cannot be read');
}

if (errors.length > 0) {
  writeError(config, "❌ Lock file validation failed");
  for (const error of errors) {
    console.error(error);
  }

  exitWithError(config);
}

writeSuccess(config, "✅ Lock file is valid");
run("git lfs pre-push origin");

try {
  run("git-lfs version");
} catch (error) {
  writeError(
    config,
    `This repository is configured for Git LFS but 'git-lfs' was not found on your path. If you no longer wish to use Git LFS, remove this hook by deleting .git/hooks/pre-push.\nError: ${
      (error as Error)?.message
    }`
  );
  exitWithError(config);
}

run("git lfs pre-push origin");
exitWithSuccess(config);
