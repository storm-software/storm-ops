#!/usr/bin/env zx

import { isError } from "../utilities/index.js";

try {
  await spinner("Running Storm post-commit hook...", async () => {
    const result = await $`git-lfs version`;
    if (!result || isError(result)) {
      console.error(
        `This repository is configured for Git LFS but 'git-lfs' was not found on your path. If you no longer wish to use Git LFS, remove this hook by deleting .git/hooks/post-commit.\nError: ${result}`
      );
      process.exit(1);
    }

    await $`git lfs post-checkout`;
  });
} catch (e) {
  console.error(`Error: ${e.stderr}`);
  console.error(e);
  process.exit(1);
}
