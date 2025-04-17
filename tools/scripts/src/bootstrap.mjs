#!/usr/bin/env zx
/* -------------------------------------------------------------------

                  ⚡ Storm Software - Storm Stack

 This code was released as part of the Storm Stack project. Storm Stack
 is maintained by Storm Software under the Apache-2.0 License, and is
 free for commercial and private use. For more information, please visit
 our licensing page.

 Website:         https://stormsoftware.com
 Repository:      https://github.com/storm-software/storm-stack
 Documentation:   https://stormsoftware.com/projects/storm-stack/docs
 Contact:         https://stormsoftware.com/contact
 License:         https://stormsoftware.com/projects/storm-stack/license

 ------------------------------------------------------------------- */

import { build } from "esbuild";
import { $, chalk, echo } from "zx";

// usePwsh();

try {
  echo`${chalk.whiteBright("⚙️  Bootstrapping the monorepo...")}`;

  await Promise.all([
    build({
      entryPoints: [
        "packages/workspace-tools/src/plugins/rust/index.ts",
        "packages/workspace-tools/src/plugins/typescript/index.ts",
        "packages/workspace-tools/src/plugins/typescript/tsup.ts"
      ],
      outdir: "dist/plugins",
      tsconfig: "packages/workspace-tools/tsconfig.json",
      packages: "external",
      logLevel: "info",
      bundle: true,
      minify: false,
      outExtension: {
        ".js": ".js"
      },
      format: "cjs",
      platform: "node"
    }).then(() => {
      echo`${chalk.green("Storm Workspace plugins built successfully")}`;
    }),
    build({
      entryPoints: ["packages/cloudflare-tools/src/plugins/index.ts"],
      outdir: "dist/plugins/cloudflare",
      tsconfig: "packages/cloudflare-tools/tsconfig.json",
      packages: "external",
      logLevel: "info",
      bundle: true,
      minify: false,
      outExtension: {
        ".js": ".js"
      },
      format: "cjs",
      platform: "node"
    }).then(() => {
      echo`${chalk.green("Storm Cloudflare plugin built successfully")}`;
    })
  ]).then(() => {
    echo`${chalk.green("All Storm plugin built successfully")}`;
  });

  const proc = $`pnpm nx reset`.timeout(`${5 * 60}s`);
  proc.stdout.on("data", data => {
    echo`${data}`;
  });
  const result = await proc;
  if (!result.ok) {
    throw new Error(
      `An error occurred while resetting the Nx daemon process: \n\n${result.message}\n`
    );
  }

  echo`${chalk.green("Completed monorepo bootstrapping successfully!")}`;
} catch (error) {
  echo`${chalk.red(error?.message ? error.message : "A failure occurred while bootstrapping the monorepo")}`;

  process.exit(1);
}
