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
import { readTargetsFromPackageJson } from "nx/src/utils/package-json";
import type { PackageJson } from "pkg-types";
import { setDefaultProjectTags } from "../../utils/project-tags";

export const name = "storm-software/typescript/tsup";

export type TsupPluginOptions = object;

export const createNodesV2: CreateNodesV2<TsupPluginOptions> = [
  "**/tsup.config.ts",
  async (configFiles, options, context): Promise<CreateNodesResultV2> => {
    return await createNodesFromFiles(
      (configFile, options, context) => {
        try {
          const projectRoot = createProjectRoot(
            configFile,
            context.workspaceRoot
          );
          if (!projectRoot) {
            console.error(
              `[storm-software/typescript/tsup]: tsup.config.ts file must be location in the project root directory: ${configFile}`
            );
            return {};
          }

          const packageJson = readJsonFile(join(projectRoot, "package.json"));
          if (!packageJson) {
            console.error(
              `[storm-software/typescript/tsup]: No package.json found in project root: ${projectRoot}`
            );
            return {};
          }

          if (
            !packageJson.devDependencies?.tsup &&
            !packageJson.dependencies?.tsup
          ) {
            console.warn(
              `[storm-software/typescript/tsup]: No "tsup" dependency or devDependency found in package.json: ${configFile}
Please add it to your dependencies by running \`pnpm add tsup -D --filter="${packageJson.name}"\``
            );
          }

          const project = createProjectFromPackageJsonNextToProjectJson(
            join(projectRoot, "project.json"),
            packageJson
          );

          const nxJson = readNxJson(context.workspaceRoot);
          const targets: ProjectConfiguration["targets"] =
            readTargetsFromPackageJson(
              packageJson,
              nxJson,
              projectRoot,
              context.workspaceRoot
            );

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

          targets["build-base"] ??= {
            cache: true,
            inputs: [
              `{workspaceRoot}/${configFile}`,
              "typescript",
              "^production"
            ],
            outputs: ["{projectRoot}/dist"],
            executor: "nx:run-commands",
            dependsOn: ["build-untyped", "^build"],
            options: {
              command: `tsup --config="${relativeConfig}"`,
              cwd: relativeRoot
            }
          };

          targets.build ??= {
            cache: true,
            inputs: [
              "{workspaceRoot}/LICENSE",
              "{projectRoot}/dist",
              "{projectRoot}/*.md",
              "{projectRoot}/package.json"
            ],
            outputs: ["{workspaceRoot}/dist/{projectRoot}"],
            executor: "nx:run-commands",
            dependsOn: ["build-base", "build-untyped", "^build"],
            options: {
              commands: [
                `pnpm copyfiles LICENSE dist/${relativeRoot}`,
                `pnpm copyfiles --up=2 ./${relativeRoot}/*.md ./${relativeRoot}/package.json dist/${relativeRoot}`,
                `pnpm copyfiles --up=3 "./${relativeRoot}/dist/**/*" dist/${relativeRoot}/dist`
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

          return project?.name
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
