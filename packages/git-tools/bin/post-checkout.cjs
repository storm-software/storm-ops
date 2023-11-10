#!/usr/bin/env node

const { execSync } = require("node:child_process");

try {
  console.log("Running Storm post-checkout hook...");

  const changed = execSync(
    "git diff-tree -r --name-only --no-commit-id $1 $2",
    "utf8"
  );
  execSync(
    `node @storm-software/git-tools/scripts/package-version-warning.cjs ${changed}`
  );

  const result = execSync("git-lfs -v", "utf8");
  if (result && Number.isInteger(Number.parseInt(result)) && Number(result)) {
    console.error(
      `This repository is configured for Git LFS but 'git-lfs' was not found on your path. If you no longer wish to use Git LFS, remove this hook by deleting .git/hooks/post-checkout.\nError: ${result}`
    );
    process.exit(1);
  }

  const remote = execSync("git rev-parse --abbrev-ref HEAD", "utf8");
  execSync(`git lfs post-checkout ${remote}`);
} catch (e) {
  console.error(e);
  process.exit(1);
}
