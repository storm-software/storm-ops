import { ProjectConfiguration, readJsonFile } from "@nx/devkit";
import defu from "defu";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { PackageJson } from "pkg-types";
import { getProjectTag, ProjectTagConstants } from "./project-tags";

export const getProjectPlatform = (
  project: ProjectConfiguration,
  ignoreTags = false,
): "node" | "neutral" | "browser" | "worker" => {
  const tsconfigJson = readJsonFile(join(project.root, "tsconfig.json"));
  if (!tsconfigJson) {
    throw new Error(`No tsconfig.json found in project root: ${project.root}`);
  }

  const packageJson = readJsonFile(join(project.root, "package.json"));
  if (!packageJson) {
    throw new Error(`No package.json found in project root: ${project.root}`);
  }

  let platformTag: string | undefined = undefined;
  if (!ignoreTags) {
    platformTag = getProjectTag(project, ProjectTagConstants.Platform.TAG_ID);
  }

  if (platformTag !== ProjectTagConstants.Platform.NEUTRAL) {
    const types = Array.isArray(tsconfigJson.compilerOptions?.types)
      ? tsconfigJson.compilerOptions.types
      : [];

    if (
      platformTag === ProjectTagConstants.Platform.WORKER ||
      types.some(
        (type) => type.toLowerCase() === "@cloudflare/workers-types",
      ) ||
      packageJson.devDependencies?.["@cloudflare/workers-types"] ||
      packageJson.devDependencies?.["wrangler"]
    ) {
      return "worker";
    }

    if (
      platformTag === ProjectTagConstants.Platform.NODE ||
      types?.some((type) => type.toLowerCase() === "node") ||
      packageJson.devDependencies?.["@types/node"]
    ) {
      return "node";
    }

    if (
      platformTag === ProjectTagConstants.Platform.BROWSER ||
      types?.some((type) => type.toLowerCase() === "dom") ||
      (packageJson.dependencies &&
        Object.keys(packageJson.dependencies).some((dependency) =>
          dependency.includes("react"),
        )) ||
      (packageJson.devDependencies &&
        Object.keys(packageJson.devDependencies).some((devDependency) =>
          devDependency.includes("react"),
        ))
    ) {
      return "browser";
    }
  }

  return "neutral";
};

export const getProjectConfigFromProjectJsonPath = (
  projectJsonPath: string,
  packageJson: PackageJson,
): ProjectConfiguration => {
  return getProjectConfigFromProjectRoot(dirname(projectJsonPath), packageJson);
};

export const getProjectConfigFromProjectRoot = (
  projectRoot: string,
  packageJson: PackageJson,
): ProjectConfiguration => {
  const { nx, name } = packageJson;
  const projectJson = readJsonFile(join(projectRoot, "project.json"));

  return defu(nx ?? {}, projectJson, {
    targets: {},
    tags: [],
    name,
    root: projectRoot,
  }) as ProjectConfiguration;
};

export const getProjectRoot = (
  configPath: string,
  workspaceRoot: string,
): string | null => {
  try {
    const root = dirname(configPath);
    const projectRoot = join(workspaceRoot, root);

    if (
      !existsSync(join(projectRoot, "package.json")) &&
      !existsSync(join(projectRoot, "project.json"))
    ) {
      return null;
    }

    return projectRoot;
  } catch (error_) {
    console.error(error_);
    return null;
  }
};
