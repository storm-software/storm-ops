import { existsSync } from "node:fs";
import {
  readJsonFile,
  workspaceRoot,
  type RawProjectGraphDependency,
  type CreateDependenciesContext,
  type CreateNodesContext,
  type PackageManager,
  type ProjectGraphExternalNode,
  output
} from "nx/src/devkit-exports";
import { join } from "node:path";
import {
  getYarnLockfileDependencies,
  getYarnLockfileNodes
} from "nx/src/plugins/js/lock-file/yarn-parser";
import {
  getPnpmLockfileDependencies,
  getPnpmLockfileNodes
} from "nx/src/plugins/js/lock-file/pnpm-parser";
import {
  getNpmLockfileDependencies,
  getNpmLockfileNodes
} from "nx/src/plugins/js/lock-file/npm-parser";

export const YARN_LOCK_FILE = "yarn.lock";
export const NPM_LOCK_FILE = "package-lock.json";
export const PNPM_LOCK_FILE = "pnpm-lock.yaml";
export const LOCK_FILES = [YARN_LOCK_FILE, NPM_LOCK_FILE, PNPM_LOCK_FILE];

export const YARN_LOCK_PATH = join(workspaceRoot, YARN_LOCK_FILE);
export const NPM_LOCK_PATH = join(workspaceRoot, NPM_LOCK_FILE);
export const PNPM_LOCK_PATH = join(workspaceRoot, PNPM_LOCK_FILE);

/**
 * Parses lock file and maps dependencies and metadata to {@link LockFileGraph}
 */
export function getLockFileNodes(
  packageManager: PackageManager,
  contents: string,
  lockFileHash: string,
  context: CreateNodesContext
): Record<string, ProjectGraphExternalNode> {
  try {
    if (packageManager === "yarn") {
      const packageJson = readJsonFile(join(context.workspaceRoot, "package.json"));
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
  context: CreateDependenciesContext
): RawProjectGraphDependency[] {
  try {
    if (packageManager === "yarn") {
      return getYarnLockfileDependencies(contents, lockFileHash, context);
    }
    if (packageManager === "pnpm") {
      return getPnpmLockfileDependencies(contents, lockFileHash, context);
    }
    if (packageManager === "npm") {
      return getNpmLockfileDependencies(contents, lockFileHash, context);
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
  throw new Error(`Unknown package manager ${packageManager} or lock file missing`);
}

/**
 * Returns lock file name based on the detected package manager in the root
 * @param packageManager
 * @returns
 */
export function getLockFileName(packageManager: PackageManager): string {
  if (packageManager === "yarn") {
    return YARN_LOCK_FILE;
  }
  if (packageManager === "pnpm") {
    return PNPM_LOCK_FILE;
  }
  if (packageManager === "npm") {
    return NPM_LOCK_FILE;
  }
  throw new Error(`Unknown package manager: ${packageManager}`);
}

// generate body lines for error message
function errorBodyLines(originalError: Error, additionalInfo: string[] = []): string[] {
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
  return process.env.npm_command === "install" && process.env.npm_lifecycle_event === "postinstall";
}
