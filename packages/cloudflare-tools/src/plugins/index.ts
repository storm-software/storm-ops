import {
  createNodesFromFiles,
  CreateNodesResultV2,
  CreateNodesV2
} from "@nx/devkit";
import {
  addProjectTag,
  ProjectTagConstants
} from "@storm-software/workspace-tools/utils/project-tags";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { readNxJson } from "nx/src/config/nx-json.js";
import type { ProjectConfiguration } from "nx/src/config/workspace-json-project-json";
import { readJsonFile } from "nx/src/utils/fileutils";
import {
  type PackageJson,
  readTargetsFromPackageJson
} from "nx/src/utils/package-json";

export const name = "storm-software/cloudflare";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type CloudflarePluginOptions = {};

export const createNodesV2: CreateNodesV2<CloudflarePluginOptions> = [
  "{**/wrangler.toml}",
  async (
    configFiles,
    options = { includeApps: true },
    context
  ): Promise<CreateNodesResultV2> => {
    return await createNodesFromFiles(
      async (file, options = { includeApps: true }, context) => {
        try {
          const packageJson = createPackageJson(file, context.workspaceRoot);
          if (!packageJson) {
            return {};
          }

          const project = createProjectFromPackageJsonNextToProjectJson(
            file,
            packageJson
          );
          const nxJson = readNxJson(context.workspaceRoot);

          const targets: ProjectConfiguration["targets"] =
            readTargetsFromPackageJson(packageJson, nxJson);

          // Apply nx-release-publish target for non-private projects

          targets["serve"] = {
            cache: false,
            inputs: ["typescript", "^production"],
            dependsOn: ["build"],
            executor: "@storm-software/cloudflare-tools:serve",
            options: {
              port: 4500
            }
          };

          targets["clean-package"] = {
            cache: true,
            dependsOn: ["build"],
            inputs: ["typescript", "^production"],
            outputs: ["{workspaceRoot}/dist/{projectRoot}"],
            executor: "@storm-software/workspace-tools:clean-package",
            options: {
              cleanReadMe: true,
              cleanComments: true
            }
          };

          targets["nx-release-publish"] = {
            cache: false,
            inputs: ["typescript", "^production"],
            dependsOn: ["clean-package", "^nx-release-publish"],
            executor: "@storm-software/cloudflare-tools:cloudflare-publish",
            options: {}
          };

          addProjectTag(
            project,
            ProjectTagConstants.ProjectType.TAG_ID,
            project.projectType === "application"
              ? ProjectTagConstants.ProjectType.APPLICATION
              : ProjectTagConstants.ProjectType.LIBRARY,
            { overwrite: true }
          );
          addProjectTag(
            project,
            ProjectTagConstants.DistStyle.TAG_ID,
            ProjectTagConstants.DistStyle.CLEAN,
            { overwrite: true }
          );
          addProjectTag(
            project,
            ProjectTagConstants.Provider.TAG_ID,
            "cloudflare",
            {
              overwrite: true
            }
          );

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
                        generator:
                          "@storm-software/workspace-tools:release-version"
                      }
                    }
                  }
                }
              }
            : {};
        } catch (e) {
          console.error(e);
          return {};
        }
      },
      configFiles,
      options,
      context
    );
  }
];

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

function createPackageJson(
  projectJsonPath: string,
  workspaceRoot: string
): PackageJson | null {
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
