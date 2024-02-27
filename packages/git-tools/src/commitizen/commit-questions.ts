/* eslint-disable @typescript-eslint/no-explicit-any */
import fuzzy from "fuzzy";
import type { DistinctQuestion } from "inquirer";
import type { CommitQuestions, CommitState, CommitStateAnswers } from "../types";

export const createQuestions = <TQuestions extends CommitQuestions = CommitQuestions>(
  state: CommitState
): readonly DistinctQuestion<CommitStateAnswers<TQuestions>>[] => {
  const minTitleLengthErrorMessage = `The subject must have at least ${state.config.minMessageLength} characters`;
  const configQuestions = state.config.questions;

  const questions = [
    {
      ...createQuestion(configQuestions, "type", 0),
      type: "list"
    },
    {
      ...createQuestion(configQuestions, "scope", 1),
      type: "list"
    },
    {
      ...createQuestion(configQuestions, "subject", 2),
      maxLength: state.config.maxMessageLength - 3,
      type: "input",
      validate: (input: string) =>
        input.length >= state.config.minMessageLength || minTitleLengthErrorMessage
    },
    createQuestion(configQuestions, "body", 3),
    createQuestion(configQuestions, "breaking", 4),
    createQuestion(configQuestions, "issues", 5)
  ];

  return Object.keys(state.config.questions).reduce((ret: any[], key: string) => {
    if (key && !ret.some((item) => item.name === key)) {
      ret.push(createQuestion(configQuestions, key, ret.length));
    }

    return ret;
  }, questions);
};

export const createQuestion = (
  questions: CommitQuestions,
  name: string,
  index: number | string
) => {
  const question = questions[name];
  const selectOptionsExist = Array.isArray(question?.enum) && question.enum.length > 0;

  return {
    message: `${question?.description}:`,
    suffix: question?.body ? question.body : undefined,
    name,
    type: selectOptionsExist ? "list" : "input",
    prefix: `${typeof index === "string" ? index : index + 1}.`,
    choices: selectOptionsExist ? question.enum : undefined,
    source: selectOptionsExist
      ? (_answers?: any, input?: string) =>
          Promise.resolve(fuzzy.filter(input || "", question.enum ? question.enum : []))
      : undefined
  };
};
