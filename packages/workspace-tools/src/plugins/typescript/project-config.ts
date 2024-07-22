import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import type { ProjectConfiguration } from "nx/src/config/workspace-json-project-json";
import { readJsonFile } from "nx/src/utils/fileutils";
import {
  readTargetsFromPackageJson,
  type PackageJson
} from "nx/src/utils/package-json";
import {
  ProjectTagConstants,
  addProjectTag,
  isEqualProjectTag,
  setDefaultProjectTags
} from "../../utils/project-tags";

export const name = "storm-software/typescript/project-config";

export const createNodes = [
  "{project.json,**/project.json}",
  (file, _, ctx) => {
    const packageJson = createPackageJson(file, ctx.workspaceRoot);
    if (!packageJson) {
      return {};
    }

    const project = createProjectFromPackageJsonNextToProjectJson(
      file,
      packageJson
    );
    const targets: ProjectConfiguration["targets"] =
      readTargetsFromPackageJson(packageJson);

    if (!targets["lint-ls"]) {
      targets["lint-ls"] = {
        cache: true,
        inputs: ["config_linting", "typescript", "^production"],
        dependsOn: ["^lint-ls"],
        executor: "nx:run-commands",
        options: {
          command:
            'pnpm exec ls-lint --config="@storm-software/linting-tools/ls-lint/ls-lint.yml" ',
          color: true
        }
      };
    }

    if (!targets.lint) {
      targets.lint = {
        cache: true,
        inputs: ["config_linting", "typescript", "^production"],
        dependsOn: ["lint-ls", "^lint"],
        executor: "@nx/eslint:lint",
        options: {
          format: "stylish",
          fix: true,
          cache: true,
          errorOnUnmatchedPattern: false,
          printConfig: true
        }
      };
    }

    if (!targets["format-readme"]) {
      targets["format-readme"] = {
        cache: true,
        dependsOn: ["^format-readme"]
      };
    }

    if (!targets["format-toml"]) {
      targets["format-toml"] = {
        cache: true,
        dependsOn: ["^format-toml"]
      };
    }

    if (!targets["format-prettier"]) {
      targets["format-prettier"] = {
        cache: true,
        inputs: ["config_linting", "typescript", "^production"],
        dependsOn: ["^format-prettier"]
      };
    }

    if (!targets.format) {
      targets.format = {
        cache: true,
        inputs: ["config_linting", "typescript", "^production"],
        dependsOn: [
          "format-readme",
          "format-toml",
          "format-prettier",
          "^format"
        ],
        executor: "nx:run-commands",
        options: {
          command: "echo 'Formatting the project files in \"{projectRoot}\"' ",
          color: true
        }
      };
    }

    if (!targets.clean) {
      targets.clean = {
        cache: true,
        executor: "nx:run-commands",
        inputs: ["default", "^production"],
        outputs: ["{workspaceRoot}/dist/{projectRoot}"],
        options: {
          command: "pnpm exec rimraf dist/{projectRoot}",
          color: true,
          cwd: "{workspaceRoot}"
        }
      };
    }

    if (!targets.rebuild) {
      targets.rebuild = {
        cache: false,
        executor: "nx:run-commands",
        dependsOn: ["clean", "^build"],
        inputs: ["default", "^production"],
        outputs: ["{workspaceRoot}/dist/{projectRoot}"],
        options: {
          command: `pnpm exec nx run ${project.name}:build`,
          color: true,
          cwd: "{workspaceRoot}"
        }
      };
    }

    if (!targets.test) {
      targets.test = {
        cache: true,
        executor: "@nx/jest:jest",
        inputs: [
          "config_testing",
          "source_testing",
          "typescript",
          "^production"
        ],
        outputs: ["{workspaceRoot}/coverage/{projectRoot}"],
        defaultConfiguration: "local",
        options: {
          jestConfig: "{projectRoot}/jest.config.ts",
          passWithNoTests: true
        },
        configurations: {
          local: {
            ci: false,
            codeCoverage: true
          },
          ci: {
            ci: true,
            codeCoverage: true
          }
        }
      };
    }

    // Apply nx-release-publish target for non-private projects
    const isPrivate = packageJson.private ?? false;
    if (!isPrivate) {
      targets["nx-release-publish"] = {
        cache: false,
        inputs: ["default", "^production"],
        executor: "@storm-software/workspace-tools:npm-publish",
        options: {}
      };

      if (
        project.projectType === "application" ||
        isEqualProjectTag(
          project,
          ProjectTagConstants.ProjectType.TAG_ID,
          ProjectTagConstants.ProjectType.APPLICATION
        ) ||
        isEqualProjectTag(
          project,
          ProjectTagConstants.DistStyle.TAG_ID,
          ProjectTagConstants.DistStyle.CLEAN
        )
      ) {
        targets["clean-package"] = {
          cache: true,
          dependsOn: ["build"],
          inputs: ["default", "^production"],
          outputs: ["{workspaceRoot}/dist/{projectRoot}"],
          executor: "@storm-software/workspace-tools:clean-package",
          options: {
            cleanReadMe: true,
            cleanComments: true
          }
        };

        targets["nx-release-publish"].dependsOn = ["clean-package"];
      }
    }

    addProjectTag(
      project,
      ProjectTagConstants.Language.TAG_ID,
      ProjectTagConstants.Language.TYPESCRIPT,
      { overwrite: true }
    );
    setDefaultProjectTags(project);

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
