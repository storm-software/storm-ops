import { FileData } from "@nx/devkit";
import { StormWorkspaceConfig } from "@storm-software/config";
import { writeDebug } from "@storm-software/config-tools/logger/console";
import { execCommand } from "nx/src/command-line/release/utils/exec-command.js";
import {
  extractTagAndVersion,
  getGitDiff,
  GetLatestGitTagForPatternOptions,
  gitAdd,
  GitCommit,
  GitTagAndVersion,
  parseCommits
} from "nx/src/command-line/release/utils/git";
import { RepoGitTags } from "nx/src/command-line/release/utils/repository-git-tags.js";
import { isPrerelease } from "nx/src/command-line/release/utils/shared";
import { interpolate } from "nx/src/tasks-runner/utils.js";
import { coerce, gt, gte, prerelease } from "semver";

export async function getCommits(
  fromSHA: string,
  toSHA: string
): Promise<GitCommit[]> {
  const rawCommits = await getGitDiff(fromSHA, toSHA);
  // Parse as conventional commits
  return parseCommits(rawCommits);
}

export async function filterProjectCommits({
  fromSHA,
  toSHA,
  projectPath
}: {
  fromSHA: string;
  toSHA: string;
  projectPath: string;
}) {
  const allCommits = await getCommits(fromSHA, toSHA);
  return allCommits.filter(c =>
    c.affectedFiles.find(f => f.startsWith(projectPath))
  );
}

export function commitChangesNonProjectFiles(
  commit: GitCommit,
  nonProjectFiles: FileData[]
): boolean {
  return nonProjectFiles.some(fileData =>
    commit.affectedFiles.includes(fileData.file)
  );
}

export function getProjectsAffectedByCommit(
  commit: GitCommit,
  fileToProjectMap: Record<string, string>
): string[] {
  const affectedProjects = new Set<string>();
  for (const file of commit.affectedFiles) {
    affectedProjects.add(fileToProjectMap[file]!);
  }
  return Array.from(affectedProjects);
}

export function extractPreid(version: string): string | undefined {
  if (!isPrerelease(version)) {
    return undefined;
  }

  const preid = prerelease(version)?.[0];
  if (typeof preid === "string") {
    if (preid.trim() === "") {
      return undefined;
    }

    return preid;
  }
  if (typeof preid === "number") {
    return preid.toString();
  }
  return undefined;
}

// export function createGitTagValues(
//   releaseGroups: ReleaseGroupWithName[],
//   releaseGroupToFilteredProjects: Map<ReleaseGroupWithName, Set<string>>,
//   versionData: VersionData
// ): string[] {
//   const tags = [] as string[];

//   for (const releaseGroup of releaseGroups) {
//     const releaseGroupProjectNames = Array.from(
//       releaseGroupToFilteredProjects.get(releaseGroup) ?? []
//     );
//     // For independent groups we want one tag per project, not one for the overall group
//     if (releaseGroup.projectsRelationship === "independent") {
//       for (const project of releaseGroupProjectNames) {
//         const projectVersionData = versionData[project];
//         if (projectVersionData?.newVersion) {
//           tags.push(
//             interpolate(releaseGroup.releaseTag.pattern, {
//               version: projectVersionData.newVersion,
//               projectName: project
//             })
//           );
//         }
//       }
//       continue;
//     }

//     if (releaseGroupProjectNames.length > 0 && releaseGroupProjectNames[0]) {
//       // For fixed groups we want one tag for the overall group
//       const projectVersionData = versionData[releaseGroupProjectNames[0]]; // all at the same version, so we can just pick the first one
//       if (projectVersionData?.newVersion) {
//         tags.push(
//           interpolate(releaseGroup.releaseTag.pattern, {
//             version: projectVersionData.newVersion,
//             releaseGroupName: releaseGroup.name
//           })
//         );
//       }
//     }
//   }

//   return tags;
// }

/**
 * Create a git tag for the current commit.
 *
 * @param params - Parameters for the gitTag function
 * @returns A promise that resolves to the output of the git tag command
 */
export async function gitTag({
  tag,
  message,
  additionalArgs,
  dryRun,
  verbose,
  logFn
}: {
  tag: string;
  message?: string;
  additionalArgs?: string | string[];
  dryRun?: boolean;
  verbose?: boolean;
  logFn?: (message: string) => void;
}): Promise<string> {
  logFn = logFn || console.log;

  const commandArgs = [
    "tag",
    // Create an annotated tag (recommended for releases here: https://git-scm.com/docs/git-tag)
    "--annotate",
    "--sign",
    tag,
    "--message",
    message || tag
  ];
  if (additionalArgs) {
    if (Array.isArray(additionalArgs)) {
      commandArgs.push(...additionalArgs);
    } else {
      commandArgs.push(...additionalArgs.split(" "));
    }
  }

  if (verbose) {
    logFn(
      dryRun
        ? `Would tag the current commit in git with the following command, but --dry-run was set:`
        : `Tagging the current commit in git with the following command:`
    );
    logFn(`git ${commandArgs.join(" ")}`);
  }

  if (dryRun) {
    return "";
  }

  try {
    return await execCommand("git", commandArgs);
  } catch (err) {
    throw new Error(`Unexpected error when creating tag ${tag}:\n\n${err}`);
  }
}

/**
 * Commit staged changes to git.
 *
 * @param params - Parameters for the gitCommit function
 * @returns A promise that resolves to the output of the git commit command
 */
export async function gitCommit({
  messages,
  additionalArgs,
  dryRun,
  verbose,
  logFn
}: {
  messages: string[];
  additionalArgs?: string | string[];
  dryRun?: boolean;
  verbose?: boolean;
  logFn?: (message: string) => void;
}): Promise<string | undefined> {
  logFn = logFn || console.log;

  const commandArgs = ["commit", "-S"];
  for (const message of messages) {
    commandArgs.push("--message", message);
  }
  if (additionalArgs) {
    if (Array.isArray(additionalArgs)) {
      commandArgs.push(...additionalArgs);
    } else {
      commandArgs.push(...additionalArgs.split(" "));
    }
  }

  if (verbose) {
    logFn(
      dryRun
        ? `Would commit all previously staged files in git with the following command, but --dry-run was set:`
        : `Committing files in git with the following command:`
    );
    logFn(`git ${commandArgs.join(" ")}`);
  }

  if (dryRun) {
    return;
  }

  let hasStagedFiles = false;
  try {
    // This command will error if there are staged changes
    await execCommand("git", ["diff-index", "--quiet", "HEAD", "--cached"]);
  } catch {
    hasStagedFiles = true;
  }

  if (!hasStagedFiles) {
    logFn("\nNo staged files found. Skipping commit.");
    return;
  }

  return execCommand("git", commandArgs);
}

/**
 * Commit changes to git.
 *
 * @param params - Parameters for the commitChanges function
 * @throws Error if no changed or deleted files are provided
 * @returns A promise that resolves when the commit is complete
 */
export async function commitChanges({
  changedFiles,
  deletedFiles,
  isDryRun,
  isVerbose,
  gitCommitMessages,
  gitCommitArgs,
  logFn
}: {
  changedFiles?: string[];
  deletedFiles?: string[];
  isDryRun?: boolean;
  isVerbose?: boolean;
  gitCommitMessages?: string[];
  gitCommitArgs?: string | string[];
  logFn?: (message: string) => void;
}) {
  logFn = logFn || console.log;

  if (!changedFiles?.length && !deletedFiles?.length) {
    throw new Error("Error: No changed files to commit");
  }

  logFn(`Committing changes with git`);

  await gitAdd({
    changedFiles,
    deletedFiles,
    dryRun: isDryRun,
    verbose: isVerbose
  });
  // The extra logs need something breathing room
  if (isVerbose) {
    console.log("");
  }
  await gitCommit({
    messages: gitCommitMessages || [],
    additionalArgs: gitCommitArgs,
    dryRun: isDryRun,
    verbose: isVerbose
  });
}

// https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
const SEMVER_REGEX =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/g;

/**
 * Get the latest git tag for the configured release tag pattern.
 *
 * This function will:
 * - Get all tags from the git repo, sorted by version
 * - Filter the tags into a list with SEMVER-compliant tags, matching the release tag pattern
 * - If a preid is provided, prioritize tags for that preid, then semver tags without a preid
 * - If no preid is provided, search only for stable semver tags (i.e. no pre-release or build metadata)
 *
 * @param releaseTagPattern - The pattern to filter the tags list by
 * @param additionalInterpolationData - Additional data used when interpolating the release tag pattern
 * @param options - The options to use when getting the latest git tag for the pattern
 *
 * @returns The tag and version
 */
export async function getLatestGitTagForPattern(
  workspaceConfig: StormWorkspaceConfig,
  releaseTagPattern: string,
  additionalInterpolationData = {},
  resolveTags: RepoGitTags["resolveTags"],
  options: GetLatestGitTagForPatternOptions
): Promise<GitTagAndVersion | null> {
  const { requireSemver, strictPreid, preid, checkAllBranchesWhen } = options;

  try {
    const tags: string[] = await resolveTags(checkAllBranchesWhen);
    if (!tags.length) {
      return null;
    }

    const interpolatedTagPattern = interpolate(releaseTagPattern, {
      version: "%v%",
      projectName: "%p%",
      releaseGroupName: "%rg%",
      ...additionalInterpolationData
    });

    const tagRegexp = `^${interpolatedTagPattern
      .replace(/[/\-\\^$*+?.()|[\]{}]/g, "\\$&")
      .replace("%v%", "(.+)")
      .replace("%p%", "(.+)")
      .replace("%rg%", "(.+)")}`;

    const matchingTags = tags.filter(tag => {
      if (requireSemver) {
        // Match against Semver Regex when using semverVersioning to ensure only valid semver tags are matched
        return (
          !!tag.match(tagRegexp) &&
          tag.match(tagRegexp)!.some(r => r.match(SEMVER_REGEX))
        );
      } else {
        return !!tag.match(tagRegexp);
      }
    });
    if (!matchingTags.length) {
      return null;
    }

    writeDebug(
      `Found ${matchingTags.length} matching tags out of ${
        tags.length
      } total tags for release tag pattern "${
        releaseTagPattern
      }" (Interpolated tag pattern: ${interpolatedTagPattern})`,
      workspaceConfig
    );

    if (!strictPreid) {
      writeDebug(
        `Not using strict preid, will use the first matching tag ${matchingTags[0]!} for release tag pattern "${
          releaseTagPattern
        }" (Interpolated tag pattern: ${interpolatedTagPattern})`,
        workspaceConfig
      );

      // If not using strict preid, we can just return the first matching tag
      return extractTagAndVersion(matchingTags[0]!, tagRegexp, options);
    }

    // Find stable release tags
    const stableReleaseTags = matchingTags.filter(tag => {
      const matches = tag.match(tagRegexp);
      if (!matches) return false;
      const [, version] = matches;
      return version && !isPrerelease(version);
    });

    writeDebug(
      `Found ${stableReleaseTags.length} stable tags for release tag pattern "${
        releaseTagPattern
      }" (Interpolated tag pattern: ${interpolatedTagPattern})`,
      workspaceConfig
    );

    if (preid && preid.length > 0) {
      // When a preid is provided, find tags matching that preid
      const preidReleaseTags = matchingTags.filter(tag => {
        const match = tag.match(tagRegexp);
        if (!match) return false;

        const version = match.find(part => part.match(SEMVER_REGEX));
        return version && version.includes(`-${preid}.`);
      });

      writeDebug(
        `Found ${preidReleaseTags.length} preid tags for release tag pattern "${
          releaseTagPattern
        }" (Interpolated tag pattern: ${interpolatedTagPattern})`,
        workspaceConfig
      );

      // If both preid and stable tags exist, compare them to determine which is truly "latest"
      if (preidReleaseTags.length > 0 && stableReleaseTags.length > 0) {
        const preidResult = extractTagAndVersion(
          preidReleaseTags[0]!,
          tagRegexp,
          options
        );
        const stableResult = extractTagAndVersion(
          stableReleaseTags[0]!,
          tagRegexp,
          options
        );

        writeDebug(
          `Extracted preid version: ${
            preidResult.extractedVersion
          } and stable version: ${
            stableResult.extractedVersion
          } for release tag pattern "${
            releaseTagPattern
          }" (Interpolated tag pattern: ${interpolatedTagPattern})`,
          workspaceConfig
        );

        // Get the base version of the preid release (e.g., "1.2.4" from "1.2.4-alpha.1")
        const preidBaseVersion = coerce(preidResult.extractedVersion)?.version;
        const stableVersion = stableResult.extractedVersion;

        // If the stable version is >= the preid's base version, use the stable tag
        // This handles the case where a stable release was made after the prerelease
        // (e.g., 1.1.1 stable was released after 1.1.0-alpha.3)
        if (
          preidBaseVersion &&
          stableVersion &&
          gte(stableVersion, preidBaseVersion)
        ) {
          writeDebug(
            `Using latest stable tag for release tag pattern "${
              releaseTagPattern
            }" (Interpolated tag pattern: ${
              interpolatedTagPattern
            }) because its version (${
              stableVersion
            }) is greater than or equal to the base version of the latest preid tag (${
              preidBaseVersion
            })`,
            workspaceConfig
          );

          return stableResult;
        }

        // Otherwise, use the preid tag (prerelease's base is ahead of stable)
        return preidResult;
      }

      // If only preid tags exist (no stable), use the latest preid tag
      if (preidReleaseTags.length > 0) {
        writeDebug(
          `Using latest preid tag for release tag pattern "${
            releaseTagPattern
          }" (Interpolated tag pattern: ${interpolatedTagPattern})`,
          workspaceConfig
        );

        return preidReleaseTags.reduce(
          (ret, releaseTag) => {
            const result = extractTagAndVersion(releaseTag, tagRegexp, options);
            if (gt(result.extractedVersion, ret.extractedVersion)) {
              return result;
            }

            return ret;
          },
          extractTagAndVersion(preidReleaseTags[0]!, tagRegexp, options)
        );
      }

      // If no matching preid tags, fall through to find stable tags below
    }

    // If there are stable release tags, use the latest one
    if (stableReleaseTags.length > 0) {
      writeDebug(
        `Using latest stable tag for release tag pattern "${
          releaseTagPattern
        }" (Interpolated tag pattern: ${interpolatedTagPattern})`,
        workspaceConfig
      );

      return stableReleaseTags.reduce(
        (ret, releaseTag) => {
          const result = extractTagAndVersion(releaseTag, tagRegexp, options);
          if (gt(result.extractedVersion, ret.extractedVersion)) {
            return result;
          }

          return ret;
        },
        extractTagAndVersion(stableReleaseTags[0]!, tagRegexp, options)
      );
    }

    // Otherwise return null
    return null;
  } catch {
    return null;
  }
}
