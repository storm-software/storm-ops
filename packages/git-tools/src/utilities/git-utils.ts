import { execCommand } from "nx/src/command-line/release/utils/exec-command.js";

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
