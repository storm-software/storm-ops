import { COMMIT_TYPES } from "conventional-changelog-storm-software/commit-types";
import {
  CommitQuestionProps,
  DEFAULT_COMMIT_PROMPT_MESSAGES,
  DEFAULT_MONOREPO_COMMIT_QUESTIONS,
  DEFAULT_MONOREPO_COMMIT_SETTINGS,
  DefaultMonorepoCommitQuestionKeys,
  MonorepoCommitConfig,
  MonorepoCommitQuestionEnum
} from "../../types";

const config: MonorepoCommitConfig = {
  settings: DEFAULT_MONOREPO_COMMIT_SETTINGS,
  messages: DEFAULT_COMMIT_PROMPT_MESSAGES,
  questions: DEFAULT_MONOREPO_COMMIT_QUESTIONS as MonorepoCommitQuestionEnum<
    DefaultMonorepoCommitQuestionKeys,
    CommitQuestionProps
  >,
  types: COMMIT_TYPES
};

export default config;
