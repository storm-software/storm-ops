#!/usr/bin/env node

const { execSync } = require("node:child_process");

try {
  console.log("Running Storm post-checkout hook...");

  execSync(
    'changedFiles="$(git diff-tree -r --name-only --no-commit-id $1 $2)" && node @storm-software/git-tools/scripts/package-version-warning.cjs $changedFiles'
  );

  const result = execSync(
    "command -v git-lfs >/dev/null 2>&1 || echo >&2 '\nThis repository is configured for Git LFS but 'git-lfs' was not found on your path. If you no longer wish to use Git LFS, remove this hook by deleting .git/hooks/post-checkout.\n' && exit(2) ",
    "utf8"
  );
  if (Number(result)) {
    console.error(`Git LFS error: ${result}`);
    process.exit(1);
  }
  execSync('git lfs post-checkout "$@"');
} catch (e) {
  console.error(e);
  process.exit(1);
}
