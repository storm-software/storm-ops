import { CreateNodes } from "@nx/devkit";
import { existsSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { readNxJson } from "nx/src/config/nx-json.js";
import type { ProjectConfiguration } from "nx/src/config/workspace-json-project-json";
import { readJsonFile } from "nx/src/utils/fileutils";
import {
  readTargetsFromPackageJson,
  type PackageJson
} from "nx/src/utils/package-json";
import { readTSConfig } from "pkg-types";
import { getProjectPlatform } from "../../utils/plugin-helpers";
import {
  ProjectTagConstants,
  addProjectTag,
  isEqualProjectTag,
  setDefaultProjectTags
} from "../../utils/project-tags";

export const name = "storm-software/typescript";

/**
 * Options for configuring the TypeScript plugin.
 */
export interface TypeScriptPluginOptions {
  /**
   * Whether to include applications in the TypeScript project configuration.
   * @defaultValue true
   */
  includeApps?: boolean;

  /**
   * Whether to enable Knip, a tool for analyzing TypeScript projects.
   * @defaultValue true
   */
  enableKnip?: boolean;

  /**
   * Whether to enable Markdownlint for linting Markdown files.
   * @defaultValue true
   */
  enableMarkdownlint?: boolean;

  /**
   * Whether to enable ESLint for linting TypeScript and JavaScript files.
   * @defaultValue true
   */
  enableEslint?: boolean;

  /**
   * Whether to skip the linting of internal tools (projects in the `/tools` directory).
   *
   * @defaultValue false
   */
  lintInternalTools?: boolean;
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
      packageJson
    );

    // If the project is an application and we don't want to include apps, skip it
    if (opts?.includeApps === false && project.projectType === "application") {
      return {};
    }

    const enableKnip = opts?.enableKnip !== false;
    const enableMarkdownlint = opts?.enableMarkdownlint !== false;
    const enableEslint = opts?.enableEslint !== false;

    const nxJson = readNxJson(ctx.workspaceRoot);
    const targets: ProjectConfiguration["targets"] = readTargetsFromPackageJson(
      packageJson,
      nxJson
    );

    if (
      join(ctx.workspaceRoot, project.root).startsWith(
        join(ctx.workspaceRoot, "tools")
      ) &&
      opts?.lintInternalTools !== true
    ) {
      targets.lint = {
        dependsOn: ["^lint"],
        executor: "nx:run-commands",
        options: {
          command:
            "echo 'Skipping linting of internal tools package \"{projectName}\". This can be changed by setting `lintInternalTools` to `true` in the Storm TypeScript plugin options.' "
        }
      };
    } else {
      if (!targets["lint-knip"] && enableKnip) {
        const relativePath = relative(dirname(file), ctx.workspaceRoot);

        targets["lint-knip"] = {
          cache: true,
          outputs: ["{projectRoot}/**/*.md", "{projectRoot}/**/*.mdx"],
          inputs: [
            "linting",
            "{projectRoot}/**/*.md",
            "{projectRoot}/**/*.mdx"
          ],
          dependsOn: ["^lint-knip"],
          executor: "nx:run-commands",
          options: {
            command: `pnpm exec knip --config "${join(relativePath, "node_modules/@storm-software/linting-tools/knip/config.json").replaceAll("\\", "/")}" --tsConfig "{projectRoot}/tsconfig.json" --directory "{projectRoot}" --fix --cache --cache-location "${join(relativePath, "node_modules/.cache/knip/{projectRoot}").replaceAll("\\", "/")}" --workspace "${relativePath.replaceAll("\\", "/")}"`
          }
        };
      }

      if (!targets["lint-markdown"] && enableMarkdownlint) {
        targets["lint-markdown"] = {
          cache: true,
          outputs: ["{projectRoot}/**/*.md", "{projectRoot}/**/*.mdx"],
          inputs: [
            "linting",
            "{projectRoot}/**/*.md",
            "{projectRoot}/**/*.mdx"
          ],
          dependsOn: ["^lint-markdown"],
          executor: "nx:run-commands",
          options: {
            command:
              'pnpm exec markdownlint-cli2 "{projectRoot}/*.{md,mdx}" "{projectRoot}/**/*.{md,mdx}" --config "node_modules/@storm-software/markdownlint/config/base.markdownlint-cli2.jsonc" --fix'
          }
        };
      }

      if (!targets.lint && enableEslint) {
        let eslintConfig = checkEslintConfigAtPath(project.root);
        if (!eslintConfig) {
          eslintConfig = checkEslintConfigAtPath(ctx.workspaceRoot);
        }

        if (eslintConfig) {
          targets.lint = {
            cache: true,
            inputs: ["linting", "typescript", "^production"],
            outputs: [
              "{projectRoot}/**/*.{ts,tsx,js,jsx,json,md,mdx,yaml,yml,html,css,scss,sass,less,graphql,gql,\}"
            ],
            dependsOn: ["lint-markdown", "lint-knip", "^lint"],
            executor: "@nx/eslint:lint",
            options: {
              format: "stylish",
              fix: true,
              errorOnUnmatchedPattern: false,
              cache: true,
              cacheLocation:
                "{workspaceRoot}/node_modules/.cache/eslint/{projectRoot}",
              eslintConfig
            }
          };
        }
      }
    }

    if (!targets.format) {
      targets.format = {
        dependsOn: [
          "format-readme",
          "format-toml",
          "format-prettier",
          "^format"
        ],
        executor: "nx:run-commands",
        options: {
          command: "echo 'Formatting the project files in \"{projectRoot}\"' "
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

    if (!targets.rebuild) {
      targets.rebuild = {
        cache: false,
        executor: "nx:run-commands",
        dependsOn: ["clean", "^build"],
        inputs: ["typescript", "default", "^production"],
        outputs: ["{workspaceRoot}/dist/{projectRoot}"],
        options: {
          command: `pnpm exec nx run ${project.name}:build`
        }
      };
    }

    if (!targets.test && checkJestConfigAtPath(project.root)) {
      targets.test = {
        cache: true,
        executor: "@nx/jest:jest",
        inputs: ["testing", "typescript", "^production"],
        outputs: ["{workspaceRoot}/coverage/{projectRoot}"],
        defaultConfiguration: "development",
        options: {
          jestConfig: "{projectRoot}/jest.config.ts",
          passWithNoTests: true
        },
        configurations: {
          development: {
            ci: false,
            codeCoverage: true
          },
          production: {
            ci: true,
            codeCoverage: true
          }
        }
      };
    }

    targets["size-limit"] = {
      dependsOn: ["build", "^size-limit"],
      options: {}
    };

    // Apply nx-release-publish target for non-private projects
    const isPrivate = packageJson.private ?? false;
    if (!isPrivate) {
      addProjectTag(
        project,
        ProjectTagConstants.Registry.TAG_ID,
        ProjectTagConstants.Registry.NPM,
        { overwrite: true }
      );

      targets["nx-release-publish"] = {
        dependsOn: ["build", "size-limit", "^nx-release-publish"],
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
          inputs: [
            "linting",
            "testing",
            "documentation",
            "default",
            "^production"
          ],
          outputs: ["{workspaceRoot}/dist/{projectRoot}"],
          executor: "@storm-software/workspace-tools:clean-package",
          options: {
            cleanReadMe: true,
            cleanComments: true
          }
        };

        targets["nx-release-publish"].dependsOn?.push("clean-package");
        targets["size-limit"].dependsOn?.push("clean-package");
      }
    }

    addProjectTag(
      project,
      ProjectTagConstants.Language.TAG_ID,
      ProjectTagConstants.Language.TYPESCRIPT,
      { overwrite: true }
    );

    const platform = getProjectPlatform(project);
    switch (platform) {
      case "worker":
        addProjectTag(
          project,
          ProjectTagConstants.Platform.TAG_ID,
          ProjectTagConstants.Platform.WORKER,
          { overwrite: true }
        );
        break;

      case "node":
        addProjectTag(
          project,
          ProjectTagConstants.Platform.TAG_ID,
          ProjectTagConstants.Platform.NODE,
          { overwrite: true }
        );
        break;

      case "browser":
        addProjectTag(
          project,
          ProjectTagConstants.Platform.TAG_ID,
          ProjectTagConstants.Platform.BROWSER,
          { overwrite: true }
        );
        break;

      default:
        addProjectTag(
          project,
          ProjectTagConstants.Platform.TAG_ID,
          ProjectTagConstants.Platform.NEUTRAL,
          { overwrite: true }
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

function checkEslintConfigAtPath(directory: string): string | null {
  const hasEslintConfigFile = (fileName: string): boolean => {
    return existsSync(join(directory, fileName));
  };

  if (hasEslintConfigFile(".eslintrc.js")) {
    return ".eslintrc.js";
  } else if (hasEslintConfigFile(".eslintrc.cjs")) {
    return ".eslintrc.cjs";
  } else if (hasEslintConfigFile(".eslintrc.yaml")) {
    return ".eslintrc.yaml";
  } else if (hasEslintConfigFile(".eslintrc.yml")) {
    return ".eslintrc.yml";
  } else if (hasEslintConfigFile(".eslintrc.json")) {
    return ".eslintrc.json";
  } else if (hasEslintConfigFile(".eslintrc")) {
    return ".eslintrc";
  } else if (hasEslintConfigFile("eslint.config.js")) {
    return "eslint.config.js";
  } else if (hasEslintConfigFile("eslint.config.cjs")) {
    return "eslint.config.cjs";
  } else if (hasEslintConfigFile("eslint.config.mjs")) {
    return "eslint.config.mjs";
  } else if (hasEslintConfigFile("eslint.config.ts")) {
    return "eslint.config.ts";
  } else if (hasEslintConfigFile("eslint.config.cts")) {
    return "eslint.config.cts";
  } else if (hasEslintConfigFile("eslint.config.mts")) {
    return "eslint.config.mts";
  }

  return null;
}

function checkJestConfigAtPath(directory: string): string | null {
  const hasJestConfigFile = (fileName: string): boolean => {
    return existsSync(join(directory, fileName));
  };

  if (hasJestConfigFile("eslint.config.js")) {
    return "jest.config.js";
  } else if (hasJestConfigFile("eslint.config.cjs")) {
    return "jest.config.cjs";
  } else if (hasJestConfigFile("eslint.config.mjs")) {
    return "jest.config.mjs";
  } else if (hasJestConfigFile("eslint.config.ts")) {
    return "jest.config.ts";
  } else if (hasJestConfigFile("jest.config.cts")) {
    return "jest.config.cts";
  } else if (hasJestConfigFile("jest.config.mts")) {
    return "jest.config.mts";
  }

  return null;
}
