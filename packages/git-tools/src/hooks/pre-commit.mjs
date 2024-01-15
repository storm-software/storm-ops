#!/usr/bin/env zx

import { checkPackageVersion, isPackageVersionChanged } from "../scripts/check-package-version.mjs";

try {
  await spinner("Running Storm pre-commit hook...", async () => {
    checkPackageVersion(process.argv?.slice(2));

    if (isPackageVersionChanged(process.argv?.slice(2))) {
      console.error("Please regenerate the package lock file before committing.");
      process.exit(1);
    }
  });
} catch (e) {
  console.error(`Error: ${e.stderr}`);
  console.error(e);
  process.exit(1);
}
