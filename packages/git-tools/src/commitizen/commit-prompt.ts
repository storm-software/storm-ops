/* eslint-disable @typescript-eslint/no-explicit-any */

import { CommitState } from "../types";
import { createQuestions } from "./commit-questions";

export const commitPrompt = async (state: CommitState) => {
  const inquirer = await import("inquirer");

  const prompt = inquirer.createPromptModule({});
  const questions = createQuestions(state);

  /*questions.forEach(
    (question: DistinctQuestion<CommitStateAnswers<CommitQuestions>>) => {
      console.log(`${question.name} - ${question.message}`);
      const choices = (question as any).choices;
      if (choices) {
        console.log("Choices:");
        choices.forEach((choice: string) => {
          console.log(choice);
        });
      }
    }
  );*/

  const answers = await prompt(questions);
  Object.keys(state.answers).forEach(key => {
    if (answers[key]) {
      state.answers[key] = answers[key];
    }
  });

  return state;
};
