import type { StormConfig } from "@storm-software/config";
import {
  writeError,
  writeFatal,
  writeInfo,
  writeSuccess,
  writeWarning
} from "@storm-software/config-tools";
import { createNxReleaseConfig } from "nx/src/command-line/release/config/config.js";
import { filterReleaseGroups } from "nx/src/command-line/release/config/filter-release-groups.js";
import { releaseChangelog, releasePublish } from "nx/src/command-line/release/index.js";
import { gitCommit, gitTag } from "nx/src/command-line/release/utils/git.js";
import {
  createCommitMessageValues,
  createGitTagValues,
  handleDuplicateGitTags
} from "nx/src/command-line/release/utils/shared.js";
import { readNxJson } from "nx/src/config/nx-json.js";
import { createProjectGraphAsync } from "nx/src/project-graph/project-graph.js";
import { releaseVersion } from "./nx-version";

export const runRelease = async (
  config: StormConfig,
  options: {
    project?: string;
    firstRelease?: boolean;
    head?: string;
    base?: string;
    dryRun?: boolean;
  }
) => {
  try {
    const authorName = process.env.GITHUB_ACTOR
      ? process.env.GITHUB_ACTOR
      : process.env.STORM_WORKER
        ? process.env.STORM_WORKER
        : process.env.STORM_OWNER;
    const committerName = process.env.STORM_WORKER
      ? process.env.STORM_WORKER
      : process.env.STORM_OWNER;

    process.env.GIT_AUTHOR_NAME = authorName;
    process.env.GIT_AUTHOR_EMAIL = `${authorName}@users.noreply.github.com`;
    process.env.GIT_COMMITTER_NAME = committerName;
    process.env.GIT_COMMITTER_EMAIL = `${committerName}@users.noreply.github.com`;
    process.env.NPM_CONFIG_PROVENANCE = "true";

    writeInfo(config, "Creating workspace Project Graph data...");

    const projectGraph = await createProjectGraphAsync({ exitOnError: true });
    const nxJson = readNxJson();

    writeInfo(config, "Reading in the workspaces release configuration from the nx.json file...");
    const { error: configError, nxReleaseConfig } = await createNxReleaseConfig(
      projectGraph,
      nxJson.release
    );
    if (configError) {
      throw new Error(
        `An error occured determining the release configuration: (${
          configError.code
        }) ${JSON.stringify(configError.data)}`
      );
    }

    writeInfo(config, "Determining the current release versions...");

    const shouldCommit = nxJson.release?.git?.commit ?? true;
    const shouldStage = (shouldCommit || nxJson.release?.git?.stageChanges) ?? true;
    const shouldTag = nxJson.release?.git?.tag ?? true;

    const projects = !nxJson.release.projects
      ? undefined
      : Array.isArray(nxJson.release.projects)
        ? nxJson.release.projects
        : [nxJson.release.projects];

    const { workspaceVersion, projectsVersionData } = await releaseVersion(config, {
      projects,
      dryRun: !!options.dryRun,
      verbose: true,
      preid: config.preid,
      stageChanges: shouldStage,
      gitCommit: false,
      gitTag: false
    });

    writeInfo(config, "Generating the release changelog files...");

    await releaseChangelog({
      version: nxReleaseConfig.projectsRelationship !== "fixed" ? undefined : workspaceVersion,
      versionData: projectsVersionData,
      dryRun: !!options.dryRun,
      verbose: true,
      to: options.head ?? process.env.NX_HEAD,
      from: options.base ?? process.env.NX_BASE,
      stageChanges: shouldStage,
      gitCommit: false,
      gitTag: false
    });

    const {
      error: filterError,
      releaseGroups,
      releaseGroupToFilteredProjects
    } = filterReleaseGroups(projectGraph, nxReleaseConfig);
    if (filterError) {
      writeError(config, "An error occurred filtering the release groups");
      throw new Error(`${filterError.title}: \n${filterError.bodyLines.join("\n")}`);
    }

    if (shouldCommit) {
      writeInfo(config, "Committing changes with git");

      const commitMessageValues: string[] = createCommitMessageValues(
        releaseGroups,
        releaseGroupToFilteredProjects,
        projectsVersionData,
        "chore({projectName}): Release package v{version} [skip ci]"
      );

      await gitCommit({
        messages: commitMessageValues,
        additionalArgs: nxReleaseConfig.git.commitArgs,
        dryRun: false,
        verbose: true
      });
    }

    if (shouldTag) {
      writeInfo(config, "Tagging commit with git");

      // Resolve any git tags as early as possible so that we can hard error in case of any duplicates before reaching the actual git command
      const gitTagValues: string[] = createGitTagValues(
        releaseGroups,
        releaseGroupToFilteredProjects,
        projectsVersionData
      );
      handleDuplicateGitTags(gitTagValues);

      for (const tag of gitTagValues) {
        await gitTag({
          tag,
          message: nxReleaseConfig.git.tagMessage,
          additionalArgs: nxReleaseConfig.git.tagArgs,
          dryRun: false,
          verbose: true
        });
      }
    }

    let hasNewVersion = false;

    // null means that all projects are versioned together but there were no changes
    if (workspaceVersion !== null) {
      hasNewVersion = Object.values(projectsVersionData).some(
        (version) => version.newVersion !== null
      );
    }

    if (hasNewVersion) {
      writeInfo(config, "Publishing the release...");
      await releasePublish({
        dryRun: !!options.dryRun,
        verbose: true
      });
    } else {
      writeWarning(config, "Skipped publishing packages.");
    }

    writeSuccess(config, "Completed the release process!");
  } catch (error) {
    writeFatal(config, "An exception was thrown while running the release version command.");
    error.message &&
      writeError(
        config,
        `${error.name ? `${error.name}: ` : ""}${error.message}${
          error.stack ? `\n${error.stack}` : ""
        }`
      );

    throw error;
  }
};
