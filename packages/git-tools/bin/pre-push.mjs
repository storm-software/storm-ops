#!/usr/bin/env zx

import { findWorkspaceRootSafe } from "../../config-tools/utilities/find-workspace-root.js";

try {
  await spinner("Running Storm post-push hook...", async () => {
    console.log("🔒🔒🔒 Validating lock files 🔒🔒🔒\n");

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
      const content = await fs.readJson("pnpm-lock.yaml");
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
      for (const error of errors) {
        console.error(error);
      }

      process.exit(1);
    } else {
      console.log("Lock file is valid 👍");

      const result = await $`git-lfs -v`;
      if (result && Number.isInteger(Number.parseInt(result)) && Number(result)) {
        console.error(
          `This repository is configured for Git LFS but 'git-lfs' was not found on your path. If you no longer wish to use Git LFS, remove this hook by deleting .git/hooks/post-push.\nError: ${result}`
        );

        process.exit(1);
      }

      await $`git lfs post-push origin ${$.env?.STORM_BRANCH ?? "main"}`;
    }
  });
} catch (p) {
  console.error(`Error: ${p.stderr}`);
  process.exit(1);
}
