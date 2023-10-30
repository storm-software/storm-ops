import shellescape from "any-shell-escape";
import { execSync } from "child_process";
import fs from "fs";
import { join } from "path";
import { commitPrompt } from "../commitizen/commit-prompt";
import { createState, getGitDir } from "../commitizen/commit-state";
import { formatCommitMessage } from "../commitizen/format-commit-message";

export const runCommit = async (
  commitConfig = "@storm-software/git-tools/commit/config.js",
  dryRun = false
) => {
  try {
    const state = await createState(commitConfig);
    if (dryRun) {
      console.log("Running in dry mode.");
    }

    const message = formatCommitMessage(await commitPrompt(state));
    const commitMsgFile = join(getGitDir(), "COMMIT_EDITMSG");
    const command = shellescape(["git", "commit", "--file", commitMsgFile]);

    if (dryRun) {
      // The full path is replaced with a relative path to make the test pass on every machine
      console.log("Will execute command:");
      console.log(command.replace(commitMsgFile, ".git/COMMIT_EDITMSG"));

      console.log("Message:");
      console.log(message);
    } else {
      console.log(command);

      fs.writeFileSync(commitMsgFile, message);
      execSync(command);
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
