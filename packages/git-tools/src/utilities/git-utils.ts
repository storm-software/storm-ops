import { FileData } from "@nx/devkit";
import { ReleaseGroupWithName } from "nx/src/command-line/release/config/filter-release-groups";
import { execCommand } from "nx/src/command-line/release/utils/exec-command.js";
import {
  getGitDiff,
  gitAdd,
  GitCommit,
  parseCommits
} from "nx/src/command-line/release/utils/git";
import {
  isPrerelease,
  VersionData
} from "nx/src/command-line/release/utils/shared";
import { interpolate } from "nx/src/tasks-runner/utils";
import { prerelease } from "semver";

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

export function createGitTagValues(
  releaseGroups: ReleaseGroupWithName[],
  releaseGroupToFilteredProjects: Map<ReleaseGroupWithName, Set<string>>,
  versionData: VersionData
): string[] {
  const tags = [] as string[];

  for (const releaseGroup of releaseGroups) {
    const releaseGroupProjectNames = Array.from(
      releaseGroupToFilteredProjects.get(releaseGroup) ?? []
    );
    // For independent groups we want one tag per project, not one for the overall group
    if (releaseGroup.projectsRelationship === "independent") {
      for (const project of releaseGroupProjectNames) {
        const projectVersionData = versionData[project];
        if (projectVersionData?.newVersion) {
          tags.push(
            interpolate(releaseGroup.releaseTagPattern, {
              version: projectVersionData.newVersion,
              projectName: project
            })
          );
        }
      }
      continue;
    }

    if (releaseGroupProjectNames.length > 0 && releaseGroupProjectNames[0]) {
      // For fixed groups we want one tag for the overall group
      const projectVersionData = versionData[releaseGroupProjectNames[0]]; // all at the same version, so we can just pick the first one
      if (projectVersionData?.newVersion) {
        tags.push(
          interpolate(releaseGroup.releaseTagPattern, {
            version: projectVersionData.newVersion,
            releaseGroupName: releaseGroup.name
          })
        );
      }
    }
  }

  return tags;
}

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
