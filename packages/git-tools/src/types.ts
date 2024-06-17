/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  NxReleaseChangelogConfiguration,
  NxReleaseConventionalCommitsConfiguration,
  NxReleaseGitConfiguration,
  NxReleaseVersionConfiguration
} from "nx/src/config/nx-json";
import type {
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
  tagFormat?: string;
  git: boolean;
  branches: string[];
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

export interface NxReleaseConfig {
  /**
   * Shorthand for amending the projects which will be included in the implicit default release group (all projects by default).
   * @note Only one of `projects` or `groups` can be specified, the cannot be used together.
   */
  projects?: string[] | string;
  /**
   * @note When no projects or groups are configured at all (the default), all projects in the workspace are treated as
   * if they were in a release group together with a fixed relationship.
   */
  groups?: Record<
    string, // group name
    {
      /**
       * Whether to version and release projects within the group independently, or together in lock step ("fixed").
       * If not set on the group, this will be informed by the projectsRelationship config at the top level.
       */
      projectsRelationship?: "fixed" | "independent";
      /**
       * Required list of one or more projects to include in the release group. Any single project can
       * only be used in a maximum of one release group.
       */
      projects: string[] | string;
      /**
       * Optionally override version configuration for this group.
       *
       * NOTE: git configuration is not supported at the group level, only the root/command level
       */
      version?: NxReleaseVersionConfiguration;
      /**
       * Project changelogs are disabled by default.
       *
       * Here you can optionally override project changelog configuration for this group.
       * Notes about boolean values:
       *
       * - true = enable project level changelogs using default configuration
       * - false = explicitly disable project level changelogs
       *
       * NOTE: git configuration is not supported at the group level, only the root/command level
       */
      changelog?: NxReleaseChangelogConfiguration | boolean;
      /**
       * Optionally override the git/release tag pattern to use for this group.
       */
      releaseTagPattern?: string;
    }
  >;
  /**
   * Configures the default value for all groups that don't explicitly state their own projectsRelationship.
   *
   * By default, this is set to "fixed" which means all projects in the workspace will be versioned and
   * released together in lock step.
   */
  projectsRelationship?: "fixed" | "independent";
  changelog?: {
    /**
     * Enable or override configuration for git operations as part of the changelog subcommand
     */
    git?: NxReleaseGitConfiguration;
    /**
     * Workspace changelog is enabled by default. Notes about boolean values:
     *
     * - true = explicitly enable workspace changelog using default configuration
     * - false = disable workspace changelog
     */
    workspaceChangelog?: NxReleaseChangelogConfiguration | boolean;
    /**
     * Project changelogs are disabled by default. Notes about boolean values:
     *
     * - true = enable project level changelogs using default configuration
     * - false = explicitly disable project level changelogs
     */
    projectChangelogs?: NxReleaseChangelogConfiguration | boolean;
    /**
     * Whether or not to automatically look up the first commit for the workspace (or package, if versioning independently)
     * and use that as the starting point for changelog generation. If this is not enabled, changelog generation will fail
     * if there is no previous matching git tag to use as a starting point.
     */
    automaticFromRef?: boolean;
  };
  /**
   * If no version config is provided, we will assume that @nx/js:release-version
   * is the desired generator implementation, allowing for terser config for the common case.
   */
  version?: NxReleaseVersionConfiguration & {
    /**
     * Enable or override configuration for git operations as part of the version subcommand
     */
    git?: NxReleaseGitConfiguration;
    /**
     * A command to run after validation of nx release configuration, but before versioning begins.
     * Used for preparing build artifacts. If --dry-run is passed, the command is still executed, but
     * with the NX_DRY_RUN environment variable set to 'true'.
     */
    preVersionCommand?: string;
  };
  /**
   * Optionally override the git/release tag pattern to use. This field is the source of truth
   * for changelog generation and release tagging, as well as for conventional commits parsing.
   *
   * It supports interpolating the version as {version} and (if releasing independently or forcing
   * project level version control system releases) the project name as {projectName} within the string.
   *
   * The default releaseTagPattern for fixed/unified releases is: "v{version}"
   * The default releaseTagPattern for independent releases at the project level is: "{projectName}@{version}"
   */
  releaseTagPattern?: string;
  /**
   * Enable and configure automatic git operations as part of the release
   */
  git?: NxReleaseGitConfiguration;
  conventionalCommits?: NxReleaseConventionalCommitsConfiguration;
}

export type NxReleaseConventionalCommitsConfig = NonNullable<
  NxReleaseConfig["conventionalCommits"]
>;
export type NxReleaseProjectsConfig = NonNullable<NxReleaseConfig["projects"]>;
export type NxReleaseGroupsConfig = NonNullable<NxReleaseConfig["groups"]>;
export type NxReleaseVersionConfig = NonNullable<NxReleaseConfig["version"]>;
export type NxReleaseGitConfig = NonNullable<NxReleaseConfig["git"]>;
export type NxReleaseChangelogConfig = NonNullable<
  NxReleaseConfig["changelog"]
>;

export type NxReleaseRequiredGitConfig = Required<{
  commit?: boolean | undefined;
  commitMessage?: string | undefined;
  commitArgs?: string | undefined;
  stageChanges?: boolean | undefined;
  tag?: boolean | undefined;
  tagMessage?: string | undefined;
  tagArgs?: string | undefined;
}>;
