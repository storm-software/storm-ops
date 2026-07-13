import { getWorkspaceConfig } from "@storm-software/config-tools/get-config";
import {
  writeDebug,
  writeTrace,
  writeWarning
} from "@storm-software/config-tools/logger/console";
import { findWorkspaceRoot } from "@storm-software/config-tools/utilities/find-workspace-root";
import { DEFAULT_NPM_TAG } from "@storm-software/npm-tools/constants";
import { getNpmRegistry } from "@storm-software/npm-tools/helpers/get-registry";
import { getVersion } from "@storm-software/npm-tools/helpers/get-version";
import { coerce, gt, valid } from "semver";
import { replacePrefix } from "./format";
import {
  getCatalogFromPackageJson,
  readRootPackageJson,
  setCatalogInPackageJson,
  writeRootPackageJson
} from "./package-json";

/**
 * Safely retrieve the workspace catalog from the workspace root `package.json` file.
 *
 * @param workspaceRoot - The root directory of the workspace. Defaults to the result of `findWorkspaceRoot(process.cwd())`.
 * @returns A promise that resolves to the catalog object if found, or undefined if no catalog exists or the `package.json` file is not found.
 */
export async function getCatalogSafe(
  workspaceRoot = findWorkspaceRoot(process.cwd())
): Promise<Record<string, string> | undefined> {
  const packageJson = await readRootPackageJson(workspaceRoot);
  if (!packageJson) {
    throw new Error("No package.json file found in workspace root");
  }

  const catalog = getCatalogFromPackageJson(packageJson);
  if (catalog) {
    return Object.fromEntries(
      Object.entries(catalog).map(([key, value]) => {
        return [key, value.replaceAll('"', "").replaceAll("'", "")];
      })
    );
  }

  console.warn(
    `No catalog found in package.json file located in workspace root: ${workspaceRoot} \nFile content: ${JSON.stringify(
      packageJson,
      null,
      2
    )}`
  );

  return undefined;
}

/**
 * Retrieve the workspace catalog from the workspace root `package.json` file.
 *
 * @param workspaceRoot - The root directory of the workspace. Defaults to the result of `findWorkspaceRoot(process.cwd())`.
 * @returns A promise that resolves to the catalog object if found, or throws an error if no catalog exists or the `package.json` file is not found.
 * @throws Will throw an error if the `package.json` file is found but cannot be read.
 */
export async function getCatalog(
  workspaceRoot = findWorkspaceRoot(process.cwd())
): Promise<Record<string, string> | undefined> {
  const catalog = await getCatalogSafe(workspaceRoot);
  if (!catalog) {
    throw new Error("No catalog entries found in workspace root package.json file");
  }

  return catalog;
}

/**
 * Set the workspace catalog in the workspace root `package.json` file.
 *
 * @param catalog - The catalog object to set in the `package.json` file.
 * @param workspaceRoot - The root directory of the workspace. Defaults to the result of `findWorkspaceRoot(process.cwd())`.
 */
export async function setCatalog(
  catalog: Record<string, string>,
  workspaceRoot = findWorkspaceRoot(process.cwd())
) {
  const packageJson = await readRootPackageJson(workspaceRoot);
  if (!packageJson) {
    throw new Error("No package.json file found in workspace root");
  }

  setCatalogInPackageJson(
    packageJson,
    Object.fromEntries(
      Object.entries(catalog)
        .filter(([, value]) => value && valid(replacePrefix(value), true))
        .map(([key, value]) => {
          return [key, value.replaceAll('"', "").replaceAll("'", "")];
        })
    )
  );

  await writeRootPackageJson(packageJson, workspaceRoot);
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

  /**
   * The version prefix to use when updating the package (e.g., "^", "~", or "1.2.3"). Defaults to "^".
   *
   * - Caret (^): The default prefix. It allows updates to the latest minor or patch version while staying within the same major version. Example: "^1.2.3" allows updates to 1.3.0 or 1.2.4, but not 2.0.0.
   * - Tilde (~): Allows updates to the latest patch version while staying within the same minor version. Example: "~1.2.3" allows updates to 1.2.4 but not 1.3.0.
   * - Exact (no prefix): Locks the dependency to a specific version. No updates are allowed. Example: 1.2.3 will only use 1.2.3.
   * - Greater/Less Than (>, <, >=, <=): Specifies a range of acceptable versions. Example: ">=1.2.3 <2.0.0" allows any version from 1.2.3 to 1.9.x.
   * - Wildcard (*): Allows the most flexibility by accepting any version. Example: "*2.4.6" allows any version.
   *
   * @defaultValue `"^"`
   */
  prefix?: "^" | "~" | ">" | "<" | ">=" | "<=" | "*";

  /**
   * An indicator of whether to enable debug logging for the upgrade process.
   *
   * @defaultValue `false`
   */
  verbose?: boolean;
}

export interface UpgradeCatalogResult {
  catalog: Record<string, string>;
  updated: boolean;
}

/**
 * Upgrade a package in the workspace catalog.
 *
 * @param catalog - The workspace catalog to update.
 * @param packageName - The name of the package to upgrade.
 * @param options - Options for upgrading the package.
 * @returns The updated catalog.
 */
export async function upgradeCatalog(
  catalog: Record<string, string>,
  packageName: string,
  options: UpgradeCatalogPackageOptions = {}
): Promise<UpgradeCatalogResult> {
  const {
    tag = DEFAULT_NPM_TAG,
    prefix = "^",
    workspaceRoot = findWorkspaceRoot(),
    verbose = false
  } = options;

  const workspaceConfig = await getWorkspaceConfig(true, { workspaceRoot });

  if (verbose) {
    writeTrace(
      `Upgrading catalog entry for package "${packageName}" with tag "${tag}"`,
      workspaceConfig
    );
  }

  const registry = await getNpmRegistry();
  const origVersion = await getVersion(packageName, tag, {
    executable: "bun pm",
    registry
  });
  if (!origVersion) {
    throw new Error(
      `Failed to fetch version for package "${packageName}" with tag "${tag}"`
    );
  }
  if (!valid(replacePrefix(origVersion), true)) {
    throw new Error(
      `Invalid version "${origVersion}" fetched for package "${packageName}" with tag "${tag}"`
    );
  }

  const version = `${prefix || ""}${replacePrefix(origVersion)}`;

  let updated = false;
  if (
    !valid(coerce(catalog[packageName])) ||
    (coerce(catalog[packageName]) &&
      coerce(version) &&
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      gt(coerce(version)!, coerce(catalog[packageName])!))
  ) {
    catalog[packageName] = `${prefix || ""}${replacePrefix(version)}`;

    writeDebug(
      `Writing version ${catalog[packageName]} to catalog for "${
        packageName
      }" package`,
      workspaceConfig
    );

    updated = true;
  } else if (verbose) {
    writeDebug(
      `The current version ${catalog[packageName]} for package "${
        packageName
      }" is greater than or equal to the version ${replacePrefix(
        version
      )} fetched from the npm registry with tag "${tag}". No update performed.`,
      workspaceConfig
    );
  }

  return { catalog, updated };
}

/**
 * Update package.json dependencies currently using `catalog:` or `workspace:*` to use the workspace catalog dependencies actual versions and the local workspace versions respectively.
 *
 * @param packageRoot - The root directory of the package to update. Defaults to the current working directory.
 * @param workspaceRoot - The root directory of the workspace. Defaults to the result of `findWorkspaceRoot(packageRoot)`.
 * @returns A promise that resolves when the package.json file has been updated.
 * @throws Will throw an error if no package.json file is found in the package root, or if a dependency is marked as `catalog:` but no catalog exists.
 */
export async function saveCatalog(
  packageName: string,
  options: UpgradeCatalogPackageOptions = {}
) {
  const {
    tag = DEFAULT_NPM_TAG,
    prefix = "^",
    throwIfMissingInCatalog = false,
    workspaceRoot = findWorkspaceRoot(),
    verbose = false
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

  if (verbose) {
    writeTrace(
      `Upgrading catalog entry for package "${packageName}" with tag "${tag}"`,
      workspaceConfig
    );
  }

  const registry = await getNpmRegistry();
  const origVersion = await getVersion(packageName, tag, {
    executable: "bun pm",
    registry
  });
  if (!origVersion) {
    throw new Error(
      `Failed to fetch version for package "${packageName}" with tag "${tag}"`
    );
  }
  if (!valid(replacePrefix(origVersion), true)) {
    throw new Error(
      `Invalid version "${origVersion}" fetched for package "${packageName}" with tag "${tag}"`
    );
  }

  const version = `${prefix || ""}${replacePrefix(origVersion)}`;

  if (version === catalog[packageName]) {
    if (verbose) {
      writeTrace(
        `The version for package "${packageName}" is already up to date in the catalog: ${version}`,
        workspaceConfig
      );
    }
  } else if (
    !valid(replacePrefix(catalog[packageName]), true) ||
    (coerce(catalog[packageName]) &&
      coerce(version) &&
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      gt(coerce(version)!, coerce(catalog[packageName])!))
  ) {
    catalog[packageName] = `${prefix || ""}${replacePrefix(version)}`;

    writeDebug(
      `Writing version ${catalog[packageName]} to catalog for "${packageName}" package`,
      workspaceConfig
    );

    await setCatalog(catalog, workspaceRoot);
  } else if (verbose) {
    writeWarning(
      `The current version "${catalog[packageName]}" for package "${
        packageName
      }" is greater than or equal to the version "${
        version
      }" fetched from the npm registry with tag "${tag}". No update performed.`,
      workspaceConfig
    );
  }
}
