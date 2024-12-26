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
import { setDefaultProjectTags } from "../../utils/project-tags";

export const name = "storm-software/typescript/tsup";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TsupPluginOptions {}

export const createNodesV2: CreateNodesV2<TsupPluginOptions> = [
  "**/tsup.config.ts",
  async (configFiles, options, context): Promise<CreateNodesResultV2> => {
    return await createNodesFromFiles(
      (configFile, options, context) => {
        try {
          console.log(`Processing tsup.config.ts file: ${configFile}`);

          const projectRoot = createProjectRoot(
            configFile,
            context.workspaceRoot
          );
          if (!projectRoot) {
            console.error(
              `tsup.config.ts file must be location in the project root directory: ${configFile}`
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
            !packageJson.devDependencies?.tsup &&
            !packageJson.dependencies?.tsup
          ) {
            console.warn(
              `No "tsup" dependency or devDependency found in package.json: ${configFile}
Please add it to your dependencies by running "pnpm add tsup -D --filter="${packageJson.name}"`
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
            .replace(context.workspaceRoot, "");
          if (relativeRoot.startsWith("/")) {
            relativeRoot = relativeRoot.slice(1);
          }

          targets["build-base"] ??= {
            cache: true,
            inputs: [
              `{workspaceRoot}/${configFile}`,
              "typescript",
              "^production"
            ],
            executor: "nx:run-commands",
            dependsOn: ["clean", "^build"],
            options: {
              command: `tsup --config="${configFile}"`,
              cwd: relativeRoot
            }
          };

          targets.build ??= {
            cache: true,
            inputs: ["typescript", "^production"],
            executor: "nx:run-commands",
            dependsOn: ["build-base"],
            options: {
              commands: [
                `pnpm copyfiles LICENSE dist/${relativeRoot}`,
                `pnpm copyfiles --up=2 ./${relativeRoot}/README.md ./${relativeRoot}/package.json dist/${relativeRoot}`,
                `pnpm copyfiles --up=3 ./${relativeRoot}/dist/* dist/${relativeRoot}/dist`
              ]
            }
          };

          targets.clean = {
            executor: "nx:run-commands",
            inputs: [
              `{workspaceRoot}/${configFile}`,
              "typescript",
              "^production"
            ],
            options: {
              commands: [
                `pnpm exec rimraf dist/${relativeRoot}`,
                `pnpm exec rimraf ${relativeRoot}/dist`
              ]
            }
          };

          setDefaultProjectTags(project, name);

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
    const root = dirname(configPath);
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
