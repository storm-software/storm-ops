import { joinPaths } from "@storm-software/config-tools/utilities/correct-paths";
import { findWorkspaceRoot } from "@storm-software/config-tools/utilities/find-workspace-root";
import { dump, load } from "js-yaml";
import { existsSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { PnpmWorkspaceFile } from "../types";

/**
 * Retrieve the pnpm catalog from the workspace's `pnpm-workspace.yaml` file.
 *
 * @param workspaceRoot - The root directory of the workspace. Defaults to the result of `findWorkspaceRoot(process.cwd())`.
 * @returns A promise that resolves to the catalog object if found, or undefined if no catalog exists or the `pnpm-workspace.yaml` file is not found.
 * @throws Will throw an error if the `pnpm-workspace.yaml` file is found but cannot be read.
 */
export function getPnpmWorkspaceFilePath(
  workspaceRoot = findWorkspaceRoot(process.cwd())
): string {
  const pnpmWorkspacePath = joinPaths(workspaceRoot, "pnpm-workspace.yaml");
  if (!existsSync(pnpmWorkspacePath)) {
    throw new Error(
      `No \`pnpm-workspace.yaml\` file found in workspace root (searched in: ${pnpmWorkspacePath}).`
    );
  }

  return pnpmWorkspacePath;
}

/**
 * Retrieve the pnpm catalog from the workspace's `pnpm-workspace.yaml` file.
 *
 * @param workspaceRoot - The root directory of the workspace. Defaults to the result of `findWorkspaceRoot(process.cwd())`.
 * @returns A promise that resolves to the catalog object if found, or undefined if no catalog exists or the `pnpm-workspace.yaml` file is not found.
 * @throws Will throw an error if the `pnpm-workspace.yaml` file is found but cannot be read.
 */
export async function readPnpmWorkspaceFile(
  workspaceRoot = findWorkspaceRoot(process.cwd())
): Promise<PnpmWorkspaceFile | undefined> {
  return load(getPnpmWorkspaceFilePath(workspaceRoot)) as PnpmWorkspaceFile;
}

/**
 * Retrieve the pnpm catalog from the workspace's `pnpm-workspace.yaml` file.
 *
 * @param workspaceRoot - The root directory of the workspace. Defaults to the result of `findWorkspaceRoot(process.cwd())`.
 * @returns A promise that resolves to the catalog object if found, or undefined if no catalog exists or the `pnpm-workspace.yaml` file is not found.
 * @throws Will throw an error if the `pnpm-workspace.yaml` file is found but cannot be read.
 */
export async function writePnpmWorkspaceFile(
  pnpmWorkspaceFile: PnpmWorkspaceFile,
  workspaceRoot = findWorkspaceRoot(process.cwd())
) {
  await writeFile(
    getPnpmWorkspaceFilePath(workspaceRoot),
    dump(pnpmWorkspaceFile)
  );
}
