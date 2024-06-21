import { dirname } from "node:path";
import {
  DependencyType,
  type ProjectGraphExternalNode
} from "nx/src/config/project-graph";
import {
  workspaceRoot,
  type CreateDependencies,
  type CreateNodes,
  type ProjectConfiguration,
  type RawProjectGraphDependency
} from "@nx/devkit";
import { cargoMetadata, isExternal } from "../../utils/cargo";
import type { Package } from "../../utils/toml";

export const name = "storm-software/rust/cargo-toml";

export const createNodes: CreateNodes = [
  "*/**/Cargo.toml",
  (cargoFile, _opts, ctx) => {
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

        const targets: ProjectConfiguration["targets"] = {
          "lint-ls": {
            cache: true,
            inputs: ["config_linting", "rust", "^production"],
            dependsOn: ["^lint-ls"]
          },
          lint: {
            cache: true,
            inputs: ["config_linting", "rust", "^production"],
            dependsOn: ["lint-ls", "^lint"],
            executor: "@monodon/rust:lint",
            options: {
              "target-dir": `{workspaceRoot}/dist/target/${cargoPackage.name}`
            }
          },
          "format-readme": {
            cache: true,
            dependsOn: ["^format-readme"]
          },
          "format-toml": {
            cache: true,
            dependsOn: ["^format-toml"]
          },
          format: {
            cache: true,
            inputs: ["config_linting", "rust", "^production"],
            dependsOn: ["format-readme", "format-toml", "^format"],
            executor: "nx:run-commands",
            options: {
              command:
                "echo 'Formatting the project files in \"{projectRoot}\"' ",
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
            dependsOn: ["format", "clean", "^build"],
            executor: "@monodon/rust:check",
            outputs: ["{options.target-dir}"],
            options: {
              "target-dir": `{workspaceRoot}/dist/target/${cargoPackage.name}`
            }
          },
          test: {
            cache: true,
            inputs: ["config_testing", "source_testing", "rust", "^production"],
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

        const isPrivate = cargoPackage.publish?.length === 0;
        if (!isPrivate) {
          targets["nx-release-publish"] = {
            cache: false,
            inputs: ["rust", "^production"],
            executor: "@storm-software/workspace-tools:cargo-publish",
            options: {
              packageRoot: root
            }
          };
        }

        projects[root] = {
          root,
          name: cargoPackage.name,
          targets,
          release: {
            version: {
              generator: "@storm-software/workspace-tools:release-version"
            }
          },
          tags: ["language:rust"]
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
