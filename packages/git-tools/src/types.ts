/* eslint-disable @typescript-eslint/no-explicit-any */

import type { ProjectGraph, ProjectsConfigurations } from "@nx/devkit";
import { Variant } from "@storm-software/config/types";
import { CommitEnumItemProps } from "conventional-changelog-storm-software/types/commit-types";
import { RuleConfigSeverity } from "conventional-changelog-storm-software/types/commitlint";
import {
  NxReleaseChangelogConfiguration,
  NxReleaseConventionalCommitsConfiguration,
  NxReleaseGitConfiguration,
  NxReleaseVersionConfiguration
} from "nx/src/config/nx-json";

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

export interface CommitLintCLIOptions {
  config?: string;
  message?: string;
  file?: string;
}

export type CommitScopeProps = CommitEnumItemProps & {
  projectRoot: string;
};

export type CommitScopesEnum = Record<string, CommitScopeProps>;

type CommitQuestionTypeProp = "input" | "select" | "confirm";

export type CommitQuestionProps = {
  type?: CommitQuestionTypeProp;
  title: string;
  description: string;
  enum?: Record<string, CommitEnumItemProps>;
  defaultValue?: string | boolean;
  maxLength?: number;
  minLength?: number;
  when?: (answers: Record<string, string>) => boolean;
};

export const DEFAULT_COMMIT_PROMPT_MESSAGES = {
  skip: "press enter to skip",
  max: "must be %d chars at most",
  min: "must be %d chars at least",
  emptyWarning: "can not be empty",
  upperLimitWarning: "%s is %d characters longer than the upper limit",
  lowerLimitWarning: "%s is %d characters less than the lower limit",
  closedIssueMessage: "Closes: "
} as const;

export type DefaultCommitPromptMessagesKeys =
  keyof typeof DEFAULT_COMMIT_PROMPT_MESSAGES;

export type CommitPromptMessagesEnum<
  TCommitPromptMessagesKeys extends
    DefaultCommitPromptMessagesKeys = DefaultCommitPromptMessagesKeys
> = Record<TCommitPromptMessagesKeys, string> &
  typeof DEFAULT_COMMIT_PROMPT_MESSAGES;

export type CommitSettingsEnum = Record<string, any> & {
  scopeEnumSeparator?: string;
  enableMultipleScopes: boolean;
  disableEmoji: boolean;
  breakingChangePrefix?: string;
  closedIssuePrefix?: string;
  format: string;
};

export type CommitState<
  TCommitAnswers extends Record<string, string | boolean> = Record<
    string,
    string | boolean
  >,
  TCommitConfig extends Record<string, any> = Record<string, any>
> = {
  variant: Variant;
  answers: TCommitAnswers;
  config: TCommitConfig;
  root: string;
};

export interface CommitLintRuleOutcome {
  /** If the commit is considered valid for the rule */
  valid: boolean;
  /** The "severity" of the rule (1 = warning, 2 = error) */
  level: RuleConfigSeverity;
  /** The name of the rule */
  name: string;
  /** The message returned from the rule, if invalid */
  message: string;
}

export interface CommitLintOutcome {
  /** The linted commit, as string */
  input: string;
  /** If the linted commit is considered valid */
  valid: boolean;
  /** All errors, per rule, for the commit */
  errors: CommitLintRuleOutcome[];
  /** All warnings, per rule, for the commit */
  warnings: CommitLintRuleOutcome[];
}

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

export type NxReleaseGroupConfig = NxReleaseGroupsConfig[string];

export type NxReleaseRequiredGitConfig = Required<{
  commit?: boolean | undefined;
  commitMessage?: string | undefined;
  commitArgs?: string | undefined;
  stageChanges?: boolean | undefined;
  tag?: boolean | undefined;
  tagMessage?: string | undefined;
  tagArgs?: string | undefined;
}>;
