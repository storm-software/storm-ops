/**
 * Find Workspace Root
 *
 * @remarks
 * Find the monorepo root directory
 */

import { findFolderUp } from "./find-up";

const rootFiles = [
  "lerna.json",
  "storm.config.js",
  "storm.config.ts",
  ".storm.json",
  ".storm.yaml",
  ".storm.yml",
  ".storm.js",
  ".storm.ts",
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
    return (
      process.env.STORM_WORKSPACE_ROOT ?? process.env.NX_WORKSPACE_ROOT_PATH
    );
  }

  return findFolderUp(pathInsideMonorepo ?? process.cwd(), rootFiles);
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
