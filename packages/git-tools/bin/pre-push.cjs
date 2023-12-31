#!/usr/bin/env node

const { execSync } = require("node:child_process");
const fs = require("fs");

try {
  console.log("Running Storm pre-push hook...");

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

  console.log("🔒🔒🔒 Validating lock files 🔒🔒🔒\n");

  const errors = [];
  if (fs.existsSync("package-lock.json")) {
    errors.push(
      'Invalid occurrence of "package-lock.json" file. Please remove it and use only "pnpm-lock.yaml"'
    );
  }
  if (fs.existsSync("yarn.lock")) {
    errors.push(
      'Invalid occurrence of "yarn.lock" file. Please remove it and use only "pnpm-lock.yaml"'
    );
  }

  try {
    const content = fs.readFileSync("pnpm-lock.yaml", "utf-8");
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
    errors.forEach(e => console.error(e));
    process.exit(1);
  }

  console.log("Lock file is valid 👍");

  const result = execSync("git-lfs -v", {
    encoding: "utf8",
    env: { ...process.env },
    windowsHide: true
  });
  if (result && Number.isInteger(Number.parseInt(result)) && Number(result)) {
    console.error(
      `This repository is configured for Git LFS but 'git-lfs' was not found on your path. If you no longer wish to use Git LFS, remove this hook by deleting .git/hooks/pre-push.\nError: ${result}`
    );
    process.exit(1);
  }

  execSync("git lfs pre-push origin main", {
    encoding: "utf8",
    env: { ...process.env },
    windowsHide: true
  });
} catch (e) {
  console.error(e);
  process.exit(1);
}
