import {
  output,
  readJsonFile,
  workspaceRoot,
  type CreateDependenciesContext,
  type CreateNodesContext,
  type PackageManager,
  type ProjectGraphExternalNode,
  type RawProjectGraphDependency
} from "@nx/devkit";
import { existsSync } from "node:fs";
import { join } from "node:path";
import {
  getNpmLockfileDependencies,
  getNpmLockfileNodes
} from "nx/src/plugins/js/lock-file/npm-parser";
import {
  getPnpmLockfileDependencies,
  getPnpmLockfileNodes
} from "nx/src/plugins/js/lock-file/pnpm-parser";
import {
  getYarnLockfileDependencies,
  getYarnLockfileNodes
} from "nx/src/plugins/js/lock-file/yarn-parser";

export const YARN_LOCK_FILE = "yarn.lock";
export const NPM_LOCK_FILE = "package-lock.json";
export const PNPM_LOCK_FILE = "pnpm-lock.yaml";
export const BUN_LOCK_FILE = "bun.lock";
export const LOCK_FILES = [
  YARN_LOCK_FILE,
  NPM_LOCK_FILE,
  PNPM_LOCK_FILE,
  BUN_LOCK_FILE
];

export const YARN_LOCK_PATH = join(workspaceRoot, YARN_LOCK_FILE);
export const NPM_LOCK_PATH = join(workspaceRoot, NPM_LOCK_FILE);
export const PNPM_LOCK_PATH = join(workspaceRoot, PNPM_LOCK_FILE);
export const BUN_LOCK_PATH = join(workspaceRoot, BUN_LOCK_FILE);

/**
 * Parses lock file and maps dependencies and metadata to {@link LockFileGraph}
 */
export function getLockFileNodes(
  packageManager: PackageManager,
  contents: string,
  lockFileHash: string,
  context: CreateNodesContext
): {
  nodes: Record<string, ProjectGraphExternalNode>;
  keyMap:
    | Map<string, ProjectGraphExternalNode>
    | Map<string, Set<ProjectGraphExternalNode>>;
} {
  try {
    if (packageManager === "yarn") {
      const packageJson = readJsonFile(
        join(context.workspaceRoot, "package.json")
      );
      return getYarnLockfileNodes(contents, lockFileHash, packageJson);
    }
    if (packageManager === "pnpm") {
      return getPnpmLockfileNodes(contents, lockFileHash);
    }
    if (packageManager === "npm") {
      return getNpmLockfileNodes(contents, lockFileHash);
    }
  } catch (e) {
    if (!isPostInstallProcess()) {
      output.error({
        title: `Failed to parse ${packageManager} lockfile`,
        bodyLines: errorBodyLines(e)
      });
    }
    throw e;
  }
  throw new Error(`Unknown package manager: ${packageManager}`);
}

/**
 * Parses lock file and maps dependencies and metadata to {@link LockFileGraph}
 */
export function getLockFileDependencies(
  packageManager: PackageManager,
  contents: string,
  lockFileHash: string,
  context: CreateDependenciesContext,
  keyMap:
    | Map<string, ProjectGraphExternalNode>
    | Map<string, Set<ProjectGraphExternalNode>>
): RawProjectGraphDependency[] {
  try {
    if (packageManager === "yarn") {
      return getYarnLockfileDependencies(
        contents,
        lockFileHash,
        context,
        keyMap as Map<string, ProjectGraphExternalNode>
      );
    }
    if (packageManager === "pnpm") {
      return getPnpmLockfileDependencies(
        contents,
        lockFileHash,
        context,
        keyMap as Map<string, Set<ProjectGraphExternalNode>>
      );
    }
    if (packageManager === "npm") {
      return getNpmLockfileDependencies(
        contents,
        lockFileHash,
        context,
        keyMap as Map<string, ProjectGraphExternalNode>
      );
    }
  } catch (e) {
    if (!isPostInstallProcess()) {
      output.error({
        title: `Failed to parse ${packageManager} lockfile`,
        bodyLines: errorBodyLines(e)
      });
    }
    throw e;
  }
  throw new Error(`Unknown package manager: ${packageManager}`);
}

export function lockFileExists(packageManager: PackageManager): boolean {
  if (packageManager === "yarn") {
    return existsSync(YARN_LOCK_PATH);
  }
  if (packageManager === "pnpm") {
    return existsSync(PNPM_LOCK_PATH);
  }
  if (packageManager === "npm") {
    return existsSync(NPM_LOCK_PATH);
  }
  if (packageManager === "bun") {
    return (
      existsSync(BUN_LOCK_PATH) || existsSync(join(workspaceRoot, "bun.lockb"))
    );
  }
  throw new Error(
    `Unknown package manager ${packageManager} or lock file missing`
  );
}

export const LOCK_FILE_BY_PACKAGE_MANAGER: Record<PackageManager, string> = {
  npm: "package-lock.json",
  yarn: "yarn.lock",
  pnpm: "pnpm-lock.yaml",
  bun: "bun.lock"
};

export const OTHER_LOCK_FILES: Record<PackageManager, string[]> = {
  npm: ["yarn.lock", "pnpm-lock.yaml", "bun.lock", "bun.lockb"],
  yarn: ["package-lock.json", "pnpm-lock.yaml", "bun.lock", "bun.lockb"],
  pnpm: ["package-lock.json", "yarn.lock", "bun.lock", "bun.lockb"],
  bun: ["package-lock.json", "yarn.lock", "pnpm-lock.yaml", "bun.lockb"]
};

/**
 * Returns the lock file name for the given package manager
 *
 * @param packageManager - The package manager to get the lock file name for
 * @returns The lock file name for the given package manager
 */
export function getLockFileName(packageManager: PackageManager): string {
  return LOCK_FILE_BY_PACKAGE_MANAGER[packageManager];
}

/**
 * Returns the other lock file names for the given package manager
 *
 * @param packageManager - The package manager to get the other lock file names for
 * @returns The other lock file names for the given package manager
 */
export function getOtherLockFileNames(
  packageManager: PackageManager
): string[] {
  return OTHER_LOCK_FILES[packageManager];
}

// generate body lines for error message
function errorBodyLines(
  originalError: Error,
  additionalInfo: string[] = []
): string[] {
  const result = [
    "Please open an issue at `https://github.com/storm-software/storm-ops/issues/new?template=1-bug.yml` and provide a reproduction.",
    ...(additionalInfo as string[])
  ];

  if (originalError.message) {
    result.push(`\nOriginal error: ${originalError.message}\n\n`);
  }

  if (originalError.stack) {
    result.push(originalError.stack);
  }

  return result;
}

function isPostInstallProcess(): boolean {
  return (
    process.env.npm_command === "install" &&
    process.env.npm_lifecycle_event === "postinstall"
  );
}
