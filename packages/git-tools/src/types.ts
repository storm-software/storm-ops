/* eslint-disable @typescript-eslint/no-explicit-any */

import type { ProjectGraph, ProjectsConfigurations } from "@nx/devkit";
import { Variant } from "@storm-software/config/types";
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

export type CommitEnumItemProps = {
  description: string;
  title?: string;
  emoji?: string;
  hidden?: boolean;
};

export type CommitTypeProps = CommitEnumItemProps & {
  semverBump: "none" | "patch" | "minor" | "major";
  changelog: {
    title: string;
    hidden: boolean;
  };
};

export const COMMIT_TYPES = {
  /* --- Bumps version when selected --- */

  "chore": {
    "description": "Other changes that don't modify src or test files",
    "title": "Chore",
    "emoji": "⚙️  ",
    "semverBump": "patch",
    "changelog": {
      "title": "Miscellaneous",
      "hidden": false
    }
  },
  "fix": {
    "description":
      "A change that resolves an issue previously identified with the package",
    "title": "Bug Fix",
    "emoji": "🪲  ",
    "semverBump": "patch",
    "changelog": {
      "title": "Bug Fixes",
      "hidden": false
    }
  },
  "feat": {
    "description": "A change that adds a new feature to the package",
    "title": "Feature",
    "emoji": "🔑 ",
    "semverBump": "minor",
    "changelog": {
      "title": "Features",
      "hidden": false
    }
  },
  "ci": {
    "description":
      "Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)",
    "title": "Continuous Integration",
    "emoji": "🧰 ",
    "semverBump": "patch",
    "changelog": {
      "title": "Continuous Integration",
      "hidden": false
    }
  },
  "refactor": {
    "description": "A code change that neither fixes a bug nor adds a feature",
    "title": "Code Refactoring",
    "emoji": "🧪 ",
    "semverBump": "patch",
    "changelog": {
      "title": "Source Code Improvements",
      "hidden": false
    }
  },
  "style": {
    "description":
      "Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)",
    "title": "Style Improvements",
    "emoji": "💎 ",
    "semverBump": "patch",
    "changelog": {
      "title": "Style Improvements",
      "hidden": false
    }
  },
  "perf": {
    "description": "A code change that improves performance",
    "title": "Performance Improvement",
    "emoji": "⏱️  ",
    "semverBump": "patch",
    "changelog": {
      "title": "Performance Improvements",
      "hidden": false
    }
  },

  /* --- Does not bump version when selected --- */

  "docs": {
    "description": "A change that only includes documentation updates",
    "title": "Documentation",
    "emoji": "📜 ",
    "semverBump": "none",
    "changelog": {
      "title": "Documentation",
      "hidden": false
    }
  },
  "test": {
    "description": "Adding missing tests or correcting existing tests",
    "title": "Testing",
    "emoji": "🚨 ",
    "semverBump": "none",
    "changelog": {
      "title": "Testing",
      "hidden": true
    }
  },

  /* --- Not included in commitlint but included in changelog --- */

  "deps": {
    "description":
      "Changes that add, update, or remove dependencies. This includes devDependencies and peerDependencies",
    "title": "Dependencies",
    "emoji": "📦 ",
    "hidden": true,
    "semverBump": "patch",
    "changelog": {
      "title": "Dependency Upgrades",
      "hidden": false
    }
  },

  /* --- Not included in commitlint or changelog --- */

  "build": {
    "description":
      "Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)",
    "title": "Build",
    "emoji": "🛠 ",
    "hidden": true,
    "semverBump": "none",
    "changelog": {
      "title": "Build",
      "hidden": true
    }
  },
  "release": {
    "description": "Publishing a commit containing a newly released version",
    "title": "Publish Release",
    "emoji": "🚀 ",
    "hidden": true,
    "semverBump": "none",
    "changelog": {
      "title": "Publish Release",
      "hidden": true
    }
  }
} as const;

export type DefaultCommitTypeKeys = keyof typeof COMMIT_TYPES;

export type CommitTypesEnum<
  TCommitTypes extends DefaultCommitTypeKeys = DefaultCommitTypeKeys
> = Record<TCommitTypes, CommitTypeProps>;

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

export const DEFAULT_MINIMAL_COMMIT_QUESTIONS = {
  type: {
    type: "select",
    title: "Commit Type",
    description: "Select the commit type that best describes your changes",
    enum: (
      Object.keys(COMMIT_TYPES).filter(
        type => COMMIT_TYPES[type].hidden !== true
      ) as DefaultCommitTypeKeys[]
    ).reduce((ret, type) => {
      ret[type] = COMMIT_TYPES[type] as CommitTypeProps;

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

export type DefaultMinimalCommitQuestionKeys =
  keyof typeof DEFAULT_MINIMAL_COMMIT_QUESTIONS;

export type MinimalCommitQuestionEnum<
  TCommitQuestionKeys extends
    DefaultMinimalCommitQuestionKeys = DefaultMinimalCommitQuestionKeys,
  TCommitQuestionProps extends CommitQuestionProps = CommitQuestionProps
> = Record<TCommitQuestionKeys, TCommitQuestionProps> &
  typeof DEFAULT_MINIMAL_COMMIT_QUESTIONS;

export type DefaultMonorepoCommitQuestionKeys =
  keyof typeof DEFAULT_MONOREPO_COMMIT_QUESTIONS;

export type MonorepoCommitQuestionEnum<
  TCommitQuestionKeys extends
    DefaultMonorepoCommitQuestionKeys = DefaultMonorepoCommitQuestionKeys,
  TCommitQuestionProps extends CommitQuestionProps = CommitQuestionProps
> = Record<TCommitQuestionKeys, TCommitQuestionProps> &
  typeof DEFAULT_MONOREPO_COMMIT_QUESTIONS;

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

export const DEFAULT_MINIMAL_COMMIT_MESSAGE_FORMAT = "{type}: {emoji}{subject}";

export const DEFAULT_MINIMAL_COMMIT_SETTINGS = {
  enableMultipleScopes: false,
  disableEmoji: true,
  breakingChangePrefix: "💣 ",
  closedIssuePrefix: "✅ ",
  format: DEFAULT_MINIMAL_COMMIT_MESSAGE_FORMAT
};

export const DEFAULT_MONOREPO_COMMIT_MESSAGE_FORMAT =
  "{type}({scope}): {emoji}{subject}";

export const DEFAULT_MONOREPO_COMMIT_SETTINGS = {
  enableMultipleScopes: false,
  disableEmoji: true,
  breakingChangePrefix: "💣 ",
  closedIssuePrefix: "✅ ",
  format: DEFAULT_MONOREPO_COMMIT_MESSAGE_FORMAT
};

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

export type RuleConfigCondition = "always" | "never";
export enum RuleConfigSeverity {
  Disabled = 0,
  Warning = 1,
  Error = 2
}

export type CommitRulesEnum = Record<
  string,
  | [RuleConfigSeverity, RuleConfigCondition]
  | [RuleConfigSeverity, RuleConfigCondition, number]
  | [RuleConfigSeverity, RuleConfigCondition, string]
  | [RuleConfigSeverity, RuleConfigCondition, string[]]
  | [RuleConfigSeverity, RuleConfigCondition, any]
  | any
>;

export type DefaultCommitRulesEnum = {
  "body-leading-blank": [RuleConfigSeverity, RuleConfigCondition];
  "body-max-length": [RuleConfigSeverity, RuleConfigCondition, number];
  "footer-leading-blank": [RuleConfigSeverity, RuleConfigCondition];
  "footer-max-line-length": [RuleConfigSeverity, RuleConfigCondition, number];
  "header-max-length": [RuleConfigSeverity, RuleConfigCondition, number];
  "header-trim": [RuleConfigSeverity, RuleConfigCondition];
  "subject-case": [RuleConfigSeverity, RuleConfigCondition, string[]];
  "subject-empty": [RuleConfigSeverity, RuleConfigCondition];
  "subject-full-stop": [RuleConfigSeverity, RuleConfigCondition, string];
  "subject-max-length": [RuleConfigSeverity, RuleConfigCondition, number];
  "subject-min-length": [RuleConfigSeverity, RuleConfigCondition, number];
  "type-case": [RuleConfigSeverity, RuleConfigCondition, string];
  "type-empty": [RuleConfigSeverity, RuleConfigCondition];
  "type-enum": [RuleConfigSeverity, RuleConfigCondition, string[]];
  "scope-empty":
    | [RuleConfigSeverity, RuleConfigCondition]
    | RuleConfigSeverity.Disabled;
  "scope-case":
    | [RuleConfigSeverity, RuleConfigCondition, string[]]
    | RuleConfigSeverity.Disabled;
  "scope-enum":
    | [RuleConfigSeverity, RuleConfigCondition, string[]]
    | RuleConfigSeverity.Disabled;
  "type-max-length": [RuleConfigSeverity, RuleConfigCondition, number];
  "type-min-length": [RuleConfigSeverity, RuleConfigCondition, number];
} & CommitRulesEnum;

export type DefaultMinimalCommitRulesEnum = {
  "body-leading-blank": [RuleConfigSeverity, RuleConfigCondition];
  "body-max-length": [RuleConfigSeverity, RuleConfigCondition, number];
  "footer-leading-blank": [RuleConfigSeverity, RuleConfigCondition];
  "footer-max-line-length": [RuleConfigSeverity, RuleConfigCondition, number];
  "header-max-length": [RuleConfigSeverity, RuleConfigCondition, number];
  "header-trim": [RuleConfigSeverity, RuleConfigCondition];
  "subject-case": [RuleConfigSeverity, RuleConfigCondition, string[]];
  "subject-empty": [RuleConfigSeverity, RuleConfigCondition];
  "subject-full-stop": [RuleConfigSeverity, RuleConfigCondition, string];
  "subject-max-length": [RuleConfigSeverity, RuleConfigCondition, number];
  "subject-min-length": [RuleConfigSeverity, RuleConfigCondition, number];
  "type-case": [RuleConfigSeverity, RuleConfigCondition, string];
  "type-empty": [RuleConfigSeverity, RuleConfigCondition];
  "type-enum": [RuleConfigSeverity, RuleConfigCondition, string[]];
  "scope-empty": RuleConfigSeverity.Disabled;
  "scope-case": RuleConfigSeverity.Disabled;
  "type-max-length": [RuleConfigSeverity, RuleConfigCondition, number];
  "type-min-length": [RuleConfigSeverity, RuleConfigCondition, number];
} & CommitRulesEnum;

export const DEFAULT_MINIMAL_COMMIT_RULES: DefaultMinimalCommitRulesEnum = {
  "body-leading-blank": [RuleConfigSeverity.Warning, "always"],
  "body-max-length": [RuleConfigSeverity.Error, "always", 600],
  "footer-leading-blank": [RuleConfigSeverity.Warning, "always"],
  "footer-max-line-length": [RuleConfigSeverity.Error, "always", 150],
  "header-max-length": [RuleConfigSeverity.Error, "always", 150],
  "header-trim": [RuleConfigSeverity.Error, "always"],
  "subject-case": [RuleConfigSeverity.Error, "always", ["sentence-case"]],
  "subject-empty": [RuleConfigSeverity.Error, "never"],
  "subject-full-stop": [RuleConfigSeverity.Error, "never", "."],
  "subject-max-length": [RuleConfigSeverity.Error, "always", 150],
  "subject-min-length": [RuleConfigSeverity.Error, "always", 3],
  "type-case": [RuleConfigSeverity.Error, "always", "kebab-case"],
  "type-empty": [RuleConfigSeverity.Error, "never"],
  "type-enum": [
    RuleConfigSeverity.Error,
    "always",
    Object.keys(COMMIT_TYPES)
  ] as [RuleConfigSeverity, RuleConfigCondition, string[]],
  "type-max-length": [RuleConfigSeverity.Error, "always", 20],
  "type-min-length": [RuleConfigSeverity.Error, "always", 3],
  "scope-empty": RuleConfigSeverity.Disabled,
  "scope-case": RuleConfigSeverity.Disabled,
  "scope-enum": RuleConfigSeverity.Disabled
};

export type MinimalCommitConfig<
  TCommitQuestionEnum extends
    MinimalCommitQuestionEnum = MinimalCommitQuestionEnum,
  TCommitTypesEnum extends CommitTypesEnum = CommitTypesEnum,
  TCommitPromptMessagesEnum extends
    CommitPromptMessagesEnum = CommitPromptMessagesEnum,
  TCommitSettingsEnum extends CommitSettingsEnum = CommitSettingsEnum
> = {
  extends?: string[];
  messages: TCommitPromptMessagesEnum;
  settings: TCommitSettingsEnum;
  types: TCommitTypesEnum;
  questions: TCommitQuestionEnum;
};

export type DefaultMinimalResolvedCommitRulesEnum =
  DefaultMinimalCommitRulesEnum & {
    "scope-enum": (
      ctx: any
    ) => Promise<[RuleConfigSeverity, RuleConfigCondition, string[]]>;
  };

export type MinimalCommitResolvedConfig<
  TCommitQuestionEnum extends MinimalCommitQuestionEnum<
    DefaultMinimalCommitQuestionKeys,
    CommitQuestionProps
  > = MinimalCommitQuestionEnum<
    DefaultMinimalCommitQuestionKeys,
    CommitQuestionProps
  >,
  TCommitPromptMessagesEnum extends
    CommitPromptMessagesEnum = CommitPromptMessagesEnum,
  TCommitSettingsEnum extends CommitSettingsEnum = CommitSettingsEnum
> = {
  parserPreset: string;
  prompt: {
    settings: TCommitSettingsEnum;
    messages: TCommitPromptMessagesEnum;
    questions: TCommitQuestionEnum;
  };
};

export type MinimalCommitQuestionAnswers<
  TCommitQuestionEnum extends
    MinimalCommitQuestionEnum = MinimalCommitQuestionEnum
> = Record<keyof TCommitQuestionEnum | string, string | boolean>;

export type MinimalCommitState<
  TCommitQuestionEnum extends
    MinimalCommitQuestionEnum = MinimalCommitQuestionEnum,
  TCommitPromptMessagesEnum extends
    CommitPromptMessagesEnum = CommitPromptMessagesEnum,
  TCommitSettingsEnum extends CommitSettingsEnum = CommitSettingsEnum
> = CommitState<
  MinimalCommitQuestionAnswers<TCommitQuestionEnum>,
  MinimalCommitResolvedConfig<
    TCommitQuestionEnum,
    TCommitPromptMessagesEnum,
    TCommitSettingsEnum
  >
> & {
  variant: "minimal";
};

export type DefaultMonorepoCommitRulesEnum = {
  "body-leading-blank": [RuleConfigSeverity, RuleConfigCondition];
  "body-max-length": [RuleConfigSeverity, RuleConfigCondition, number];
  "footer-leading-blank": [RuleConfigSeverity, RuleConfigCondition];
  "footer-max-line-length": [RuleConfigSeverity, RuleConfigCondition, number];
  "header-max-length": [RuleConfigSeverity, RuleConfigCondition, number];
  "header-trim": [RuleConfigSeverity, RuleConfigCondition];
  "subject-case": [RuleConfigSeverity, RuleConfigCondition, string[]];
  "subject-empty": [RuleConfigSeverity, RuleConfigCondition];
  "subject-full-stop": [RuleConfigSeverity, RuleConfigCondition, string];
  "subject-max-length": [RuleConfigSeverity, RuleConfigCondition, number];
  "subject-min-length": [RuleConfigSeverity, RuleConfigCondition, number];
  "type-case": [RuleConfigSeverity, RuleConfigCondition, string];
  "type-empty": [RuleConfigSeverity, RuleConfigCondition];
  "type-enum": [RuleConfigSeverity, RuleConfigCondition, string[]];
  "scope-empty": [RuleConfigSeverity, RuleConfigCondition];
  "scope-case": [RuleConfigSeverity, RuleConfigCondition, string[]];
  "type-max-length": [RuleConfigSeverity, RuleConfigCondition, number];
  "type-min-length": [RuleConfigSeverity, RuleConfigCondition, number];
} & CommitRulesEnum;

export const DEFAULT_MONOREPO_COMMIT_RULES: DefaultMonorepoCommitRulesEnum = {
  "body-leading-blank": [RuleConfigSeverity.Warning, "always"],
  "body-max-length": [RuleConfigSeverity.Error, "always", 600],
  "footer-leading-blank": [RuleConfigSeverity.Warning, "always"],
  "footer-max-line-length": [RuleConfigSeverity.Error, "always", 150],
  "header-max-length": [RuleConfigSeverity.Error, "always", 150],
  "header-trim": [RuleConfigSeverity.Error, "always"],
  "subject-case": [RuleConfigSeverity.Error, "always", ["sentence-case"]],
  "subject-empty": [RuleConfigSeverity.Error, "never"],
  "subject-full-stop": [RuleConfigSeverity.Error, "never", "."],
  "subject-max-length": [RuleConfigSeverity.Error, "always", 150],
  "subject-min-length": [RuleConfigSeverity.Error, "always", 3],
  "type-case": [RuleConfigSeverity.Error, "always", "kebab-case"],
  "type-empty": [RuleConfigSeverity.Error, "never"],
  "type-enum": [
    RuleConfigSeverity.Error,
    "always",
    Object.keys(COMMIT_TYPES)
  ] as [RuleConfigSeverity, RuleConfigCondition, string[]],
  "type-max-length": [RuleConfigSeverity.Error, "always", 20],
  "type-min-length": [RuleConfigSeverity.Error, "always", 3],
  "scope-case": [RuleConfigSeverity.Error, "always", ["kebab-case"]],
  "scope-empty": [RuleConfigSeverity.Error, "never"]
};

export type MonorepoCommitConfig<
  TCommitQuestionEnum extends
    MonorepoCommitQuestionEnum = MonorepoCommitQuestionEnum,
  TCommitTypesEnum extends CommitTypesEnum = CommitTypesEnum,
  TCommitPromptMessagesEnum extends
    CommitPromptMessagesEnum = CommitPromptMessagesEnum,
  TCommitSettingsEnum extends CommitSettingsEnum = CommitSettingsEnum
> = {
  extends?: string[];
  messages: TCommitPromptMessagesEnum;
  settings: TCommitSettingsEnum;
  types: TCommitTypesEnum;
  questions: TCommitQuestionEnum;
};

export type DefaultMonorepoResolvedCommitRulesEnum =
  DefaultMonorepoCommitRulesEnum & {
    "scope-enum": (
      ctx: any
    ) => Promise<[RuleConfigSeverity, RuleConfigCondition, string[]]>;
  };

export type MonorepoCommitResolvedConfig<
  TCommitQuestionEnum extends MonorepoCommitQuestionEnum<
    DefaultMonorepoCommitQuestionKeys,
    CommitQuestionProps
  > = MonorepoCommitQuestionEnum<
    DefaultMonorepoCommitQuestionKeys,
    CommitQuestionProps
  >,
  TCommitPromptMessagesEnum extends
    CommitPromptMessagesEnum = CommitPromptMessagesEnum,
  TCommitSettingsEnum extends CommitSettingsEnum = CommitSettingsEnum
> = {
  utils: Record<string, any>;
  parserPreset: string;
  prompt: {
    settings: TCommitSettingsEnum;
    messages: TCommitPromptMessagesEnum;
    questions: TCommitQuestionEnum;
  };
};

export type MonorepoCommitQuestionAnswers<
  TCommitQuestionEnum extends
    MonorepoCommitQuestionEnum = MonorepoCommitQuestionEnum
> = Record<keyof TCommitQuestionEnum | string, string | boolean>;

export type MonorepoCommitState<
  TCommitQuestionEnum extends
    MonorepoCommitQuestionEnum = MonorepoCommitQuestionEnum,
  TCommitPromptMessagesEnum extends
    CommitPromptMessagesEnum = CommitPromptMessagesEnum,
  TCommitSettingsEnum extends CommitSettingsEnum = CommitSettingsEnum
> = CommitState<
  MonorepoCommitQuestionAnswers<TCommitQuestionEnum>,
  MonorepoCommitResolvedConfig<
    TCommitQuestionEnum,
    TCommitPromptMessagesEnum,
    TCommitSettingsEnum
  >
> & {
  variant: "monorepo";
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
