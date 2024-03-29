import {
  type ProjectConfiguration,
  type RawProjectGraphDependency,
  workspaceRoot,
  type CreateNodes,
  type CreateDependencies
} from "@nx/devkit";
import { DependencyType, type ProjectGraphExternalNode } from "nx/src/config/project-graph";
import { dirname } from "node:path";
import type { Package } from "../../utils/toml";
import { cargoMetadata, isExternal } from "../../utils/cargo";

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

    for (const pkg of cargoPackages) {
      if (!isExternal(pkg, ctx.workspaceRoot)) {
        // const root = normalizePath(dirname(relative(ctx.workspaceRoot, pkg.manifest_path)));
        const root = dirname(cargoFile);

        const targets: ProjectConfiguration["targets"] = {
          lint: {
            cache: true,
            inputs: ["default", "^production"],
            dependsOn: ["^lint"],
            executor: "@monodon/rust:lint",
            outputs: ["{options.target-dir}"],
            options: {
              "target-dir": `dist/target/${pkg.name}`
            }
          },
          build: {
            cache: true,
            inputs: ["default", "^production"],
            dependsOn: ["lint", "^build"],
            executor: "@monodon/rust:check",
            outputs: ["{options.target-dir}"],
            options: {
              "target-dir": `dist/target/${pkg.name}`
            }
          },
          test: {
            cache: true,
            inputs: ["defaultTesting", "^production"],
            dependsOn: ["test", "^build"],
            executor: "@monodon/rust:test",
            outputs: ["{options.target-dir}"],
            options: {
              "target-dir": `dist/target/${pkg.name}`
            },
            configurations: {
              production: {
                release: true
              }
            }
          }
        };

        // Apply nx-release-publish target for non-private projects
        const isPrivate = pkg.publish?.length === 0;
        if (!isPrivate) {
          targets["nx-release-publish"] = {
            cache: false,
            inputs: ["default", "^production"],
            dependsOn: ["test", "build", "^nx-release-publish"],
            executor: "@storm-software/workspace-tools:cargo-publish",
            options: {
              packageRoot: root
            }
          };
        }

        projects[root] = {
          root,
          name: pkg.name,
          targets,
          release: {
            version: {
              generator: "@storm-software/workspace-tools:release-version"
            }
          },
          tags: ["rust", "cargo"]
        };
      }
      for (const dep of pkg.dependencies) {
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

export const createDependencies: CreateDependencies = (_, { projects, externalNodes }) => {
  const metadata = cargoMetadata();
  if (!metadata) {
    return [];
  }

  const { packages: cargoPackages } = metadata;

  const dependencies: RawProjectGraphDependency[] = [];

  for (const pkg of cargoPackages) {
    if (projects[pkg.name]) {
      for (const deps of pkg.dependencies) {
        if (!cargoPackages.find((p) => p.name === deps.name)) {
          continue;
        }

        // if the dependency is listed in nx projects, it's not an external dependency
        if (projects[deps.name]) {
          dependencies.push(createDependency(pkg, deps.name, DependencyType.static));
        } else {
          const externalDepName = `cargo:${deps.name}`;
          if (externalDepName in (externalNodes ?? {})) {
            dependencies.push(createDependency(pkg, externalDepName, DependencyType.static));
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
