#!/usr/bin/env node

const { execSync } = require("node:child_process");

try {
  console.log("Running Storm post-commit hook...");

  const result = execSync("git-lfs -v", "utf8");
  if (result && Number.isInteger(Number.parseInt(result)) && Number(result)) {
    console.error(
      `This repository is configured for Git LFS but 'git-lfs' was not found on your path. If you no longer wish to use Git LFS, remove this hook by deleting .git/hooks/post-commit.\nError: ${result}`
    );
    process.exit(1);
  }

  execSync("git lfs post-commit origin main");
} catch (e) {
  console.error(e);
  process.exit(1);
}
