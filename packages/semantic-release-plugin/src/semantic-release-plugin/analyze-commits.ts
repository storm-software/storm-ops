/* eslint-disable @typescript-eslint/no-explicit-any */

import { PluginFn } from "semantic-release-plugin-decorators";
import { filterCommits } from "./get-commits-for-project";

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

    return _plugin(
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
