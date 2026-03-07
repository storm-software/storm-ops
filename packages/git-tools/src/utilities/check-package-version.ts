/**
 * Checks if the package version has changed by looking for changes in lock files.
 *
 * @param files - An array of file paths to check for changes. Typically, this would be the list of files changed in a git commit or checkout.
 * @returns true if any of the lock files have changed, indicating a potential change in package versions; otherwise, false.
 */
export const isPackageVersionChanged = (files: string[]) =>
  files?.some(
    arg =>
      arg.includes("package-lock.json") ||
      arg.includes("yarn.lock") ||
      arg.includes("pnpm-lock.json") ||
      arg.includes("pnpm-lock.yaml") ||
      arg.includes("pnpm-lock.yml") ||
      arg.includes("bun.lockb")
  );

/**
 * Checks if the package version has changed and logs a warning if it has. This function is typically used in git hooks to alert developers to run `pnpm i` when lock files have changed, ensuring that their local environment is up to date with the latest dependencies.
 *
 * @param files - An array of file paths to check for changes. Typically, this would be the list of files changed in a git commit or checkout.
 */
export const checkPackageVersion = (files: string[]) => {
  if (isPackageVersionChanged(files)) {
    console.warn(
      [
        "⚠️ ----------------------------------------------------------------------------------------- ⚠️",
        "⚠️  The pnpm-lock file changed! Please run `pnpm i` to ensure your packages are up to date.  ⚠️",
        "⚠️ ----------------------------------------------------------------------------------------- ⚠️"
      ].join("\n")
    );
  }
};
