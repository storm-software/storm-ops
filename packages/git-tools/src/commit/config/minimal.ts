import { DEFAULT_COMMIT_TYPES } from "conventional-changelog-storm-software/commit-types";
import { COMMIT_CONFIGS } from "conventional-changelog-storm-software/configs";
import {
  CommitTypeProps,
  CommitTypesEnum,
  DefaultCommitTypeKeys
} from "conventional-changelog-storm-software/types/commit-types";
import { DEFAULT_COMMIT_PROMPT_MESSAGES } from "../../types";

export const DEFAULT_MINIMAL_COMMIT_QUESTIONS = {
  type: {
    type: "select",
    title: "Commit Type",
    description: "Select the commit type that best describes your changes",
    enum: (
      Object.keys(DEFAULT_COMMIT_TYPES).filter(
        type => DEFAULT_COMMIT_TYPES[type].hidden !== true
      ) as DefaultCommitTypeKeys[]
    ).reduce((ret, type) => {
      ret[type] = DEFAULT_COMMIT_TYPES[type] as CommitTypeProps;

      return ret;
    }, {} as CommitTypesEnum),
    defaultValue: "chore",
    maxLength: 20,
    minLength: 3
  },
  subject: {
    type: "input",
    title: "Commit Subject",
    description: "Write a short, imperative tense description of the change",
    maxLength: 150,
    minLength: 3
  },
  body: {
    type: "input",
    title: "Commit Body",
    description: "Provide a longer description of the change",
    maxLength: 600
  },
  isBreaking: {
    type: "confirm",
    title: "Breaking Changes",
    description: "Are there any breaking changes as a result of this commit?",
    defaultValue: false
  },
  breakingBody: {
    type: "input",
    title: "Breaking Changes (Details)",
    description:
      "A BREAKING CHANGE commit requires a body. Please enter a longer description of the commit itself",
    when: (answers: Record<string, any>) => answers.isBreaking === true,
    maxLength: 600,
    minLength: 3
  },
  isIssueAffected: {
    type: "confirm",
    title: "Open Issue Affected",
    description: "Does this change impact any open issues?",
    defaultValue: false
  },
  issuesBody: {
    type: "input",
    title: "Open Issue Affected (Details)",
    description:
      "If issues are closed, the commit requires a body. Please enter a longer description of the commit itself",
    when: (answers: Record<string, any>) => answers.isIssueAffected === true,
    maxLength: 600,
    minLength: 3
  }
} as const;

const config = {
  settings: COMMIT_CONFIGS.minimal.commitlint.settings,
  messages: DEFAULT_COMMIT_PROMPT_MESSAGES,
  questions: DEFAULT_MINIMAL_COMMIT_QUESTIONS,
  types: DEFAULT_COMMIT_TYPES
};

export default config;
