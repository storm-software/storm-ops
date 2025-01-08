import {
  joinPaths,
  writeDebug,
  writeInfo,
  writeSuccess,
  writeWarning
} from "@storm-software/config-tools";
import { StormConfig } from "@storm-software/config/types";
import { existsSync } from "fs";
import { readFile } from "fs/promises";
import childProcess from "node:child_process";
import { DEFAULT_COMMIT_TYPES } from "../types";
import { getNxScopes } from "./scope";

const COMMIT_EDITMSG_PATH = ".git/COMMIT_EDITMSG";

export const runCommitLint = async (
  config: StormConfig,
  params: {
    config?: string;
    message?: string;
    file?: string;
  }
) => {
  writeInfo(
    "📝 Validating git commit message aligns with the Storm Software specification",
    config
  );

  let commitMessage;
  if (params.message && params.message !== COMMIT_EDITMSG_PATH) {
    commitMessage = params.message;
  } else {
    const commitFile = joinPaths(
      config.workspaceRoot,
      params.file || COMMIT_EDITMSG_PATH
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
      remote.includes(`${config.name}.git`)
    );
    if (upstreamRemote) {
      const upstreamRemoteIdentifier = upstreamRemote.split("\t")[0]?.trim();
      if (!upstreamRemoteIdentifier) {
        writeWarning(
          `No upstream remote found for ${config.name}.git. Skipping comparison.`,
          config
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
        `No upstream remote found for ${config.name}.git. Skipping comparison against upstream main.`,
        config
      );
      return;
    }

    commitMessage = childProcess.execSync(gitLogCmd).toString().trim();
    if (!commitMessage) {
      writeWarning(
        "No commits found. Skipping commit message validation.",
        config
      );
      return;
    }
  }

  const allowedTypes = Object.keys(DEFAULT_COMMIT_TYPES).join("|");
  const allowedScopes = (await getNxScopes()).join("|");
  // eslint-disable-next-line no-useless-escape
  const commitMsgRegex = `(${allowedTypes})\\((${allowedScopes})\\)!?:\\s(([a-z0-9:\-\s])+)`;

  const matchCommit = new RegExp(commitMsgRegex, "g").test(commitMessage);
  const matchRevert = /Revert/gi.test(commitMessage);
  const matchRelease = /Release/gi.test(commitMessage);

  if (+!(matchRelease || matchRevert || matchCommit) === 0) {
    writeSuccess(`Commit was processing completed successfully!`, config);
  } else {
    let errorMessage =
      " Oh no! 😦 Your commit message: \n" +
      "-------------------------------------------------------------------\n" +
      commitMessage +
      "\n-------------------------------------------------------------------" +
      "\n\n 👉️ Does not follow the commit message convention specified in the CONTRIBUTING.MD file.";
    errorMessage += "\ntype(scope): subject \n BLANK LINE \n body";
    errorMessage += "\n";
    errorMessage += `\npossible types: ${allowedTypes}`;
    errorMessage += `\npossible scopes: ${allowedScopes} (if unsure use "core")`;
    errorMessage +=
      "\nEXAMPLE: \n" +
      "feat(nx): add an option to generate lazy-loadable modules\n" +
      "fix(core)!: breaking change should have exclamation mark\n";

    throw new Error(errorMessage);
  }
};
