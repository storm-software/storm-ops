import {
  detectPackageManager,
  getPackageManagerCommand,
  type PackageManager
} from "@nx/devkit";
import type { StormWorkspaceConfig } from "@storm-software/config";
import { getConfig } from "@storm-software/config-tools/get-config";

export type { PackageManager };

export interface PackageManagerCommands {
  preInstall?: string;
  install: string;
  ciInstall: string;
  updateLockFile: string;
  add: string;
  addDev: string;
  rm: string;
  exec: string;
  dlx: string;
  list: string;
  why: string;
  run: (script: string, args?: string) => string;
  getRegistryUrl?: string;
  publish: (
    packageRoot: string,
    registry: string,
    registryConfigKey: string,
    tag: string
  ) => string;
  ignoreScriptsFlag?: string;
}

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

export function getInstallCommand(packageManager: PackageManager): string {
  return getPackageManagerCommand(packageManager).install;
}
