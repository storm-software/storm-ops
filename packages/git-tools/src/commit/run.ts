import { confirm, input, select } from "@inquirer/prompts";
import { joinPaths } from "@storm-software/config-tools";
import { getConfig } from "@storm-software/config-tools/get-config";
import {
  writeDebug,
  writeInfo
} from "@storm-software/config-tools/logger/console";
import { run } from "@storm-software/config-tools/utilities/run";
import shellescape from "any-shell-escape";
import chalkTemplate from "chalk-template";
import fs from "node:fs/promises";
import { runCommitLint } from "../commitlint/run";
import {
  CommitQuestionAnswers,
  CommitQuestionProps,
  CommitState
} from "../types";
import { createState, getGitDir } from "./commit-state";
import { formatCommitMessage } from "./format-commit-message";

export const runCommit = async (
  commitizenFile = "@storm-software/git-tools/commit/config",
  dryRun = false
) => {
  const config = await getConfig();

  const state = await createState(config, commitizenFile);
  if (dryRun) {
    writeInfo("Running in dry mode.", config);
  }

  console.log(chalkTemplate`
{bold.#999999 ----------------------------------------}

{bold.#FFFFFF ⚡ Storm Software Git-Tools - Commit}
{#CCCCCC Please provide the requested details below...}
`);

  state.answers = await askQuestions(state);

  const message = formatCommitMessage(state);
  const commitMsgFile = joinPaths(getGitDir(), "COMMIT_EDITMSG");

  console.log(chalkTemplate`
{bold.#999999 ----------------------------------------}

{bold.#FFFFFF Commit message} - {#DDDDDD ${message}}
{bold.#FFFFFF Git-Commit File} - {#DDDDDD ${commitMsgFile}}

    `);

  await runCommitLint(config, { message });

  const commandItems = ["git", "commit"];
  if (!process.env.CI && !process.env.STORM_CI) {
    commandItems.push("-S");
  }

  commandItems.push(...["--file", commitMsgFile]);
  const command = shellescape(commandItems);

  if (dryRun) {
    // The full path is replaced with a relative path to make the test pass on every machine
    writeDebug(
      `Skipping execution [dry-run]: ${command.replace(commitMsgFile, ".git/COMMIT_EDITMSG")}`,
      config
    );
    writeDebug(`Message [dry-run]: ${message}`, config);
  } else {
    await fs.writeFile(commitMsgFile, message);

    run(config, command);
  }
};

const askQuestions = async (
  state: CommitState
): Promise<CommitQuestionAnswers> => {
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
};

export const askQuestion = (
  index: number,
  question: CommitQuestionProps
): Promise<string | boolean> => {
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
        .filter(key => !question.enum![key]?.hidden)
        .map(key => ({
          name: question.enum![key]?.title || key,
          value: key,
          description: question.enum![key]?.description || ""
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
};
