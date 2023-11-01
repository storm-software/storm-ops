import importFrom from "import-from";
import { isUndefined } from "lodash-es";
import { dirname } from "node:path";
import { RELEASE_TYPES } from "../constants";
import { getWorkspaceRoot } from "./utils";

export const loadReleaseRules = async ({ releaseRules }, { cwd }) => {
  let loadedReleaseRules;
  const __dirname = dirname(getWorkspaceRoot());

  if (releaseRules) {
    loadedReleaseRules =
      typeof releaseRules === "string"
        ? importFrom.silent(__dirname, releaseRules) ||
          importFrom(cwd, releaseRules)
        : releaseRules;

    if (!Array.isArray(loadedReleaseRules)) {
      throw new TypeError(
        'Error in commit-analyzer configuration: "releaseRules" must be an array of rules'
      );
    }

    loadedReleaseRules.forEach(rule => {
      if (!rule || isUndefined(rule.release)) {
        throw new Error(
          'Error in commit-analyzer configuration: rules must be an object with a "release" property'
        );
      } else if (
        !RELEASE_TYPES.includes(rule.release) &&
        rule.release !== null &&
        rule.release !== false
      ) {
        throw new Error(
          `Error in commit-analyzer configuration: "${
            rule.release
          }" is not a valid release type. Valid values are: ${JSON.stringify(
            RELEASE_TYPES
          )}`
        );
      }
    });
  }

  return loadedReleaseRules;
};
