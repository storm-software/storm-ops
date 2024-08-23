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

export interface CargoPluginOptions {
  includeApps?: boolean;
  skipDocs?: boolean;
}

export const createNodes: CreateNodes<CargoPluginOptions> = [
  "*/**/Cargo.toml",
  (
    cargoFile: string,
    opts: CargoPluginOptions = { includeApps: true, skipDocs: false },
    ctx: CreateNodesContext
  ) => {
    const metadata = cargoMetadata();
    if (!metadata) {
      return {};
    }

    const { packages: cargoPackages } = metadata;

    const externalNodes: Record<string, ProjectGraphExternalNode> = {};
    const projects: Record<string, ProjectConfiguration> = {};

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
            dependsOn: ["^lint-ls"]
          },
          lint: {
            cache: true,
            inputs: ["linting", "rust", "^production"],
            dependsOn: ["lint-ls", "^lint"],
            executor: "@monodon/rust:lint",
            options: {
              "target-dir": `{workspaceRoot}/dist/target/${cargoPackage.name}`
            }
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
          format: {
            cache: true,
            inputs: ["linting", "documentation", "rust", "^production"],
            dependsOn: ["format-readme", "format-toml", "^format"],
            executor: "nx:run-commands",
            options: {
              command: `cargo fmt -p ${project.name}`,
              color: true
            }
          },
          clean: {
            cache: true,
            inputs: ["rust", "^production"],
            outputs: [`{workspaceRoot}/dist/target/${cargoPackage.name}`],
            executor: "nx:run-commands",
            options: {
              command: `pnpm exec rimraf dist/target/${cargoPackage.name}`,
              color: true,
              cwd: "{workspaceRoot}"
            }
          },
          build: {
            cache: true,
            inputs: ["rust", "^production"],
            dependsOn: ["format", "^build"],
            executor: "@monodon/rust:check",
            outputs: ["{options.target-dir}"],
            options: {
              "target-dir": `{workspaceRoot}/dist/target/${cargoPackage.name}`
            }
          },
          rebuild: {
            cache: false,
            inputs: ["rust", "^production"],
            dependsOn: ["clean", "^build"],
            executor: "@monodon/rust:check",
            outputs: ["{options.target-dir}"],
            options: {
              "target-dir": `{workspaceRoot}/dist/target/${cargoPackage.name}`
            }
          },
          test: {
            cache: true,
            inputs: ["testing", "rust", "^production"],
            dependsOn: ["build", "^test"],
            executor: "@monodon/rust:test",
            outputs: ["{options.target-dir}"],
            options: {
              "target-dir": `{workspaceRoot}/dist/target/${cargoPackage.name}`
            },
            configurations: {
              production: {
                release: true
              }
            }
          }
        };

        if (opts.skipDocs != true) {
          project.targets.docs = {
            cache: true,
            inputs: ["linting", "documentation", "default", "^production"],
            dependsOn: ["build", "lint-docs", "^docs"],
            outputs: [`{workspaceRoot}/dist/docs/${cargoPackage.name}`],
            executor: "nx:run-commands",
            options: {
              command: `cargo doc -p ${project.name} --target-dir dist/docs/${cargoPackage.name}`,
              color: true
            }
          };
        }

        const isPrivate = cargoPackage.publish?.length === 0;
        if (!isPrivate) {
          project.targets["nx-release-publish"] = {
            cache: true,
            inputs: [
              "linting",
              "testing",
              "documentation",
              "rust",
              "^production"
            ],
            executor: "@storm-software/workspace-tools:cargo-publish",
            options: {
              packageRoot: root
            }
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
  }
];

export const createDependencies: CreateDependencies = (
  _,
  { projects, externalNodes }
) => {
  const metadata = cargoMetadata();
  if (!metadata) {
    return [];
  }

  const { packages: cargoPackages } = metadata;
  const dependencies: RawProjectGraphDependency[] = [];

  for (const pkg of cargoPackages) {
    if (projects[pkg.name]) {
      for (const deps of pkg.dependencies) {
        if (!cargoPackages.find(p => p.name === deps.name)) {
          continue;
        }

        // if the dependency is listed in nx projects, it's not an external dependency
        if (projects[deps.name]) {
          dependencies.push(
            createDependency(pkg, deps.name, DependencyType.static)
          );
        } else {
          const externalDepName = `cargo:${deps.name}`;
          if (externalDepName in (externalNodes ?? {})) {
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
  const workspaceRootClean = workspaceRoot.replace(/\\/g, "/");
  return {
    type,
    source: pkg.name,
    target: depName,
    sourceFile: target.replace(`${workspaceRootClean}/`, "")
  };
}
