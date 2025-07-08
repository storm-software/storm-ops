import {
  joinPaths,
  writeDebug,
  writeInfo,
  writeSuccess,
  writeWarning
} from "@storm-software/config-tools";
import { StormWorkspaceConfig } from "@storm-software/config/types";
import defu from "defu";
import { existsSync } from "fs";
import { readFile } from "fs/promises";
import childProcess from "node:child_process";
import { COMMIT_TYPES } from "../types";
import { DEFAULT_COMMITLINT_CONFIG } from "./config";
import lint from "./lint";
import { getNxScopes, getRuleFromScopeEnum } from "./scope";

const COMMIT_EDITMSG_PATH = ".git/COMMIT_EDITMSG";

export const runCommitLint = async (
  config: StormWorkspaceConfig,
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
      params.file || params.message || COMMIT_EDITMSG_PATH
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

  const allowedTypes = Object.keys(COMMIT_TYPES).join("|");
  const allowedScopes = await getNxScopes({
    config
  });

  // eslint-disable-next-line no-useless-escape
  const commitMsgRegex = `(${allowedTypes})\\((${allowedScopes})\\)!?:\\s(([a-z0-9:\-\s])+)`;
  const matchCommit = new RegExp(commitMsgRegex, "g").test(commitMessage);

  const commitlintConfig = defu(
    params.config ?? {},
    { rules: { "scope-enum": getRuleFromScopeEnum(allowedScopes) } },
    DEFAULT_COMMITLINT_CONFIG
  );

  const report = await lint(commitMessage, commitlintConfig.rules, {
    parserOpts: commitlintConfig.parserOpts,
    helpUrl: commitlintConfig.helpUrl
  });

  if (!matchCommit || report.errors.length || report.warnings.length) {
    writeSuccess(`Commit was processing completed successfully!`, config);
  } else {
    let errorMessage =
      " Oh no! Your commit message: \n" +
      "-------------------------------------------------------------------\n" +
      commitMessage +
      "\n-------------------------------------------------------------------" +
      "\n\n Does not follow the commit message convention specified by Storm Software.";
    errorMessage += "\ntype(scope): subject \n BLANK LINE \n body";
    errorMessage += "\n";
    errorMessage += `\nPossible types: ${allowedTypes}`;
    errorMessage += `\nPossible scopes: ${allowedScopes} (if unsure use "monorepo")`;
    errorMessage +=
      "\n\nEXAMPLE: \n" +
      "feat(my-lib): add an option to generate lazy-loadable modules\n" +
      "fix(monorepo)!: breaking change should have exclamation mark\n";
    errorMessage += `\n\nCommitLint Errors: ${report.errors.length ? report.errors.map(error => ` - ${error.message}`).join("\n") : "None"}`;
    errorMessage += `\nCommitLint Warnings: ${report.warnings.length ? report.warnings.map(warning => ` - ${warning.message}`).join("\n") : "None"}`;
    errorMessage += "\n\nPlease fix the commit message and rerun storm-commit.";
    errorMessage += `\n\nMore details about the Storm Software commit message specification can be found at: ${commitlintConfig.helpUrl}`;

    throw new Error(errorMessage);
  }

  return report.input;
};
