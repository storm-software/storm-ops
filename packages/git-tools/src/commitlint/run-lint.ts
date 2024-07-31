#!/usr/bin/env node

import {
  loadStormConfig,
  writeDebug,
  writeSuccess
} from "@storm-software/config-tools";
import { readFile } from "fs/promises";
import childProcess from "node:child_process";
import commitlintConfig from "./config";
import { getNxScopes } from "./get-nx-scopes";

// console.log("🐟🐟🐟 Validating git commit message 🐟🐟🐟");

export const COMMIT_EDITMSG_PATH = ".git/COMMIT_EDITMSG";

export const runCommitLint = async (commitMessageArg?: string) => {
  const config = await loadStormConfig();

  let commitMessage;
  if (commitMessageArg && commitMessageArg !== COMMIT_EDITMSG_PATH) {
    commitMessage = commitMessageArg;
  } else if (commitMessageArg !== COMMIT_EDITMSG_PATH) {
    commitMessage = await readCommitMessageFile();
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
        throw new Error(
          `No upstream remote found for ${config.name}.git. Skipping comparison.`
        );
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
      throw new Error(
        `No upstream remote found for ${config.name}.git. Skipping comparison against upstream main.`
      );
    }

    commitMessage = childProcess.execSync(gitLogCmd).toString().trim();
    if (!commitMessage) {
      throw new Error("No commits found. Skipping commit message validation.");
    }
  }

  const allowedTypes = Object.keys(
    commitlintConfig.prompt.questions.type.enum
  ).join("|");
  const allowedScopes = (await getNxScopes()).join("|");
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

const readCommitMessageFile = async (): Promise<string> => {
  return (await readFile(COMMIT_EDITMSG_PATH, "utf8"))?.trim();
};
