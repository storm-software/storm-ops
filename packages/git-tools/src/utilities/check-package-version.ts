export const isPackageVersionChanged = fields =>
  fields?.some(
    arg =>
      arg.includes("package-lock.json") ||
      arg.includes("yarn.lock") ||
      arg.includes("pnpm-lock.json") ||
      arg.includes("pnpm-lock.yaml") ||
      arg.includes("pnpm-lock.yml") ||
      arg.includes("bun.lockb")
  );

export const checkPackageVersion = fields => {
  if (isPackageVersionChanged(fields)) {
    console.warn(
      [
        "⚠️ ----------------------------------------------------------------------------------------- ⚠️",
        "⚠️  The pnpm-lock file changed! Please run `pnpm i` to ensure your packages are up to date.  ⚠️",
        "⚠️ ----------------------------------------------------------------------------------------- ⚠️"
      ].join("\n")
    );
  }
};
