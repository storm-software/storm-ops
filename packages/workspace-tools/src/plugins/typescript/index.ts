import {
  createNodesFromFiles,
  CreateNodesResultV2,
  CreateNodesV2
} from "@nx/devkit";
import defu from "defu";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { readNxJson } from "nx/src/config/nx-json.js";
import type {
  ProjectConfiguration,
  TargetDependencyConfig
} from "nx/src/config/workspace-json-project-json";
import { readJsonFile } from "nx/src/utils/fileutils";
import type { PackageJson as NxPackageJson } from "nx/src/utils/package-json";
import { readTargetsFromPackageJson } from "nx/src/utils/package-json";
import type { PackageJson } from "pkg-types";
import { readTSConfig } from "pkg-types";
import { getProjectPlatform, getRoot } from "../../utils/plugin-helpers";
import {
  addProjectTag,
  isEqualProjectTag,
  ProjectTagConstants,
  setDefaultProjectTags
} from "../../utils/project-tags";

export const name = "storm-software/typescript";

/**
 * Options for configuring the TypeScript plugin.
 */
export interface TypeScriptPluginOptions {
  /**
   * Whether to include applications in the TypeScript project configuration.
   *
   * @defaultValue true
   */
  includeApps?: boolean;

  /**
   * Whether to enable Markdownlint for linting Markdown files.
   *
   * @remarks
   * If set to a string, it will be used as the target name instead of the default "lint-markdown".
   *
   * @defaultValue "lint-markdown"
   */
  enableMarkdownlint?: string | false;

  /**
   * Whether to enable ESLint for linting TypeScript and JavaScript files.
   *
   * @remarks
   * If set to a string, it will be used as the target name instead of the default "lint".
   *
   * @defaultValue "lint"
   */
  enableEslint?: string | false;

  /**
   * Whether to enable TypeScript type checking via `tsc`.
   *
   * @remarks
   * If set to a string, it will be used as the target name instead of the default "type-check".
   *
   * @defaultValue "type-check"
   */
  enableTypeCheck?: string | false;

  /**
   * Whether to skip the linting of internal tools (projects in the `/tools` directory).
   *
   * @defaultValue false
   */
  lintInternalTools?: boolean;
}

export const createNodesV2: CreateNodesV2<TypeScriptPluginOptions> = [
  "{project.json,**/project.json}",
  async (
    configFiles,
    options = { includeApps: true },
    context
  ): Promise<CreateNodesResultV2> => {
    const nxJson = readNxJson(context.workspaceRoot);

    return createNodesFromFiles(
      async (file, options = { includeApps: true }, context) => {
        try {
          const packageJson = createPackageJson(file, context.workspaceRoot);
          if (!packageJson) {
            return {};
          }

          const tsconfig = await createTsconfig(file, context.workspaceRoot);
          if (!tsconfig) {
            return {};
          }

          const projectConfig = createProjectFromPackageJsonNextToProjectJson(
            file,
            packageJson
          );

          // If the project is an application and we don't want to include apps, skip it
          if (
            options?.includeApps === false &&
            projectConfig.projectType === "application"
          ) {
            return {};
          }

          const root = getRoot(projectConfig.root, context);

          const enableMarkdownlint = options?.enableMarkdownlint !== false;
          const enableEslint = options?.enableEslint !== false;
          const enableTypeCheck = options?.enableTypeCheck !== false;

          const targets: ProjectConfiguration["targets"] =
            readTargetsFromPackageJson(
              packageJson as NxPackageJson,
              nxJson,
              projectConfig.root,
              context.workspaceRoot
            );

          if (
            join(context.workspaceRoot, projectConfig.root).startsWith(
              join(context.workspaceRoot, "tools")
            ) &&
            options?.lintInternalTools !== true
          ) {
            targets.lint ??= {
              dependsOn: ["^lint"],
              executor: "nx:run-commands",
              options: {
                command:
                  "echo 'Skipping linting of internal tools package \"{projectName}\". This can be changed by setting `lintInternalTools` to `true` in the Storm TypeScript plugin options.' "
              }
            };
          } else {
            targets["lint-ls"] ??= {
              cache: true,
              inputs: ["linting", "typescript", "^production"],
              dependsOn: ["^lint-ls"],
              executor: "nx:run-commands",
              options: {
                command:
                  'pnpm exec ls-lint --config="node_modules/@storm-software/linting-tools/ls-lint/.ls-lint.yml" '
              }
            };

            if (enableMarkdownlint) {
              targets[
                options?.enableMarkdownlint &&
                typeof options?.enableMarkdownlint === "string"
                  ? options.enableMarkdownlint
                  : "lint-markdown"
              ] ??= {
                cache: true,
                inputs: [
                  "linting",
                  "{projectRoot}/**/*.md",
                  "{projectRoot}/**/*.mdx"
                ],
                outputs: ["{projectRoot}/**/*.md", "{projectRoot}/**/*.mdx"],
                dependsOn: [
                  `^${
                    options?.enableMarkdownlint &&
                    typeof options?.enableMarkdownlint === "string"
                      ? options.enableMarkdownlint
                      : "lint-markdown"
                  }`
                ],
                executor: "nx:run-commands",
                options: {
                  command:
                    'pnpm exec markdownlint-cli2 "{projectRoot}/*.{md,mdx}" "{projectRoot}/**/*.{md,mdx}" --config "node_modules/@storm-software/markdownlint/config/base.markdownlint-cli2.jsonc" --fix'
                }
              };
            }

            if (enableTypeCheck) {
              targets[
                options?.enableTypeCheck &&
                typeof options?.enableTypeCheck === "string"
                  ? options.enableTypeCheck
                  : "type-check"
              ] ??= {
                cache: true,
                inputs: ["typescript", "^production"],
                outputs: ["{workspaceRoot}/dist/{projectRoot}"],
                executor: "nx:run-commands",
                dependsOn: [
                  `^${
                    options?.enableTypeCheck &&
                    typeof options?.enableTypeCheck === "string"
                      ? options.enableTypeCheck
                      : "type-check"
                  }`
                ],
                options: {
                  command: `pnpm exec tsc --noEmit --pretty --project ${join(
                    projectConfig.root,
                    "tsconfig.json"
                  )}`
                }
              };
            }

            if (enableEslint) {
              let eslintConfig = checkEslintConfigAtPath(projectConfig.root);
              if (!eslintConfig) {
                eslintConfig = checkEslintConfigAtPath(context.workspaceRoot);
              }

              if (eslintConfig) {
                targets[
                  options?.enableEslint &&
                  typeof options?.enableEslint === "string"
                    ? options.enableEslint
                    : "lint"
                ] ??= {
                  cache: true,
                  inputs: ["linting", "typescript", "^production"],
                  outputs: [
                    "{projectRoot}/**/*.{ts,tsx,js,jsx,json,md,mdx,yaml,yml,html,css,scss,sass,less,graphql,gql}"
                  ],
                  dependsOn: [
                    enableMarkdownlint
                      ? options?.enableMarkdownlint &&
                        typeof options?.enableMarkdownlint === "string"
                        ? options.enableMarkdownlint
                        : "lint-markdown"
                      : undefined,
                    enableTypeCheck
                      ? options?.enableTypeCheck &&
                        typeof options?.enableTypeCheck === "string"
                        ? options.enableTypeCheck
                        : "type-check"
                      : undefined,
                    `^${
                      options?.enableEslint &&
                      typeof options?.enableEslint === "string"
                        ? options.enableEslint
                        : "lint"
                    }`
                  ].filter(Boolean) as (string | TargetDependencyConfig)[],
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

          targets["format-toml"] ??= {
            cache: true,
            inputs: ["linting", "{projectRoot}/**/*.toml"],
            outputs: ["{projectRoot}/**/*.toml"],
            dependsOn: ["^format-toml"],
            executor: "nx:run-commands",
            options: {
              command:
                'pnpm exec taplo format --config="node_modules/@storm-software/linting-tools/taplo/config.toml" --cache-path="node_modules/.cache/taplo/{projectRoot}" --colors="always" "{projectRoot}/*.toml" "{projectRoot}/**/*.toml" '
            }
          };

          targets["format-readme"] ??= {
            cache: true,
            inputs: [
              "linting",
              "documentation",
              "{projectRoot}/{README.md,package.json,Cargo.toml,executors.json,generators.json}"
            ],
            outputs: ["{projectRoot}/README.md"],
            dependsOn: ["^format-readme"],
            executor: "nx:run-commands",
            options: {
              command:
                'pnpm exec storm-git readme --templates="tools/readme-templates" --project="{projectName}"'
            }
          };

          targets["format-prettier"] ??= {
            cache: true,
            inputs: ["linting", "typescript", "^production"],
            outputs: ["{projectRoot}/**/*"],
            dependsOn: ["^format-prettier"],
            executor: "nx:run-commands",
            options: {
              command:
                'pnpm exec prettier "{projectRoot}/**/*" --write --ignore-unknown --no-error-on-unmatched-pattern --config="node_modules/@storm-software/prettier/config.json" --ignore-path="node_modules/@storm-software/prettier/.prettierignore" --cache --cache-location="node_modules/.cache/prettier/{projectRoot}" '
            }
          };

          targets.format ??= {
            cache: true,
            inputs: ["linting", "typescript", "^production"],
            outputs: ["{projectRoot}/**/*"],
            dependsOn: [
              "format-readme",
              "format-toml",
              "format-prettier",
              "^format"
            ],
            executor: "nx:run-commands",
            options: {
              command:
                "echo 'Formatting the project files in \"{projectRoot}\"' "
            }
          };

          targets.clean ??= {
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

          targets.rebuild ??= {
            cache: false,
            executor: "nx:run-commands",
            dependsOn: ["clean", "^build"],
            inputs: ["typescript", "^production"],
            outputs: ["{workspaceRoot}/dist/{projectRoot}"],
            options: {
              command: `pnpm exec nx run ${projectConfig.name}:build`
            }
          };

          if (checkJestConfigAtPath(projectConfig.root)) {
            targets.test ??= {
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

          targets["docs"] ??= {
            cache: true,
            inputs: ["linting", "documentation", "typescript", "^production"],
            outputs: ["{projectRoot}/docs"],
            dependsOn: ["build", "format-readme", "lint-docs", "^docs"],
            options: {}
          };

          targets["size-limit"] ??= {
            cache: true,
            inputs: ["testing", "typescript", "^production"],
            outputs: ["{workspaceRoot}/dist/{projectRoot}"],
            dependsOn: ["build", "^size-limit"],
            options: {}
          };

          // Apply nx-release-publish target for non-private projects
          const isPrivate = packageJson.private ?? false;
          if (!isPrivate) {
            addProjectTag(
              projectConfig,
              ProjectTagConstants.Registry.TAG_ID,
              ProjectTagConstants.Registry.NPM,
              { overwrite: true }
            );

            targets["nx-release-publish"] = {
              cache: false,
              dependsOn: ["build", "size-limit", "^nx-release-publish"],
              executor: "@storm-software/workspace-tools:npm-publish",
              options: {}
            };

            if (
              projectConfig.projectType === "application" ||
              isEqualProjectTag(
                projectConfig,
                ProjectTagConstants.ProjectType.TAG_ID,
                ProjectTagConstants.ProjectType.APPLICATION
              ) ||
              isEqualProjectTag(
                projectConfig,
                ProjectTagConstants.DistStyle.TAG_ID,
                ProjectTagConstants.DistStyle.CLEAN
              )
            ) {
              targets["clean-package"] ??= {
                cache: true,
                dependsOn: ["build"],
                inputs: ["{workspaceRoot}/dist/{projectRoot}"],
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
            projectConfig,
            ProjectTagConstants.Language.TAG_ID,
            ProjectTagConstants.Language.TYPESCRIPT,
            { overwrite: true }
          );

          const platform = getProjectPlatform(projectConfig);
          switch (platform) {
            case "worker":
              addProjectTag(
                projectConfig,
                ProjectTagConstants.Platform.TAG_ID,
                ProjectTagConstants.Platform.WORKER,
                { overwrite: true }
              );
              break;

            case "node":
              addProjectTag(
                projectConfig,
                ProjectTagConstants.Platform.TAG_ID,
                ProjectTagConstants.Platform.NODE,
                { overwrite: true }
              );
              break;

            case "browser":
              addProjectTag(
                projectConfig,
                ProjectTagConstants.Platform.TAG_ID,
                ProjectTagConstants.Platform.BROWSER,
                { overwrite: true }
              );
              break;

            default:
              addProjectTag(
                projectConfig,
                ProjectTagConstants.Platform.TAG_ID,
                ProjectTagConstants.Platform.NEUTRAL,
                { overwrite: true }
              );
              break;
          }

          setDefaultProjectTags(projectConfig, name);

          return {
            projects: {
              [root]: defu(
                {
                  root,
                  targets,
                  release: {
                    version: {
                      generator:
                        "@storm-software/workspace-tools:release-version"
                    }
                  }
                },
                projectConfig
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
    console.warn(e);
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
    console.warn(e);
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
