import {
  createProjectGraphAsync,
  joinPathFragments,
  ProjectConfiguration,
  ProjectGraph,
  readCachedProjectGraph,
  readJsonFile
} from "@nx/devkit";
import { joinPaths } from "@storm-software/config-tools/utilities/correct-paths";
import {
  CargoToml,
  parseCargoToml
} from "@storm-software/config-tools/utilities/toml";
import { execFileSync } from "child_process";
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import type { PackageJson } from "nx/src/utils/package-json";
import { dirname, resolve } from "path";
import { format } from "prettier";
import prettierPlugin from "prettier-plugin-packagejson";
import { isEqualProjectTag, ProjectTagConstants } from "./project-tags";

const PACKAGE_JSON_DEP_FIELDS = [
  "dependencies",
  "devDependencies",
  "optionalDependencies",
  "peerDependencies"
] as const;

const PACKAGE_JSON_FORMAT_OPTIONS = {
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
  plugins: [prettierPlugin]
};

export type PackageManagerType = "package.json" | "Cargo.toml";
export const PackageManagerTypes = {
  PackageJson: "package.json" as PackageManagerType,
  CargoToml: "Cargo.toml" as PackageManagerType
};

export type PackageInfo = {
  content: PackageJson | CargoToml;
  type: PackageManagerType;
};

export const getPackageInfo = (
  project: ProjectConfiguration
): null | PackageInfo => {
  if (
    isEqualProjectTag(
      project,
      ProjectTagConstants.Language.TAG_ID,
      ProjectTagConstants.Language.RUST
    ) &&
    existsSync(joinPathFragments(project.root, "Cargo.toml"))
  ) {
    return {
      type: "Cargo.toml",
      content: parseCargoToml(joinPathFragments(project.root, "Cargo.toml"))
    };
  } else if (
    isEqualProjectTag(
      project,
      ProjectTagConstants.Language.TAG_ID,
      ProjectTagConstants.Language.TYPESCRIPT
    ) &&
    existsSync(joinPathFragments(project.root, "package.json"))
  ) {
    return {
      type: "package.json",
      content: readJsonFile(
        joinPathFragments(project.root, "package.json")
      ) as PackageJson
    };
  }

  return null;
};

async function getPrivateWorkspacePackageNames(
  workspaceRoot: string
): Promise<Set<string>> {
  let projectGraph: ProjectGraph;
  try {
    projectGraph = readCachedProjectGraph();
  } catch {
    await createProjectGraphAsync();
    projectGraph = readCachedProjectGraph();
  }

  const privatePackages = new Set<string>();
  await Promise.all(
    Object.keys(projectGraph.nodes).map(async node => {
      const projectNode = projectGraph.nodes[node];
      if (!projectNode?.data.root) {
        return;
      }

      const projectPackageJsonPath = joinPaths(
        workspaceRoot,
        projectNode.data.root,
        "package.json"
      );
      if (!existsSync(projectPackageJsonPath)) {
        return;
      }

      const projectPackageJson = JSON.parse(
        await readFile(projectPackageJsonPath, "utf8")
      );
      if (projectPackageJson.private === true && projectPackageJson.name) {
        privatePackages.add(projectPackageJson.name);
      }
    })
  );

  return privatePackages;
}

function stripPrivateWorkspaceDepsFromPackageJson(
  packageJson: PackageJson,
  privatePackages: Set<string>
): string[] {
  const removed: string[] = [];

  for (const field of PACKAGE_JSON_DEP_FIELDS) {
    const deps = packageJson[field];
    if (!deps || typeof deps !== "object") {
      continue;
    }

    for (const [name, version] of Object.entries(deps)) {
      if (
        typeof version === "string" &&
        version.startsWith("workspace:") &&
        privatePackages.has(name)
      ) {
        delete deps[name];
        removed.push(`${field}.${name}`);
      }
    }

    if (Object.keys(deps).length === 0) {
      delete packageJson[field];
    }
  }

  return removed;
}

/**
 * Remove private workspace package references from a package.json file before publish.
 *
 * @param packageRoot - The root directory of the package to update.
 * @param workspaceRoot - The root directory of the workspace.
 * @returns A list of removed dependency keys in `field.name` form.
 */
export async function stripPrivateWorkspaceDeps(
  packageRoot: string,
  workspaceRoot: string
): Promise<string[]> {
  const packageJsonPath = joinPaths(packageRoot, "package.json");
  const packageJson = JSON.parse(
    await readFile(packageJsonPath, "utf8")
  ) as PackageJson;
  const privatePackages = await getPrivateWorkspacePackageNames(workspaceRoot);
  const removed = stripPrivateWorkspaceDepsFromPackageJson(
    packageJson,
    privatePackages
  );

  if (removed.length === 0) {
    return removed;
  }

  await writeFile(
    packageJsonPath,
    await format(JSON.stringify(packageJson), PACKAGE_JSON_FORMAT_OPTIONS)
  );

  return removed;
}

/**
 * Adds the current git HEAD commit hash to the package.json file at the specified path.
 *
 * @param filePath - The path to the package.json file.
 * @returns A promise that resolves when the file has been updated.
 * @throws Will throw an error if no file path is provided or if the file cannot be read or written.
 */
export async function addPackageJsonGitHead(packageRoot: string) {
  const packageJsonPath = joinPaths(packageRoot, "package.json");
  if (!packageJsonPath) {
    throw new Error(
      "No file path provided. Please provide a valid path to the package.json file."
    );
  }

  const packageJsonValue = JSON.parse(await readFile(packageJsonPath, "utf8"));
  if (!packageJsonValue || typeof packageJsonValue !== "object") {
    throw new Error(
      `Invalid package.json file at ${packageJsonPath}. Please ensure it is a valid JSON file.`
    );
  }

  const gitHead = execFileSync("git", ["rev-parse", "HEAD"], {
    cwd: dirname(resolve(packageJsonPath)),
    encoding: "utf8"
  }).trim();
  packageJsonValue.gitHead = gitHead;

  return writeFile(
    packageJsonPath,
    await format(JSON.stringify(packageJsonValue), PACKAGE_JSON_FORMAT_OPTIONS)
  );
}
