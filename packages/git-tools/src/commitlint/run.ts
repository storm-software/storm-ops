import {
  joinPaths,
  writeDebug,
  writeInfo,
  writeSuccess,
  writeWarning
} from "@storm-software/config-tools";
import { StormWorkspaceConfig } from "@storm-software/config/types";
import createPreset from "conventional-changelog-storm-software";
import { existsSync } from "fs";
import { readFile } from "fs/promises";
import childProcess from "node:child_process";
import { CommitLintCLIOptions } from "../types";
import lint from "./lint";

const COMMIT_EDITMSG_PATH = ".git/COMMIT_EDITMSG";

export async function runCommitLint(
  workspaceConfig: StormWorkspaceConfig,
  options: CommitLintCLIOptions
) {
  writeInfo(
    "📝 Validating git commit message aligns with the Storm Software specification",
    workspaceConfig
  );

  let commitMessage;
  if (options.message && options.message !== COMMIT_EDITMSG_PATH) {
    commitMessage = options.message;
  } else {
    const commitFile = joinPaths(
      workspaceConfig.workspaceRoot,
      options.file || options.message || COMMIT_EDITMSG_PATH
    );
    if (existsSync(commitFile)) {
      commitMessage = (await readFile(commitFile, "utf8"))?.trim();
    }
  }

  if (!commitMessage) {
    let gitLogCmd = "git log -1 --no-merges";
    const gitRemotes = childProcess
      .execSync("git remote -v")
      .toString()
      .trim()
      .split("\n");
    const upstreamRemote = gitRemotes.find(remote =>
      remote.includes(`${workspaceConfig.name}.git`)
    );
    if (upstreamRemote) {
      const upstreamRemoteIdentifier = upstreamRemote.split("\t")[0]?.trim();
      if (!upstreamRemoteIdentifier) {
        writeWarning(
          `No upstream remote found for ${workspaceConfig.name}.git. Skipping comparison.`,
          workspaceConfig
        );
        return;
      }

      writeDebug(`Comparing against remote ${upstreamRemoteIdentifier}`);
      const currentBranch = childProcess
        .execSync("git branch --show-current")
        .toString()
        .trim();

      // exclude all commits already present in upstream/main
      gitLogCmd =
        gitLogCmd + ` ${currentBranch} ^${upstreamRemoteIdentifier}/main`;
    } else {
      writeWarning(
        `No upstream remote found for ${workspaceConfig.name}.git. Skipping comparison against upstream main.`,
        workspaceConfig
      );
      return;
    }

    commitMessage = childProcess.execSync(gitLogCmd).toString().trim();
    if (!commitMessage) {
      writeWarning(
        "No commits found. Skipping commit message validation.",
        workspaceConfig
      );
      return;
    }
  }

  const preset = await createPreset(workspaceConfig.variant);

  const report = await lint(commitMessage, preset);

  if (
    !preset.commitlint.regex.test(commitMessage) ||
    report.errors.length ||
    report.warnings.length
  ) {
    writeSuccess(
      `Commit was processing completed successfully!`,
      workspaceConfig
    );
  } else {
    let errorMessage =
      " Oh no! Your commit message: \n" +
      "-------------------------------------------------------------------\n" +
      commitMessage +
      "\n-------------------------------------------------------------------" +
      `\n\n Does not follow the \`${workspaceConfig.variant}\` commit message convention specified by the ${
        (typeof workspaceConfig.organization === "string"
          ? workspaceConfig.organization
          : workspaceConfig.organization?.name) || "Storm Software"
      } team.`;
    errorMessage += preset.changelogs.props.scope?.length
      ? "\ntype(scope): subject \n BLANK LINE \n body"
      : "\ntype: subject \n BLANK LINE \n body";
    errorMessage += "\n";
    errorMessage += `\nPossible types: ${preset.changelogs.props.types.map(
      type => `${type.section} (${type.type})`
    )}`;
    if (preset.changelogs.props.scope?.length) {
      errorMessage += `\nPossible scopes: ${preset.changelogs.props.scope} (if unsure use "monorepo")`;
    }
    errorMessage +=
      "\n\nEXAMPLE: \n" +
      "feat(my-lib): add an option to generate lazy-loadable modules\n" +
      "fix(monorepo)!: breaking change should have exclamation mark\n";
    errorMessage += `\n\nCommitLint Errors: ${
      report.errors.length
        ? report.errors.map(error => ` - ${error.message}`).join("\n")
        : "None"
    }`;
    errorMessage += `\nCommitLint Warnings: ${
      report.warnings.length
        ? report.warnings.map(warning => ` - ${warning.message}`).join("\n")
        : "None"
    }`;
    errorMessage += "\n\nPlease fix the commit message and rerun storm-commit.";
    errorMessage += `\n\nMore details about the Storm Software commit message specification can be found at: ${
      preset.commitlint.helpUrl
    }`;

    throw new Error(errorMessage);
  }

  return report.input;
}
