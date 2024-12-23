import { CreateNodes, readJsonFile } from "@nx/devkit";
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

export const createNodes: CreateNodes = [
  "*/**/tsup.config.*",
  (file, opts, ctx) => {
    const projectRoot = createProjectRoot(file, ctx.workspaceRoot);
    if (!projectRoot) {
      console.error(
        `tsup.config.ts file must be location in the project root directory: ${file}`
      );
      return {};
    }

    const packageJson = readJsonFile(join(projectRoot, "package.json"));
    if (!packageJson) {
      console.error(`No package.json found in project root: ${projectRoot}`);
      return {};
    }
    if (!packageJson.devDependencies?.tsup && !packageJson.dependencies?.tsup) {
      console.warn(
        `No "tsup" dependency or devDependency found in package.json: ${file}
Please add it to your dependencies by running "pnpm add tsup -D --filter="${packageJson.name}"`
      );
    }

    const project = createProjectFromPackageJsonNextToProjectJson(
      join(projectRoot, "project.json"),
      packageJson
    );

    const nxJson = readNxJson(ctx.workspaceRoot);
    const targets: ProjectConfiguration["targets"] = readTargetsFromPackageJson(
      packageJson,
      nxJson
    );

    if (!targets["build-base"]) {
      targets["build-base"] = {
        cache: true,
        inputs: [file, "typescript", "^production"],
        outputs: ["{workspaceRoot}/{projectRoot}/dist"],
        executor: "nx:run-commands",
        dependsOn: ["clean", "^build"],
        options: {
          command: `tsup --config="${file}"`,
          cwd: "{projectRoot}"
        }
      };
    }

    if (!targets.build) {
      targets.build = {
        cache: true,
        inputs: [file, "typescript", "^production"],
        outputs: ["{workspaceRoot}/dist/{projectRoot}"],
        executor: "nx:run-commands",
        dependsOn: ["build-base"],
        options: {
          commands: [
            `pnpm copyfiles LICENSE dist/${projectRoot}`,
            `pnpm copyfiles --up=2 ./${projectRoot}/README.md ./${projectRoot}/package.json dist/${projectRoot}`,
            `pnpm copyfiles --up=3 ./${projectRoot}/dist/* dist/${projectRoot}/dist`
          ]
        }
      };
    }

    if (!targets.clean) {
      targets.clean = {
        cache: true,
        executor: "nx:run-commands",
        inputs: ["typescript", "^production"],
        outputs: ["{workspaceRoot}/dist/{projectRoot}"],
        options: {
          command: "pnpm exec rimraf dist/{projectRoot}",
          color: true,
          cwd: "{workspaceRoot}"
        }
      };
    }

    setDefaultProjectTags(project, name);

    return project?.name
      ? {
          projects: {
            [project.name]: {
              ...project,
              targets
            }
          }
        }
      : {};
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
