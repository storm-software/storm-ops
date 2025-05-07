#!/usr/bin/env zx

import { $, argv, chalk, echo } from "zx";

try {
  let configuration = argv.configuration;
  if (!configuration) {
    if (argv.prod) {
      configuration = "production";
    } else if (argv.dev) {
      configuration = "development";
    } else {
      configuration = "production";
    }
  }

  echo`${chalk.whiteBright(`📦  Building the monorepo in ${configuration} mode...`)}`;

  let proc = $`pnpm bootstrap`.timeout("60s");
  proc.stdout.on("data", data => {
    echo`${data}`;
  });
  let result = await proc;
  if (!result.ok) {
    throw new Error(
      `An error occurred while bootstrapping the monorepo: \n\n${result.message}\n`
    );
  }

  if (configuration === "production") {
    proc = $`pnpm nx run workspace-tools:build:production --outputStyle=stream`;
    proc.stdout.on("data", data => {
      echo`${data}`;
    });
    result = await proc;

    if (!result.ok) {
      throw new Error(
        `An error occurred while building the workspace-tools package in production mode: \n\n${result.message}\n`
      );
    }

    proc = $`pnpm nx run-many --target=build --all --exclude="@storm-software/storm-ops" --configuration=production --parallel=5 --outputStyle=stream`;
    proc.stdout.on("data", data => {
      echo`${data}`;
    });
    result = await proc;

    if (!result.ok) {
      throw new Error(
        `An error occurred while building the monorepo in production mode: \n\n${result.message}\n`
      );
    }
  } else {
    proc = $`pnpm nx run workspace-tools:build:${configuration} --outputStyle=dynamic-legacy`;
    proc.stdout.on("data", data => {
      echo`${data}`;
    });
    result = await proc;

    if (!result.ok) {
      throw new Error(
        `An error occurred while building the workspace-tools package in ${configuration} mode: \n\n${result.message}\n`
      );
    }

    proc = $`pnpm nx run-many --target=build --all --exclude="@storm-software/storm-ops" --configuration=${configuration} --nxBail --outputStyle=dynamic-legacy`;
    proc.stdout.on("data", data => {
      echo`${data}`;
    });
    result = await proc;

    if (!result.ok) {
      throw new Error(
        `An error occurred while building the monorepo in ${configuration} mode: \n\n${result.message}\n`
      );
    }
  }

  echo`${chalk.green(`Successfully built the monorepo in ${configuration} mode!`)}`;
} catch (error) {
  echo`${chalk.red(error?.message ? error.message : "A failure occurred while building the monorepo")}`;

  process.exit(1);
}
