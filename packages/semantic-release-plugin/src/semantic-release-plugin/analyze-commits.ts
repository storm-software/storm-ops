/* eslint-disable @typescript-eslint/no-explicit-any */

import filter from "conventional-commits-filter";
import { sync as parser } from "conventional-commits-parser";
import { PluginFn } from "semantic-release-plugin-decorators";
import { DEFAULT_RELEASE_RULES, RELEASE_TYPES } from "../constants";
import { analyzeCommit } from "./analyze-commit";
import { compareReleaseTypes } from "./compare-release-types";
import { filterCommits } from "./get-commits-for-project";
import { loadParserConfig } from "./load-parser-config";
import { loadReleaseRules } from "./load-release-rules";

export const analyzeCommitsForProject =
  (verbose?: boolean) =>
  (_plugin: PluginFn) =>
  async (config: any, context: any) => {
    console.log("analyzeCommitsForProject");
    console.log(config);
    console.log(context);

    if (!config) {
      throw new Error("Release context is missing.");
    }

    if (!context.commits) {
      throw new Error("Commits are missing.");
    }

    const filteredCommits = await filterCommits(
      context.commits,
      config,
      context,
      verbose
    );

    return analyzeCommits(
      {
        preset: "conventionalcommits",
        // JSON Schema: https://github.com/conventional-changelog/conventional-changelog-config-spec/blob/master/versions/2.0.0/schema.json
        presetConfig: {
          header: "# ${PROJECT_NAME} v${version} Changelog\n\n",
          preMajor: process.env.CI_PRE_MAJOR,
          releaseCommitMessageFormat:
            "chore(${PROJECT_NAME}): Changelogs generated for v${nextRelease.version}\n\n${nextRelease.notes}"
        },
        releaseRules: [{ type: "refactor", release: "patch" }],
        ...config
      },
      {
        ...context,
        commits: filteredCommits
      }
    );
  };

const analyzeCommits = async (pluginConfig: any, context: any) => {
  const { commits } = context;
  if (!commits || !commits.length) {
    console.log("No commits found, skipping analysis");
    return null;
  }

  const releaseRules = await loadReleaseRules(pluginConfig, context);
  const config = await loadParserConfig(pluginConfig, context);
  let releaseType = null;

  filter(
    commits
      .filter(({ message, hash }) => {
        if (!message.trim()) {
          console.debug("Skip commit %s with empty message", hash);
          return false;
        }

        return true;
      })
      .map(({ message, ...commitProps }) => ({
        rawMsg: message,
        message,
        ...commitProps,
        ...parser(message, config)
      }))
  ).every(({ rawMsg, ...commit }) => {
    console.log(`Analyzing commit: %s`, rawMsg);
    let commitReleaseType;

    // Determine release type based on custom releaseRules
    if (releaseRules) {
      console.debug("Analyzing with custom rules");
      commitReleaseType = analyzeCommit(releaseRules, commit);
    }

    // If no custom releaseRules or none matched the commit, try with default releaseRules
    if (commitReleaseType === null || commitReleaseType === undefined) {
      console.debug("Analyzing with default rules");
      commitReleaseType = analyzeCommit(DEFAULT_RELEASE_RULES, commit);
    }

    if (commitReleaseType) {
      console.log("The release type for the commit is %s", commitReleaseType);
    } else {
      console.log("The commit should not trigger a release");
    }

    // Set releaseType if commit's release type is higher
    if (
      commitReleaseType &&
      compareReleaseTypes(releaseType, commitReleaseType)
    ) {
      releaseType = commitReleaseType;
    }

    // Break loop if releaseType is the highest
    if (releaseType === RELEASE_TYPES[0]) {
      return false;
    }

    return true;
  });
  console.log(
    "Analysis of %s commits complete: %s release",
    commits.length,
    releaseType || "no"
  );

  return releaseType;
};
