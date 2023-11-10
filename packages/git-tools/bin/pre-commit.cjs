#!/usr/bin/env node

const { execSync } = require("node:child_process");

try {
  console.log("Running Storm pre-commit hook...");

  execSync(
    'pnpm lint-staged --concurrent false --config="@storm-software/git-tools/lint-staged/config.cjs"'
  );
  execSync("pnpm test");
} catch (e) {
  console.error(e);
  process.exit(1);
}
