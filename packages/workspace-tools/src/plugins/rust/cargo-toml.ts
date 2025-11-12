import {
  CreateDependenciesContext,
  createNodesFromFiles,
  CreateNodesResultV2,
  CreateNodesV2,
  joinPathFragments,
  readJsonFile,
  TargetConfiguration,
  validateDependency,
  workspaceRoot,
  type CreateDependencies,
  type ProjectConfiguration,
  type RawProjectGraphDependency
} from "@nx/devkit";
import defu from "defu";
import { existsSync } from "node:fs";
import { dirname } from "node:path";
import {
  DependencyType,
  type ProjectGraphExternalNode
} from "nx/src/config/project-graph";
import { cargoMetadata, isExternal } from "../../utils/cargo";
import { getRoot } from "../../utils/plugin-helpers";
import {
  addProjectTag,
  ProjectTagConstants,
  setDefaultProjectTags
} from "../../utils/project-tags";

export const name = "storm-software/rust";
export const description = "Plugin for parsing Cargo.toml files";

export type CargoPluginProfileMap = Record<string, string> & {
  development?: string;
  production?: string;
};
export const DefaultCargoPluginProfileMap = {
  development: "dev",
  production: "prod"
};

/**
 * Options for configuring the Storm Rust Nx plugin
 */
export interface CargoPluginOptions {
  /**
   * Whether to include Rust applications as projects in the workspace
   */
  includeApps?: boolean;

  /**
   * Whether to skip generating documentation for the projects
   */
  skipDocs?: boolean;

  /**
   * The Rust toolchain to use for executing cargo commands
   */
  toolchain?: "stable" | "beta" | "nightly";

  /**
   * Custom profile mappings for cargo build profiles
   */
  profiles?: CargoPluginProfileMap;
}

/**
 * Create nodes for Rust projects based on Cargo.toml files
 */
export const createNodesV2: CreateNodesV2<CargoPluginOptions | undefined> = [
  "*/**/Cargo.toml",
  async (configFiles, options, context): Promise<CreateNodesResultV2> => {
    return await createNodesFromFiles(
      (configFile, options, context) => {
        try {
          const profiles = options?.profiles ?? {};
          const includeApps = options?.includeApps ?? true;
          const toolchain = options?.toolchain;
          const skipDocs = options?.skipDocs ?? false;

          const metadata = cargoMetadata();
          if (!metadata) {
            return {};
          }

          const { packages: cargoPackages } = metadata;

          const externalNodes: Record<string, ProjectGraphExternalNode> = {};
          const projects: Record<string, ProjectConfiguration> = {};

          const profs = {
            ...DefaultCargoPluginProfileMap,
            ...profiles
          };
          const configurations = Object.keys(profs).reduce((ret, key) => {
            ret[key] = {
              profile: profs[key]
            };

            return ret;
          }, {});

          const cargoPackageMap = cargoPackages.reduce((acc, p) => {
            if (!acc.has(p.name)) {
              acc.set(p.name, p);
            }
            return acc;
          }, new Map<string, { manifest_path: string; name: string; version: string }>());

          for (const cargoPackage of cargoPackages) {
            if (!isExternal(cargoPackage, context.workspaceRoot)) {
              const root = getRoot(dirname(configFile), context);
              const project: ProjectConfiguration = {
                root,
                name: cargoPackage.name
              };
              if (existsSync(joinPathFragments(root, "project.json"))) {
                const projectJson = readJsonFile<ProjectConfiguration>(
                  joinPathFragments(root, "project.json")
                );
                if (projectJson) {
                  Object.keys(projectJson).forEach(key => {
                    if (!project[key]) {
                      project[key] = projectJson[key];
                    }
                  });
                }
              }

              // If the project is an application and we don't want to include apps, skip it
              if (
                includeApps === false &&
                project.projectType === "application"
              ) {
                continue;
              }

              const targets: Record<string, TargetConfiguration<any>> = {
                "lint-markdown": {
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
                },
                "lint-ls": {
                  cache: true,
                  inputs: ["linting", "rust", "^production"],
                  dependsOn: ["^lint-ls"],
                  options: {
                    command:
                      'pnpm exec ls-lint --config="./node_modules/@storm-software/linting-tools/ls-lint/.ls-lint.yml" ',
                    color: true
                  }
                },
                lint: {
                  cache: true,
                  inputs: ["linting", "rust", "^production"],
                  dependsOn: ["lint-ls", "lint-markdown", "^lint"],
                  executor: "@storm-software/workspace-tools:cargo-clippy",
                  options: {
                    toolchain,
                    fix: false
                  },
                  defaultConfiguration: "development",
                  configurations
                },
                check: {
                  cache: true,
                  inputs: ["linting", "rust", "^production"],
                  dependsOn: ["lint", "^check"],
                  executor: "@storm-software/workspace-tools:cargo-check",
                  options: {
                    toolchain
                  },
                  defaultConfiguration: "development",
                  configurations
                },
                "format-readme": {
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
                },
                "format-toml": {
                  cache: true,
                  inputs: ["linting", "{projectRoot}/**/*.toml"],
                  outputs: ["{projectRoot}/**/*.toml"],
                  dependsOn: ["^format-toml"],
                  executor: "nx:run-commands",
                  options: {
                    command:
                      'pnpm exec taplo format --config="node_modules/@storm-software/linting-tools/taplo/config.toml" --cache-path="node_modules/.cache/taplo/{projectRoot}" --colors="always" "{projectRoot}/*.toml" "{projectRoot}/**/*.toml" '
                  }
                },
                "format-clippy": {
                  cache: true,
                  inputs: ["linting", "rust", "^production"],
                  dependsOn: ["^format-clippy"],
                  executor: "@storm-software/workspace-tools:cargo-clippy",
                  options: {
                    toolchain,
                    fix: true
                  },
                  defaultConfiguration: "development",
                  configurations
                },
                format: {
                  cache: true,
                  inputs: ["linting", "documentation", "rust", "^production"],
                  dependsOn: [
                    "format-readme",
                    "format-clippy",
                    "format-toml",
                    "^format"
                  ],
                  executor: "@storm-software/workspace-tools:cargo-format",
                  options: {
                    toolchain,
                    fix: true
                  },
                  defaultConfiguration: "development",
                  configurations
                },
                clean: {
                  cache: true,
                  inputs: ["rust", "^production"],
                  outputs: [`{workspaceRoot}/dist/{projectRoot}/target`],
                  executor: "nx:run-commands",
                  options: {
                    command: `pnpm exec rimraf dist/{projectRoot}/target`,
                    color: true,
                    cwd: "{workspaceRoot}"
                  }
                },
                build: {
                  cache: true,
                  inputs: ["rust", "^production"],
                  dependsOn: ["build-base", "^build"],
                  executor: "@storm-software/workspace-tools:cargo-build",
                  outputs: [`{workspaceRoot}/dist/{projectRoot}/target`],
                  options: {
                    toolchain: toolchain
                  },
                  defaultConfiguration: "development",
                  configurations
                },
                rebuild: {
                  cache: false,
                  inputs: ["rust", "^production"],
                  dependsOn: ["clean", "build-base", "^build"],
                  executor: "@storm-software/workspace-tools:cargo-build",
                  outputs: [`{workspaceRoot}/dist/{projectRoot}/target`],
                  options: {
                    toolchain: toolchain
                  },
                  defaultConfiguration: "development",
                  configurations
                },
                test: {
                  cache: true,
                  inputs: ["testing", "rust", "^production"],
                  dependsOn: ["build", "^test"],
                  executor: "@monodon/rust:test",
                  outputs: ["{options.target-dir}"],
                  options: {
                    "target-dir": `{workspaceRoot}/dist/{projectRoot}/target`
                  },
                  defaultConfiguration: "development",
                  configurations
                }
              };

              if (skipDocs != true) {
                targets.docs = {
                  cache: true,
                  inputs: ["linting", "documentation", "^production"],
                  dependsOn: ["format-readme", "lint-docs", "^docs"],
                  outputs: [`{workspaceRoot}/dist/{projectRoot}/docs`],
                  executor: "@storm-software/workspace-tools:cargo-doc",
                  options: {
                    toolchain: toolchain
                  },
                  defaultConfiguration: "production",
                  configurations
                };
              }

              if (
                cargoPackage.publish === null ||
                cargoPackage.publish === undefined ||
                cargoPackage.publish === true ||
                (Array.isArray(cargoPackage.publish) &&
                  cargoPackage.publish.length > 0)
              ) {
                addProjectTag(
                  project,
                  ProjectTagConstants.Registry.TAG_ID,
                  ProjectTagConstants.Registry.CARGO,
                  { overwrite: true }
                );

                targets["nx-release-publish"] = {
                  cache: true,
                  inputs: [
                    "linting",
                    "testing",
                    "documentation",
                    "rust",
                    "^production"
                  ],
                  dependsOn: ["build", "^nx-release-publish"],
                  executor: "@storm-software/workspace-tools:cargo-publish",
                  options: {
                    packageRoot: root
                  },
                  defaultConfiguration: "production",
                  configurations
                };
              }

              addProjectTag(
                project,
                ProjectTagConstants.Language.TAG_ID,
                ProjectTagConstants.Language.RUST,
                { overwrite: true }
              );
              setDefaultProjectTags(project, name);

              projects[root] = defu(
                {
                  targets,
                  release: {
                    version: {
                      versionActions:
                        "@storm-software/workspace-tools/release/rust-version-actions"
                    }
                  }
                },
                project
              );
            }

            for (const dep of cargoPackage.dependencies) {
              if (isExternal(dep, context.workspaceRoot)) {
                const externalDepName = `cargo:${dep.name}`;
                if (!externalNodes?.[externalDepName]) {
                  externalNodes[externalDepName] = {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    type: "cargo" as any,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    name: externalDepName as any,
                    data: {
                      packageName: dep.name,
                      version: cargoPackageMap.get(dep.name)?.version ?? "0.0.0"
                    }
                  };
                }
              }
            }
          }

          return {
            projects,
            externalNodes
          };
        } catch (e) {
          console.error("An error occurred in the Storm Rust Nx plugin.");
          console.error(e);

          throw new Error("An error occurred in the Storm Rust Nx plugin.", {
            cause: e
          });
        }
      },
      configFiles,
      options,
      context
    );
  }
];

/**
 * Create dependencies between Rust projects based on Cargo metadata
 *
 * @param options - The user provided plugin options
 * @param context - The plugin context
 * @returns An array of project graph dependencies
 */
export const createDependencies: CreateDependencies<CargoPluginOptions> = (
  options,
  context
) => {
  try {
    console.debug(
      `[storm-software/rust]: Creating dependencies using cargo metadata.`
    );

    const metadata = cargoMetadata();
    if (!metadata?.packages) {
      console.debug(
        `[storm-software/rust]: Unable to find cargo metadata. Skipping dependency creation.`
      );

      return [];
    }

    const dependencies: RawProjectGraphDependency[] = [];
    for (const pkg of metadata.packages) {
      if (context.projects[pkg.name]) {
        for (const deps of pkg.dependencies) {
          if (!metadata.packages.find(p => p.name === deps.name)) {
            console.debug(
              `[storm-software/rust]: Dependency ${deps.name} not found in the cargo metadata.`
            );
            continue;
          }

          // if the dependency is listed in Nx projects, it's not an external dependency
          if (context.projects[deps.name]) {
            dependencies.push(
              createDependency(context, pkg, deps.name, DependencyType.static)
            );
          } else {
            const externalDepName = `cargo:${deps.name}`;
            if (externalDepName in (context.externalNodes ?? {})) {
              dependencies.push(
                createDependency(
                  context,
                  pkg,
                  externalDepName,
                  DependencyType.static
                )
              );
            }
          }
        }
      }
    }

    return dependencies;
  } catch (e) {
    console.error(
      "An error occurred creating dependencies in the Storm Rust Nx plugin."
    );
    console.error(e);

    throw new Error(
      "An error occurred creating dependencies in the Storm Rust Nx plugin.",
      {
        cause: e
      }
    );
  }
};

function createDependency(
  context: CreateDependenciesContext,
  pkg: { manifest_path: string; name: string },
  depName: string,
  type: DependencyType
): RawProjectGraphDependency {
  const dependency = {
    type,
    source: pkg.name,
    target: depName,
    sourceFile: pkg.manifest_path
      .replace(/\\/g, "/")
      .replace(`${workspaceRoot.replace(/\\/g, "/")}/`, "")
  };
  validateDependency(dependency, context);

  return dependency;
}
