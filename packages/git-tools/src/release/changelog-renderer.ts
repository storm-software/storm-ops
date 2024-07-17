import { existsSync } from "node:fs";
import axios from "axios";
import type { ChangelogRenderer } from "nx/release/changelog-renderer/index.js";
import type { GitCommit } from "nx/src/command-line/release/utils/git.js";
import {
  formatReferences,
  type RepoSlug
} from "nx/src/command-line/release/utils/github.js";
import { getCommitsRelevantToProjects } from "nx/src/command-line/release/utils/shared.js";
import type { ProjectConfiguration } from "nx/src/devkit-exports.js";
import { major } from "semver";

/**
 * The specific options available to the default implementation of the ChangelogRenderer that nx exports
 * for the common case.
 */
export interface StormChangelogRenderOptions extends Record<string, unknown> {
  /**
   * Whether or not the commit authors should be added to the bottom of the changelog in a "Thank You"
   * section. Defaults to true.
   */
  authors?: boolean;
  /**
   * Whether or not the commit references (such as commit and/or PR links) should be included in the changelog.
   * Defaults to true.
   */
  commitReferences?: boolean;
  /**
   * Whether or not to include the date in the version title. It can be set to false to disable it, or true to enable
   * with the default of (YYYY-MM-DD). Defaults to true.
   */
  versionTitleDate?: boolean;
}

/**
 * The Storm ChangelogRenderer for generating markdown from the given commits and other metadata.
 */
export const changelogRenderer: ChangelogRenderer = async ({
  projectGraph,
  commits = [],
  releaseVersion,
  project,
  entryWhenNoChanges,
  changelogRenderOptions,
  repoSlug
}): Promise<string> => {
  const markdownLines = [] as string[];
  const breakingChanges = [] as string[];

  const commitTypes = {
    feat: { title: "Features" },
    perf: { title: "Performance" },
    fix: { title: "Bug Fixes" },
    refactor: { title: "Refactoring" },
    docs: { title: "Documentation" },
    deps: { title: "Dependency Upgrades" },
    types: { title: "Type Definitions" },
    chore: { title: "Chore" },
    examples: { title: "Examples" },
    test: { title: "Tests" },
    style: { title: "Styling" },
    ci: { title: "Continuous Integration" },
    revert: { title: "Revert" }
  } as Record<string, { title: string }>;

  // If the current range of commits contains both a commit and its revert, we strip them both from the final list
  for (const commit of commits) {
    if (commit.type === "revert") {
      for (const revertedHash of commit.revertedHashes) {
        const revertedCommit = commits.find(c =>
          revertedHash.startsWith(c.shortHash)
        );
        if (revertedCommit) {
          commits.splice(commits.indexOf(revertedCommit), 1);
          commits.splice(commits.indexOf(commit), 1);
        }
      }
    }
  }

  // workspace root level changelog
  if (project === null) {
    // No changes for the workspace
    if (commits.length === 0) {
      if (entryWhenNoChanges) {
        markdownLines.push(
          "",
          `${await createVersionTitle(
            releaseVersion,
            changelogRenderOptions
          )}\n${entryWhenNoChanges}`,
          ""
        );
      }
      return markdownLines.join("\n").trim();
    }

    const typeGroups = groupBy(commits, "type");

    markdownLines.push(
      "",
      await createVersionTitle(
        releaseVersion,
        changelogRenderOptions,
        project,
        project ? projectGraph.nodes[project]?.data : null
      ),
      ""
    );

    for (const type of Object.keys(commitTypes)) {
      const group = typeGroups[type];
      if (!group || group.length === 0) {
        continue;
      }

      markdownLines.push("", `### ${commitTypes[type]?.title}`, "");

      /**
       * In order to make the final changelog most readable, we organize commits as follows:
       * - By scope, where scopes are in alphabetical order (commits with no scope are listed first)
       * - Within a particular scope grouping, we list commits in chronological order
       */
      const commitsInChronologicalOrder = group.reverse();
      const commitsGroupedByScope = groupBy(
        commitsInChronologicalOrder,
        "scope"
      );
      const scopesSortedAlphabetically = Object.keys(
        commitsGroupedByScope
      ).sort();

      for (const scope of scopesSortedAlphabetically) {
        const commits = commitsGroupedByScope[scope];
        for (const commit of commits) {
          const line = formatCommit(commit, changelogRenderOptions, repoSlug);
          markdownLines.push(line);
          if (commit.isBreaking) {
            const breakingChangeExplanation = extractBreakingChangeExplanation(
              commit.body
            );
            breakingChanges.push(
              breakingChangeExplanation
                ? `- ${
                    commit.scope ? `**${commit.scope.trim()}:** ` : ""
                  }${breakingChangeExplanation}`
                : line
            );
          }
        }
      }
    }
  } else {
    // project level changelog
    const relevantCommits = await getCommitsRelevantToProjects(
      projectGraph,
      commits,
      [project]
    );

    // Generating for a named project, but that project has no relevant changes in the current set of commits, exit early
    if (relevantCommits.length === 0) {
      if (entryWhenNoChanges) {
        markdownLines.push(
          "",
          `${await createVersionTitle(
            releaseVersion,
            changelogRenderOptions,
            project,
            projectGraph.nodes[project]?.data
          )}\n${entryWhenNoChanges}`,
          ""
        );
      }
      return markdownLines.join("\n").trim();
    }

    markdownLines.push(
      "",
      await createVersionTitle(
        releaseVersion,
        changelogRenderOptions,
        project,
        projectGraph.nodes[project]?.data
      ),
      ""
    );

    const typeGroups = groupBy(
      // Sort the relevant commits to have the unscoped commits first, before grouping by type
      relevantCommits.sort((a, b) => (b.scope ? 1 : 0) - (a.scope ? 1 : 0)),
      "type"
    );
    for (const type of Object.keys(commitTypes)) {
      const group = typeGroups[type];
      if (!group || group.length === 0) {
        continue;
      }

      markdownLines.push("", `### ${commitTypes?.[type]?.title}`, "");

      const commitsInChronologicalOrder = group.reverse();
      for (const commit of commitsInChronologicalOrder) {
        const line = formatCommit(commit, changelogRenderOptions, repoSlug);
        markdownLines.push(`${line}\n`);
        if (commit.isBreaking) {
          const breakingChangeExplanation = extractBreakingChangeExplanation(
            commit.body
          );
          breakingChanges.push(
            breakingChangeExplanation
              ? `- ${
                  commit.scope ? `**${commit.scope.trim()}:** ` : ""
                }${breakingChangeExplanation}`
              : line
          );
        }
      }
    }
  }

  if (breakingChanges.length > 0) {
    markdownLines.push("", "#### Breaking Changes", "", ...breakingChanges);
  }

  if (changelogRenderOptions.authors) {
    const _authors = new Map<string, { email: Set<string>; github?: string }>();
    for (const commit of commits) {
      if (!commit.author) {
        continue;
      }

      const name = commit.author.name
        .split(" ")
        .map(p => p.trim())
        .join(" ");
      if (!name || name.includes("[bot]")) {
        continue;
      }

      if (_authors.has(name)) {
        const entry = _authors.get(name);
        entry?.email.add(commit.author.email);
      } else {
        _authors.set(name, { email: new Set([commit.author.email]) });
      }
    }

    // Try to map authors to github usernames
    if (repoSlug) {
      await Promise.all(
        [..._authors.keys()].map(async authorName => {
          const meta = _authors.get(authorName);
          if (meta) {
            for (const email of meta.email) {
              // For these pseudo-anonymized emails we can just extract the Github username from before the @
              // It could either be in the format: username@ or github_id+username@
              if (email.endsWith("@users.noreply.github.com")) {
                const match = email.match(
                  /^(\d+\+)?([^@]+)@users\.noreply\.github\.com$/
                );
                if (match?.[2]) {
                  meta.github = match[2];
                  break;
                }
              }

              // Look up any other emails against the ungh.cc API
              const { data } = await axios
                .get<
                  any,
                  { data?: { user?: { username: string } } }
                >(`https://ungh.cc/users/find/${email}`)
                .catch(() => ({ data: { user: null } }));
              if (data?.user) {
                meta.github = data.user.username;
                break;
              }
            }
          }
        })
      );
    }

    const authors = [..._authors.entries()].map(e => ({
      name: e[0],
      ...e[1]
    }));

    if (authors.length > 0) {
      markdownLines.push(
        "",
        "### " + "Thank you to our wonderful contributors",
        "",
        ...authors
          // Sort the contributors by name
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(i => {
            // Tag the author's Github username if we were able to resolve it so that Github adds them as a contributor
            const github = i.github ? ` @${i.github}` : "";
            return `- ${i.name}${github}`;
          })
      );
    }
  }

  return markdownLines.join("\n").trim();
};

export default changelogRenderer;

function groupBy(items: any[], key: string) {
  const groups = {} as Record<string, any>;
  for (const item of items) {
    groups[item[key]] = groups[item[key]] || [];
    groups[item[key]].push(item);
  }
  return groups;
}

function formatCommit(
  commit: GitCommit,
  changelogRenderOptions: StormChangelogRenderOptions,
  repoSlug?: RepoSlug
): string {
  let commitLine = `- ${commit.isBreaking ? "⚠️  " : ""}${
    commit.scope ? `**${commit.scope.trim()}:** ` : ""
  }${commit.description}`;
  if (repoSlug && changelogRenderOptions.commitReferences) {
    commitLine += formatReferences(commit.references, repoSlug);
  }
  return commitLine;
}

/**
 * It is common to add further information about a breaking change in the commit body,
 * and it is naturally that information that should be included in the BREAKING CHANGES
 * section of changelog, rather than repeating the commit title/description.
 */
function extractBreakingChangeExplanation(message: string): string | null {
  const breakingChangeIdentifier = "BREAKING CHANGE:";
  const startIndex = message.indexOf(breakingChangeIdentifier);

  if (startIndex === -1) {
    // "BREAKING CHANGE:" not found in the message
    return null;
  }

  const startOfBreakingChange = startIndex + breakingChangeIdentifier.length;
  const endOfBreakingChange = message.indexOf("\n", startOfBreakingChange);

  if (endOfBreakingChange === -1) {
    // No newline character found, extract till the end of the message
    return message.substring(startOfBreakingChange).trim();
  }

  // Extract and return the breaking change message
  return message.substring(startOfBreakingChange, endOfBreakingChange).trim();
}

async function createVersionTitle(
  version: string,
  changelogRenderOptions: StormChangelogRenderOptions,
  projectName?: string | null,
  projectConfig?: ProjectConfiguration | null
) {
  let previousVersion!: string;
  if (projectConfig && projectName && existsSync(projectConfig.root)) {
    const packageJson = await require(`${projectConfig.root}/package.json`);
    previousVersion = packageJson.version;
  }

  // Normalize by removing any leading `v` during comparison
  const isMajorVersion = `${major(version)}.0.0` === version.replace(/^v/, "");
  let maybeDateStr = "";
  if (changelogRenderOptions.versionTitleDate) {
    // MM-DD-YYYY
    maybeDateStr = ` (${new Date().getMonth()}-${new Date().getDay()}-${new Date().getFullYear()})`;
  }

  if (
    previousVersion &&
    previousVersion !== version.replace(/^v/, "") &&
    process.env.STORM_REPOSITORY
  ) {
    if (isMajorVersion) {
      return `# [${version}](${process.env.STORM_REPOSITORY}/compare/${projectName}-${version}...v${previousVersion})${maybeDateStr}`;
    }
    return `## [${version}](${process.env.STORM_REPOSITORY}/compare/${projectName}-${version}...v${previousVersion})${maybeDateStr}`;
  }

  if (isMajorVersion) {
    return `# ${version}${maybeDateStr}`;
  }
  return `## ${version}${maybeDateStr}`;
}
