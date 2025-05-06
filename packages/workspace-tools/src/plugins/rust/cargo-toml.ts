import {
  createNodesFromFiles,
  CreateNodesResultV2,
  CreateNodesV2,
  joinPathFragments,
  readJsonFile,
  workspaceRoot,
  type CreateDependencies,
  type ProjectConfiguration,
  type RawProjectGraphDependency
} from "@nx/devkit";
import { existsSync } from "node:fs";
import { dirname } from "node:path";
import {
  DependencyType,
  type ProjectGraphExternalNode
} from "nx/src/config/project-graph";
import { cargoMetadata, isExternal } from "../../utils/cargo";
import {
  addProjectTag,
  ProjectTagConstants,
  setDefaultProjectTags
} from "../../utils/project-tags";
import type { Package } from "../../utils/toml";

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

export const DEFAULT_ERROR_MESSAGE =
  "An error occurred in the Storm Rust Nx plugin.";

export interface CargoPluginOptions {
  includeApps?: boolean;
  skipDocs?: boolean;
  toolchain?: "stable" | "beta" | "nightly";
  profiles?: CargoPluginProfileMap;
}

export const createNodesV2: CreateNodesV2<CargoPluginOptions | undefined> = [
  "*/**/Cargo.toml",
  async (configFiles, options, context): Promise<CreateNodesResultV2> => {
    return await createNodesFromFiles(
      (configFile, options, context) => {
        try {
          console.log(`Processing Cargo.toml file: ${configFile}`);

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
          }, new Map<string, Package>());

          for (const cargoPackage of cargoPackages) {
            if (!isExternal(cargoPackage, context.workspaceRoot)) {
              const root = dirname(configFile);

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

              project.targets = {
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
                  outputs: [`{workspaceRoot}/dist/target/{projectRoot}`],
                  executor: "nx:run-commands",
                  options: {
                    command: `pnpm exec rimraf dist/target/crates/${cargoPackage.name}`,
                    color: true,
                    cwd: "{workspaceRoot}"
                  }
                },
                build: {
                  cache: true,
                  inputs: ["rust", "^production"],
                  dependsOn: ["build-base", "^build"],
                  executor: "@storm-software/workspace-tools:cargo-build",
                  outputs: [`{workspaceRoot}/dist/target/{projectRoot}`],
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
                  outputs: [`{workspaceRoot}/dist/target/{projectRoot}`],
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
                    "target-dir": `{workspaceRoot}/dist/target/{projectRoot}`
                  },
                  defaultConfiguration: "development",
                  configurations
                }
              };

              if (skipDocs != true) {
                project.targets.docs = {
                  cache: true,
                  inputs: [
                    "linting",
                    "documentation",
                    "default",
                    "^production"
                  ],
                  dependsOn: ["format-readme", "lint-docs", "^docs"],
                  outputs: [`{workspaceRoot}/dist/docs/{projectRoot}`],
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

                project.targets["nx-release-publish"] = {
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

              projects[root] = {
                ...project,
                release: {
                  ...project.release,
                  version: {
                    ...project.release?.version,
                    generator: "@storm-software/workspace-tools:release-version"
                  }
                }
              };
            }

            for (const dep of cargoPackage.dependencies) {
              if (isExternal(dep, context.workspaceRoot)) {
                const externalDepName = `cargo:${dep.name}`;
                if (!externalNodes?.[externalDepName]) {
                  externalNodes[externalDepName] = {
                    type: "cargo" as any,
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
          console.error(DEFAULT_ERROR_MESSAGE);
          console.error(e);

          throw new Error(DEFAULT_ERROR_MESSAGE, { cause: e });
        }
      },
      configFiles,
      options,
      context
    );
  }
];

export const createDependencies: CreateDependencies = (_, context) => {
  const metadata = cargoMetadata();
  if (!metadata) {
    return [];
  }

  const { packages: cargoPackages } = metadata;
  const dependencies: RawProjectGraphDependency[] = [];

  for (const pkg of cargoPackages) {
    if (context.projects[pkg.name]) {
      console.debug(`Local Cargo package found: ${pkg.name}`);

      for (const deps of pkg.dependencies) {
        if (!cargoPackages.find(p => p.name === deps.name)) {
          console.debug(
            `Dependency ${deps.name} not found in the cargo metadata.`
          );
          continue;
        }

        // if the dependency is listed in nx projects, it's not an external dependency
        if (context.projects[deps.name]) {
          dependencies.push(
            createDependency(pkg, deps.name, DependencyType.static)
          );
        } else {
          const externalDepName = `cargo:${deps.name}`;
          if (externalDepName in (context.externalNodes ?? {})) {
            dependencies.push(
              createDependency(pkg, externalDepName, DependencyType.static)
            );
          }
        }
      }
    }
  }

  return dependencies;
};

function createDependency(
  pkg: Package,
  depName: string,
  type: DependencyType
): RawProjectGraphDependency {
  const target = pkg.manifest_path.replace(/\\/g, "/");

  return {
    type,
    source: pkg.name,
    target: depName,
    sourceFile: target.replace(`${workspaceRoot.replace(/\\/g, "/")}/`, "")
  };
}
