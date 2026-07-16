import type { StormWorkspaceConfig } from "@storm-software/config";

export type PackageManager = NonNullable<
  StormWorkspaceConfig["packageManager"]
>;

const LOCK_FILE_BY_PACKAGE_MANAGER: Record<PackageManager, string> = {
  npm: "package-lock.json",
  yarn: "yarn.lock",
  pnpm: "pnpm-lock.yaml",
  bun: "bun.lock"
};

const OTHER_LOCK_FILES: Record<PackageManager, string[]> = {
  npm: ["yarn.lock", "pnpm-lock.yaml", "bun.lock", "bun.lockb"],
  yarn: ["package-lock.json", "pnpm-lock.yaml", "bun.lock", "bun.lockb"],
  pnpm: ["package-lock.json", "yarn.lock", "bun.lock", "bun.lockb"],
  bun: ["package-lock.json", "yarn.lock", "pnpm-lock.yaml", "bun.lockb"]
};

export function getLockFileName(
  packageManager: PackageManager
): string {
  return LOCK_FILE_BY_PACKAGE_MANAGER[packageManager];
}

export function getOtherLockFileNames(
  packageManager: PackageManager
): string[] {
  return OTHER_LOCK_FILES[packageManager];
}

export function getInstallCommand(
  packageManager: PackageManager
): string {
  switch (packageManager) {
    case "npm":
      return "npm i";
    case "yarn":
      return "yarn install";
    case "pnpm":
      return "pnpm i";
    case "bun":
      return "bun install";
  }
}
