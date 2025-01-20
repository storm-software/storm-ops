import { joinPaths } from "@storm-software/config-tools";
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { format } from "prettier";
import readYamlFile from "read-yaml-file";

let pnpmCatalog!: Record<string, string>;

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
    const pnpmWorkspacePath = joinPaths(workspaceRoot, "pnpm-workspace.yaml");
    if (!existsSync(pnpmWorkspacePath)) {
      console.warn(
        `No \`pnpm-workspace.yaml\` file found in workspace root (searching in: ${pnpmWorkspacePath}). Skipping pnpm catalog read for now.`
      );

      return;
    }

    const pnpmWorkspaceYaml = await readYamlFile<{
      catalog: Record<string, string>;
    }>(pnpmWorkspacePath);
    console.info(
      `pnpmWorkspaceYaml: ${JSON.stringify(pnpmWorkspaceYaml ?? {})}`
    );

    if (pnpmWorkspaceYaml?.catalog) {
      pnpmCatalog = pnpmWorkspaceYaml.catalog;
    } else {
      console.warn(
        `Found a \`pnpm-workspace.yaml\` file in the workspace root directory, but no pnpm catalog existed:
File name: ${pnpmWorkspacePath}
File contents: ${pnpmWorkspaceYaml ? JSON.stringify(pnpmWorkspaceYaml) : "EMPTY FILE"}`
      );
    }
  }

  if (!pnpmCatalog) {
    console.warn(
      `No pnpm catalog found. Attempting to read from workspace root's \`pnpm-workspace.yaml\` file.`
    );
  }

  const packageJsonPath = joinPaths(packageRoot, "package.json");
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
        if (!pnpmCatalog) {
          throw new Error(
            `Dependency ${dependencyName} is marked as \`catalog:\`, but no catalog exists in the workspace root's \`pnpm-workspace.yaml\` file.`
          );
        }

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

  return writeFile(
    packageJsonPath,
    await format(JSON.stringify(packageJson), {
      parser: "json",
      proseWrap: "always",
      trailingComma: "none",
      tabWidth: 2,
      semi: true,
      singleQuote: false,
      quoteProps: "as-needed",
      insertPragma: false,
      bracketSameLine: true,
      printWidth: 80,
      bracketSpacing: true,
      arrowParens: "avoid",
      endOfLine: "lf",
      plugins: ["prettier-plugin-pkg"]
    })
  );
}
