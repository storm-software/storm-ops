import { getWorkspaceConfig } from "@storm-software/config-tools/get-config";
import {
  writeDebug,
  writeTrace
} from "@storm-software/config-tools/logger/console";
import { findWorkspaceRoot } from "@storm-software/config-tools/utilities/find-workspace-root";
import { DEFAULT_NPM_TAG } from "@storm-software/npm-tools/constants";
import { getVersion } from "@storm-software/npm-tools/helpers/get-version";
import { coerce, gt, valid } from "semver";
import {
  readPnpmWorkspaceFile,
  writePnpmWorkspaceFile
} from "./pnpm-workspace";

/**
 * Safely retrieve the pnpm catalog from the workspace's `pnpm-workspace.yaml` file.
 *
 * @param workspaceRoot - The root directory of the workspace. Defaults to the result of `findWorkspaceRoot(process.cwd())`.
 * @returns A promise that resolves to the catalog object if found, or undefined if no catalog exists or the `pnpm-workspace.yaml` file is not found.
 */
export async function getCatalogSafe(
  workspaceRoot = findWorkspaceRoot(process.cwd())
): Promise<Record<string, string> | undefined> {
  const pnpmWorkspaceFile = await readPnpmWorkspaceFile(workspaceRoot);
  if (!pnpmWorkspaceFile) {
    throw new Error("No pnpm-workspace.yaml file found");
  }

  if (pnpmWorkspaceFile?.catalog) {
    return Object.fromEntries(
      Object.entries(pnpmWorkspaceFile.catalog).map(([key, value]) => {
        return [key, value.replaceAll('"', "").replaceAll("'", "")];
      })
    );
  } else {
    console.warn(
      `No catalog found in pnpm-workspace.yaml file located in workspace root: ${workspaceRoot} \nFile content: ${JSON.stringify(
        pnpmWorkspaceFile,
        null,
        2
      )}`
    );
  }

  return undefined;
}

/**
 * Retrieve the pnpm catalog from the workspace's `pnpm-workspace.yaml` file.
 *
 * @param workspaceRoot - The root directory of the workspace. Defaults to the result of `findWorkspaceRoot(process.cwd())`.
 * @returns A promise that resolves to the catalog object if found, or throws an error if no catalog exists or the `pnpm-workspace.yaml` file is not found.
 * @throws Will throw an error if the `pnpm-workspace.yaml` file is found but cannot be read.
 */
export async function getCatalog(
  workspaceRoot = findWorkspaceRoot(process.cwd())
): Promise<Record<string, string> | undefined> {
  const catalog = await getCatalogSafe(workspaceRoot);
  if (!catalog) {
    throw new Error("No catalog entries found in pnpm-workspace.yaml file");
  }

  return catalog;
}

/**
 * Set the pnpm catalog in the workspace's `pnpm-workspace.yaml` file.
 *
 * @param catalog - The catalog object to set in the `pnpm-workspace.yaml` file.
 * @param workspaceRoot - The root directory of the workspace. Defaults to the result of `findWorkspaceRoot(process.cwd())`.
 */
export async function setCatalog(
  catalog: Record<string, string>,
  workspaceRoot = findWorkspaceRoot(process.cwd())
) {
  const pnpmWorkspaceFile = await readPnpmWorkspaceFile(workspaceRoot);
  if (!pnpmWorkspaceFile) {
    throw new Error("No pnpm-workspace.yaml file found");
  }

  pnpmWorkspaceFile.catalog = Object.fromEntries(
    Object.entries(catalog).map(([key, value]) => {
      return [key, value.replaceAll('"', "").replaceAll("'", "")];
    })
  );

  await writePnpmWorkspaceFile(pnpmWorkspaceFile, workspaceRoot);
}

export interface UpgradeCatalogPackageOptions {
  /**
   * The npm tag to use when fetching the latest version of the package.
   *
   * @defaultValue `"latest"`
   */
  tag?: string;

  /**
   * The root directory of the workspace.
   *
   * @defaultValue The value returned by `findWorkspaceRoot(process.cwd())`
   */
  workspaceRoot?: string;

  /**
   * An indicator of whether to throw an error if the package is not found in the catalog.
   *
   * @defaultValue `false`
   */
  throwIfMissingInCatalog?: boolean;
}

/**
 * Update package.json dependencies currently using `catalog:` or `workspace:*` to use the pnpm catalog dependencies actual versions and the local workspace versions respectively.
 *
 * @param packageRoot - The root directory of the package to update. Defaults to the current working directory.
 * @param workspaceRoot - The root directory of the workspace. Defaults to the result of `findWorkspaceRoot(packageRoot)`.
 * @returns A promise that resolves when the package.json file has been updated.
 * @throws Will throw an error if no package.json file is found in the package root, or if a dependency is marked as `catalog:` but no catalog exists.
 */
export async function upgradeCatalogPackage(
  packageName: string,
  options: UpgradeCatalogPackageOptions = {}
) {
  const {
    tag = DEFAULT_NPM_TAG,
    throwIfMissingInCatalog = false,
    workspaceRoot = findWorkspaceRoot()
  } = options;

  const workspaceConfig = await getWorkspaceConfig(true, { workspaceRoot });

  const catalog = await getCatalog(workspaceRoot);
  if (!catalog) {
    throw new Error("No catalog found");
  }
  if (throwIfMissingInCatalog === true && !catalog[packageName]) {
    throw new Error(
      `Package "${packageName}" not found in catalog: ${JSON.stringify(
        catalog,
        null,
        2
      )}`
    );
  }

  writeTrace(
    `Upgrading catalog entry for package "${packageName}" with tag "${tag}"`,
    workspaceConfig
  );

  const version = await getVersion(packageName, tag);
  if (
    !valid(coerce(catalog[packageName])) ||
    (coerce(catalog[packageName]) &&
      coerce(version) &&
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      gt(coerce(version)!, coerce(catalog[packageName])!))
  ) {
    catalog[packageName] = version;
  }

  writeDebug(
    `Writing version ${version} to catalog for "${packageName}" package`,
    workspaceConfig
  );

  await setCatalog(catalog, workspaceRoot);
}
