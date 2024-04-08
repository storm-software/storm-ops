import type { StormConfig } from "@storm-software/config";
import {
  // writeDebug,
  writeError,
  writeFatal,
  writeInfo,
  writeSuccess,
  writeWarning
} from "@storm-software/config-tools";
import {
  // type NxReleaseConfig,
  createNxReleaseConfig
} from "./release-config";
// import {
//   type ReleaseGroupWithName,
//   filterReleaseGroups
// } from "nx/src/command-line/release/config/filter-release-groups.js";
import {
  releaseChangelog,
  releasePublish
} from "nx/src/command-line/release/index.js";
// import { gitTag } from "nx/src/command-line/release/utils/git.js";
// import {
//   createGitTagValues,
//   handleDuplicateGitTags
// } from "nx/src/command-line/release/utils/shared.js";
import { readNxJson } from "nx/src/config/nx-json.js";
import { createProjectGraphAsync } from "nx/src/project-graph/project-graph.js";
// import { resolveChangelogVersions } from "nx/src/command-line/release/changelog.js";
import { releaseVersion } from "./nx-version";
// import { createCommitMessageValues } from "nx/src/command-line/release/utils/shared";
// import type { ChangelogOptions } from "nx/src/command-line/release/command-object.js";
// import type { VersionData } from "nx/src/command-line/release/version.js";
import type {
  ReleaseVersion
  // commitChanges,
  // createCommitMessageValues,
  // createGitTagValues,
  // handleDuplicateGitTags
} from "nx/src/command-line/release/utils/shared.js";
import { createProjectFileMapUsingProjectGraph } from "nx/src/project-graph/file-map-utils.js";
// import {
//   type GitCommit,
//   getFirstGitCommit,
//   getGitDiff,
//   getLatestGitTagForPattern,
//   parseCommits,
//   gitPush,
//   getCommitHash,
//   gitAdd,
//   gitTag
// } from "nx/src/command-line/release/utils/git.js";
// import {
//   type GithubRequestConfig,
//   createOrUpdateGithubRelease,
//   getGitHubRepoSlug,
//   resolveGithubToken,
//   getGithubReleaseByTag
// } from "nx/src/command-line/release/utils/github.js";
// import { FsTree, type Tree } from "nx/src/generators/tree.js";
// import { interpolate } from "nx/src/tasks-runner/utils.js";
// import type { ProjectGraph, ProjectGraphProjectNode } from "nx/src/config/project-graph.js";
// import { changelogRenderer } from "@storm-software/changelog";
// import { parseChangelogMarkdown } from "nx/src/command-line/release/utils/markdown.js";
// import { printAndFlushChanges } from "nx/src/command-line/release/utils/print-changes.js";

export interface NxReleaseChangelogResult {
  workspaceChangelog?: {
    releaseVersion: ReleaseVersion;
    contents: string;
  };
  projectChangelogs?: {
    [projectName: string]: {
      releaseVersion: ReleaseVersion;
      contents: string;
    };
  };
}

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
      : process.env.STORM_BOT
        ? process.env.STORM_BOT
        : process.env.STORM_OWNER;
    const committerName = process.env.STORM_BOT
      ? process.env.STORM_BOT
      : process.env.STORM_OWNER;

    process.env.GIT_AUTHOR_NAME = authorName;
    process.env.GIT_AUTHOR_EMAIL = `${authorName}@users.noreply.github.com`;
    process.env.GIT_COMMITTER_NAME = committerName;
    process.env.GIT_COMMITTER_EMAIL = `${committerName}@users.noreply.github.com`;
    process.env.NPM_CONFIG_PROVENANCE = "true";

    process.env.NPM_AUTH_TOKEN = process.env.NPM_TOKEN;
    process.env.NODE_AUTH_TOKEN = process.env.NPM_TOKEN;

    writeInfo(config, "Creating workspace Project Graph data...");

    const projectGraph = await createProjectGraphAsync({ exitOnError: true });
    const nxJson = readNxJson();

    writeInfo(
      config,
      "Reading in the workspaces release configuration from the nx.json file..."
    );
    const { error: configError, nxReleaseConfig } = await createNxReleaseConfig(
      projectGraph,
      await createProjectFileMapUsingProjectGraph(projectGraph),
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

    //const shouldCommit = nxJson.release?.git?.commit ?? true;
    // const shouldStage = (shouldCommit || nxJson.release?.git?.stageChanges) ?? true;
    //const shouldTag = nxJson.release?.git?.tag ?? true;

    const { workspaceVersion, projectsVersionData } = await releaseVersion(
      config,
      {
        dryRun: false,
        verbose: true,
        preid: config.preid,
        stageChanges: true,
        gitCommit: false,
        gitTag: false
      }
    );

    await releaseChangelog({
      version:
        nxReleaseConfig?.projectsRelationship !== "fixed"
          ? undefined
          : workspaceVersion,
      versionData: projectsVersionData,
      dryRun: false,
      verbose: true,
      to: options.head ?? process.env.NX_HEAD,
      from: options.base ?? process.env.NX_BASE,
      gitCommit: true,
      gitCommitMessage: "chore(release): Publish monorepo release updates"
    });

    // const {
    //   error: filterError,
    //   releaseGroups,
    //   releaseGroupToFilteredProjects
    // } = filterReleaseGroups(projectGraph, nxReleaseConfig);
    // if (filterError) {
    //   writeError(config, "An error occurred filtering the release groups");
    //   throw new Error(`${filterError.title}: \n${filterError.bodyLines.join("\n")}`);
    // }

    // const versionData = resolveChangelogVersions(
    //   projectsVersionData,
    //   releaseGroups,
    //   releaseGroupToFilteredProjects
    // );

    // const changelogGenerationEnabled =
    //   !!nxReleaseConfig.changelog.workspaceChangelog ||
    //   Object.values(nxReleaseConfig.groups).some((g) => g.changelog);
    // if (!changelogGenerationEnabled) {
    //   writeWarning(config, "Release changelog generation is not enabled...");
    // } else {
    //   writeInfo(config, "Generating the release changelog files...");

    //   const commitMessageValues: string[] = createCommitMessageValues(
    //     releaseGroups,
    //     releaseGroupToFilteredProjects,
    //     versionData,
    //     "chore({project}): Publish updates to monorepo [skip ci]"
    //   );

    //   const gitTagValues: string[] = createGitTagValues(
    //     releaseGroups,
    //     releaseGroupToFilteredProjects,
    //     versionData
    //   );
    //   handleDuplicateGitTags(gitTagValues);

    //   const tree = new FsTree(config.workspaceRoot, true);
    //   const postGitTasks: ((latestCommit: string) => Promise<void>)[] = [];

    //   for (const releaseGroup of releaseGroups) {
    //     // The entire feature is disabled at the release group level, exit early
    //     if (releaseGroup.changelog === false) {
    //       continue;
    //     }

    //     const projects = releaseGroup.projects;
    //     const projectNodes = projects.map((name) => projectGraph.nodes[name]);

    //     for (const project of projectNodes) {
    //       let fromRef =
    //         (options.base ?? process.env.NX_BASE) ||
    //         (
    //           await getLatestGitTagForPattern(releaseGroup.releaseTagPattern, {
    //             projectName: project.name
    //           })
    //         )?.tag;

    //       let commits: GitCommit[] | null = null;

    //       if (!fromRef) {
    //         const firstCommit = await getFirstGitCommit();
    //         const allCommits = await getCommits(firstCommit, options.head ?? process.env.NX_HEAD);
    //         const commitsForProject = allCommits.filter((c) =>
    //           c.affectedFiles.find((f) => f.startsWith(project.data.root))
    //         );

    //         fromRef = commitsForProject[0]?.shortHash;

    //         writeDebug(
    //           config,
    //           `Determined --from ref for ${project.name} from the first commit in which it exists: ${fromRef}`
    //         );

    //         commits = commitsForProject;
    //       }

    //       if (!fromRef && !commits) {
    //         throw new Error(
    //           `Unable to determine the previous git tag. If this is the first release of your workspace, use the --first-release option or set the "release.changelog.automaticFromRef" config property in nx.json to generate a changelog from the first commit. Otherwise, be sure to configure the "release.releaseTagPattern" property in nx.json to match the structure of your repository's git tags.`
    //         );
    //       }

    //       if (!commits) {
    //         commits = await getCommits(fromRef, options.head ?? process.env.NX_HEAD);
    //       }

    //       const githubRepoSlug = getGitHubRepoSlug("origin");

    //       const projectChangelogs = await generateChangelogForProjects(
    //         tree,
    //         projectGraph,
    //         githubRepoSlug,
    //         commits,
    //         versionData,
    //         releaseGroup,
    //         [project]
    //       );

    //       let hasPushed = false;
    //       for (const [_, projectChangelog] of Object.entries(projectChangelogs)) {
    //         postGitTasks.push(async (latestCommit) => {
    //           if (!hasPushed) {
    //             writeDebug(config, "Pushing to git remote");

    //             // Before we can create/update the release we need to ensure the commit exists on the remote
    //             await gitPush("origin");
    //             hasPushed = true;
    //           }

    //           writeDebug(config, "Creating GitHub Release");

    //           const token = await resolveGithubToken();
    //           const githubRequestConfig: GithubRequestConfig = {
    //             repo: githubRepoSlug,
    //             token
    //           };

    //           const existingGithubReleaseForVersion = await getGithubReleaseByTag(
    //             githubRequestConfig,
    //             projectChangelog.releaseVersion.gitTag
    //           );

    //           await createOrUpdateGithubRelease(
    //             githubRequestConfig,
    //             {
    //               version: projectChangelog.releaseVersion.rawVersion,
    //               body: projectChangelog.contents,
    //               prerelease: projectChangelog.releaseVersion.isPrerelease,
    //               commit: latestCommit
    //             },
    //             existingGithubReleaseForVersion
    //           );
    //         });
    //       }
    //     }

    //     await applyChangesAndExit(
    //       {},
    //       nxReleaseConfig,
    //       tree,
    //       options.head ?? process.env.NX_HEAD,
    //       postGitTasks,
    //       commitMessageValues,
    //       gitTagValues
    //     );
    //   }

    // const commitMessageValues: string[] = createCommitMessageValues(
    //   releaseGroups,
    //   releaseGroupToFilteredProjects,
    //   projectsVersionData,
    //   "chore({projectName}): Release package v{version} [skip ci]"
    // );

    // await releaseChangelog({
    //   version: nxReleaseConfig.projectsRelationship !== "fixed" ? undefined : workspaceVersion,
    //   versionData: projectsVersionData,
    //   dryRun: false,
    //   verbose: true,
    //   to: options.head ?? process.env.NX_HEAD,
    //   from: options.base ?? process.env.NX_BASE,
    //   gitRemote: "origin",
    //   gitCommit: true,
    //   gitCommitMessage: "chore(release): Publish updates to monorepo [skip ci]",
    //   gitTag: true
    // });
    // }

    // const commitMessageValues: string[] = createCommitMessageValues(
    //   releaseGroups,
    //   releaseGroupToFilteredProjects,
    //   projectsVersionData,
    //   "chore({projectName}): Release package v{version} [skip ci]"
    // );

    // if (shouldTag) {
    writeInfo(config, "Tagging commit with git");

    // Resolve any git tags as early as possible so that we can hard error in case of any duplicates before reaching the actual git command
    // const gitTagValues: string[] = createGitTagValues(
    //   releaseGroups,
    //   releaseGroupToFilteredProjects,
    //   projectsVersionData
    // );
    // handleDuplicateGitTags(gitTagValues);

    // for (const tag of gitTagValues) {
    //   await gitTag({
    //     tag,
    //     message: nxReleaseConfig.git.tagMessage,
    //     additionalArgs: nxReleaseConfig.git.tagArgs,
    //     dryRun: false,
    //     verbose: true
    //   });
    // }

    /*const {
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
    }*/

    if (
      Object.values(projectsVersionData).some(
        version => version.newVersion !== null
      )
    ) {
      writeInfo(config, "Publishing the release...");
      await releasePublish(
        {
          dryRun: !!options.dryRun,
          verbose: true
        },
        false
      );
    } else {
      writeWarning(config, "Skipped publishing packages.");
    }

    writeSuccess(config, "Completed the release process!");
  } catch (error) {
    writeFatal(
      config,
      "An exception was thrown while running the release version command."
    );
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

// function resolveChangelogVersions(
//   versionData: VersionData,
//   releaseGroups: ReleaseGroupWithName[],
//   releaseGroupToFilteredProjects: Map<ReleaseGroupWithName, Set<string>>
// ) {
//   if (!versionData) {
//     throw new Error("You must provide a version string and/or a versionData object.");
//   }

//   return releaseGroups.reduce((versionData, releaseGroup) => {
//     const releaseGroupProjectNames = Array.from(releaseGroupToFilteredProjects.get(releaseGroup));
//     for (const projectName of releaseGroupProjectNames) {
//       /**
//        * In the case where a versionData object was provided, we need to make sure all projects are present,
//        * otherwise it suggests a filtering mismatch between the version and changelog command invocations.
//        */
//       if (!versionData[projectName]) {
//         throw new Error(
//           `The provided versionData object does not contain a version for project "${projectName}". This suggests a filtering mismatch between the version and changelog command invocations.`
//         );
//       }
//     }
//     return versionData;
//   }, versionData || {});
// }

// async function applyChangesAndExit(
//   args: ChangelogOptions,
//   nxReleaseConfig: NxReleaseConfig,
//   tree: Tree,
//   toSHA: string,
//   postGitTasks: ((latestCommit: string) => Promise<void>)[],
//   commitMessageValues: string[],
//   gitTagValues: string[]
// ) {
//   let latestCommit = toSHA;

//   const changes = tree.listChanges();

//   if (!changes.length) {
//     console.warn(
//       "No changes were detected for any changelog files, so no changelog entries will be generated."
//     );
//     return;
//   }

//   // Generate a new commit for the changes, if configured to do so
//   if (args.gitCommit ?? nxReleaseConfig.changelog.git.commit) {
//     await commitChanges(
//       changes.map((f) => f.path),
//       false,
//       true,
//       commitMessageValues,
//       args.gitCommitArgs || nxReleaseConfig.changelog.git.commitArgs
//     );
//     // Resolve the commit we just made
//     latestCommit = await getCommitHash("HEAD");
//   } else if ((args.stageChanges ?? nxReleaseConfig.changelog.git.stageChanges) && changes.length) {
//     console.log("Staging changed files with git");
//     await gitAdd({
//       changedFiles: changes.map((f) => f.path),
//       dryRun: false,
//       verbose: true
//     });
//   }

//   // Generate a one or more git tags for the changes, if configured to do so
//   if (args.gitTag ?? nxReleaseConfig.changelog.git.tag) {
//     console.log("Tagging commit with git");
//     for (const tag of gitTagValues) {
//       await gitTag({
//         tag,
//         message: args.gitTagMessage || nxReleaseConfig.changelog.git.tagMessage,
//         additionalArgs: args.gitTagArgs || nxReleaseConfig.changelog.git.tagArgs,
//         dryRun: false,
//         verbose: true
//       });
//     }
//   }

//   // Run any post-git tasks in series
//   for (const postGitTask of postGitTasks) {
//     await postGitTask(latestCommit);
//   }

//   return;
// }

// async function getCommits(fromSHA: string, toSHA: string) {
//   const rawCommits = await getGitDiff(fromSHA, toSHA);
//   // Parse as conventional commits
//   return parseCommits(rawCommits).filter((c) => {
//     const type = c.type;
//     // Always ignore non user-facing commits for now
//     // TODO: allow this filter to be configurable via config in a future release
//     if (type === "feat" || type === "fix" || type === "perf") {
//       return true;
//     }
//     return false;
//   });
// }

// async function generateChangelogForProjects(
//   tree: Tree,
//   projectGraph: ProjectGraph,
//   githubRepoSlug: `${string}/${string}`,
//   commits: GitCommit[],
//   projectsVersionData: VersionData,
//   releaseGroup: ReleaseGroupWithName,
//   projects: ProjectGraphProjectNode[]
// ): Promise<NxReleaseChangelogResult["projectChangelogs"] | null> {
//   if (releaseGroup.changelog === false) {
//     return null;
//   }

//   const projectChangelogs: NxReleaseChangelogResult["projectChangelogs"] = {};

//   for (const project of projects) {
//     const interpolatedTreePath = interpolate("", {
//       projectName: project.name,
//       projectRoot: project.data.root,
//       workspaceRoot: "" // within the tree, workspaceRoot is the root
//     });

//     /**
//      * newVersion will be null in the case that no changes were detected (e.g. in conventional commits mode),
//      * no changelog entry is relevant in that case.
//      */
//     if (projectsVersionData[project.name].newVersion === null) {
//       continue;
//     }

//     const releaseVersion = new ReleaseVersion({
//       version: projectsVersionData[project.name].newVersion,
//       releaseTagPattern: releaseGroup.releaseTagPattern,
//       projectName: project.name
//     });

//     if (interpolatedTreePath) {
//       console.log({
//         title: `Generating an entry in ${interpolatedTreePath} for ${releaseVersion.gitTag}`
//       });
//     }

//     const contents = await changelogRenderer({
//       projectGraph,
//       commits,
//       releaseVersion: releaseVersion.rawVersion,
//       project: project.name,
//       repoSlug: githubRepoSlug,
//       entryWhenNoChanges: false,
//       changelogRenderOptions: {}
//     });

//     if (interpolatedTreePath) {
//       let changelogContents = tree.exists(interpolatedTreePath)
//         ? tree.read(interpolatedTreePath).toString()
//         : "";
//       if (changelogContents) {
//         // NOTE: right now existing releases are always expected to be in markdown format, but in the future we could potentially support others via a custom parser option
//         const changelogReleases = parseChangelogMarkdown(changelogContents).releases;

//         const existingVersionToUpdate = changelogReleases.find(
//           (r) => r.version === releaseVersion.rawVersion
//         );
//         if (existingVersionToUpdate) {
//           changelogContents = changelogContents.replace(
//             `## ${releaseVersion.rawVersion}\n\n\n${existingVersionToUpdate.body}`,
//             contents
//           );
//         } else {
//           // No existing version, simply prepend the new release to the top of the file
//           changelogContents = `${contents}\n\n${changelogContents}`;
//         }
//       } else {
//         // No existing changelog contents, simply create a new one using the generated contents
//         changelogContents = contents;
//       }

//       tree.write(interpolatedTreePath, changelogContents);

//       printAndFlushChanges(
//         tree,
//         true,
//         3,
//         false,
//         "There is no difference in changelog files after the changes were applied.",
//         // Only print the change for the current changelog file at this point
//         (f) => f.path === interpolatedTreePath
//       );
//     }

//     projectChangelogs[project.name] = {
//       releaseVersion,
//       contents
//     };
//   }

//   return projectChangelogs;
// }
