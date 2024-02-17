import type { StormConfig } from "@storm-software/config";
import { writeDebug, writeError, writeInfo } from "@storm-software/config-tools";
import type { VersionOptions } from "nx/src/command-line/release/command-object.js";
import {
  createNxReleaseConfig,
  handleNxReleaseConfigError
} from "nx/src/command-line/release/config/config.js";
import {
  type ReleaseGroupWithName,
  filterReleaseGroups
} from "nx/src/command-line/release/config/filter-release-groups.js";
import { gitAdd, gitTag } from "nx/src/command-line/release/utils/git.js";
import {
  type VersionData,
  createCommitMessageValues,
  createGitTagValues,
  handleDuplicateGitTags,
  commitChanges
} from "nx/src/command-line/release/utils/shared.js";
import { type NxJsonConfiguration, readNxJson } from "nx/src/config/nx-json.js";
import {
  createProjectGraphAsync,
  readProjectsConfigurationFromProjectGraph
} from "nx/src/project-graph/project-graph.js";
import { resolveNxJsonConfigErrorMessage } from "nx/src/command-line/release/utils/resolve-nx-json-error-message.js";
import { FsTree, flushChanges, type Tree } from "nx/src/generators/tree.js";
import { batchProjectsByGeneratorConfig } from "nx/src/command-line/release/utils/batch-projects-by-generator-config.js";
import { getGeneratorInformation } from "nx/src/command-line/generate/generator-utils.js";
import type {
  NxReleaseVersionResult,
  ReleaseVersionGeneratorResult,
  ReleaseVersionGeneratorSchema
} from "nx/src/command-line/release/version.js";
import { parseGeneratorString } from "nx/src/command-line/generate/generate.js";
import type { ProjectGraph } from "nx/src/config/project-graph.js";
import { combineOptionsForGenerator } from "nx/src/utils/params.js";
import { relative } from "node:path";
import { readFileSync } from "node:fs";
import { joinPathFragments, workspaceRoot } from "nx/src/devkit-exports.js";
import { printDiff } from "nx/src/command-line/release/utils/print-changes.js";

interface GeneratorData {
  collectionName: string;
  generatorName: string;
  configGeneratorOptions: NxJsonConfiguration["release"]["groups"][number]["version"]["generatorOptions"];
  normalizedGeneratorName: string;
  schema: any;
  implementationFactory: () => Generator<unknown>;
}

export async function releaseVersion(
  config: StormConfig,
  args: VersionOptions
): Promise<NxReleaseVersionResult> {
  writeInfo(config, "Running release version command");

  const projectGraph = await createProjectGraphAsync({ exitOnError: true });
  const { projects } = readProjectsConfigurationFromProjectGraph(projectGraph);
  const nxJson = readNxJson();

  if (args.verbose) {
    process.env.NX_VERBOSE_LOGGING = "true";
  }

  // Apply default configuration to any optional user configuration
  const { error: configError, nxReleaseConfig } = await createNxReleaseConfig(
    projectGraph,
    nxJson.release
  );
  if (configError) {
    return await handleNxReleaseConfigError(configError);
  }

  // The nx release top level command will always override these three git args. This is how we can tell
  // if the top level release command was used or if the user is using the changelog subcommand.
  // If the user explicitly overrides these args, then it doesn't matter if the top level config is set,
  // as all of the git options would be overridden anyway.
  if (
    (args.gitCommit === undefined ||
      args.gitTag === undefined ||
      args.stageChanges === undefined) &&
    nxJson.release?.git
  ) {
    await resolveNxJsonConfigErrorMessage(["release", "git"]);

    throw new Error(
      `The "release.git" property in nx.json may not be used with the "nx release version" subcommand or programmatic API. Instead, configure git options for subcommands directly with "release.version.git" and "release.changelog.git".`
    );
  }

  writeInfo(config, "Filtering projects and release groups");

  const {
    error: filterError,
    releaseGroups,
    releaseGroupToFilteredProjects
  } = filterReleaseGroups(projectGraph, nxReleaseConfig, args.projects, args.groups);
  if (filterError) {
    writeError(config, filterError.title);
    throw new Error(filterError.title);
  }

  const tree = new FsTree(config.workspaceRoot, args.verbose);

  const versionData: VersionData = {};
  const commitMessage: string | undefined =
    args.gitCommitMessage || nxReleaseConfig.version.git.commitMessage;
  const additionalChangedFiles = new Set<string>();
  const generatorCallbacks: (() => Promise<void>)[] = [];

  if (args.projects?.length) {
    writeInfo(
      config,
      "Run versioning for all remaining release groups and filtered projects within them"
    );

    for (const releaseGroup of releaseGroups) {
      const releaseGroupName = releaseGroup.name;
      writeInfo(
        config,
        `Running versioning for release group "${releaseGroupName}" and filtered projects within it`
      );

      const releaseGroupProjectNames = Array.from(releaseGroupToFilteredProjects.get(releaseGroup));
      const projectBatches = batchProjectsByGeneratorConfig(
        projectGraph,
        releaseGroup,
        // Only batch based on the filtered projects within the release group
        releaseGroupProjectNames
      );

      for (const [generatorConfigString, projectNames] of projectBatches.entries()) {
        writeInfo(
          config,
          `Running versioning for batch "${JSON.stringify(
            projectNames
          )}" for release-group "${releaseGroupName}"`
        );

        const [generatorName, generatorOptions] = JSON.parse(generatorConfigString);
        // Resolve the generator for the batch and run versioning on the projects within the batch
        const generatorData = resolveGeneratorData({
          ...extractGeneratorCollectionAndName(
            `batch "${JSON.stringify(projectNames)}" for release-group "${releaseGroupName}"`,
            generatorName
          ),
          configGeneratorOptions: generatorOptions,
          // all project data from the project graph (not to be confused with projectNamesToRunVersionOn)
          projects
        });
        const generatorCallback = await runVersionOnProjects(
          config,
          projectGraph,
          nxJson,
          args,
          tree,
          generatorData,
          projectNames,
          releaseGroup,
          versionData
        );
        // Capture the callback so that we can run it after flushing the changes to disk
        generatorCallbacks.push(async () => {
          const changedFiles = await generatorCallback(tree, {
            dryRun: !!args.dryRun,
            verbose: !!args.verbose,
            generatorOptions
          });
          for (const f of changedFiles) {
            additionalChangedFiles.add(f);
          }
        });
      }
    }

    // Resolve any git tags as early as possible so that we can hard error in case of any duplicates before reaching the actual git command
    const gitTagValues: string[] =
      args.gitTag ?? nxReleaseConfig.version.git.tag
        ? createGitTagValues(releaseGroups, releaseGroupToFilteredProjects, versionData)
        : [];
    handleDuplicateGitTags(gitTagValues);

    printAndFlushChanges(config, tree, !!args.dryRun);

    for (const generatorCallback of generatorCallbacks) {
      await generatorCallback();
    }

    const changedFiles = [...tree.listChanges().map((f) => f.path), ...additionalChangedFiles];

    // No further actions are necessary in this scenario (e.g. if conventional commits detected no changes)
    if (!changedFiles.length) {
      return {
        // An overall workspace version cannot be relevant when filtering to independent projects
        workspaceVersion: undefined,
        projectsVersionData: versionData
      };
    }

    if (args.gitCommit ?? nxReleaseConfig.version.git.commit) {
      await commitChanges(
        changedFiles,
        !!args.dryRun,
        !!args.verbose,
        createCommitMessageValues(
          releaseGroups,
          releaseGroupToFilteredProjects,
          versionData,
          commitMessage
        ),
        args.gitCommitArgs || nxReleaseConfig.version.git.commitArgs
      );
    } else if (args.stageChanges ?? nxReleaseConfig.version.git.stageChanges) {
      writeInfo(config, "Staging changed files with git");
      await gitAdd({
        changedFiles,
        dryRun: args.dryRun,
        verbose: args.verbose
      });
    }

    if (args.gitTag ?? nxReleaseConfig.version.git.tag) {
      writeInfo(config, "Tagging commit with git");
      for (const tag of gitTagValues) {
        await gitTag({
          tag,
          message: args.gitTagMessage || nxReleaseConfig.version.git.tagMessage,
          additionalArgs: args.gitTagArgs || nxReleaseConfig.version.git.tagArgs,
          dryRun: args.dryRun,
          verbose: args.verbose
        });
      }
    }

    return {
      // An overall workspace version cannot be relevant when filtering to independent projects
      workspaceVersion: undefined,
      projectsVersionData: versionData
    };
  }

  /**
   * Run versioning for all remaining release groups
   */
  for (const releaseGroup of releaseGroups) {
    const releaseGroupName = releaseGroup.name;
    const projectBatches = batchProjectsByGeneratorConfig(
      projectGraph,
      releaseGroup,
      // Batch based on all projects within the release group
      releaseGroup.projects
    );

    for (const [generatorConfigString, projectNames] of projectBatches.entries()) {
      const [generatorName, generatorOptions] = JSON.parse(generatorConfigString);
      // Resolve the generator for the batch and run versioning on the projects within the batch
      const generatorData = resolveGeneratorData({
        ...extractGeneratorCollectionAndName(
          `batch "${JSON.stringify(projectNames)}" for release-group "${releaseGroupName}"`,
          generatorName
        ),
        configGeneratorOptions: generatorOptions,
        // all project data from the project graph (not to be confused with projectNamesToRunVersionOn)
        projects
      });
      const generatorCallback = await runVersionOnProjects(
        config,
        projectGraph,
        nxJson,
        args,
        tree,
        generatorData,
        projectNames,
        releaseGroup,
        versionData
      );
      // Capture the callback so that we can run it after flushing the changes to disk
      generatorCallbacks.push(async () => {
        const changedFiles = await generatorCallback(tree, {
          dryRun: !!args.dryRun,
          verbose: !!args.verbose,
          generatorOptions
        });
        for (const f of changedFiles) {
          additionalChangedFiles.add(f);
        }
      });
    }
  }

  // Resolve any git tags as early as possible so that we can hard error in case of any duplicates before reaching the actual git command
  const gitTagValues: string[] =
    args.gitTag ?? nxReleaseConfig.version.git.tag
      ? createGitTagValues(releaseGroups, releaseGroupToFilteredProjects, versionData)
      : [];
  handleDuplicateGitTags(gitTagValues);

  printAndFlushChanges(config, tree, !!args.dryRun);

  for (const generatorCallback of generatorCallbacks) {
    await generatorCallback();
  }

  // Only applicable when there is a single release group with a fixed relationship
  let workspaceVersion: string | null | undefined = undefined;
  if (releaseGroups.length === 1) {
    const releaseGroup = releaseGroups[0];
    if (releaseGroup.projectsRelationship === "fixed") {
      const releaseGroupProjectNames = Array.from(releaseGroupToFilteredProjects.get(releaseGroup));
      workspaceVersion = versionData[releaseGroupProjectNames[0]].newVersion; // all projects have the same version so we can just grab the first
    }
  }

  const changedFiles = [...tree.listChanges().map((f) => f.path), ...additionalChangedFiles];

  // No further actions are necessary in this scenario (e.g. if conventional commits detected no changes)
  if (!changedFiles.length) {
    return {
      workspaceVersion,
      projectsVersionData: versionData
    };
  }

  if (args.gitCommit ?? nxReleaseConfig.version.git.commit) {
    await commitChanges(
      changedFiles,
      !!args.dryRun,
      !!args.verbose,
      createCommitMessageValues(
        releaseGroups,
        releaseGroupToFilteredProjects,
        versionData,
        commitMessage
      ),
      args.gitCommitArgs || nxReleaseConfig.version.git.commitArgs
    );
  } else if (args.stageChanges ?? nxReleaseConfig.version.git.stageChanges) {
    writeInfo(config, "Staging changed files with git");
    await gitAdd({
      changedFiles,
      dryRun: args.dryRun,
      verbose: args.verbose
    });
  }

  if (args.gitTag ?? nxReleaseConfig.version.git.tag) {
    writeInfo(config, "Tagging commit with git");
    for (const tag of gitTagValues) {
      await gitTag({
        tag,
        message: args.gitTagMessage || nxReleaseConfig.version.git.tagMessage,
        additionalArgs: args.gitTagArgs || nxReleaseConfig.version.git.tagArgs,
        dryRun: args.dryRun,
        verbose: args.verbose
      });
    }
  }

  return {
    workspaceVersion,
    projectsVersionData: versionData
  };
}

async function runVersionOnProjects(
  config: StormConfig,
  projectGraph: ProjectGraph,
  nxJson: NxJsonConfiguration,
  args: VersionOptions,
  tree: Tree,
  generatorData: GeneratorData,
  projectNames: string[],
  releaseGroup: ReleaseGroupWithName,
  versionData: VersionData
): Promise<ReleaseVersionGeneratorResult["callback"]> {
  const generatorOptions: ReleaseVersionGeneratorSchema = {
    // Always ensure a string to avoid generator schema validation errors
    specifier: args.specifier ?? "",
    preid: args.preid ?? "",
    ...generatorData.configGeneratorOptions,
    // The following are not overridable by user config
    projects: projectNames.map((p) => projectGraph.nodes[p]),
    projectGraph,
    releaseGroup,
    firstRelease: args.firstRelease ?? false
  };

  // Apply generator defaults from schema.json file etc
  const combinedOpts = await combineOptionsForGenerator(
    generatorOptions as any,
    generatorData.collectionName,
    generatorData.normalizedGeneratorName,
    readProjectsConfigurationFromProjectGraph(projectGraph),
    nxJson,
    generatorData.schema,
    false,
    null,
    relative(process.cwd(), config.workspaceRoot),
    args.verbose
  );

  writeDebug(config, `Generator options: ${JSON.stringify(combinedOpts, null, 2)}`);

  const releaseVersionGenerator: any = generatorData.implementationFactory();

  // We expect all version generator implementations to return a ReleaseVersionGeneratorResult object, rather than a GeneratorCallback
  const versionResult = (await releaseVersionGenerator(
    tree,
    combinedOpts
  )) as unknown as ReleaseVersionGeneratorResult;

  if (typeof versionResult === "function") {
    throw new Error(
      `The version generator ${generatorData.collectionName}:${generatorData.normalizedGeneratorName} returned a function instead of an expected ReleaseVersionGeneratorResult`
    );
  }

  // Merge the extra version data into the existing
  appendVersionData(versionData, versionResult.data);

  return versionResult.callback;
}

function printAndFlushChanges(config: StormConfig, tree: Tree, isDryRun: boolean) {
  const changes = tree.listChanges();

  // Print the changes
  for (const f of changes) {
    if (f.type === "CREATE") {
      writeInfo(config, `CREATE ${f.path}${isDryRun ? " [dry-run]" : ""}`);
      printDiff("", f.content?.toString() || "");
    } else if (f.type === "UPDATE") {
      writeInfo(config, `UPDATE ${f.path}${isDryRun ? " [dry-run]" : ""}`);
      const currentContentsOnDisk = readFileSync(joinPathFragments(tree.root, f.path)).toString();
      printDiff(currentContentsOnDisk, f.content?.toString() || "");
    } else if (f.type === "DELETE") {
      throw new Error("Unexpected DELETE change, please report this as an issue");
    }
  }

  if (!isDryRun) {
    flushChanges(workspaceRoot, changes);
  }
}

function extractGeneratorCollectionAndName(description: string, generatorString: string) {
  const parsedGeneratorString = parseGeneratorString(generatorString);
  const collectionName = parsedGeneratorString.collection;
  const generatorName = parsedGeneratorString.generator;

  if (!collectionName || !generatorName) {
    throw new Error(
      `Invalid generator string: ${generatorString} used for ${description}. Must be in the format of [collectionName]:[generatorName]`
    );
  }

  return { collectionName, generatorName };
}

function appendVersionData(
  existingVersionData: VersionData,
  newVersionData: VersionData = {}
): VersionData {
  // Mutate the existing version data
  for (const [key, value] of Object.entries(newVersionData)) {
    if (existingVersionData[key]) {
      throw new Error(
        `Version data key "${key}" already exists in version data. This is likely a bug.`
      );
    }
    existingVersionData[key] = value;
  }
  return existingVersionData;
}

function resolveGeneratorData({
  collectionName,
  generatorName,
  configGeneratorOptions,
  projects
}): GeneratorData {
  try {
    const { normalizedGeneratorName, schema, implementationFactory } = getGeneratorInformation(
      collectionName,
      generatorName,
      workspaceRoot,
      projects
    );

    return {
      collectionName,
      generatorName,
      configGeneratorOptions,
      normalizedGeneratorName,
      schema,
      implementationFactory: implementationFactory as any
    };
  } catch (err) {
    if (err.message.startsWith("Unable to resolve")) {
      // See if it is because the plugin is not installed
      try {
        require.resolve(collectionName);
        // is installed
        throw new Error(
          `Unable to resolve the generator called "${generatorName}" within the "${collectionName}" package`
        );
      } catch {
        /**
         * Special messaging for the most common case (especially as the user is unlikely to explicitly have
         * the @nx/js generator config in their nx.json so we need to be clear about what the problem is)
         */
        if (collectionName === "@nx/js") {
          throw new Error(
            "The @nx/js plugin is required in order to version your JavaScript packages. Please install it and try again."
          );
        }
        throw new Error(
          `Unable to resolve the package ${collectionName} in order to load the generator called ${generatorName}. Is the package installed?`
        );
      }
    }
    // Unexpected error, rethrow
    throw err;
  }
}
