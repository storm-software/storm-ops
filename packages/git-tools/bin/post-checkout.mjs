#!/usr/bin/env zx

try {
  await spinner("Running Storm post-checkout hook...", async () => {
    const changed = await $`git diff-tree -r --name-only --no-commit-id $1 $2`;

    await $`zx ../scripts/package-version-warning.mjs ${changed}`;

    const result = await $`git-lfs -v`;
    if (result && Number.isInteger(Number.parseInt(result)) && Number(result)) {
      console.error(
        `This repository is configured for Git LFS but 'git-lfs' was not found on your path. If you no longer wish to use Git LFS, remove this hook by deleting .git/hooks/post-checkout.\nError: ${result}`
      );
      process.exit(1);
    }

    await $`git lfs post-checkout origin ${$.env?.STORM_BRANCH ?? "main"}`;
  });
} catch (p) {
  console.error(`Error: ${p.stderr}`);
  process.exit(1);
}
