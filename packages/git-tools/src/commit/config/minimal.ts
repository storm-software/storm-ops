import {
  COMMIT_TYPES,
  CommitQuestionProps,
  DEFAULT_COMMIT_PROMPT_MESSAGES,
  DEFAULT_MINIMAL_COMMIT_QUESTIONS,
  DEFAULT_MINIMAL_COMMIT_SETTINGS,
  DefaultMinimalCommitQuestionKeys,
  MinimalCommitConfig,
  MinimalCommitQuestionEnum
} from "../../types";

const config: MinimalCommitConfig = {
  settings: DEFAULT_MINIMAL_COMMIT_SETTINGS,
  messages: DEFAULT_COMMIT_PROMPT_MESSAGES,
  questions: DEFAULT_MINIMAL_COMMIT_QUESTIONS as MinimalCommitQuestionEnum<
    DefaultMinimalCommitQuestionKeys,
    CommitQuestionProps
  >,
  types: COMMIT_TYPES
};

export default config;
