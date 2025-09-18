import { DEFAULT_COMMIT_TYPES } from "conventional-changelog-storm-software/commit-types";
import { COMMIT_CONFIGS } from "conventional-changelog-storm-software/configs";
import { CommitScopesEnum, DEFAULT_COMMIT_PROMPT_MESSAGES } from "../../types";
import { DEFAULT_MINIMAL_COMMIT_QUESTIONS } from "./minimal";

export const DEFAULT_MONOREPO_COMMIT_QUESTIONS = {
  type: DEFAULT_MINIMAL_COMMIT_QUESTIONS.type,
  scope: {
    type: "select",
    title: "Commit Scope",
    description: "Select the project that's the most impacted by this change",
    enum: {} as CommitScopesEnum,
    defaultValue: "monorepo",
    maxLength: 50,
    minLength: 1
  },
  subject: DEFAULT_MINIMAL_COMMIT_QUESTIONS.subject,
  body: DEFAULT_MINIMAL_COMMIT_QUESTIONS.body,
  isBreaking: DEFAULT_MINIMAL_COMMIT_QUESTIONS.isBreaking,
  breakingBody: DEFAULT_MINIMAL_COMMIT_QUESTIONS.breakingBody,
  isIssueAffected: DEFAULT_MINIMAL_COMMIT_QUESTIONS.isIssueAffected,
  issuesBody: DEFAULT_MINIMAL_COMMIT_QUESTIONS.issuesBody
} as const;

const config = {
  settings: COMMIT_CONFIGS.monorepo.commitlint.settings,
  messages: DEFAULT_COMMIT_PROMPT_MESSAGES,
  questions: DEFAULT_MONOREPO_COMMIT_QUESTIONS,
  types: DEFAULT_COMMIT_TYPES
};

export default config;
