/* eslint-disable @typescript-eslint/no-explicit-any */

import { PluginFn } from "semantic-release-plugin-decorators";
import { filterCommits } from "./get-commits-for-project";

export const analyzeCommitsForProject =
  (verbose?: boolean) =>
  (_plugin: PluginFn) =>
  async (config: any, context: any) => {
    if (!config) {
      throw new Error("Release config is missing.");
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
    if (!filteredCommits || filteredCommits.length === 0) {
      context.logger.warn(
        `No commits found for the ${config.projectName} package. Skip analysis.`
      );
    }

    const releaseRules = (config.releaseRules ?? []).reduce(
      (ret: Array<{ type: string; release: string }>, rule: any) => {
        if (
          !ret.some(
            r =>
              r.type?.toLowerCase()?.trim() === rule.type?.toLowerCase()?.trim()
          )
        ) {
          ret.push(rule);
        }

        return ret;
      },
      [{ type: "refactor", release: "patch" }]
    );

    return _plugin(
      {
        ...config,
        preset: "conventionalcommits",
        // JSON Schema: https://github.com/conventional-changelog/conventional-changelog-config-spec/blob/master/versions/2.0.0/schema.json
        presetConfig: {
          ...config.presetConfig,
          header: "# ${PROJECT_NAME} v${version} Changelog\n\n",
          preMajor: process.env.CI_PRE_MAJOR,
          releaseCommitMessageFormat:
            "chore(${PROJECT_NAME}): Changelogs generated for v${nextRelease.version}\n\n${nextRelease.notes}"
        },
        releaseRules
      },
      {
        ...context,
        commits: filteredCommits
      }
    );
  };
