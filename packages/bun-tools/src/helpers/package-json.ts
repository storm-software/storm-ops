import { getWorkspaceConfig, writeTrace } from "@storm-software/config-tools";
import { joinPaths } from "@storm-software/config-tools/utilities/correct-paths";
import { findWorkspaceRoot } from "@storm-software/config-tools/utilities/find-workspace-root";
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { format } from "prettier";
import { WorkspacePackageJson } from "../types";

const PACKAGE_JSON_PRETTIER_OPTIONS = {
  parser: "json" as const,
  proseWrap: "preserve" as const,
  trailingComma: "none" as const,
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  quoteProps: "as-needed" as const,
  insertPragma: false,
  bracketSameLine: true,
  printWidth: 80,
  bracketSpacing: true,
  arrowParens: "avoid" as const,
  endOfLine: "lf" as const,
  plugins: ["prettier-plugin-packagejson"]
};

/**
 * Retrieve the path to the workspace root `package.json` file.
 *
 * @param workspaceRoot - The root directory of the workspace. Defaults to the result of `findWorkspaceRoot(process.cwd())`.
 * @returns The absolute path to the workspace root `package.json` file.
 * @throws Will throw an error if the `package.json` file is not found.
 */
export function getRootPackageJsonPath(
  workspaceRoot = findWorkspaceRoot(process.cwd())
): string {
  const packageJsonPath = joinPaths(workspaceRoot, "package.json");
  if (!existsSync(packageJsonPath)) {
    throw new Error(
      `No \`package.json\` file found in workspace root (searched in: ${packageJsonPath}).`
    );
  }

  return packageJsonPath;
}

/**
 * Read the workspace root `package.json` file.
 *
 * @param workspaceRoot - The root directory of the workspace. Defaults to the result of `findWorkspaceRoot(process.cwd())`.
 * @returns A promise that resolves to the parsed `package.json` object.
 */
export async function readRootPackageJson(
  workspaceRoot = findWorkspaceRoot(process.cwd())
): Promise<WorkspacePackageJson | undefined> {
  const result = await readFile(getRootPackageJsonPath(workspaceRoot), "utf8");
  if (!result) {
    return undefined;
  }

  return JSON.parse(result) as WorkspacePackageJson;
}

/**
 * Retrieve the catalog from a workspace root `package.json` file.
 *
 * Bun supports catalogs at the top level or within a `workspaces` object.
 *
 * @param packageJson - The parsed workspace root `package.json` object.
 * @returns The catalog object if found, or undefined if no catalog exists.
 */
export function getCatalogFromPackageJson(
  packageJson: WorkspacePackageJson
): Record<string, string> | undefined {
  if (packageJson.catalog) {
    return packageJson.catalog;
  }

  const workspaces = packageJson.workspaces;
  if (
    workspaces &&
    typeof workspaces === "object" &&
    !Array.isArray(workspaces)
  ) {
    return workspaces.catalog;
  }

  return undefined;
}

/**
 * Set the catalog on a workspace root `package.json` object.
 *
 * Updates the existing catalog location when present, otherwise writes to the top-level `catalog` field.
 *
 * @param packageJson - The parsed workspace root `package.json` object.
 * @param catalog - The catalog object to set.
 */
export function setCatalogInPackageJson(
  packageJson: WorkspacePackageJson,
  catalog: Record<string, string>
) {
  if (packageJson.catalog) {
    packageJson.catalog = catalog;
    return;
  }

  const workspaces = packageJson.workspaces;
  if (
    workspaces &&
    typeof workspaces === "object" &&
    !Array.isArray(workspaces) &&
    workspaces.catalog
  ) {
    workspaces.catalog = catalog;
    return;
  }

  packageJson.catalog = catalog;
}

/**
 * Write the workspace root `package.json` file.
 *
 * @param packageJson - The parsed workspace root `package.json` object.
 * @param workspaceRoot - The root directory of the workspace. Defaults to the result of `findWorkspaceRoot(process.cwd())`.
 */
export async function writeRootPackageJson(
  packageJson: WorkspacePackageJson,
  workspaceRoot = findWorkspaceRoot(process.cwd())
) {
  const config = await getWorkspaceConfig();
  const stringified = await format(
    JSON.stringify(packageJson),
    PACKAGE_JSON_PRETTIER_OPTIONS
  );

  writeTrace(
    `Writing updated package.json file to workspace root: ${stringified}`,
    config
  );

  await writeFile(getRootPackageJsonPath(workspaceRoot), stringified);
}
