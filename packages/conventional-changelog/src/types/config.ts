import { StormWorkspaceConfig } from "@storm-software/config/types";

export type ChangelogCommitType = Record<
  string,
  {
    type: string;
    title: string;
    hidden: boolean | undefined;
  }
>;

export interface ChangelogCommitGroupType {
  type: string;
  section: string;
  hidden?: boolean;
}

export interface PresetConfig {
  ignoreCommits?: string[];
  issuePrefixes?: string[];
  types?: ChangelogCommitType;
  bumpStrict?: boolean;
  scope?: string | string[];
  issueUrlFormat?: string;
  preMajor?: boolean;
  formatDate?: (date: string | Date) => string;
}

export interface ResolvedPresetOptions {
  workspace: StormWorkspaceConfig;
  ignoreCommits?: string[];
  issuePrefixes: string[];
  types: ChangelogCommitType;
  bumpStrict: boolean;
  scope?: string | string[];
  issueUrlFormat: string;
  commitUrlFormat: string;
  compareUrlFormat: string;
  userUrlFormat: string;
  preMajor: boolean;
  formatDate: (date: string | Date) => string;
}

export interface CommitsConfig {
  ignore?: string[];
  merges: boolean;
}

export type WhatBumpFunction = (
  commits: {
    type: string;
    scope?: string | undefined;
    notes: { title: string }[];
  }[]
) => { level: number; reason: string } | null;

export interface WhatBumpConfig {
  types: ChangelogCommitType;
  bumpStrict?: boolean;
}

export interface ParserConfig {
  headerPattern?: RegExp;
  headerCorrespondence?: string[];
  breakingHeaderPattern?: RegExp;
  noteKeywords?: string[];
  revertPattern?: RegExp;
  revertCorrespondence?: string[];
  issuePrefixes?: string[];
  mergePattern?: RegExp;
  mergeCorrespondence?: string[];
}
