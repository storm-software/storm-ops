#!/usr/bin/env zx

import { $, argv, chalk, echo } from "zx";

try {
  let base = argv.base;
  if (!base) {
    base = process.env.NX_BASE;
  }
  let head = argv.head;
  if (!head) {
    head = process.env.NX_HEAD;
  }
  if (!base || !head) {
    throw new Error(
      `Base and head arguments are required. Please provide them using the --base and --head flags.`
    );
  }

  await echo`${chalk.whiteBright(`📦  Releasing Storm-Ops packages (Base tag: "${base}", Head tag: "${head}")`)}`;

  // Graph construction needs the local Nx plugins, including on a clean checkout.
  await $`pnpm bootstrap`;
  const check =
    await $`pnpm exec tsx tools/scripts/src/release-check.cts`.nothrow();
  if (check.exitCode === 10) {
    echo`${chalk.green("No release changes detected; skipping builds and publishing.")}`;
    process.exit(0);
  }
  if (!check.ok) {
    throw new Error(
      "Failed to determine release changes; refusing to skip the release."
    );
  }

  // One graph builds the JS artifacts and release tooling. Cargo publish checks
  // the packaged Rust sources itself, so no optimized Rust build is needed here.
  let proc =
    $`pnpm nx run-many --target=build --projects=packages/* --configuration=production --parallel=5 --outputStyle=static`.timeout(
      `${30 * 60}s`
    );
  proc.stdout.on("data", data => {
    echo`${data}`;
  });
  let result = await proc;
  if (!result.ok) {
    throw new Error(
      `An error occurred while building Storm-Ops packages: \n\n${result.message}\n`
    );
  }

  proc = $`node ./dist/packages/git-tools/bin/git.cjs release --base=${base} --head=${head}`;
  proc.stdout.on("data", data => {
    echo`${data}`;
  });
  result = await proc;
  if (!result.ok) {
    throw new Error(
      `An error occurred while releasing Storm-Ops packages: \n\n${result.message}\n`
    );
  }

  echo`${chalk.green("Successfully released Storm-Ops packages")}`;
} catch (error) {
  echo`${chalk.red(error?.message ? error.message : "A failure occurred while releasing Storm-Ops packages")}`;

  process.exit(1);
}
