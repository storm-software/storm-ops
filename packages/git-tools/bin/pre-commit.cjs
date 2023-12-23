#!/usr/bin/env node

const { execSync } = require("node:child_process");

try {
  console.log("Running Storm pre-commit hook...");

  ["SIGTERM", "SIGINT", "SIGUSR2"].map(type => {
    process.once(type, async () => {
      try {
        console.info(`process.on ${type}`);
        console.info(`shutdown process done, exiting with code 0`);
        process.exit(0);
      } catch (e) {
        console.warn(`shutdown process failed, exiting with code 1`);
        console.error(e);
        process.exit(1);
      }
    });
  });

  execSync(
    'pnpm lint-staged --config="@storm-software/git-tools/lint-staged/config.cjs"',
    { encoding: "utf8", env: { ...process.env }, windowsHide: true }
  );
  execSync("pnpm test", {
    encoding: "utf8",
    env: { ...process.env },
    windowsHide: true
  });
} catch (e) {
  console.error(e);
  process.exit(1);
}
