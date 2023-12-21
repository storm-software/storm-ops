/**
 * monorepo-root
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
 */
export function findWorkspaceRootSafe(
  pathInsideMonorepo?: string
): Promise<string | undefined> {
  return (
    process.env.STORM_WORKSPACE_ROOT
      ? process.env.STORM_WORKSPACE_ROOT
      : process.env.NX_WORKSPACE_ROOT_PATH
      ? process.env.NX_WORKSPACE_ROOT_PATH
      : findUp(rootFiles, {
          cwd: pathInsideMonorepo ?? process.cwd(),
          type: "file",
          limit: 1
        })
  ) as Promise<string | undefined>;
}

/**
 * Find the monorepo root directory, searching upwards from `path`.
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
 */
export function findWorkspaceRoot(
  pathInsideMonorepo?: string
): Promise<string> {
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

/**
 * Find the monorepo root directory, searching upwards from `path`.
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
