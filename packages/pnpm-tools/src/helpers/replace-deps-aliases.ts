import {
  createProjectGraphAsync,
  ProjectGraph,
  readCachedProjectGraph
} from "@nx/devkit";
import { joinPaths } from "@storm-software/config-tools/utilities/correct-paths";
import { findWorkspaceRoot } from "@storm-software/config-tools/utilities/find-workspace-root";
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { format } from "prettier";
import { getCatalog } from "./catalog";

/**
 * Update package.json dependencies currently using `catalog:` or `workspace:*` to use the pnpm catalog dependencies actual versions and the local workspace versions respectively.
 *
 * @param packageRoot - The root directory of the package to update. Defaults to the current working directory.
 * @param workspaceRoot - The root directory of the workspace. Defaults to the result of `findWorkspaceRoot(packageRoot)`.
 * @returns A promise that resolves when the package.json file has been updated.
 * @throws Will throw an error if no package.json file is found in the package root, or if a dependency is marked as `catalog:` but no catalog exists.
 */
export async function replaceDepsAliases(
  packageRoot = process.cwd(),
  workspaceRoot = findWorkspaceRoot(packageRoot)
) {
  const packageJsonPath = joinPaths(packageRoot, "package.json");
  const packageJsonFile = await readFile(packageJsonPath, "utf8");
  if (!packageJsonFile) {
    throw new Error(
      "No package.json file found in package root: " + packageRoot
    );
  }

  const catalog = await getCatalog(workspaceRoot);
  const packageJson = JSON.parse(packageJsonFile);

  const pnpmWorkspacePath = joinPaths(workspaceRoot, "pnpm-workspace.yaml");
  if (!existsSync(pnpmWorkspacePath)) {
    console.warn(
      `No \`pnpm-workspace.yaml\` file found in workspace root (searching in: ${pnpmWorkspacePath}). Skipping pnpm catalog read for now.`
    );

    return packageJson;
  }

  if (!catalog) {
    console.warn(
      `No pnpm catalog found. Skipping dependencies replacement for now.`
    );
    return;
  }

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
        if (!catalog) {
          throw new Error(
            `Dependency ${dependencyName} is marked as \`catalog:\`, but no catalog exists in the workspace root's \`pnpm-workspace.yaml\` file.`
          );
        }

        const catalogVersion = catalog[dependencyName];
        if (!catalogVersion) {
          throw new Error("Missing pnpm catalog version for " + dependencyName);
        }

        dependencies[dependencyName] = catalogVersion;
      } else if (dependencies[dependencyName].startsWith("catalog:")) {
        throw new Error("multiple named catalogs not supported");
      }
    }
  }

  let projectGraph!: ProjectGraph;
  try {
    projectGraph = readCachedProjectGraph();
  } catch {
    await createProjectGraphAsync();
    projectGraph = readCachedProjectGraph();
  }

  const workspacePackages = {} as Record<string, string>;
  if (projectGraph) {
    await Promise.all(
      Object.keys(projectGraph.nodes).map(async node => {
        const projectNode = projectGraph.nodes[node];
        if (projectNode?.data.root) {
          const projectPackageJsonPath = joinPaths(
            workspaceRoot,
            projectNode.data.root,
            "package.json"
          );
          if (existsSync(projectPackageJsonPath)) {
            const projectPackageJsonContent = await readFile(
              projectPackageJsonPath,
              "utf8"
            );

            const projectPackageJson = JSON.parse(projectPackageJsonContent);
            if (projectPackageJson.private !== true) {
              workspacePackages[projectPackageJson.name] =
                projectPackageJson.version;
            }
          }
        }
      })
    );
  }

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
      if (dependencies[dependencyName].startsWith("workspace:")) {
        if (workspacePackages[dependencyName]) {
          dependencies[dependencyName] =
            `^${workspacePackages[dependencyName]}`;
        } else {
          throw new Error(
            `Workspace dependency ${dependencyName} not found in workspace packages.`
          );
        }
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
