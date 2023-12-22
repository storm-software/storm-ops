/**
 * Find Workspace Root
 *
 * @remarks
 * Find the monorepo root directory
 */

import { findUp, findUpSync } from "./find-up";

const rootFiles = [
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

/**
 * Find the monorepo root directory, searching upwards from `path`.
 *
 * @param pathInsideMonorepo - The path inside the monorepo to start searching from
 * @returns The monorepo root directory
 */
export async function findWorkspaceRootSafe(
  pathInsideMonorepo?: string
): Promise<string | undefined> {
  if (process.env.STORM_WORKSPACE_ROOT || process.env.NX_WORKSPACE_ROOT_PATH) {
    return (
      process.env.STORM_WORKSPACE_ROOT ?? process.env.NX_WORKSPACE_ROOT_PATH
    );
  }
  return await findUp(rootFiles, {
    cwd: pathInsideMonorepo ?? process.cwd(),
    type: "file",
    limit: 1
  });
}

/**
 * Find the monorepo root directory, searching upwards from `path`.
 *
 * @param pathInsideMonorepo - The path inside the monorepo to start searching from
 * @returns The monorepo root directory
 */
export function findWorkspaceRootSafeSync(
  pathInsideMonorepo?: string
): string | undefined {
  return process.env.STORM_WORKSPACE_ROOT
    ? process.env.STORM_WORKSPACE_ROOT
    : process.env.NX_WORKSPACE_ROOT_PATH
    ? process.env.NX_WORKSPACE_ROOT_PATH
    : findUpSync(rootFiles, {
        cwd: pathInsideMonorepo ?? process.cwd(),
        type: "file",
        limit: 1
      });
}

/**
 * Find the monorepo root directory, searching upwards from `path`.
 *
 * @param pathInsideMonorepo - The path inside the monorepo to start searching from
 * @returns The monorepo root directory
 */
export async function findWorkspaceRoot(
  pathInsideMonorepo?: string
): Promise<string> {
  const result = await findWorkspaceRootSafe(pathInsideMonorepo);
  if (!result) {
    throw new Error(
      `Cannot find workspace root upwards from known path. Files search list includes: \n${rootFiles.join(
        "\n"
      )}\nPath: ${pathInsideMonorepo ? pathInsideMonorepo : process.cwd()}`
    );
  }

  return result;
}

/**
 * Find the monorepo root directory, searching upwards from `path`.
 *
 * @param pathInsideMonorepo - The path inside the monorepo to start searching from
 * @returns The monorepo root directory
 */
export function findWorkspaceRootSync(pathInsideMonorepo?: string): string {
  const result = findWorkspaceRootSafeSync(pathInsideMonorepo);
  if (!result) {
    throw new Error(
      `Cannot find workspace root upwards from known path. Files search list includes: \n${rootFiles.join(
        "\n"
      )}\nPath: ${pathInsideMonorepo ? pathInsideMonorepo : process.cwd()}`
    );
  }

  return result;
}
