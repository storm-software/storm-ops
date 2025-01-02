import { readFile, writeFile } from "node:fs/promises";
import path, { join } from "node:path";
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
  const pnpmWorkspacePath = join(workspaceRoot, "pnpm-workspace.yaml");
  if (!pnpmCatalog) {
    const pnpmWorkspaceYaml = await readYamlFile<{
      catalog: Record<string, string>;
    }>(path.resolve(pnpmWorkspacePath));
    if (pnpmWorkspaceYaml?.catalog) {
      pnpmCatalog = pnpmWorkspaceYaml.catalog;
    }
  }

  if (!pnpmCatalog) {
    console.warn(
      `No \`pnpm-workspace.yaml\` file found in workspace root (searching for: ${pnpmWorkspacePath}). Skipping pnpm catalog update.`
    );
    return;
  }

  const packageJsonPath = join(packageRoot, "package.json");
  const packageJsonFile = await readFile(packageJsonPath, "utf8");
  if (!packageJsonFile) {
    throw new Error(
      "No package.json file found in package root: " + packageRoot
    );
  }

  const packageJson = JSON.parse(packageJsonFile);
  for (const dependencyType of [
    "dependencies",
    "devDependencies",
    "peerDependencies"
  ]) {
    const dependencies = packageJson[dependencyType];
    if (!dependencies) {
      continue;
    }

    for (const dependencyName of Object.keys(dependencies)) {
      if (dependencies[dependencyName] === "catalog:") {
        const catalogVersion = pnpmCatalog[dependencyName];
        if (!catalogVersion) {
          throw new Error("Missing pnpm catalog version for " + dependencyName);
        }

        dependencies[dependencyName] = catalogVersion;
      } else if (dependencies[dependencyName].startsWith("catalog:")) {
        throw new Error("multiple named catalogs not supported");
      }
    }
  }

  return writeFile(packageJsonPath, JSON.stringify(packageJson));
}
