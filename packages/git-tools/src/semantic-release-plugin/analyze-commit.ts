/* eslint-disable @typescript-eslint/no-unused-vars */
import { isMatchWith, isString } from "lodash-es";
import micromatch from "micromatch";
import { RELEASE_TYPES } from "../constants";
import { compareReleaseTypes } from "./compare-release-types";

export const analyzeCommit = (releaseRules, commit) => {
  let releaseType;

  releaseRules
    .filter(
      ({ breaking, revert, release, ...rule }) =>
        // If the rule is not `breaking` or the commit doesn't have a breaking change note
        (!breaking || (commit.notes && commit.notes.length > 0)) &&
        // If the rule is not `revert` or the commit is not a revert
        (!revert || commit.revert) &&
        // Otherwise match the regular rules
        isMatchWith(commit, rule, (object, src) =>
          isString(src) && isString(object)
            ? micromatch.isMatch(object, src)
            : undefined
        )
    )
    .every(match => {
      if (compareReleaseTypes(releaseType, match.release)) {
        releaseType = match.release;
        console.debug(
          "The rule %o match commit with release type %o",
          match,
          releaseType
        );
        if (releaseType === RELEASE_TYPES[0]) {
          console.debug(
            "Release type %o is the highest possible. Stop analysis.",
            releaseType
          );
          return false;
        }
      } else {
        console.debug(
          "The rule %o match commit with release type %o but the higher release type %o has already been found for this commit",
          match,
          match.release,
          releaseType
        );
      }

      return true;
    });

  return releaseType;
};
