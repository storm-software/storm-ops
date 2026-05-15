import { StormWorkspaceConfig } from "@storm-software/config";
import { isVerbose, writeDebug } from "@storm-software/config-tools";
import { VersionOptions } from "nx/src/command-line/release/command-object.js";
import {
  IMPLICIT_DEFAULT_RELEASE_GROUP,
  NxReleaseConfig
} from "nx/src/command-line/release/config/config.js";
import { ReleaseGroupWithName } from "nx/src/command-line/release/config/filter-release-groups.js";
import {
  FinalConfigForProject,
  ReleaseGraph
} from "nx/src/command-line/release/utils/release-graph.js";
import {
  VersionData,
  VersionDataEntry
} from "nx/src/command-line/release/utils/shared.js";
import { deriveSpecifierFromConventionalCommits } from "nx/src/command-line/release/version/derive-specifier-from-conventional-commits";
import { deriveSpecifierFromVersionPlan } from "nx/src/command-line/release/version/deriver-specifier-from-version-plans";
import { ProjectLogger } from "nx/src/command-line/release/version/project-logger.js";
import {
  BUMP_TYPE_REASON_TEXT,
  ReleaseGroupProcessor
} from "nx/src/command-line/release/version/release-group-processor";
import {
  NOOP_VERSION_ACTIONS,
  SemverBumpType,
  VersionActions
} from "nx/src/command-line/release/version/version-actions.js";
import { NxReleaseVersionConfiguration } from "nx/src/config/nx-json.js";
import {
  ProjectGraph,
  ProjectGraphProjectNode
} from "nx/src/config/project-graph.js";
import { Tree } from "nx/src/generators/tree.js";
import semver from "semver";

export class StormReleaseGroupProcessor extends ReleaseGroupProcessor {
  #tree: Tree;

  #projectGraph: ProjectGraph;

  #nxReleaseConfig: NxReleaseConfig;

  #releaseGraph: ReleaseGraph;

  /**
   * Track any version plan files that have been processed so that we can delete them after versioning is complete,
   * while leaving any unprocessed files in place.
   */
  #processedVersionPlanFiles = new Set<string>();

  /**
   * Tracks which release groups have already been processed to avoid
   * processing them multiple times. Used during the group traversal.
   */
  #processedGroups: Set<string> = new Set();

  /**
   * Keeps track of which projects have already had their versions bumped.
   * This is used to avoid redundant version bumping and to determine which
   * projects need their dependencies updated.
   */
  #bumpedProjects: Set<string> = new Set();

  /**
   * versionData that will ultimately be returned to the nx release version handler by getVersionData()
   */
  #versionData: Map<
    string, // project name
    VersionDataEntry
  > = new Map();

  constructor(
    tree: Tree,
    protected workspaceConfig: StormWorkspaceConfig,
    projectGraph: ProjectGraph,
    nxReleaseConfig: NxReleaseConfig,
    releaseGraph: ReleaseGraph,
    private versionOptions: VersionOptions
  ) {
    super(tree, projectGraph, nxReleaseConfig, releaseGraph, {
      dryRun: !!versionOptions.dryRun,
      verbose: versionOptions.verbose || isVerbose(workspaceConfig.logLevel),
      firstRelease: !!versionOptions.firstRelease,
      preid: versionOptions.preid ?? workspaceConfig.preid ?? "",
      userGivenSpecifier: versionOptions.specifier as
        | SemverBumpType
        | undefined,
      filters: {
        projects: versionOptions.projects,
        groups: versionOptions.groups
      },
      versionActionsOptionsOverrides:
        versionOptions.versionActionsOptionsOverrides
    });

    this.#tree = tree;
    this.#projectGraph = projectGraph;
    this.#nxReleaseConfig = nxReleaseConfig;
    this.#releaseGraph = releaseGraph;
  }

  override getReleaseGroupNameForProject(projectName: string): string | null {
    const group = this.#releaseGraph.projectToReleaseGroup.get(projectName);
    return group ? group.name : null;
  }

  override getNextGroup(): string | null {
    for (const [groupName, groupNode] of this.#releaseGraph.groupGraph) {
      if (
        !this.#processedGroups.has(groupName) &&
        Array.from(groupNode.dependencies).every(dep =>
          this.#processedGroups.has(dep)
        )
      ) {
        return groupName;
      }
    }
    return null;
  }

  override flushAllProjectLoggers() {
    for (const projectLogger of this.#releaseGraph.projectLoggers.values()) {
      projectLogger.flush();
    }
  }

  override deleteProcessedVersionPlanFiles(): void {
    for (const versionPlanPath of this.#processedVersionPlanFiles) {
      this.#tree.delete(versionPlanPath);
    }
  }

  override getVersionData(): VersionData {
    return Object.fromEntries(this.#versionData);
  }

  /**
   * Invoke the afterAllProjectsVersioned functions for each unique versionActions type.
   * This can be useful for performing actions like updating a workspace level lock file.
   *
   * Because the tree has already been flushed to disk at this point, each afterAllProjectsVersioned
   * function is responsible for returning the list of changed and deleted files that it affected.
   *
   * The root level `release.version.versionActionsOptions` is what is passed in here because this
   * is a one time action for the whole workspace. Release group and project level overrides are
   * not applicable.
   */
  override async afterAllProjectsVersioned(
    rootVersionActionsOptions: Record<string, unknown>
  ): Promise<{
    changedFiles: string[];
    deletedFiles: string[];
  }> {
    const changedFiles = new Set<string>();
    const deletedFiles = new Set<string>();

    for (const [, afterAllProjectsVersioned] of this.#releaseGraph
      .uniqueAfterAllProjectsVersioned) {
      const {
        changedFiles: changedFilesForVersionActions,
        deletedFiles: deletedFilesForVersionActions
      } = await afterAllProjectsVersioned(this.#tree.root, {
        dryRun: this.versionOptions.dryRun,
        verbose:
          this.versionOptions.verbose ||
          isVerbose(this.workspaceConfig.logLevel),
        rootVersionActionsOptions
      });

      for (const file of changedFilesForVersionActions) {
        changedFiles.add(file);
      }
      for (const file of deletedFilesForVersionActions) {
        deletedFiles.add(file);
      }
    }

    return {
      changedFiles: Array.from(changedFiles),
      deletedFiles: Array.from(deletedFiles)
    };
  }

  override async processDockerProjects(
    dockerVersionScheme?: string,
    dockerVersion?: string
  ) {
    const dockerProjects = new Map<string, FinalConfigForProject>();
    for (const project of this.#versionData.keys()) {
      const hasDockerTechnology = Object.values(
        this.#projectGraph.nodes[project]?.data?.targets ?? []
      ).some(({ metadata }) => metadata?.technologies?.includes("docker"));
      if (!hasDockerTechnology) {
        continue;
      }
      const finalConfigForProject =
        this.#releaseGraph.finalConfigsByProject.get(project);
      dockerProjects.set(project, finalConfigForProject!);
    }
    // If no docker projects to process, exit early to avoid unnecessary loading of docker handling
    if (dockerProjects.size === 0) {
      return;
    }
    let handleDockerVersion: (
      workspaceRoot: string,
      projectGraphNode: ProjectGraphProjectNode,
      finalConfigForProject: FinalConfigForProject,
      dockerVersionScheme?: string,
      dockerVersion?: string,
      versionActionsVersion?: string
    ) => Promise<{ newVersion: string; logs: string[] }>;
    try {
      const dockerVersionUtilsPath = "@nx/docker/release/version-utils";
      const { handleDockerVersion: _handleDockerVersion } = require(
        dockerVersionUtilsPath
      );
      handleDockerVersion = _handleDockerVersion;
    } catch (e) {
      console.error(
        "Could not find `@nx/docker`. Please run `nx add @nx/docker` before attempting to release Docker images."
      );
      throw e;
    }
    for (const [project, finalConfigForProject] of dockerProjects.entries()) {
      const projectNode = this.#projectGraph.nodes[project];
      const projectVersionData = this.#versionData.get(project);
      const { newVersion, logs } = await handleDockerVersion(
        this.workspaceConfig.workspaceRoot,
        projectNode!,
        finalConfigForProject,
        dockerVersionScheme,
        dockerVersion,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-non-null-asserted-optional-chain
        projectVersionData?.newVersion!
      );

      logs.forEach(log =>
        this.#getProjectLoggerForProject(project).buffer(log)
      );
      const newVersionData = {
        ...projectVersionData,
        dockerVersion: newVersion
      };
      this.#versionData.set(project, newVersionData as VersionDataEntry);
    }
    this.flushAllProjectLoggers();
  }

  override async processGroups(): Promise<string[]> {
    const processOrder: string[] = [];

    // Use the topologically sorted groups
    for (const nextGroup of this.#releaseGraph.sortedReleaseGroups) {
      // Skip groups that have already been processed (could happen with circular dependencies)
      if (this.#processedGroups.has(nextGroup)) {
        continue;
      }
      // The next group might not present in the groupGraph if it has been filtered out
      if (!this.#releaseGraph.groupGraph.has(nextGroup)) {
        continue;
      }

      const allDependenciesProcessed = Array.from(
        this.#releaseGraph.groupGraph.get(nextGroup)!.dependencies
      ).every(dep => this.#processedGroups.has(dep));

      if (!allDependenciesProcessed) {
        // If we encounter a group whose dependencies aren't all processed,
        // it means there's a circular dependency that our topological sort broke.
        // We need to process any unprocessed dependencies first.
        for (const dep of this.#releaseGraph.groupGraph.get(nextGroup)!
          .dependencies) {
          if (!this.#processedGroups.has(dep)) {
            // The next group might not present in the groupGraph if it has been filtered out
            if (!this.#releaseGraph.groupGraph.has(dep)) {
              continue;
            }
            await this.#processGroup(dep);
            this.#processedGroups.add(dep);
            processOrder.push(dep);
          }
        }
      }

      await this.#processGroup(nextGroup);
      this.#processedGroups.add(nextGroup);
      processOrder.push(nextGroup);
    }

    return processOrder;
  }

  async #bumpVersions(releaseGroup: ReleaseGroupWithName): Promise<boolean> {
    if (releaseGroup.projectsRelationship === "fixed") {
      return this.#bumpFixedVersionGroup(releaseGroup);
    } else {
      return this.#bumpIndependentVersionGroup(releaseGroup);
    }
  }

  async #processGroup(releaseGroupName: string): Promise<void> {
    const groupNode = this.#releaseGraph.groupGraph.get(releaseGroupName)!;
    await this.#bumpVersions(groupNode.group);

    // Flush the project loggers for the group
    for (const project of groupNode.group.projects) {
      const projectLogger = this.#releaseGraph.projectLoggers.get(project);
      if (!projectLogger) {
        throw new Error(
          `No project logger found for project ${
            project
          } in release group ${releaseGroupName}. This should never happen.`
        );
      }

      projectLogger.flush();
    }
  }

  async #bumpFixedVersionGroup(
    releaseGroup: ReleaseGroupWithName
  ): Promise<boolean> {
    if (releaseGroup.projects.length === 0) {
      return false;
    }

    let bumped = false;
    const firstProject = releaseGroup.projects.reduce((ret, project) => {
      const currentVersion = this.#getCurrentCachedVersionForProject(project);
      if (!ret) {
        return currentVersion;
      }

      const largestVersion = this.#getCurrentCachedVersionForProject(ret);
      if (!largestVersion) {
        return currentVersion;
      }

      writeDebug(
        `Comparing versions for fixed group ${
          releaseGroup.name
        }: Current Greatest Version: ${largestVersion}, Current Project Version: ${
          currentVersion
        } (project: ${project})`
      );

      if (currentVersion && semver.gt(currentVersion, largestVersion)) {
        return currentVersion;
      }

      return ret;
    }, "");

    const {
      newVersionInput,
      newVersionInputReason,
      newVersionInputReasonData
    } = await this.#determineVersionBumpForProject(releaseGroup, firstProject);

    if (newVersionInput === "none") {
      // No direct bump for this group, but we may still need to bump if a dependency group has been bumped
      let bumpedByDependency = false;

      // Use sorted projects to check for dependencies in processed groups
      const sortedProjects =
        this.#releaseGraph.sortedProjects.get(releaseGroup.name) || [];

      // Iterate through each project in the release group in topological order
      for (const project of sortedProjects) {
        const dependencies = this.#projectGraph.dependencies[project] || [];
        for (const dep of dependencies) {
          const depGroup = this.getReleaseGroupNameForProject(dep.target);
          if (
            depGroup &&
            depGroup !== releaseGroup.name &&
            this.#processedGroups.has(depGroup)
          ) {
            const depGroupBumpType =
              await this.#getFixedReleaseGroupBumpType(depGroup);

            // If a dependency group has been bumped, determine if it should trigger a bump in this group
            if (depGroupBumpType !== "none") {
              bumpedByDependency = true;
              const depBumpType = this.#determineSideEffectBump(
                releaseGroup,
                depGroupBumpType as SemverBumpType
              );
              await this.#bumpVersionForProject(
                project,
                depBumpType,
                "DEPENDENCY_ACROSS_GROUPS_WAS_BUMPED",
                {}
              );
              this.#bumpedProjects.add(project);

              // Update any dependencies in the manifest
              await this.#updateDependenciesForProject(project);
            }
          }
        }
      }

      // If any project in the group was bumped due to dependency changes, we must bump all projects in the fixed group
      if (bumpedByDependency) {
        // Update all projects in topological order
        for (const project of sortedProjects) {
          if (!this.#bumpedProjects.has(project)) {
            await this.#bumpVersionForProject(
              project,
              this.#applyPreidToBumpType("patch", project),
              "OTHER_PROJECT_IN_FIXED_GROUP_WAS_BUMPED_DUE_TO_DEPENDENCY",
              {}
            );
            // Ensure the bump for remaining projects
            this.#bumpedProjects.add(project);
            await this.#updateDependenciesForProject(project);
          }
        }
      } else {
        /**
         * No projects in the group are being bumped, but as it stands only the first project would have an appropriate log,
         * therefore add in an extra log for each additional project in the group, and we also need to make sure that the
         * versionData is fully populated.
         */
        for (const project of releaseGroup.projects) {
          this.#versionData.set(project, {
            currentVersion: this.#getCurrentCachedVersionForProject(
              project
            ) as string,
            newVersion: null,
            dockerVersion: null,
            dependentProjects: this.#getOriginalDependentProjects(project)
          });
          if (project === firstProject) {
            continue;
          }
          const projectLogger = this.#getProjectLoggerForProject(project);
          projectLogger.buffer(
            `🚫 Skipping versioning for ${project} as it is a part of a fixed release group with ${firstProject} and no dependency bumps were detected`
          );
        }
      }

      return bumpedByDependency;
    }

    const { newVersion } = await this.#calculateNewVersion(
      firstProject,
      newVersionInput,
      newVersionInputReason,
      newVersionInputReasonData
    );

    // Use sorted projects for processing projects in the right order
    const sortedProjects =
      this.#releaseGraph.sortedProjects.get(releaseGroup.name) ||
      releaseGroup.projects;

    // First, update versions for all projects in the fixed group in topological order
    for (const project of sortedProjects) {
      const versionActions = this.#getVersionActionsForProject(project);
      const projectLogger = this.#getProjectLoggerForProject(project);
      const currentVersion = this.#getCurrentCachedVersionForProject(
        project
      ) as string;

      // The first project's version was determined above, so this log is only appropriate for the remaining projects
      if (project !== firstProject) {
        projectLogger.buffer(
          `❓ Applied version ${newVersion} directly, because the project is a member of a fixed release group containing ${firstProject}`
        );
      }

      /**
       * Update the project's version based on the implementation details of the configured VersionActions
       * and display any returned log messages to the user.
       */
      const logMessages = await versionActions.updateProjectVersion(
        this.#tree,
        newVersion
      );
      for (const logMessage of logMessages) {
        projectLogger.buffer(logMessage);
      }

      this.#bumpedProjects.add(project);
      bumped = true;

      // Populate version data for each project
      this.#versionData.set(project, {
        currentVersion,
        newVersion,
        dependentProjects: this.#getOriginalDependentProjects(project)
      });
    }

    // Then, update dependencies for all projects in the fixed group, also in topological order
    if (bumped) {
      for (const project of sortedProjects) {
        await this.#updateDependenciesForProject(project);
      }
    }

    return bumped;
  }

  #getOriginalDependentProjects(
    project: string
  ): VersionDataEntry["dependentProjects"] {
    return (
      this.#releaseGraph.originalDependentProjectsPerProject.get(project) || []
    );
  }

  async #updateDependenciesForProject(projectName: string): Promise<void> {
    if (!this.#releaseGraph.allProjectsToProcess.has(projectName)) {
      throw new Error(
        `Unable to find ${projectName} in allProjectsToProcess, please report this as a bug on https://github.com/nrwl/nx/issues`
      );
    }

    const versionActions = this.#getVersionActionsForProject(projectName);
    const cachedFinalConfigForProject =
      this.#getCachedFinalConfigForProject(projectName);

    const dependenciesToUpdate: Record<string, string> = {};
    const dependencies = this.#projectGraph.dependencies[projectName] || [];

    for (const dep of dependencies) {
      if (this.#releaseGraph.allProjectsToProcess.has(dep.target)) {
        const targetVersionData = this.#versionData.get(dep.target);
        if (targetVersionData) {
          const { currentVersion: currentDependencyVersion } =
            (await versionActions.readCurrentVersionOfDependency(
              this.#tree,
              this.#projectGraph,
              dep.target
            )) as { currentVersion: string };
          if (!currentDependencyVersion) {
            continue;
          }
          let finalPrefix = "";
          if (cachedFinalConfigForProject.versionPrefix === "auto") {
            const prefixMatch = currentDependencyVersion?.match(/^([~^=])/);
            finalPrefix = prefixMatch ? prefixMatch[1]! : "";
          } else if (
            cachedFinalConfigForProject.versionPrefix &&
            ["~", "^", "="].includes(cachedFinalConfigForProject.versionPrefix)
          ) {
            finalPrefix = cachedFinalConfigForProject.versionPrefix!;
          }

          const newVersion =
            targetVersionData.newVersion ??
            this.#releaseGraph.cachedCurrentVersions.get(dep.target) ??
            currentDependencyVersion;

          // Remove any existing prefix from the new version before applying the finalPrefix
          const cleanNewVersion = newVersion.replace(/^[~^=]/, "");
          dependenciesToUpdate[dep.target] = `${finalPrefix}${cleanNewVersion}`;
        }
      }
    }

    const projectLogger = this.#getProjectLoggerForProject(projectName);
    const logMessages = await versionActions.updateProjectDependencies(
      this.#tree,
      this.#projectGraph,
      dependenciesToUpdate
    );
    for (const logMessage of logMessages) {
      projectLogger.buffer(logMessage);
    }
  }

  #getVersionActionsForProject(projectName: string): VersionActions {
    const versionActions =
      this.#releaseGraph.projectsToVersionActions.get(projectName);
    if (!versionActions) {
      throw new Error(
        `No versionActions found for project ${projectName}, please report this as a bug on https://github.com/nrwl/nx/issues`
      );
    }
    return versionActions;
  }

  async #getFixedReleaseGroupBumpType(
    releaseGroupName: string
  ): Promise<SemverBumpType | string | null> {
    const releaseGroup =
      this.#releaseGraph.groupGraph.get(releaseGroupName)!.group;
    const releaseGroupFilteredProjects =
      this.#releaseGraph.releaseGroupToFilteredProjects.get(releaseGroup);
    if (
      !releaseGroupFilteredProjects ||
      releaseGroupFilteredProjects.size === 0
    ) {
      return "none";
    }

    // It's a fixed release group, so we can just pick any project in the group
    const anyProject = releaseGroupFilteredProjects.values().next().value;
    // If already bumped, no need to re-calculate it
    const { currentVersion, newVersion } = this.#versionData.get(anyProject)!;
    if (newVersion) {
      return semver.diff(currentVersion, newVersion);
    }

    return (
      await this.#determineVersionBumpForProject(releaseGroup, anyProject)
    ).newVersionInput;
  }

  // TODO: Support influencing the side effect bump in a future version, always patch for now like in legacy versioning
  #determineSideEffectBump(
    releaseGroup: ReleaseGroupWithName,
    dependencyBumpType: SemverBumpType
  ): SemverBumpType {
    // Any project in the group can be used to resolve the applyPreidToDependents
    // setting, since it is a group/workspace level option.
    const anyProject = releaseGroup.projects[0];
    return this.#applyPreidToBumpType("patch", anyProject);
  }

  /**
   * When a preid is set (e.g. --preid rc) and the project has opted in via
   * `applyPreidToDependents`, convert a "patch" side-effect bump into a
   * "prepatch" so that semver.inc() actually applies the preid.
   * semver.inc('1.0.0', 'patch', 'rc') ignores preid and returns '1.0.1'.
   * semver.inc('1.0.0', 'prepatch', 'rc') returns '1.0.1-rc.0' as expected.
   */
  #applyPreidToBumpType(
    bumpType: SemverBumpType,
    projectName: string
  ): SemverBumpType {
    if (
      !(this.versionOptions.preid && this.workspaceConfig.preid) ||
      bumpType === "none" ||
      bumpType.startsWith("pre")
    ) {
      return bumpType;
    }
    const finalConfig = this.#getCachedFinalConfigForProject(projectName);
    if (!finalConfig.applyPreidToDependents) {
      return bumpType;
    }
    switch (bumpType) {
      case "major":
        return "premajor";
      case "minor":
        return "preminor";
      case "patch":
        return "prepatch";
      default:
        return bumpType;
    }
  }

  #getCachedFinalConfigForProject(
    projectName: string
  ): NxReleaseVersionConfiguration {
    const cachedFinalConfig =
      this.#releaseGraph.finalConfigsByProject.get(projectName);
    if (!cachedFinalConfig) {
      throw new Error(
        `Unexpected error: No cached config found for project ${projectName}, please report this as a bug on https://github.com/nrwl/nx/issues`
      );
    }
    return cachedFinalConfig;
  }

  async #bumpIndependentVersionGroup(
    releaseGroup: ReleaseGroupWithName
  ): Promise<boolean> {
    const releaseGroupFilteredProjects =
      this.#releaseGraph.releaseGroupToFilteredProjects.get(releaseGroup);

    let bumped = false;
    const projectBumpTypes = new Map<
      string,
      {
        bumpType: SemverBumpType | string;
        bumpTypeReason: keyof typeof BUMP_TYPE_REASON_TEXT;
        bumpTypeReasonData: Record<string, unknown>;
      }
    >();
    const projectsToUpdate = new Set<string>();

    if (releaseGroupFilteredProjects && releaseGroupFilteredProjects.size > 0) {
      // First pass: Determine bump types (only for projects in this release group)
      for (const project of releaseGroupFilteredProjects) {
        const {
          newVersionInput: bumpType,
          newVersionInputReason: bumpTypeReason,
          newVersionInputReasonData: bumpTypeReasonData
        } = await this.#determineVersionBumpForProject(releaseGroup, project);
        projectBumpTypes.set(project, {
          bumpType,
          bumpTypeReason,
          bumpTypeReasonData
        });
        if (bumpType !== "none") {
          projectsToUpdate.add(project);
        }
      }

      // Second pass: Update versions using topologically sorted projects
      // This ensures dependencies are processed before dependents
      const sortedProjects =
        this.#releaseGraph.sortedProjects.get(releaseGroup.name) || [];

      // Process projects in topological order
      for (const project of sortedProjects) {
        if (
          projectsToUpdate.has(project) &&
          releaseGroupFilteredProjects?.has(project)
        ) {
          const {
            bumpType: finalBumpType,
            bumpTypeReason: finalBumpTypeReason,
            bumpTypeReasonData: finalBumpTypeReasonData
          } = projectBumpTypes.get(project)!;
          if (finalBumpType !== "none") {
            await this.#bumpVersionForProject(
              project,
              finalBumpType,
              finalBumpTypeReason,
              finalBumpTypeReasonData
            );
            this.#bumpedProjects.add(project);
            bumped = true;
          }
        }
      }

      // Third pass: Update dependencies also in topological order
      for (const project of sortedProjects) {
        if (
          projectsToUpdate.has(project) &&
          releaseGroupFilteredProjects?.has(project)
        ) {
          await this.#updateDependenciesForProject(project);
        }
      }
    }

    return bumped;
  }

  #getCurrentCachedVersionForProject(projectName: string): string | null {
    return this.#releaseGraph.cachedCurrentVersions.get(projectName) || null;
  }

  async #calculateNewVersion(
    project: string,
    newVersionInput: string, // any arbitrary string, whether or not it is valid is dependent upon the version actions implementation
    newVersionInputReason: keyof typeof BUMP_TYPE_REASON_TEXT,
    newVersionInputReasonData: Record<string, unknown>
  ): Promise<{ currentVersion: string; newVersion: string }> {
    const currentVersion = this.#getCurrentCachedVersionForProject(project);
    const versionActions = this.#getVersionActionsForProject(project);
    const { newVersion, logText } = await versionActions.calculateNewVersion(
      currentVersion,
      newVersionInput,
      newVersionInputReason,
      newVersionInputReasonData,
      this.versionOptions.preid || this.workspaceConfig.preid || ""
    );
    const projectLogger = this.#getProjectLoggerForProject(project);
    projectLogger.buffer(logText);
    return { currentVersion: currentVersion!, newVersion };
  }

  async #bumpVersionForProject(
    projectName: string,
    bumpType: SemverBumpType | string,
    bumpTypeReason: keyof typeof BUMP_TYPE_REASON_TEXT,
    bumpTypeReasonData: Record<string, unknown>
  ): Promise<void> {
    const projectLogger = this.#getProjectLoggerForProject(projectName);

    if (bumpType === "none") {
      projectLogger.buffer(
        `⏩ Skipping bump for ${projectName} as bump type is "none"`
      );
      return;
    }

    const versionActions = this.#getVersionActionsForProject(projectName);

    const { currentVersion, newVersion } = await this.#calculateNewVersion(
      projectName,
      bumpType,
      bumpTypeReason,
      bumpTypeReasonData
    );

    /**
     * Update the project's version based on the implementation details of the configured VersionActions
     * and display any returned log messages to the user.
     */
    const logMessages = await versionActions.updateProjectVersion(
      this.#tree,
      newVersion
    );
    for (const logMessage of logMessages) {
      projectLogger.buffer(logMessage);
    }

    // Update version data and bumped projects
    this.#versionData.set(projectName, {
      currentVersion,
      newVersion,
      dependentProjects: this.#getOriginalDependentProjects(projectName)
    });
    this.#bumpedProjects.add(projectName);

    // Find the release group for this project
    const releaseGroupName = this.getReleaseGroupNameForProject(projectName);
    if (!releaseGroupName) {
      projectLogger.buffer(
        `⚠️ Cannot find release group for ${projectName}, skipping dependent updates`
      );
      return;
    }

    const releaseGroup =
      this.#releaseGraph.groupGraph.get(releaseGroupName)!.group;
    const releaseGroupVersionConfig =
      releaseGroup.version as NxReleaseVersionConfiguration;

    // Get updateDependents from the release group level config
    const updateDependents =
      (releaseGroupVersionConfig?.updateDependents as
        | "auto"
        | "always"
        | "never") || "always";

    // Only update dependencies for dependents if the group's updateDependents is 'auto' or 'always'
    if (updateDependents === "auto" || updateDependents === "always") {
      const dependents = this.#getNonImplicitDependentsForProject(projectName);
      // Only process dependents that are actually being processed
      const dependentsToProcess = dependents.filter(dep =>
        this.#releaseGraph.allProjectsToProcess.has(dep)
      );

      await this.#updateDependenciesForDependents(dependentsToProcess);

      for (const dependent of dependentsToProcess) {
        if (!this.#bumpedProjects.has(dependent)) {
          await this.#bumpVersionForProject(
            dependent,
            this.#applyPreidToBumpType("patch", dependent),
            "DEPENDENCY_WAS_BUMPED",
            {}
          );
        }
      }
    } else {
      const releaseGroupText =
        releaseGroupName !== IMPLICIT_DEFAULT_RELEASE_GROUP
          ? ` in release group "${releaseGroupName}" `
          : " ";
      projectLogger.buffer(
        `⏩ Skipping dependent updates as "updateDependents"${releaseGroupText}is not "auto"`
      );
    }
  }

  #getProjectDependents(project: string): Set<string> {
    return this.#releaseGraph.projectToDependents.get(project) || new Set();
  }

  #getNonImplicitDependentsForProject(project: string): string[] {
    // Use the cached dependents for O(1) lookup instead of O(n) scan
    return Array.from(this.#getProjectDependents(project));
  }

  async #updateDependenciesForDependents(dependents: string[]): Promise<void> {
    for (const dependent of dependents) {
      if (!this.#releaseGraph?.allProjectsToProcess.has(dependent)) {
        throw new Error(
          `Unable to find project "${dependent}" in allProjectsToProcess, please report this as a bug on https://github.com/nrwl/nx/issues`
        );
      }
      await this.#updateDependenciesForProject(dependent);
    }
  }

  async #determineVersionBumpForProject(
    releaseGroup: ReleaseGroupWithName,
    projectName: string
  ): Promise<{
    newVersionInput: SemverBumpType | string;
    newVersionInputReason: keyof typeof BUMP_TYPE_REASON_TEXT;
    newVersionInputReasonData: Record<string, unknown>;
  }> {
    // User given specifier has the highest precedence
    if (this.versionOptions.specifier) {
      return {
        newVersionInput: this.versionOptions.specifier as SemverBumpType,
        newVersionInputReason: "USER_SPECIFIER",
        newVersionInputReasonData: {}
      };
    }

    const projectGraphNode = this.#projectGraph.nodes[projectName];
    const projectLogger = this.#getProjectLoggerForProject(projectName);
    const cachedFinalConfigForProject =
      this.#getCachedFinalConfigForProject(projectName);

    if (
      cachedFinalConfigForProject.specifierSource === "conventional-commits"
    ) {
      const currentVersion =
        this.#getCurrentCachedVersionForProject(projectName);
      const bumpType = await deriveSpecifierFromConventionalCommits(
        {
          ...this.#nxReleaseConfig,
          git: this.#nxReleaseConfig.git ?? {}
        },
        this.#projectGraph,
        projectLogger,
        releaseGroup,
        projectGraphNode!,
        !!semver.prerelease(currentVersion ?? ""),
        this.#releaseGraph.cachedLatestMatchingGitTag.get(projectName),
        this.#releaseGraph,
        cachedFinalConfigForProject.fallbackCurrentVersionResolver,
        this.versionOptions.preid || this.workspaceConfig.preid || ""
      );
      return {
        newVersionInput: bumpType,
        newVersionInputReason: "CONVENTIONAL_COMMITS",
        newVersionInputReasonData: {}
      };
    }

    // Resolve the semver relative bump via version-plans
    if (releaseGroup.versionPlans) {
      const currentVersion =
        this.#getCurrentCachedVersionForProject(projectName);
      const { bumpType, versionPlanPath } =
        await deriveSpecifierFromVersionPlan(
          projectLogger,
          releaseGroup,
          projectGraphNode!,
          currentVersion!
        );
      if (bumpType !== "none") {
        this.#processedVersionPlanFiles.add(versionPlanPath);
      }
      return {
        newVersionInput: bumpType,
        newVersionInputReason: "VERSION_PLANS",
        newVersionInputReasonData: {
          versionPlanPath
        }
      };
    }

    // Only add the release group name to the log if it is one set by the user, otherwise it is useless noise
    // const maybeLogReleaseGroup = (log: string): string => {
    //   if (releaseGroup.name === IMPLICIT_DEFAULT_RELEASE_GROUP) {
    //     return log;
    //   }
    //   return `${log} within release group "${releaseGroup.name}"`;
    // };
    const versionActions = this.#getVersionActionsForProject(projectName);
    if (versionActions instanceof NOOP_VERSION_ACTIONS) {
      return {
        newVersionInput: "none",
        newVersionInputReason: "NOOP_VERSION_ACTIONS",
        newVersionInputReasonData: {}
      };
    }

    // if (cachedFinalConfigForProject.specifierSource === "prompt") {
    //   let specifier: SemverBumpType | string;
    //   if (releaseGroup.projectsRelationship === "independent") {
    //     specifier = await resolveSemverSpecifierFromPrompt(
    //       `${maybeLogReleaseGroup(
    //         `What kind of change is this for project "${projectName}"`
    //       )}?`,
    //       `${maybeLogReleaseGroup(
    //         `What is the exact version for project "${projectName}"`
    //       )}?`
    //     );
    //   } else {
    //     specifier = await resolveSemverSpecifierFromPrompt(
    //       `${maybeLogReleaseGroup(
    //         `What kind of change is this for the ${releaseGroup.projects.length} matched projects(s)`
    //       )}?`,
    //       `${maybeLogReleaseGroup(
    //         `What is the exact version for the ${releaseGroup.projects.length} matched project(s)`
    //       )}?`
    //     );
    //   }
    //   return {
    //     newVersionInput: specifier,
    //     newVersionInputReason: "PROMPTED_USER_SPECIFIER",
    //     newVersionInputReasonData: {}
    //   };
    // }

    throw new Error(
      `Unhandled version bump config, please report this as a bug on https://github.com/nrwl/nx/issues`
    );
  }

  #getProjectLoggerForProject(projectName: string): ProjectLogger {
    const projectLogger = this.#releaseGraph.projectLoggers.get(projectName);
    if (!projectLogger) {
      throw new Error(
        `No project logger found for project ${projectName}, please report this as a bug on https://github.com/nrwl/nx/issues`
      );
    }
    return projectLogger;
  }
}
