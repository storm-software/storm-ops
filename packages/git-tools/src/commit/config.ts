import {
  COMMIT_TYPES,
  CommitConfig,
  CommitQuestionEnum,
  CommitQuestionProps,
  DEFAULT_COMMIT_PROMPT_MESSAGES,
  DEFAULT_COMMIT_QUESTIONS,
  DEFAULT_COMMIT_SETTINGS,
  DefaultCommitQuestionKeys
} from "../types";

export const DEFAULT_COMMIT_CONFIG: CommitConfig = {
  settings: DEFAULT_COMMIT_SETTINGS,
  messages: DEFAULT_COMMIT_PROMPT_MESSAGES,
  questions: DEFAULT_COMMIT_QUESTIONS as CommitQuestionEnum<
    DefaultCommitQuestionKeys,
    CommitQuestionProps
  >,
  types: COMMIT_TYPES
};
