import { confirm, input, select } from "@inquirer/prompts";
import { joinPaths } from "@storm-software/config-tools";
import { getWorkspaceConfig } from "@storm-software/config-tools/get-config";
import {
  writeDebug,
  writeInfo
} from "@storm-software/config-tools/logger/console";
import { run } from "@storm-software/config-tools/utilities/run";
import shellescape from "any-shell-escape";
import chalkTemplate from "chalk-template";
import fs from "node:fs/promises";
import { runCommitLint } from "../commitlint/run";
import { CommitQuestionProps, CommitState } from "../types";
import { createState, getGitDir } from "./commit-state";
import { formatCommitMessage } from "./format-commit-message";

export async function runCommit(commitizenFile?: string, dryRun = false) {
  const workspaceConfig = await getWorkspaceConfig();

  const state = await createState(workspaceConfig, commitizenFile);
  if (dryRun) {
    writeInfo("Running in dry mode.", workspaceConfig);
  }

  console.log(chalkTemplate`
{bold.#999999 ----------------------------------------}

{bold.#FFFFFF ⚡ Storm Software Git-Tools - Commit}
{#CCCCCC Please provide the requested details below...}
`);

  state.answers = await askQuestions(state);

  const message = formatCommitMessage(state, workspaceConfig);
  const commitMsgFile = joinPaths(getGitDir(), "COMMIT_EDITMSG");

  console.log(chalkTemplate`
{bold.#999999 ----------------------------------------}

{bold.#FFFFFF Commit message} - {#DDDDDD ${message}}
{bold.#FFFFFF Git-Commit File} - {#DDDDDD ${commitMsgFile}}

    `);

  await runCommitLint(workspaceConfig, { message });

  const commandItems = ["git", "commit", "-S"];

  commandItems.push(...["--file", commitMsgFile]);
  const command = shellescape(commandItems);

  if (dryRun) {
    // The full path is replaced with a relative path to make the test pass on every machine
    writeDebug(
      `Skipping execution [dry-run]: ${command.replace(commitMsgFile, ".git/COMMIT_EDITMSG")}`,
      workspaceConfig
    );
    writeDebug(`Message [dry-run]: ${message}`, workspaceConfig);
  } else {
    await fs.writeFile(commitMsgFile, message);

    run(workspaceConfig, command);
  }
}

async function askQuestions<TCommitState extends CommitState = CommitState>(
  state: TCommitState
): Promise<TCommitState["answers"]> {
  let index = 0;
  for (const key of Object.keys(state.config.prompt.questions)) {
    if (
      state.config.prompt.questions[key] &&
      !state.config.prompt.questions[key].hidden &&
      (!state.config.prompt.questions[key].when ||
        state.config.prompt.questions[key].when(state.answers))
    ) {
      state.answers[key] = await askQuestion(
        index,
        state.config.prompt.questions[key]
      );
      index++;
    }
  }

  return state.answers;
}

export async function askQuestion(
  index: number,
  question: CommitQuestionProps
): Promise<string | boolean> {
  const message = chalkTemplate`{bold ${index + 1}. ${question.title}} - ${question.description}
`;

  // const message = `${index + 1}. ${question.title}: ${question.description}`;

  if (
    question.type === "select" &&
    question.enum &&
    Object.keys(question.enum).length > 1
  ) {
    return select({
      message,
      choices: Object.keys(question.enum)
        .filter(key => !question.enum?.[key]?.hidden)
        .map(key => ({
          name: question.enum?.[key]?.title || key,
          value: key,
          description: question.enum?.[key]?.description || ""
        })),
      default: String(question.defaultValue || "")
    });
  } else if (question.type === "confirm") {
    return confirm({
      message,
      default: Boolean(question.defaultValue)
    });
  } else {
    let validate:
      | ((value: string) => string | boolean | Promise<string | boolean>)
      | undefined = undefined;
    if (question.minLength !== undefined || question.maxLength !== undefined) {
      validate = (value: string) => {
        if (
          question.minLength !== undefined &&
          value.length < question.minLength
        ) {
          return `Minimum length is ${question.minLength} characters.`;
        }
        if (
          question.maxLength !== undefined &&
          value.length > question.maxLength
        ) {
          return `Maximum length is ${question.maxLength} characters.`;
        }

        return true;
      };
    }

    return input({
      message,
      required: !!(question.minLength !== undefined && question.minLength > 0),
      default: String(question.defaultValue || ""),
      validate
    });
  }
}
