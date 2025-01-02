import { joinPaths } from "@storm-software/config-tools/utilities/correct-paths";
import { readJson, writeJson } from "fs-extra";
import path from "node:path";
import readYamlFile from "read-yaml-file";

let pnpmCatalog = {} as Record<string, string>;

/**
 * Update package.json dependencies to use pnpm catalog versions
 *
 * @param packageRoot - The root of the package
 * @param workspaceRoot - The root of the workspace
 */
export async function pnpmCatalogUpdate(
  packageRoot: string,
  workspaceRoot: string = process.cwd()
) {
  if (!pnpmCatalog) {
    const pnpmWorkspaceYaml = await readYamlFile<{
      catalog: Record<string, string>;
    }>(path.resolve(joinPaths(workspaceRoot, "pnpm-workspace.yaml")));
    if (pnpmWorkspaceYaml?.catalog) {
      pnpmCatalog = pnpmWorkspaceYaml.catalog;
    }
  }

  const packageJsonPath = joinPaths(packageRoot, "package.json");
  const packageJson = await readJson(packageJsonPath);

  for (const depObjKey of [
    "dependencies",
    "devDependencies",
    "peerDependencies"
  ]) {
    const depObj = packageJson[depObjKey];
    if (!depObj) {
      continue;
    }

    for (const depName of Object.keys(depObj)) {
      if (depObj[depName] === "catalog:") {
        const catalogVersion = pnpmCatalog[depName];
        if (!catalogVersion) {
          throw new Error("Missing pnpm catalog version for " + depName);
        }

        depObj[depName] = catalogVersion;
      } else if (depObj[depName].startsWith("catalog:")) {
        throw new Error("multiple named catalogs not supported");
      }
    }
  }

  await writeJson(packageJsonPath, packageJson);
}
