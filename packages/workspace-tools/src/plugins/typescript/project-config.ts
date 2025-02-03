import { CreateNodes } from "@nx/devkit";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { readNxJson } from "nx/src/config/nx-json.js";
import type { ProjectConfiguration } from "nx/src/config/workspace-json-project-json";
import { readJsonFile } from "nx/src/utils/fileutils";
import {
  readTargetsFromPackageJson,
  type PackageJson,
} from "nx/src/utils/package-json";
import { readTSConfig } from "pkg-types";
import { getProjectPlatform } from "../../utils/plugin-helpers";
import {
  ProjectTagConstants,
  addProjectTag,
  isEqualProjectTag,
  setDefaultProjectTags,
} from "../../utils/project-tags";

export const name = "storm-software/typescript";

export interface TypeScriptPluginOptions {
  includeApps?: boolean;
}

export const createNodes: CreateNodes<TypeScriptPluginOptions> = [
  "{project.json,**/project.json}",
  async (file, opts: TypeScriptPluginOptions = { includeApps: true }, ctx) => {
    const packageJson = createPackageJson(file, ctx.workspaceRoot);
    if (!packageJson) {
      return {};
    }

    const tsconfig = await createTsconfig(file, ctx.workspaceRoot);
    if (!tsconfig) {
      return {};
    }

    const project = createProjectFromPackageJsonNextToProjectJson(
      file,
      packageJson,
    );

    // If the project is an application and we don't want to include apps, skip it
    if (opts?.includeApps === false && project.projectType === "application") {
      return {};
    }

    const nxJson = readNxJson(ctx.workspaceRoot);
    const targets: ProjectConfiguration["targets"] = readTargetsFromPackageJson(
      packageJson,
      nxJson,
    );
    if (!targets["lint-ls"]) {
      targets["lint-ls"] = {
        cache: true,
        inputs: ["linting", "typescript", "^production"],
        dependsOn: ["^lint-ls"],
        executor: "nx:run-commands",
        options: {
          command:
            'pnpm exec ls-lint --config="@storm-software/linting-tools/ls-lint/.ls-lint.yml" ',
          color: true,
        },
      };
    }

    if (!targets.lint) {
      targets.lint = {
        cache: true,
        inputs: ["linting", "typescript", "^production"],
        dependsOn: [
          "lint-ls",
          "lint-sherif",
          "lint-knip",
          "lint-docs",
          "^lint",
        ],
        executor: "@nx/eslint:lint",
        options: {
          format: "stylish",
          fix: true,
          cache: true,
          errorOnUnmatchedPattern: false,
          printConfig: true,
        },
      };
    }

    if (!targets["format-readme"]) {
      targets["format-readme"] = {
        cache: true,
        inputs: ["linting", "documentation", "typescript", "^production"],
        dependsOn: ["^format-readme"],
      };
    }

    if (!targets["format-toml"]) {
      targets["format-toml"] = {
        cache: true,
        inputs: ["linting", "typescript", "^production"],
        dependsOn: ["^format-toml"],
      };
    }

    if (!targets["format-prettier"]) {
      targets["format-prettier"] = {
        cache: true,
        inputs: ["linting", "typescript", "^production"],
        dependsOn: ["^format-prettier"],
      };
    }

    if (!targets.format) {
      targets.format = {
        cache: true,
        inputs: ["linting", "typescript", "^production"],
        dependsOn: [
          "format-readme",
          "format-toml",
          "format-prettier",
          "^format",
        ],
        executor: "nx:run-commands",
        options: {
          command: "echo 'Formatting the project files in \"{projectRoot}\"' ",
          color: true,
        },
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
          cwd: "{workspaceRoot}",
        },
      };
    }

    if (!targets.rebuild) {
      targets.rebuild = {
        cache: false,
        executor: "nx:run-commands",
        dependsOn: ["clean", "^build"],
        inputs: ["typescript", "^production"],
        outputs: ["{workspaceRoot}/dist/{projectRoot}"],
        options: {
          command: `pnpm exec nx run ${project.name}:build`,
          color: true,
          cwd: "{workspaceRoot}",
        },
      };
    }

    if (!targets.test) {
      targets.test = {
        cache: true,
        executor: "@nx/jest:jest",
        inputs: ["testing", "typescript", "^production"],
        outputs: ["{workspaceRoot}/coverage/{projectRoot}"],
        defaultConfiguration: "local",
        options: {
          jestConfig: "{projectRoot}/jest.config.ts",
          passWithNoTests: true,
        },
        configurations: {
          local: {
            ci: false,
            codeCoverage: true,
          },
          ci: {
            ci: true,
            codeCoverage: true,
          },
        },
      };
    }

    targets["size-limit"] = {
      cache: true,
      inputs: ["typescript", "^production"],
      dependsOn: ["build", "^size-limit"],
      options: {},
    };

    // Apply nx-release-publish target for non-private projects
    const isPrivate = packageJson.private ?? false;
    if (!isPrivate) {
      addProjectTag(
        project,
        ProjectTagConstants.Registry.TAG_ID,
        ProjectTagConstants.Registry.NPM,
        { overwrite: true },
      );

      targets["nx-release-publish"] = {
        cache: true,
        inputs: [
          "linting",
          "testing",
          "documentation",
          "default",
          "^production",
        ],
        dependsOn: ["build", "size-limit", "^nx-release-publish"],
        executor: "@storm-software/workspace-tools:npm-publish",
        options: {},
      };

      if (
        project.projectType === "application" ||
        isEqualProjectTag(
          project,
          ProjectTagConstants.ProjectType.TAG_ID,
          ProjectTagConstants.ProjectType.APPLICATION,
        ) ||
        isEqualProjectTag(
          project,
          ProjectTagConstants.DistStyle.TAG_ID,
          ProjectTagConstants.DistStyle.CLEAN,
        )
      ) {
        targets["clean-package"] = {
          cache: true,
          dependsOn: ["build"],
          inputs: [
            "linting",
            "testing",
            "documentation",
            "default",
            "^production",
          ],
          outputs: ["{workspaceRoot}/dist/{projectRoot}"],
          executor: "@storm-software/workspace-tools:clean-package",
          options: {
            cleanReadMe: true,
            cleanComments: true,
          },
        };

        targets["nx-release-publish"].dependsOn?.push("clean-package");
        targets["size-limit"].dependsOn?.push("clean-package");
      }
    }

    addProjectTag(
      project,
      ProjectTagConstants.Language.TAG_ID,
      ProjectTagConstants.Language.TYPESCRIPT,
      { overwrite: true },
    );

    const platform = getProjectPlatform(project);
    switch (platform) {
      case "worker":
        addProjectTag(
          project,
          ProjectTagConstants.Platform.TAG_ID,
          ProjectTagConstants.Platform.WORKER,
          { overwrite: true },
        );
        break;

      case "node":
        addProjectTag(
          project,
          ProjectTagConstants.Platform.TAG_ID,
          ProjectTagConstants.Platform.NODE,
          { overwrite: true },
        );
        break;

      case "browser":
        addProjectTag(
          project,
          ProjectTagConstants.Platform.TAG_ID,
          ProjectTagConstants.Platform.BROWSER,
          { overwrite: true },
        );
        break;

      default:
        addProjectTag(
          project,
          ProjectTagConstants.Platform.TAG_ID,
          ProjectTagConstants.Platform.NEUTRAL,
          { overwrite: true },
        );
        break;
    }

    setDefaultProjectTags(project, name);

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
                  generator: "@storm-software/workspace-tools:release-version",
                },
              },
            },
          },
        }
      : {};
  },
];

function createProjectFromPackageJsonNextToProjectJson(
  projectJsonPath: string,
  packageJson: PackageJson,
): ProjectConfiguration {
  const { nx, name } = packageJson;
  const root = dirname(projectJsonPath);

  return {
    ...nx,
    name,
    root,
    targets: {},
  } as ProjectConfiguration;
}

function createPackageJson(
  projectJsonPath: string,
  workspaceRoot: string,
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

async function createTsconfig(projectJsonPath: string, workspaceRoot: string) {
  try {
    const root = dirname(projectJsonPath);
    const tsconfigJsonPath = join(workspaceRoot, root, "tsconfig.json");
    if (!existsSync(tsconfigJsonPath)) {
      return null;
    }

    // return readTSConfig(tsconfigJsonPath, {
    //   rootPattern: workspaceRoot,
    //   startingFrom: dirname(tsconfigJsonPath)
    // });

    return readTSConfig(tsconfigJsonPath);
  } catch (e) {
    console.log(e);
    return null;
  }
}
