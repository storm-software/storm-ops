/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { COMMIT_TYPES } from "../commit-types";

export const CHANGELOG_COMMITS = Object.entries(COMMIT_TYPES).reduce(
  (ret, [key, commitType]) => {
    ret[key] = {
      ...commitType.changelog,
      type: key,
      title: commitType.changelog?.title || commitType.title,
      hidden: commitType.changelog?.hidden
    };

    return ret;
  },
  {} as Record<
    string,
    {
      type: string;
      title: string;
      hidden: boolean | undefined;
    }
  >
);

export const CHANGELOG_COMMIT_ORDER = [
  CHANGELOG_COMMITS.feat!,
  CHANGELOG_COMMITS.fix!,
  CHANGELOG_COMMITS.chore!,
  CHANGELOG_COMMITS.deps!,
  CHANGELOG_COMMITS.docs!,
  CHANGELOG_COMMITS.style!,
  CHANGELOG_COMMITS.refactor!,
  CHANGELOG_COMMITS.perf!,
  CHANGELOG_COMMITS.build!,
  CHANGELOG_COMMITS.ci!,
  CHANGELOG_COMMITS.test!
] as const;

export const CHANGELOG_COMMIT_TYPE_ORDER = CHANGELOG_COMMIT_ORDER.map(
  entry => entry.type
);
export const CHANGELOG_COMMIT_TITLE_ORDER = CHANGELOG_COMMIT_ORDER.map(
  entry => entry.title
);

export const HASH_SHORT_LENGTH = 7;
export const HEADER_MAX_LENGTH = 100;

export const DATETIME_LENGTH = 10;

export const MINIMAL_PARSER_DEFAULT_OPTIONS = {
  headerPattern: /^(\w*): (.*)$/,
  breakingHeaderPattern: /^(\w*): (.*)$/,
  headerCorrespondence: ["type", "subject"],
  noteKeywords: ["BREAKING CHANGE", "BREAKING-CHANGE"],
  revertPattern:
    /^(?:Revert|revert:)\s"?([\s\S]+?)"?\s*This reverts commit (\w*)\./i,
  revertCorrespondence: ["header", "hash"],
  issuePrefixes: ["#"]
};

export const MONOREPO_PARSER_DEFAULT_OPTIONS = {
  headerPattern: /^(\w*)(?:\((.*)\))!?: (.*)$/,
  breakingHeaderPattern: /^(\w*)(?:\((.*)\))!: (.*)$/,
  headerCorrespondence: ["type", "scope", "subject"],
  noteKeywords: ["BREAKING CHANGE", "BREAKING-CHANGE"],
  revertPattern:
    /^(?:Revert|revert:)\s"?([\s\S]+?)"?\s*This reverts commit (\w*)\./i,
  revertCorrespondence: ["header", "hash"],
  issuePrefixes: ["#"]
};
