import { existsSync } from "node:fs";
import { join } from "node:path";
import { correctPaths } from "./correct-paths";

const MAX_PATH_SEARCH_DEPTH = 30;
let depth = 0;

/**
 * Gets the nearest "node_modules" folder by walking up from start path.
 */
function findFolderUp(
  startPath: string,
  endFileNames: string[] = [],
  endDirectoryNames: string[] = []
): string | undefined {
  const _startPath = startPath ?? process.cwd();

  if (
    endDirectoryNames.some(endDirName =>
      existsSync(join(_startPath, endDirName))
    )
  ) {
    return _startPath;
  }

  if (
    endFileNames.some(endFileName => existsSync(join(_startPath, endFileName)))
  ) {
    return _startPath;
  }

  if (_startPath !== "/" && depth++ < MAX_PATH_SEARCH_DEPTH) {
    const parent = join(_startPath, "..");
    return findFolderUp(parent, endFileNames, endDirectoryNames);
  }
  return undefined;
}

const rootFiles = [
  "storm-workspace.json",
  "storm-workspace.json",
  "storm-workspace.yaml",
  "storm-workspace.yml",
  "storm-workspace.js",
  "storm-workspace.ts",
  ".storm-workspace.json",
  ".storm-workspace.yaml",
  ".storm-workspace.yml",
  ".storm-workspace.js",
  ".storm-workspace.ts",
  "lerna.json",
  "nx.json",
  "turbo.json",
  "npm-workspace.json",
  "yarn-workspace.json",
  "pnpm-workspace.json",
  "npm-workspace.yaml",
  "yarn-workspace.yaml",
  "pnpm-workspace.yaml",
  "npm-workspace.yml",
  "yarn-workspace.yml",
  "pnpm-workspace.yml",
  "npm-lock.json",
  "yarn-lock.json",
  "pnpm-lock.json",
  "npm-lock.yaml",
  "yarn-lock.yaml",
  "pnpm-lock.yaml",
  "npm-lock.yml",
  "yarn-lock.yml",
  "pnpm-lock.yml",
  "bun.lockb"
];

const rootDirectories = [
  ".storm-workspace",
  ".nx",
  ".github",
  ".vscode",
  ".verdaccio"
];

/**
 * Find the monorepo root directory, searching upwards from `path`.
 *
 * @param pathInsideMonorepo - The path inside the monorepo to start searching from
 * @returns The monorepo root directory
 */
export function findWorkspaceRootSafe(
  pathInsideMonorepo?: string
): string | undefined {
  if (process.env.STORM_WORKSPACE_ROOT || process.env.NX_WORKSPACE_ROOT_PATH) {
    return correctPaths(
      process.env.STORM_WORKSPACE_ROOT ?? process.env.NX_WORKSPACE_ROOT_PATH
    );
  }

  return correctPaths(
    findFolderUp(
      pathInsideMonorepo ?? process.cwd(),
      rootFiles,
      rootDirectories
    )
  );
}

/**
 * Find the monorepo root directory, searching upwards from `path`.
 *
 * @param pathInsideMonorepo - The path inside the monorepo to start searching from
 * @returns The monorepo root directory
 */
export function findWorkspaceRoot(pathInsideMonorepo?: string): string {
  const result = findWorkspaceRootSafe(pathInsideMonorepo);
  if (!result) {
    throw new Error(
      `Cannot find workspace root upwards from known path. Files search list includes: \n${rootFiles.join(
        "\n"
      )}\nPath: ${pathInsideMonorepo ? pathInsideMonorepo : process.cwd()}`
    );
  }

  return result;
}
