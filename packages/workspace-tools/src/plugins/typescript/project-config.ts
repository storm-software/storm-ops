import { dirname, join } from "node:path";
import { existsSync } from "node:fs";
import type { ProjectConfiguration } from "nx/src/config/workspace-json-project-json";
import { readJsonFile } from "nx/src/utils/fileutils";
import type { NxPluginV2 } from "nx/src/utils/nx-plugin";
import { type PackageJson, readTargetsFromPackageJson } from "nx/src/utils/package-json";

export const ProjectJsonProjectsPlugin: NxPluginV2 = {
  name: "storm-software/typescript/-config",
  createNodes: [
    "{project.json,**/project.json}",
    (file, _, ctx) => {
      const packageJson = createPackageJson(file, ctx.workspaceRoot);
      if (!packageJson) {
        return {};
      }

      const project = createProjectFromPackageJsonNextToProjectJson(file, packageJson);
      const targets: ProjectConfiguration["targets"] = readTargetsFromPackageJson(packageJson);

      // Apply nx-release-publish target for non-private projects
      const isPrivate = packageJson.private ?? false;
      if (!isPrivate) {
        targets["nx-release-publish"] = {
          cache: false,
          inputs: ["default", "^production"],
          dependsOn: ["^build", "^nx-release-publish"],
          executor: "@storm-software/workspace-tools:cargo-publish",
          options: {
            packageRoot: `dist/${project.root}`,
            registry: "https://registry.npmjs.org/"
          }
        };
      }

      return project?.name
        ? {
            projects: {
              [project.name]: {
                ...project,
                targets,
                release: {
                  ...project?.release,
                  version: {
                    ...project?.release?.version,
                    generator: "@storm-software/workspace-tools:release-version"
                  }
                }
              }
            }
          }
        : {};
    }
  ]
};

function createProjectFromPackageJsonNextToProjectJson(
  projectJsonPath: string,
  packageJson: PackageJson
): ProjectConfiguration {
  const { nx, name } = packageJson;
  const root = dirname(projectJsonPath);

  return {
    ...nx,
    name,
    root,
    targets: {}
  } as ProjectConfiguration;
}

function createPackageJson(projectJsonPath: string, workspaceRoot: string): PackageJson | null {
  try {
    const root = dirname(projectJsonPath);
    const packageJsonPath = join(workspaceRoot, root, "package.json");
    if (!existsSync(packageJsonPath)) {
      return null;
    }

    return readJsonFile(packageJsonPath) as PackageJson;
  } catch (e) {
    console.log(e);
    return null;
  }
}
