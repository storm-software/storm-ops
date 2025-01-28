import {
  createNodesFromFiles,
  CreateNodesResultV2,
  CreateNodesV2,
  readJsonFile
} from "@nx/devkit";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { readNxJson } from "nx/src/config/nx-json.js";
import type { ProjectConfiguration } from "nx/src/config/workspace-json-project-json";
import {
  readTargetsFromPackageJson,
  type PackageJson
} from "nx/src/utils/package-json";
import { addProjectTag, ProjectTagConstants } from "../../utils/project-tags";

export const name = "storm-software/typescript/untyped";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UntypedPluginOptions {}

export const createNodesV2: CreateNodesV2<UntypedPluginOptions> = [
  "**/*untyped.ts",
  async (configFiles, options, context): Promise<CreateNodesResultV2> => {
    return await createNodesFromFiles(
      (configFile, options, context) => {
        try {
          console.log(`Processing untyped schema file: ${configFile}`);

          const projectRoot = createProjectRoot(
            configFile,
            context.workspaceRoot
          );
          if (!projectRoot) {
            console.error(
              "No project.json found in parent directories of Untyped schema file: ",
              configFile
            );

            return {};
          }

          const packageJson = readJsonFile(join(projectRoot, "package.json"));
          if (!packageJson) {
            console.error(
              `No package.json found in project root: ${projectRoot}`
            );
            return {};
          }

          if (
            !packageJson.devDependencies?.untyped &&
            !packageJson.dependencies?.untyped
          ) {
            console.warn(
              `No "untyped" dependency or devDependency found in package.json: ${configFile}
Please add it to your dependencies by running "pnpm add untyped -D --filter="${packageJson.name}"`
            );
          }

          const project = createProjectFromPackageJsonNextToProjectJson(
            join(projectRoot, "project.json"),
            packageJson
          );

          const nxJson = readNxJson(context.workspaceRoot);
          const targets: ProjectConfiguration["targets"] =
            readTargetsFromPackageJson(packageJson, nxJson);

          let relativeRoot = projectRoot
            .replaceAll("\\", "/")
            .replace(context.workspaceRoot.replaceAll("\\", "/"), "");
          if (relativeRoot.startsWith("/")) {
            relativeRoot = relativeRoot.slice(1);
          }

          let relativeConfig = configFile.replaceAll(relativeRoot, "");
          while (relativeConfig.startsWith(".")) {
            relativeConfig = relativeConfig.slice(1);
          }
          while (relativeConfig.startsWith("/")) {
            relativeConfig = relativeConfig.slice(1);
          }

          targets["build-untyped"] ??= {
            cache: true,
            executor: "nx:run-commands",
            dependsOn: ["clean", "^build"],
            inputs: [
              "{projectRoot}/src/**/untyped.ts",
              "{projectRoot}/src/**/*.untyped.ts"
            ],
            outputs: [
              "{projectRoot}/src/**/schema.d.ts",
              "{projectRoot}/src/**/*.schema.d.ts",
              "{projectRoot}/src/**/schema.md",
              "{projectRoot}/src/**/*.schema.md",
              "{projectRoot}/src/**/schema.json",
              "{projectRoot}/src/**/*.schema.json"
            ],
            options: {
              commands: [
                `storm-untyped generate --entry=\"${projectRoot}/**/{untyped.ts,*.untyped.ts}\" `
              ]
            }
          };

          addProjectTag(project, ProjectTagConstants.Plugin.TAG_ID, name);

          const result = project?.name
            ? {
                projects: {
                  [project.name]: {
                    ...project,
                    root: relativeRoot,
                    targets
                  }
                }
              }
            : {};
          console.log(`Writing Results for ${project?.name ?? "missing name"}`);
          console.log(result);

          return result;
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
  const projectJson = readJsonFile(projectJsonPath);

  return {
    targets: {},
    tags: [],
    name,
    ...nx,
    ...projectJson,
    root
  } as ProjectConfiguration;
}

function createProjectRoot(
  configPath: string,
  workspaceRoot: string
): string | null {
  try {
    let root = dirname(configPath);
    while (
      root &&
      root !== "/" &&
      root !== workspaceRoot &&
      !existsSync(join(root, "project.json"))
    ) {
      root = join(root, "..");
    }
    if (!existsSync(join(root, "project.json"))) {
      return null;
    }

    const projectRoot = join(workspaceRoot, root);
    if (
      !existsSync(join(projectRoot, "package.json")) &&
      !existsSync(join(projectRoot, "project.json"))
    ) {
      return null;
    }

    return projectRoot;
  } catch (e) {
    console.error(e);
    return null;
  }
}
