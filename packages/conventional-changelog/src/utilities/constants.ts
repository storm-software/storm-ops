/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { DEFAULT_COMMIT_TYPES } from "../commit-types";

export const CHANGELOG_COMMIT_TYPES_OBJECT = Object.freeze(
  Object.entries(DEFAULT_COMMIT_TYPES).reduce(
    (ret, [key, commitType]) => {
      ret[key] = {
        ...commitType.changelog,
        type: key,
        section: commitType.changelog?.title || commitType.title,
        hidden: commitType.changelog?.hidden
      };

      return ret;
    },
    {} as Record<
      string,
      {
        type: string;
        section: string;
        hidden: boolean | undefined;
      }
    >
  )
);

export const CHANGELOG_COMMIT_TYPES = [
  CHANGELOG_COMMIT_TYPES_OBJECT.feat!,
  CHANGELOG_COMMIT_TYPES_OBJECT.fix!,
  CHANGELOG_COMMIT_TYPES_OBJECT.chore!,
  CHANGELOG_COMMIT_TYPES_OBJECT.deps!,
  CHANGELOG_COMMIT_TYPES_OBJECT.docs!,
  CHANGELOG_COMMIT_TYPES_OBJECT.style!,
  CHANGELOG_COMMIT_TYPES_OBJECT.refactor!,
  CHANGELOG_COMMIT_TYPES_OBJECT.perf!,
  CHANGELOG_COMMIT_TYPES_OBJECT.build!,
  CHANGELOG_COMMIT_TYPES_OBJECT.ci!,
  CHANGELOG_COMMIT_TYPES_OBJECT.test!
] as const;

export const CHANGELOG_COMMIT_TYPE_ORDER = CHANGELOG_COMMIT_TYPES.map(
  entry => entry.type
);
export const CHANGELOG_COMMIT_SECTION_ORDER = CHANGELOG_COMMIT_TYPES.map(
  entry => entry.section
);

export const HASH_SHORT_LENGTH = 7;
export const HEADER_MAX_LENGTH = 100;

export const DATETIME_LENGTH = 10;
