import { joinPathFragments, ProjectGraph, Tree } from "@nx/devkit";
import {
  modifyCargoTable,
  parseCargoToml,
  parseCargoTomlWithTree,
  stringifyCargoToml
} from "@storm-software/config-tools/utilities/toml";
import { VersionActions } from "nx/release";
import { NxReleaseVersionConfiguration } from "nx/src/config/nx-json";
import { getCrateRegistryVersion } from "../utils/registry-helpers";

export default class StormRustVersionActions extends VersionActions {
  validManifestFilenames = ["Cargo.toml"];

  public async readCurrentVersionFromSourceManifest(tree: Tree): Promise<{
    currentVersion: string;
    manifestPath: string;
  }> {
    const sourceCargoTomlPath = joinPathFragments(
      this.projectGraphNode.data.root,
      "Cargo.toml"
    );

    try {
      const cargoToml = parseCargoTomlWithTree(
        tree,
        this.projectGraphNode.data.root,
        this.projectGraphNode.name
      );
      return {
        manifestPath: sourceCargoTomlPath,
        currentVersion: cargoToml.package.version
      };
    } catch {
      throw new Error(
        `Unable to determine the current version for project "${
          this.projectGraphNode.name
        }" from ${
          sourceCargoTomlPath
        }, please ensure that the "version" field is set within the Cargo.toml file`
      );
    }
  }

  public async readCurrentVersionFromRegistry(
    tree: Tree,
    currentVersionResolverMetadata: NxReleaseVersionConfiguration["currentVersionResolverMetadata"]
  ): Promise<{
    currentVersion: string;
    logText: string;
  }> {
    const cargoToml = parseCargoTomlWithTree(
      tree,
      this.projectGraphNode.data.root,
      this.projectGraphNode.name
    );

    const crateName = cargoToml.package.name;

    const metadata = currentVersionResolverMetadata;
    const registryArg =
      typeof metadata?.registry === "string"
        ? metadata.registry
        : "https://crates.io";
    const tagArg = typeof metadata?.tag === "string" ? metadata.tag : "latest";

    let currentVersion: string | null = null;
    try {
      currentVersion = await getCrateRegistryVersion(
        crateName,
        tagArg,
        registryArg
      );
    } catch {
      // Do nothing
    }

    return {
      currentVersion: currentVersion || "0.0.0",
      // Make troubleshooting easier by including the registry and tag data in the log text
      logText: `"cargoRegistry=${registryArg}" tag=${tagArg}`
    };
  }

  public async readCurrentVersionOfDependency(
    tree: Tree,
    projectGraph: ProjectGraph,
    dependencyProjectName: string
  ): Promise<{
    currentVersion: string | null;
    dependencyCollection: string | null;
  }> {
    const cargoToml = parseCargoTomlWithTree(
      tree,
      this.projectGraphNode.data.root,
      this.projectGraphNode.name
    );

    // Resolve the package name from the project graph metadata, as it may not match the project name
    const dependencyPackageName =
      projectGraph.nodes[dependencyProjectName]?.data.metadata?.js?.packageName;
    if (!dependencyPackageName) {
      return {
        currentVersion: null,
        dependencyCollection: null
      };
    }

    let currentVersion: string | null = null;
    let dependencyCollection: string | null = null;
    for (const depType of ["dependencies", "dev-dependencies"]) {
      if (cargoToml[depType] && cargoToml[depType][dependencyPackageName]) {
        currentVersion = cargoToml[depType][dependencyPackageName];
        dependencyCollection = depType;
        break;
      }
    }

    return {
      currentVersion,
      dependencyCollection
    };
  }

  public async updateProjectVersion(
    tree: Tree,
    newVersion: string
  ): Promise<string[]> {
    const logMessages: string[] = [];
    for (const manifestToUpdate of this.manifestsToUpdate) {
      const cargoTomlString = tree
        .read(manifestToUpdate.manifestPath)
        ?.toString();
      if (!cargoTomlString) {
        throw new Error(
          `Unable to read Cargo.toml at path: ${manifestToUpdate.manifestPath}`
        );
      }

      const cargoToml = parseCargoToml(cargoTomlString);
      cargoToml.package.version = newVersion;

      tree.write(manifestToUpdate.manifestPath, stringifyCargoToml(cargoToml));

      logMessages.push(
        `✍️  New version ${newVersion} written to manifest: ${manifestToUpdate.manifestPath}`
      );
    }

    return logMessages;
  }

  async updateProjectDependencies(
    tree: Tree,
    projectGraph: ProjectGraph,
    dependenciesToUpdate: Record<string, string>
  ): Promise<string[]> {
    const numDependenciesToUpdate = Object.keys(dependenciesToUpdate).length;
    if (numDependenciesToUpdate === 0) {
      return [];
    }

    const logMessages: string[] = [];
    for (const manifestToUpdate of this.manifestsToUpdate) {
      const cargoTomlString = tree
        .read(manifestToUpdate.manifestPath)
        ?.toString();
      if (!cargoTomlString) {
        throw new Error(
          `Unable to read Cargo.toml at path: ${manifestToUpdate.manifestPath}`
        );
      }

      const cargoToml = parseCargoToml(cargoTomlString);

      for (const depType of ["dependencies", "dev-dependencies"]) {
        if (cargoToml[depType]) {
          for (const [dep, version] of Object.entries(dependenciesToUpdate)) {
            const projectRoot = projectGraph.nodes[dep]?.data.root;
            if (!projectRoot) {
              throw new Error(
                `Unable to determine the project root for "${
                  dep
                }" from the project graph metadata, please ensure that the "@storm-software/workspace-tools" plugin is installed and the project graph has been built. If the issue persists, please report this issue on https://github.com/storm-software/storm-ops/issues`
              );
            }

            const dependencyCargoTomlString = tree
              .read(manifestToUpdate.manifestPath)
              ?.toString();
            if (!dependencyCargoTomlString) {
              throw new Error(
                `Unable to read Cargo.toml at path: ${manifestToUpdate.manifestPath}`
              );
            }

            const dependencyCargoToml = parseCargoToml(
              dependencyCargoTomlString
            );

            const dependencyData =
              cargoToml[depType][dependencyCargoToml.package.name];
            dependencyData.version = version;

            modifyCargoTable(
              cargoToml,
              depType,
              dependencyCargoToml.package.name,
              dependencyData
            );

            tree.write(
              manifestToUpdate.manifestPath,
              stringifyCargoToml(cargoToml)
            );
          }
        }
      }

      logMessages.push(
        `✍️  Updated ${numDependenciesToUpdate} ${
          numDependenciesToUpdate === 1 ? "dependency" : "dependencies"
        } in manifest: ${manifestToUpdate.manifestPath}`
      );
    }

    return logMessages;
  }
}
