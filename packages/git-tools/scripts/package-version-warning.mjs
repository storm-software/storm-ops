#!/usr/bin/env zx

if (
  process.argv
    .slice(2)
    .some(
      (arg) =>
        arg.includes("pnpm-lock.json") ||
        arg.includes("pnpm-lock.yaml") ||
        arg.includes("pnpm-lock.yml")
    )
) {
  console.warn(
    [
      "⚠️ ----------------------------------------------------------------------------------------- ⚠️",
      "⚠️  The pnpm-lock file changed! Please run `pnpm i` to ensure your packages are up to date.  ⚠️",
      "⚠️ ----------------------------------------------------------------------------------------- ⚠️"
    ].join("\n")
  );
}
