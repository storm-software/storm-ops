import { ResolvedPresetOptions, WhatBumpFunction } from "./types/config";
import { CHANGELOG_COMMIT_TYPES } from "./utilities/constants";
import { matchScope } from "./utilities/helpers";

export function createWhatBump(
  options: ResolvedPresetOptions
): WhatBumpFunction {
  const hiddenTypes = options.bumpStrict
    ? CHANGELOG_COMMIT_TYPES.reduce((hiddenTypes, type) => {
        if (type.hidden) {
          hiddenTypes.push(type.type);
        }

        return hiddenTypes;
      }, [] as string[])
    : [];

  return function whatBump(commits) {
    let level = 2;
    let breakings = 0;
    let features = 0;
    let bugfixes = 0;

    commits.forEach(commit => {
      if (!matchScope(options, commit)) {
        return;
      }

      if (commit.notes.length > 0) {
        breakings += commit.notes.length;
        level = 0;
      } else if (commit.type === "feat" || commit.type === "feature") {
        features += 1;

        if (level === 2) {
          level = 1;
        }
      } else if (options.bumpStrict && !hiddenTypes.includes(commit.type)) {
        bugfixes += 1;
      }
    });

    if (options?.preMajor && level < 2) {
      level++;
    } else if (
      options.bumpStrict &&
      level === 2 &&
      !breakings &&
      !features &&
      !bugfixes
    ) {
      return null;
    }

    return {
      level,
      reason:
        breakings === 1
          ? `There is ${breakings} BREAKING CHANGE and ${features} features`
          : `There are ${breakings} BREAKING CHANGES and ${features} features`
    };
  };
}
