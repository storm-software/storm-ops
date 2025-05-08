#!/usr/bin/env zx

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

  const proc = $`pnpm nx reset --onlyDaemon`.timeout(`${5 * 60}s`);
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
