/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { COMMIT_TYPES } from "@storm-software/git-tools/types";

export const DEFAULT_COMMIT_TYPES = Object.entries(COMMIT_TYPES).reduce(
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

export const COMMIT_ORDER = [
  DEFAULT_COMMIT_TYPES.feat!,
  DEFAULT_COMMIT_TYPES.fix!,
  DEFAULT_COMMIT_TYPES.chore!,
  DEFAULT_COMMIT_TYPES.deps!,
  DEFAULT_COMMIT_TYPES.docs!,
  DEFAULT_COMMIT_TYPES.style!,
  DEFAULT_COMMIT_TYPES.refactor!,
  DEFAULT_COMMIT_TYPES.perf!,
  DEFAULT_COMMIT_TYPES.build!,
  DEFAULT_COMMIT_TYPES.ci!,
  DEFAULT_COMMIT_TYPES.test!
] as const;

export const COMMIT_TYPE_ORDER = COMMIT_ORDER.map(entry => entry.type);
export const COMMIT_TITLE_ORDER = COMMIT_ORDER.map(entry => entry.title);

export const HASH_SHORT_LENGTH = 7;
export const HEADER_MAX_LENGTH = 100;

export const DATETIME_LENGTH = 10;
