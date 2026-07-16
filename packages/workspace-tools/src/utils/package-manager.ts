import {
  detectPackageManager,
  getPackageManagerCommand,
  type PackageManager,
  type PackageManagerCommands
} from "@nx/devkit";
import type { StormWorkspaceConfig } from "@storm-software/config";
import { getConfig } from "@storm-software/config-tools/get-config";

export type { PackageManager, PackageManagerCommands };

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

/**
 * Resolve the workspace package manager from StormWorkspaceConfig,
 * falling back to Nx lockfile detection.
 */
export async function getWorkspacePackageManager(
  workspaceRoot?: string,
  config?: Pick<StormWorkspaceConfig, "packageManager"> | null
): Promise<PackageManager> {
  let packageManager = config?.packageManager;

  if (!packageManager) {
    try {
      packageManager = (await getConfig(workspaceRoot)).packageManager;
    } catch {
      packageManager = undefined;
    }
  }

  if (
    packageManager === "npm" ||
    packageManager === "yarn" ||
    packageManager === "pnpm" ||
    packageManager === "bun"
  ) {
    return packageManager;
  }

  return detectPackageManager(workspaceRoot);
}

/**
 * Resolve PackageManagerCommands using StormWorkspaceConfig.packageManager.
 */
export async function getWorkspacePackageManagerCommand(
  workspaceRoot?: string,
  config?: Pick<StormWorkspaceConfig, "packageManager"> | null
): Promise<PackageManagerCommands> {
  const packageManager = await getWorkspacePackageManager(
    workspaceRoot,
    config
  );
  return getPackageManagerCommand(packageManager, workspaceRoot);
}

export function getLockFileName(packageManager: PackageManager): string {
  return LOCK_FILE_BY_PACKAGE_MANAGER[packageManager];
}

export function getOtherLockFileNames(
  packageManager: PackageManager
): string[] {
  return OTHER_LOCK_FILES[packageManager];
}

export function getInstallCommand(packageManager: PackageManager): string {
  return getPackageManagerCommand(packageManager).install;
}
