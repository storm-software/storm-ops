import {
  createNodesFromFiles,
  CreateNodesResultV2,
  CreateNodesV2,
  ProjectGraphExternalNode
} from "@nx/devkit";
import {
  addProjectTag,
  ProjectTagConstants
} from "@storm-software/workspace-tools/utils/project-tags";
import defu from "defu";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import type { ProjectConfiguration } from "nx/src/config/workspace-json-project-json";
import { readJsonFile } from "nx/src/utils/fileutils";
import { type PackageJson } from "nx/src/utils/package-json";

export const name = "storm-software/cloudflare-tools/cloudflare";

export const createNodesV2: CreateNodesV2 = [
  "{**/wrangler.toml}",
  async (
    configFiles,
    options = { includeApps: true },
    context
  ): Promise<CreateNodesResultV2> => {
    return await createNodesFromFiles(
      async (file, options, context) => {
        try {
          const packageJson = createPackageJson(file, context.workspaceRoot);
          if (!packageJson) {
            return {};
          }

          const project = createProjectFromPackageJsonNextToProjectJson(
            file,
            packageJson
          );

          const targets: ProjectConfiguration["targets"] = {};

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

          const projects: Record<string, ProjectConfiguration> = {};
          const externalNodes: Record<string, ProjectGraphExternalNode> = {};

          projects[project.root] = defu(
            {
              targets,
              release: {
                version: {
                  versionActions:
                    "@storm-software/workspace-tools/release/js-release-actions"
                }
              }
            },
            project
          );

          return {
            projects,
            externalNodes
          };
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
