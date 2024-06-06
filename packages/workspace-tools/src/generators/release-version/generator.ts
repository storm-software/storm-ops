import { exec, execSync } from "node:child_process";
import { relative } from "node:path";
import {
  IMPLICIT_DEFAULT_RELEASE_GROUP,
  NxReleaseConfig
} from "nx/src/command-line/release/config/config";
// import ora from "ora";
import {
  getFirstGitCommit,
  getLatestGitTagForPattern
} from "nx/src/command-line/release/utils/git";
import {
  resolveSemverSpecifierFromConventionalCommits,
  resolveSemverSpecifierFromPrompt
} from "nx/src/command-line/release/utils/resolve-semver-specifier";
import { isValidSemverSpecifier } from "nx/src/command-line/release/utils/semver";
import {
  deriveNewSemverVersion,
  validReleaseVersionPrefixes,
  type VersionData
} from "nx/src/command-line/release/version";
import { interpolate } from "nx/src/tasks-runner/utils";
import { prerelease } from "semver";
import {
  formatFiles,
  joinPathFragments,
  output,
  readJson,
  updateJson,
  writeJson,
  type ProjectGraph,
  type ProjectGraphDependency,
  type ProjectGraphProjectNode,
  type Tree
} from "@nx/devkit";
import { resolveLocalPackageDependencies as resolveLocalPackageJsonDependencies } from "@nx/js/src/generators/release-version/utils/resolve-local-package-dependencies";
import { updateLockFile } from "@nx/js/src/generators/release-version/utils/update-lock-file";
import type { StormConfig } from "@storm-software/config";
import { withRunGenerator } from "../../base/base-generator";
import {
  modifyCargoTable,
  parseCargoToml,
  parseCargoTomlWithTree,
  stringifyCargoToml
} from "../../utils/toml";
import type { ReleaseVersionGeneratorSchema } from "./schema";

export async function releaseVersionGeneratorFn(
  tree: Tree,
  options: ReleaseVersionGeneratorSchema,
  config?: StormConfig
) {
  const { writeInfo, findWorkspaceRoot } = await import(
    "@storm-software/config-tools"
  );

  const versionData: VersionData = {};

  // If the user provided a specifier, validate that it is valid semver or a relative semver keyword
  if (options.specifier) {
    if (!isValidSemverSpecifier(options.specifier)) {
      throw new Error(
        `The given version specifier "${options.specifier}" is not valid. You provide an exact version or a valid semver keyword such as "major", "minor", "patch", etc.`
      );
    }
    // The node semver library classes a leading `v` as valid, but we want to ensure it is not present in the final version
    options.specifier = options.specifier.replace(/^v/, "");
  }

  if (
    options.versionPrefix &&
    validReleaseVersionPrefixes.indexOf(options.versionPrefix) === -1
  ) {
    throw new Error(
      `Invalid value for version.generatorOptions.versionPrefix: "${options.versionPrefix}"

Valid values are: ${validReleaseVersionPrefixes.map(s => `"${s}"`).join(", ")}`
    );
  }

  // always use disk as a fallback in case this is the first release
  options.fallbackCurrentVersionResolver ??= "disk";

  const projects = options.projects;

  const createResolvePackageRoot =
    (customPackageRoot?: string) =>
    (projectNode: ProjectGraphProjectNode): string => {
      if (
        projectNode?.data?.root === config?.workspaceRoot ||
        projectNode?.data?.root === "."
      ) {
        return config?.workspaceRoot ?? findWorkspaceRoot();
      }

      // Default to the project root if no custom packageRoot
      if (!customPackageRoot) {
        return projectNode.data.root;
      }

      return interpolate(customPackageRoot, {
        workspaceRoot: "",
        projectRoot: projectNode.data.root,
        projectName: projectNode.name
      });
    };

  const resolvePackageRoot = createResolvePackageRoot(options.packageRoot);

  // Resolve any custom package roots for each project upfront as they will need to be reused during dependency resolution
  const projectNameToPackageRootMap = new Map<string, string>();
  for (const project of projects) {
    projectNameToPackageRootMap.set(project.name, resolvePackageRoot(project));
  }

  let currentVersion: string | null = null;
  let currentVersionResolvedFromFallback = false;

  let latestMatchingGitTag: any = null;
  let specifier = options.specifier ? options.specifier : undefined;

  for (const project of projects) {
    const projectName = project.name;
    const packageRoot = projectNameToPackageRootMap.get(projectName);

    const packageJsonPath = joinPathFragments(
      packageRoot ?? "./",
      "package.json"
    );
    const cargoTomlPath = joinPathFragments(packageRoot ?? "./", "Cargo.toml");
    if (!tree.exists(packageJsonPath) && !tree.exists(cargoTomlPath)) {
      throw new Error(
        `The project "${projectName}" does not have a package.json available at ${packageJsonPath} or a Cargo.toml file available at ${cargoTomlPath}.

To fix this you will either need to add a package.json or Cargo.toml file at that location, or configure "release" within your nx.json to exclude "${projectName}" from the current release group, or amend the packageRoot configuration to point to where the package.json should be.`
      );
    }

    const workspaceRelativePackagePath = relative(
      config?.workspaceRoot ?? findWorkspaceRoot(),
      tree.exists(packageJsonPath) ? packageJsonPath : cargoTomlPath
    );

    const log = (msg: string) => {
      writeInfo(`${projectName}: ${msg}`, config);
    };

    writeInfo(`Running release version for project: ${project.name}`, config);

    let packageName!: string;
    let currentVersionFromDisk!: string;

    if (tree.exists(packageJsonPath)) {
      const projectPackageJson = readJson(tree, packageJsonPath);
      log(
        `🔍 Reading data for package "${projectPackageJson.name}" from ${workspaceRelativePackagePath}`
      );

      packageName = projectPackageJson.name;
      currentVersionFromDisk = projectPackageJson.version;
    } else if (tree.exists(cargoTomlPath)) {
      const cargoToml = parseCargoToml(
        tree.read(cargoTomlPath)?.toString("utf-8")
      );
      log(
        `🔍 Reading data for package "${cargoToml.package.name}" from ${workspaceRelativePackagePath}`
      );

      packageName = cargoToml.package.name;
      currentVersionFromDisk = cargoToml.package.version;

      if (options.currentVersionResolver === "registry") {
        options.currentVersionResolver = "disk";
      }
    } else {
      throw new Error(
        `The project "${projectName}" does not have a package.json available at ${workspaceRelativePackagePath} or a Cargo.toml file available at ${cargoTomlPath}.

To fix this you will either need to add a package.json or Cargo.toml file at that location, or configure "release" within your nx.json to exclude "${projectName}" from the current release group, or amend the packageRoot configuration to point to where the package.json should be.`
      );
    }

    switch (options.currentVersionResolver) {
      case "registry": {
        const metadata = options.currentVersionResolverMetadata;
        const npmRegistry = metadata?.registry ?? (await getNpmRegistry());
        const githubRegistry =
          metadata?.registry ?? (await getGitHubRegistry());
        const tag = metadata?.tag ?? "latest";

        /**
         * If the currentVersionResolver is set to registry, and the projects are not independent, we only want to make the request once for the whole batch of projects.
         * For independent projects, we need to make a request for each project individually as they will most likely have different versions.
         */
        if (options.releaseGroup.projectsRelationship === "independent") {
          try {
            // Must be non-blocking async to allow spinner to render
            currentVersion = await new Promise<string>((resolve, reject) => {
              exec(
                `npm view ${packageName} version --registry=${npmRegistry} --tag=${tag}`,
                (error, stdout, stderr) => {
                  if (error) {
                    return reject(error);
                  }
                  if (stderr) {
                    return reject(stderr);
                  }
                  return resolve(stdout.trim());
                }
              );
            });

            // spinner.stop();

            log(
              `📄 Resolved the current version as ${currentVersion} for tag "${tag}" from registry ${npmRegistry}`
            );
          } catch (_) {
            try {
              // Try getting the version from the GitHub registry
              currentVersion = await new Promise<string>((resolve, reject) => {
                exec(
                  `npm view ${packageName} version --registry=${githubRegistry} --tag=${tag}`,
                  (error, stdout, stderr) => {
                    if (error) {
                      return reject(error);
                    }
                    if (stderr) {
                      return reject(stderr);
                    }
                    return resolve(stdout.trim());
                  }
                );
              });

              // spinner.stop();

              log(
                `📄 Resolved the current version as ${currentVersion} for tag "${tag}" from registry ${githubRegistry}`
              );
            } catch (_) {
              if (options.fallbackCurrentVersionResolver === "disk") {
                log(
                  `📄 Unable to resolve the current version from the registry ${npmRegistry}${githubRegistry ? ` or ${githubRegistry}` : ""}. Falling back to the version on disk of ${currentVersionFromDisk}`
                );
                currentVersion = currentVersionFromDisk;
                currentVersionResolvedFromFallback = true;
              } else {
                throw new Error(
                  `Unable to resolve the current version from the registry ${npmRegistry}${githubRegistry ? ` or ${githubRegistry}` : ""}. Please ensure that the package exists in the registry in order to use the "registry" currentVersionResolver. Alternatively, you can use the --first-release option or set "release.version.generatorOptions.fallbackCurrentVersionResolver" to "disk" in order to fallback to the version on disk when the registry lookup fails.`
                );
              }
            }
          }
        } else {
          if (currentVersionResolvedFromFallback) {
            log(
              `📄 Using the current version ${currentVersion} already resolved from disk fallback.`
            );
          } else {
            log(
              `📄 Using the current version ${currentVersion} already resolved from the registry ${npmRegistry ?? githubRegistry}`
            );
          }
        }

        break;
      }
      case "disk":
        currentVersion = currentVersionFromDisk;
        log(
          `📄 Resolved the current version as ${currentVersion} from ${packageJsonPath}`
        );
        break;
      case "git-tag": {
        if (
          // We always need to independently resolve the current version from git tag per project if the projects are independent
          options.releaseGroup.projectsRelationship === "independent"
        ) {
          const releaseTagPattern = options.releaseGroup.releaseTagPattern;
          latestMatchingGitTag = await getLatestGitTagForPattern(
            releaseTagPattern,
            {
              projectName: project.name
            }
          );
          if (!latestMatchingGitTag) {
            if (currentVersionFromDisk) {
              log(
                `📄 Unable to resolve the current version from git tag using pattern "${releaseTagPattern}". Falling back to the version on disk of ${currentVersionFromDisk}`
              );
              currentVersion = currentVersionFromDisk;
            } else {
              log(
                `No git tags matching pattern "${releaseTagPattern}" for project "${project.name}" were found. This process also could not determine the version by checking the package files on disk, so we will attempt to use the default version value: "0.0.1".`
              );
              currentVersion = "0.0.1";
            }

            currentVersionResolvedFromFallback = true;
          } else {
            currentVersion = latestMatchingGitTag.extractedVersion;
            log(
              `📄 Resolved the current version as ${currentVersion} from git tag "${latestMatchingGitTag.tag}".`
            );
          }
        } else {
          if (currentVersionResolvedFromFallback) {
            log(
              `📄 Using the current version ${currentVersion} already resolved from disk fallback.`
            );
          } else {
            log(
              `📄 Using the current version ${currentVersion} already resolved from git tag "${latestMatchingGitTag.tag}".`
            );
          }
        }
        break;
      }
      default:
        throw new Error(
          `Invalid value for options.currentVersionResolver: ${options.currentVersionResolver}`
        );
    }

    if (options.specifier) {
      log(`📄 Using the provided version specifier "${options.specifier}".`);
    }

    /**
     * If we are versioning independently then we always need to determine the specifier for each project individually, except
     * for the case where the user has provided an explicit specifier on the command.
     *
     * Otherwise, if versioning the projects together we only need to perform this logic if the specifier is still unset from
     * previous iterations of the loop.
     *
     * NOTE: In the case that we have previously determined via conventional commits that no changes are necessary, the specifier
     * will be explicitly set to `null`, so that is why we only check for `undefined` explicitly here.
     */
    if (
      specifier === undefined ||
      (options.releaseGroup.projectsRelationship === "independent" &&
        !options.specifier)
    ) {
      const specifierSource = options.specifierSource;
      switch (specifierSource) {
        case "conventional-commits": {
          if (options.currentVersionResolver !== "git-tag") {
            throw new Error(
              `Invalid currentVersionResolver "${options.currentVersionResolver}" provided for release group "${options.releaseGroup.name}". Must be "git-tag" when "specifierSource" is "conventional-commits"`
            );
          }

          const affectedProjects =
            options.releaseGroup.projectsRelationship === "independent"
              ? [projectName]
              : projects.map(p => p.name);

          // latestMatchingGitTag will be undefined if the current version was resolved from the disk fallback.
          // In this case, we want to use the first commit as the ref to be consistent with the changelog command.
          let previousVersionRef = latestMatchingGitTag?.tag
            ? latestMatchingGitTag.tag
            : await getFirstGitCommit();
          if (!previousVersionRef) {
            log(
              `Unable to determine previous version ref for the projects ${affectedProjects.join(
                ", "
              )}. This is likely a bug in Storm's Release Versioning. We will attempt to use the default version value "0.0.1" and continue with the process.`
            );

            previousVersionRef = "0.0.1";
          }

          specifier =
            (await resolveSemverSpecifierFromConventionalCommits(
              previousVersionRef,
              options.projectGraph,
              affectedProjects,
              DEFAULT_CONVENTIONAL_COMMITS_CONFIG
            )) ?? undefined;

          if (!specifier) {
            log(
              "🚫 No changes were detected using git history and the conventional commits standard."
            );
            break;
          }

          // Always assume that if the current version is a prerelease, then the next version should be a prerelease.
          // Users must manually graduate from a prerelease to a release by providing an explicit specifier.
          if (prerelease(currentVersion)) {
            specifier = "prerelease";
            log(
              `📄 Resolved the specifier as "${specifier}" since the current version is a prerelease.`
            );
          } else {
            log(
              `📄 Resolved the specifier as "${specifier}" using git history and the conventional commits standard.`
            );
          }
          break;
        }
        case "prompt": {
          // Only add the release group name to the log if it is one set by the user, otherwise it is useless noise
          const maybeLogReleaseGroup = (log: string): string => {
            if (options.releaseGroup.name === IMPLICIT_DEFAULT_RELEASE_GROUP) {
              return log;
            }
            return `${log} within release group "${options.releaseGroup.name}"`;
          };
          if (options.releaseGroup.projectsRelationship === "independent") {
            specifier = await resolveSemverSpecifierFromPrompt(
              `${maybeLogReleaseGroup(
                `What kind of change is this for project "${projectName}"`
              )}?`,
              `${maybeLogReleaseGroup(`What is the exact version for project "${projectName}"`)}?`
            );
          } else {
            specifier = await resolveSemverSpecifierFromPrompt(
              `${maybeLogReleaseGroup(
                `What kind of change is this for the ${projects.length} matched projects(s)`
              )}?`,
              `${maybeLogReleaseGroup(
                `What is the exact version for the ${projects.length} matched project(s)`
              )}?`
            );
          }
          break;
        }
        default:
          throw new Error(
            `Invalid specifierSource "${specifierSource}" provided. Must be one of "prompt" or "conventional-commits"`
          );
      }
    }

    // Resolve any local package dependencies for this project (before applying the new version or updating the versionData)
    const localPackageDependencies = resolveLocalPackageDependencies(
      tree,
      options.projectGraph,
      projects.filter(
        project =>
          project?.data?.root && project?.data?.root !== config?.workspaceRoot
      ),
      projectNameToPackageRootMap,
      resolvePackageRoot,
      // includeAll when the release group is independent, as we may be filtering to a specific subset of projects, but we still want to update their dependents
      options.releaseGroup.projectsRelationship === "independent",
      tree.exists(packageJsonPath)
    );

    const dependentProjects = Object.values(localPackageDependencies)
      .flat()
      .filter(localPackageDependency => {
        return localPackageDependency.target === project.name;
      });

    if (!currentVersion) {
      throw new Error(
        `Unable to determine the current version for project "${projectName}"`
      );
    }

    versionData[projectName] = {
      currentVersion: currentVersion ? currentVersion : "0.0.1",
      dependentProjects,
      newVersion: null // will stay as null in the final result in the case that no changes are detected
    } as any;

    if (!specifier) {
      log(
        `🚫 Skipping versioning "${packageName}" as no changes were detected.`
      );
      continue;
    }

    const newVersion = deriveNewSemverVersion(
      currentVersion,
      specifier,
      options.preid
    );
    if (versionData[projectName]) {
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      versionData[projectName]!.newVersion = newVersion;
    }

    if (tree.exists(packageJsonPath)) {
      const projectPackageJson = readJson(tree, packageJsonPath);

      writeJson(tree, packageJsonPath, {
        ...projectPackageJson,
        version: newVersion
      });
    } else if (tree.exists(cargoTomlPath)) {
      const cargoToml = parseCargoToml(
        tree.read(cargoTomlPath)?.toString("utf-8")
      );

      cargoToml.package ??= {};
      cargoToml.package.version = newVersion;
      tree.write(cargoTomlPath, stringifyCargoToml(cargoToml));
    }

    log(
      `✍️  New version ${newVersion} written to ${workspaceRelativePackagePath}`
    );

    if (dependentProjects.length > 0) {
      log(
        `✍️  Applying new version ${newVersion} to ${dependentProjects.length} ${
          dependentProjects.length > 1
            ? "packages which depend"
            : "package which depends"
        } on ${project.name}`
      );
    }

    for (const dependentProject of dependentProjects) {
      const dependentPackageRoot = projectNameToPackageRootMap.get(
        dependentProject.source
      );
      if (!dependentPackageRoot) {
        throw new Error(
          `The dependent project "${dependentProject.source}" does not have a packageRoot available.

Projects with packageRoot configured: ${Array.from(projectNameToPackageRootMap.keys()).join(", ")}`
        );
      }

      const dependentPackageJsonPath = joinPathFragments(
        dependentPackageRoot,
        "package.json"
      );
      const dependentCargoTomlPath = joinPathFragments(
        dependentPackageRoot,
        "Cargo.toml"
      );

      if (tree.exists(dependentPackageJsonPath)) {
        updateJson(tree, dependentPackageJsonPath, json => {
          // Auto (i.e.infer existing) by default
          let versionPrefix = options.versionPrefix ?? "auto";

          // For auto, we infer the prefix based on the current version of the dependent
          if (versionPrefix === "auto") {
            versionPrefix = ""; // we don't want to end up printing auto

            const current =
              json[dependentProject.dependencyCollection][packageName];
            if (current) {
              const prefixMatch = current.match(/^[~^]/);
              if (prefixMatch) {
                versionPrefix = prefixMatch[0];
              } else {
                versionPrefix = "";
              }
            }
          }
          json[dependentProject.dependencyCollection][packageName] =
            `${versionPrefix}${newVersion}`;
          return json;
        });
      } else if (tree.exists(dependentCargoTomlPath)) {
        const dependentPkg = parseCargoTomlWithTree(
          tree,
          dependentPackageRoot,
          dependentProject.source
        );

        // Auto (i.e.infer existing) by default
        let versionPrefix = options.versionPrefix ?? "auto";
        let updatedDependencyData: string | Record<string, string> = "";

        for (const dependency of Object.entries(
          dependentPkg[dependentProject.dependencyCollection] ?? {}
        )) {
          const [dependencyName, dependencyData] = dependency as [
            string,
            string | Record<string, string>
          ];

          if (dependencyName !== dependentProject.target) {
            continue;
          }

          // For auto, we infer the prefix based on the current version of the dependent
          if (versionPrefix === "auto") {
            versionPrefix = ""; // we don't want to end up printing auto

            if (currentVersion) {
              const dependencyVersion =
                typeof dependencyData === "string"
                  ? dependencyData
                  : dependencyData.version;
              const prefixMatch = dependencyVersion?.match(/^[~^=]/);
              if (prefixMatch) {
                versionPrefix = prefixMatch[0] as "" | "auto" | "~" | "^" | "=";
              } else {
                versionPrefix = "";
              }

              // In rust the default version prefix/behavior is ^, so a ^ may have been inferred by cargo metadata via no prefix or an explicit ^.
              if (versionPrefix === "^") {
                if (
                  typeof dependencyData !== "string" &&
                  !dependencyData.version?.startsWith("^")
                ) {
                  versionPrefix = "";
                }
              }
            }
          }
          const newVersionWithPrefix = `${versionPrefix}${newVersion}`;
          updatedDependencyData =
            typeof dependencyData === "string"
              ? newVersionWithPrefix
              : {
                  ...dependencyData,
                  version: newVersionWithPrefix
                };
          break;
        }

        const cargoTomlToUpdate = joinPathFragments(
          dependentPackageRoot,
          "Cargo.toml"
        );

        modifyCargoTable(
          dependentPkg,
          dependentProject.dependencyCollection,
          dependentProject.target,
          updatedDependencyData
        );

        tree.write(cargoTomlToUpdate, stringifyCargoToml(dependentPkg));
      }
    }
  }

  /**
   * Ensure that formatting is applied so that version bump diffs are as minimal as possible
   * within the context of the user's workspace.
   */
  await formatFiles(tree);

  // Return the version data so that it can be leveraged by the overall version command
  return {
    data: versionData,
    callback: async (tree, opts) => {
      output.logSingleLine("Updating Cargo.lock file");
      const cwd = tree.root;
      const updatedFiles = await updateLockFile(cwd, opts);

      const updatedCargoPackages: string[] = [];
      for (const [projectName, projectVersionData] of Object.entries(
        versionData
      )) {
        const project = projects.find(proj => proj.name === projectName);
        if (
          projectVersionData.newVersion &&
          project?.name &&
          projectNameToPackageRootMap.get(project.name)
        ) {
          const projectRoot = projectNameToPackageRootMap.get(project.name);
          if (
            projectRoot &&
            tree.exists(joinPathFragments(projectRoot, "Cargo.toml"))
          ) {
            updatedCargoPackages.push(projectName);
          }
        }
      }

      if (updatedCargoPackages.length > 0) {
        execSync(`cargo update ${updatedCargoPackages.join(" ")}`, {
          maxBuffer: 1024 * 1024 * 1024,
          env: {
            ...process.env
          },
          cwd: tree.root
        });

        if (hasGitDiff("Cargo.lock")) {
          updatedFiles.push("Cargo.lock");
        }
      }

      return updatedFiles;
    },
    success: true
  };
}

export default withRunGenerator<ReleaseVersionGeneratorSchema>(
  "Storm Release Version",
  releaseVersionGeneratorFn
);

async function getNpmRegistry() {
  if (process.env.STORM_REGISTRY_NPM) {
    return process.env.STORM_REGISTRY_NPM;
  }

  const registry = await new Promise<string>((resolve, reject) => {
    exec("npm config get registry", (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }
      if (stderr) {
        return reject(stderr);
      }
      return resolve(stdout.trim());
    });
  });

  return registry ? registry : "https://registry.npmjs.org";
}

function getGitHubRegistry() {
  if (process.env.STORM_REGISTRY_GITHUB) {
    return process.env.STORM_REGISTRY_GITHUB;
  }

  return "https://npm.pkg.github.com";
}

function hasGitDiff(filePath: string) {
  try {
    const result = execSync(`git diff --name-only "${filePath}"`).toString();
    return result.trim() === filePath;
  } catch (_) {
    // Assuming any error means no diff or a problem executing git command
    return false;
  }
}

interface LocalPackageDependency extends ProjectGraphDependency {
  dependencyCollection: "dependencies" | "dev-dependencies";
}

function resolveLocalPackageDependencies(
  tree: Tree,
  projectGraph: ProjectGraph,
  filteredProjects: ProjectGraphProjectNode[],
  projectNameToPackageRootMap: Map<string, string>,
  resolvePackageRoot: (projectNode: ProjectGraphProjectNode) => string,
  includeAll = false,
  isNodeProject = true
): Record<string, LocalPackageDependency[]> {
  if (isNodeProject) {
    return resolveLocalPackageJsonDependencies(
      tree,
      projectGraph,
      filteredProjects,
      projectNameToPackageRootMap,
      resolvePackageRoot,
      includeAll
    ) as Record<string, LocalPackageDependency[]>;
  }

  return resolveLocalPackageCargoDependencies(
    tree,
    projectGraph,
    filteredProjects,
    projectNameToPackageRootMap,
    resolvePackageRoot,
    includeAll
  );
}

function resolveLocalPackageCargoDependencies(
  tree: Tree,
  projectGraph: ProjectGraph,
  filteredProjects: ProjectGraphProjectNode[],
  projectNameToPackageRootMap: Map<string, string>,
  resolvePackageRoot: (projectNode: ProjectGraphProjectNode) => string,
  includeAll = false
): Record<string, LocalPackageDependency[]> {
  const localPackageDependencies: Record<string, LocalPackageDependency[]> = {};

  const projects = includeAll
    ? Object.values(projectGraph.nodes)
    : filteredProjects;

  for (const projectNode of projects) {
    // Resolve the Cargo.toml path for the project, taking into account any custom packageRoot settings
    let packageRoot = projectNameToPackageRootMap.get(projectNode.name);
    // packageRoot wasn't added to the map yet, try to resolve it dynamically
    if (!packageRoot && includeAll) {
      packageRoot = resolvePackageRoot(projectNode);
      if (!packageRoot) {
        continue;
      }
      // Append it to the map for later use within the release version generator
      projectNameToPackageRootMap.set(projectNode.name, packageRoot);
    }

    const cargoTomlPath = joinPathFragments(packageRoot ?? "./", "Cargo.toml");
    if (!tree.exists(cargoTomlPath)) {
      continue;
    }

    const projectDeps = projectGraph.dependencies[projectNode.name];
    if (!projectDeps) {
      continue;
    }
    const localPackageDepsForProject: LocalPackageDependency[] = [];
    for (const dep of projectDeps) {
      const depProject = projectGraph.nodes[dep.target];
      if (!depProject) {
        continue;
      }
      const depProjectRoot = projectNameToPackageRootMap.get(dep.target);
      if (!depProjectRoot) {
        throw new Error(
          `The project "${dep.target}" does not have a packageRoot available.`
        );
      }
      const cargoToml = parseCargoTomlWithTree(
        tree,
        resolvePackageRoot(projectNode),
        projectNode.name
      );
      const dependencies = cargoToml.dependencies ?? {};
      const devDependencies = cargoToml["dev-dependencies"] ?? {};
      const dependencyCollection: "dependencies" | "dev-dependencies" | null =
        dependencies[depProject.name]
          ? "dependencies"
          : devDependencies[depProject.name]
            ? "dev-dependencies"
            : null;
      if (!dependencyCollection) {
        throw new Error(
          `The project "${projectNode.name}" does not have a local dependency on "${depProject.name}" in its Cargo.toml`
        );
      }
      localPackageDepsForProject.push({
        ...dep,
        dependencyCollection
      });
    }

    localPackageDependencies[projectNode.name] = localPackageDepsForProject;
  }

  return localPackageDependencies;
}

export const DEFAULT_CONVENTIONAL_COMMITS_CONFIG = {
  types: {
    feat: {
      semverBump: "minor",
      changelog: {
        title: "Features",
        hidden: false
      }
    },
    fix: {
      semverBump: "patch",
      changelog: {
        title: "Fixes",
        hidden: false
      }
    },
    perf: {
      semverBump: "none",
      changelog: {
        title: "Performance",
        hidden: false
      }
    },
    refactor: {
      semverBump: "none",
      changelog: {
        title: "Refactors",
        hidden: true
      }
    },
    docs: {
      semverBump: "none",
      changelog: {
        title: "Documentation",
        hidden: true
      }
    },
    build: {
      semverBump: "none",
      changelog: {
        title: "Build",
        hidden: true
      }
    },
    types: {
      semverBump: "none",
      changelog: {
        title: "Types",
        hidden: true
      }
    },
    chore: {
      semverBump: "none",
      changelog: {
        title: "Chore",
        hidden: true
      }
    },
    examples: {
      semverBump: "none",
      changelog: {
        title: "Examples",
        hidden: true
      }
    },
    test: {
      semverBump: "none",
      changelog: {
        title: "Tests",
        hidden: true
      }
    },
    style: {
      semverBump: "none",
      changelog: {
        title: "Styles",
        hidden: true
      }
    },
    ci: {
      semverBump: "none",
      changelog: {
        title: "CI",
        hidden: true
      }
    },
    revert: {
      semverBump: "none",
      changelog: {
        title: "Revert",
        hidden: true
      }
    }
  }
} as NxReleaseConfig["conventionalCommits"];
