import { findWorkspaceRoot } from "@storm-software/config-tools/utilities/find-workspace-root";
import defu from "defu";
import { WorkspacePackageJson } from "../types";
import {
  getRootPackageJsonPath,
  readRootPackageJson,
  setCatalogInPackageJson,
  writeRootPackageJson
} from "./package-json";

/**
 * Retrieve the path to the workspace root `package.json` file.
 *
 * @param workspaceRoot - The root directory of the workspace. Defaults to the result of `findWorkspaceRoot(process.cwd())`.
 * @returns The absolute path to the workspace root `package.json` file.
 * @throws Will throw an error if the `package.json` file is not found.
 */
export function getWorkspaceFilePath(
  workspaceRoot = findWorkspaceRoot(process.cwd())
): string {
  return getRootPackageJsonPath(workspaceRoot);
}

/**
 * Read workspace catalog and package globs from the workspace root `package.json` file.
 *
 * @param workspaceRoot - The root directory of the workspace. Defaults to the result of `findWorkspaceRoot(process.cwd())`.
 * @returns A promise that resolves to the workspace catalog and package globs if found.
 */
export async function readWorkspaceFile(
  workspaceRoot = findWorkspaceRoot(process.cwd())
): Promise<WorkspacePackageJson | undefined> {
  const packageJson = await readRootPackageJson(workspaceRoot);
  if (!packageJson) {
    return undefined;
  }

  return packageJson;
}

/**
 * Write workspace catalog and package globs to the workspace root `package.json` file.
 *
 * @param workspaceFile - The workspace catalog and package globs to write.
 * @param workspaceRoot - The root directory of the workspace. Defaults to the result of `findWorkspaceRoot(process.cwd())`.
 */
export async function writeWorkspaceFile(
  workspaceFile: WorkspacePackageJson,
  workspaceRoot = findWorkspaceRoot(process.cwd())
) {
  const packageJson = await readRootPackageJson(workspaceRoot);
  if (!packageJson) {
    throw new Error("No package.json file found in workspace root");
  }

  if (workspaceFile.catalog) {
    setCatalogInPackageJson(packageJson, workspaceFile.catalog);
  }

  if (!workspaceFile.packages) {
    throw new Error("No packages found in workspace file");
  }

  if (Array.isArray(packageJson.workspaces) || !packageJson.workspaces) {
    packageJson.workspaces = {
      packages: workspaceFile.packages as string[],
      catalog: workspaceFile.catalog
    };
  } else {
    packageJson.workspaces.packages = defu(
      workspaceFile.packages as string[],
      packageJson.workspaces.packages as string[]
    );
    if (workspaceFile.catalog) {
      packageJson.workspaces.catalog = defu(
        workspaceFile.catalog,
        packageJson.workspaces.catalog
      );
    }
  }

  await writeRootPackageJson(packageJson, workspaceRoot);
}
