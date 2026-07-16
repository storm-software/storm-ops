import type { StormWorkspaceConfig } from "@storm-software/config";
import {
  getInstallCommand,
  getLockFileName
} from "./package-manager";

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
      arg.includes("bun.lock") ||
      arg.includes("bun.lockb")
  );

/**
 * Checks if the package version has changed and logs a warning if it has. This function is typically used in git hooks to alert developers to run the configured package manager install command when lock files have changed, ensuring that their local environment is up to date with the latest dependencies.
 *
 * @param files - An array of file paths to check for changes. Typically, this would be the list of files changed in a git commit or checkout.
 * @param config - The workspace configuration used to determine the package manager and install command.
 */
export const checkPackageVersion = (
  files: string[],
  config: StormWorkspaceConfig
) => {
  if (isPackageVersionChanged(files)) {
    const lockFileName = getLockFileName(config.packageManager);
    const installCommand = getInstallCommand(config.packageManager);

    console.warn(
      [
        "⚠️ ----------------------------------------------------------------------------------------- ⚠️",
        `⚠️  The ${lockFileName} file changed! Please run \`${installCommand}\` to ensure your packages are up to date.  ⚠️`,
        "⚠️ ----------------------------------------------------------------------------------------- ⚠️"
      ].join("\n")
    );
  }
};
