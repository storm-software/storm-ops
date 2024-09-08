import {
  CreateNodesContext,
  joinPathFragments,
  readJsonFile,
  workspaceRoot,
  type CreateDependencies,
  type CreateNodes,
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
  ProjectTagConstants,
  addProjectTag,
  setDefaultProjectTags
} from "../../utils/project-tags";
import type { Package } from "../../utils/toml";

export const name = "storm-software/rust/cargo-toml";
export const description = "Plugin for parsing Cargo.toml files";

export type CargoPluginProfileMap = Record<string, string> & {
  development?: string;
  production?: string;
};
export const DefaultCargoPluginProfileMap = {
  development: "dev",
  production: "prod"
};

export interface CargoPluginOptions {
  includeApps?: boolean;
  skipDocs?: boolean;
  toolchain?: "stable" | "beta" | "nightly";
  profiles?: CargoPluginProfileMap;
}

export const createNodes: CreateNodes<CargoPluginOptions> = [
  "*/**/Cargo.toml",
  (
    cargoFile: string,
    opts: CargoPluginOptions = {
      includeApps: true,
      skipDocs: false,
      profiles: {}
    },
    ctx: CreateNodesContext
  ) => {
    try {
      const metadata = cargoMetadata();
      if (!metadata) {
        return {};
      }

      const { packages: cargoPackages } = metadata;

      const externalNodes: Record<string, ProjectGraphExternalNode> = {};
      const projects: Record<string, ProjectConfiguration> = {};

      const profiles = {
        ...DefaultCargoPluginProfileMap,
        ...opts.profiles
      };
      const configurations = Object.keys(profiles).reduce((ret, key) => {
        ret[key] = {
          profile: profiles[key]
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
        if (!isExternal(cargoPackage, ctx.workspaceRoot)) {
          const root = dirname(cargoFile);

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
            opts.includeApps === false &&
            project.projectType === "application"
          ) {
            continue;
          }

          project.targets = {
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
              dependsOn: ["^lint"],
              executor: "@storm-software/workspace-tools:cargo-clippy",
              options: {
                toolchain: opts.toolchain,
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
                toolchain: opts.toolchain
              },
              defaultConfiguration: "development",
              configurations
            },
            "format-readme": {
              cache: true,
              inputs: ["linting", "documentation", "rust", "^production"],
              dependsOn: ["^format-readme"]
            },
            "format-toml": {
              cache: true,
              inputs: ["linting", "rust", "^production"],
              dependsOn: ["^format-toml"]
            },
            "format-clippy": {
              cache: true,
              inputs: ["linting", "rust", "^production"],
              dependsOn: ["^format-clippy"],
              executor: "@storm-software/workspace-tools:cargo-clippy",
              options: {
                toolchain: opts.toolchain,
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
                toolchain: opts.toolchain,
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
                toolchain: opts.toolchain
              },
              defaultConfiguration: "development",
              configurations
            },
            rebuild: {
              cache: false,
              inputs: ["rust", "^production"],
              dependsOn: ["clean", "^build"],
              executor: "@storm-software/workspace-tools:cargo-build",
              outputs: [`{workspaceRoot}/dist/target/{projectRoot}`],
              options: {
                toolchain: opts.toolchain
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

          if (opts.skipDocs != true) {
            project.targets.docs = {
              cache: true,
              inputs: ["linting", "documentation", "default", "^production"],
              dependsOn: ["format-readme", "lint-docs", "^docs"],
              outputs: [`{workspaceRoot}/dist/docs/{projectRoot}`],
              executor: "@storm-software/workspace-tools:cargo-doc",
              options: {
                toolchain: opts.toolchain
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
          setDefaultProjectTags(project);

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
          if (isExternal(dep, ctx.workspaceRoot)) {
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
      console.error("An error occurred while parsing the Cargo.toml file.");
      console.error(e);
    }
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
