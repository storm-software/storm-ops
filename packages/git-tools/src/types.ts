/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  ExecutorContext,
  ProjectGraph,
  ProjectsConfigurations
} from "nx/src/devkit-exports";

export type CommitQuestion = {
  description: string;
  body?: string;
  enum?: Array<{ name: string; value: string; description?: string }>;
};

export type CommitQuestions = Record<string, CommitQuestion> & {
  type: CommitQuestion;
  scope: CommitQuestion;
  subject: CommitQuestion;
  body: CommitQuestion;
  breaking: CommitQuestion;
  issues: CommitQuestion;
};

export const CommitQuestionsKeys = [
  "type",
  "scope",
  "subject",
  "body",
  "breaking",
  "issues"
] as const;

export type CommitType = {
  description: string;
  title?: string;
  emoji?: string;
};

export type CommitTypes = Record<string, CommitType> & {
  feat: CommitType;
  fix: CommitType;
  docs: CommitType;
  style: CommitType;
  refactor: CommitType;
  perf: CommitType;
  test: CommitType;
  build: CommitType;
  ci: CommitType;
  chore: CommitType;
  revert: CommitType;
};

export type CommitTypeKeys = [
  "feat",
  "fix",
  "docs",
  "style",
  "refactor",
  "perf",
  "test",
  "build",
  "ci",
  "chore",
  "revert"
];

export type CommitStateConfig<
  TQuestions extends CommitQuestions = CommitQuestions,
  TTypes extends CommitTypes = CommitTypes
> = {
  extends?: string[];
  rules: Record<string, any>;
  breakingChangePrefix: string;
  closedIssueMessage: string;
  closedIssuePrefix: string;
  format: string;
  list: string[];
  types: TTypes;
  maxMessageLength: number;
  minMessageLength: number;
  disableEmoji: boolean;
  questions: TQuestions;
};

export type CommitStateAnswers<
  TQuestions extends CommitQuestions = CommitQuestions
> = Record<keyof TQuestions | string, string>;

export type CommitState<TQuestions extends CommitQuestions = CommitQuestions> =
  {
    answers: CommitStateAnswers<TQuestions>;
    config: CommitStateConfig<TQuestions>;
    root: string;
  };

export type GetProjectContext = Pick<
  ExecutorContext,
  | "projectName"
  | "cwd"
  | "projectsConfigurations"
  | "projectGraph"
  | "workspace"
>;

export type ReleaseConfig = any & {
  npm: boolean;
  github: boolean;
  githubOptions?: Record<string, unknown>;
  buildTarget?: string;
  changelog?: boolean;
  changelogFile?: string;
  outputPath?: string;
  commitMessage?: string;
  gitAssets?: string[];
  packageJsonDir?: string;
  parserOpts?: Record<string, unknown>;
  writerOpts?: Record<string, unknown>;
  linkCompare?: boolean;
  linkReferences?: boolean;
  releaseRules?:
    | string
    | { release: string | boolean; [key: string]: unknown }[];
  preset?: string;
  presetConfig?: Record<string, unknown>;
  plugins?: any[];
  stormPlugin?: string;
  tagFormat?: string;
  git: boolean;
};

export type ReleaseContext = ReleaseConfig & {
  projectName: string;
  workspaceDir: string;
  projectGraph: ProjectGraph;
  projectConfigs: ProjectsConfigurations;
};

export interface ReadMeOptions {
  templates: string;
  project?: string;
  output?: string;
  clean: boolean;
  prettier: boolean;
}
