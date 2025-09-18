import { DEFAULT_COMMIT_TYPES } from "../commit-types";
import { CHANGELOG_COMMIT_TYPES } from "../utilities/constants";
import { CommitlintRulesEnum } from "./commitlint";
import { CommitsConfig, ParserConfig, WhatBumpFunction } from "./config";
import { WriteConfig } from "./write";

export interface ConventionalChangelogPreset {
  commits: CommitsConfig;
  parser: ParserConfig;
  writer: WriteConfig;
  whatBump: WhatBumpFunction;
}

export interface Preset extends ConventionalChangelogPreset {
  commits: CommitsConfig;
  parser: ParserConfig;
  writer: WriteConfig;
  whatBump: WhatBumpFunction;
}

interface ChangelogProps {
  ignoreCommits?: string[];
  types: typeof CHANGELOG_COMMIT_TYPES;
  bumpStrict: boolean;
  scope?: string[];
  scopeOnly: boolean;
}

interface ChangelogConfig {
  props: ChangelogProps;
}

export interface CommitlintSettings {
  enableMultipleScopes: boolean;
  disableEmoji: boolean;
  breakingChangePrefix: string;
  closedIssuePrefix: string;
  format: string;
}

export interface CommitlintConfig {
  helpUrl: string;
  rules: CommitlintRulesEnum;
  regex: RegExp;
  settings: CommitlintSettings;
}

export interface Preset extends ConventionalChangelogPreset {
  types: typeof DEFAULT_COMMIT_TYPES;
  changelogs: ChangelogConfig;
  commitlint: CommitlintConfig;
}
