import {
  createNodesFromFiles,
  CreateNodesResultV2,
  CreateNodesV2,
  readJsonFile
} from "@nx/devkit";
import defu from "defu";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { readNxJson } from "nx/src/config/nx-json.js";
import type { ProjectConfiguration } from "nx/src/config/workspace-json-project-json";
import { readTargetsFromPackageJson } from "nx/src/utils/package-json";
import type { PackageJson } from "pkg-types";
import { getRoot } from "../../utils/plugin-helpers";
import { setDefaultProjectTags } from "../../utils/project-tags";

export const name = "storm-software/typescript/tsup";

export type TsupPluginOptions = {
  useRootDist?: boolean;
};

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

          const root = getRoot(projectRoot, context);

          let relativeConfig = configFile.replaceAll(root, "");
          while (relativeConfig.startsWith(".")) {
            relativeConfig = relativeConfig.slice(1);
          }
          while (relativeConfig.startsWith("/")) {
            relativeConfig = relativeConfig.slice(1);
          }

          targets[options?.useRootDist !== false ? "build-base" : "build"] = {
            cache: true,
            inputs: [
              `{workspaceRoot}/${configFile}`,
              "typescript",
              "^production"
            ],
            outputs: ["{projectRoot}/dist"],
            executor: "nx:run-commands",
            dependsOn: ["build-untyped", "typecheck", "^build"],
            options: {
              command: `tsup --config="${relativeConfig}"`,
              cwd: root
            }
          };

          if (options?.useRootDist !== false) {
            targets.build = {
              cache: true,
              inputs: [
                "{workspaceRoot}/LICENSE",
                "{projectRoot}/dist",
                "{projectRoot}/*.md",
                "{projectRoot}/package.json"
              ],
              outputs: [`{workspaceRoot}/dist/${root}`],
              executor: "nx:run-commands",
              dependsOn: ["build-base", "build-untyped", "^build"],
              options: {
                commands: [
                  `pnpm copyfiles LICENSE dist/${root}`,
                  `pnpm copyfiles --up=2 ./${root}/*.md ./${root}/package.json dist/${root}`,
                  `pnpm copyfiles --up=3 "./${root}/dist/**/*" dist/${root}/dist`
                ]
              }
            };
          }

          targets.clean = {
            executor: "nx:run-commands",
            inputs: [
              `{workspaceRoot}/${configFile}`,
              "typescript",
              "^production"
            ],
            options: {
              commands: [
                `pnpm exec rimraf dist/${root}`,
                `pnpm exec rimraf ${root}/dist`
              ]
            }
          };

          setDefaultProjectTags(project, name);

          return {
            projects: {
              [root]: defu(
                {
                  root,
                  targets
                },
                project
              )
            }
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
