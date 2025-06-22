import {
  joinPathFragments,
  ProjectConfiguration,
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
import type { PackageJson } from "nx/src/utils/package-json.js";
import { dirname, resolve } from "path";
import { format } from "prettier";
import { isEqualProjectTag, ProjectTagConstants } from "./project-tags";

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
    await format(JSON.stringify(packageJsonValue), {
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
