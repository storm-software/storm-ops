import type { StormWorkspaceConfig } from "@storm-software/config";
import { getWorkspaceConfig } from "@storm-software/config-tools";
import axios from "axios";
import DefaultChangelogRenderer, {
  DefaultChangelogRenderOptions,
  DependencyBump
} from "nx/release/changelog-renderer";
import { ChangelogChange } from "nx/src/command-line/release/changelog";
import { NxReleaseConfig } from "nx/src/command-line/release/config/config";
import { DEFAULT_CONVENTIONAL_COMMITS_CONFIG } from "nx/src/command-line/release/config/conventional-commits";
import { GithubRemoteReleaseClient } from "nx/src/command-line/release/utils/remote-release-clients/github";
import { major } from "semver";
import { generateChangelogTitle } from "../utilities/changelog-utils";
import { GithubRepoData } from "./github";

// axios types and values don't seem to match
// import _axios = require("axios");
// const axios = _axios as any as (typeof _axios)["default"];

export interface StormChangelogRenderOptions {
  changes: ChangelogChange[];
  changelogEntryVersion: string;
  project: string | null;
  entryWhenNoChanges: string | false;
  isVersionPlans: boolean;
  changelogRenderOptions: DefaultChangelogRenderOptions;
  dependencyBumps?: DependencyBump[];
  repoData: GithubRepoData | null;
  conventionalCommitsConfig: NxReleaseConfig["conventionalCommits"] | null;
  remoteReleaseClient: GithubRemoteReleaseClient;
}

export default class StormChangelogRenderer extends DefaultChangelogRenderer {
  /**
   * The Storm workspace configuration object, which is loaded from the storm-workspace.json file.
   */
  protected workspaceConfig: StormWorkspaceConfig | null = null;

  /**
   * The configuration object for the ChangelogRenderer, which includes the changes, version, project, and other options.
   */
  protected config: StormChangelogRenderOptions;

  /**
   * A ChangelogRenderer class takes in the determined changes and other relevant metadata and returns a string, or a Promise of a string of changelog contents (usually markdown).
   *
   * @param config - The configuration object for the ChangelogRenderer
   */
  constructor(config: Omit<StormChangelogRenderOptions, "repoData">) {
    super(config);

    this.config = {
      ...config,
      repoData: config.remoteReleaseClient.getRemoteRepoData()
    };
  }

  override async render(): Promise<string> {
    this.workspaceConfig = await getWorkspaceConfig();

    return await super.render();
  }

  protected override preprocessChanges(): void {
    this.relevantChanges = [...this.changes];
    this.breakingChanges = [];
    this.additionalChangesForAuthorsSection = [];

    // Filter out reverted changes
    for (let i = this.relevantChanges.length - 1; i >= 0; i--) {
      const change = this.relevantChanges[i];
      if (change && change.type === "revert" && change.revertedHashes) {
        for (const revertedHash of change.revertedHashes) {
          const revertedCommitIndex = this.relevantChanges.findIndex(
            c => c.shortHash && revertedHash.startsWith(c.shortHash)
          );
          if (revertedCommitIndex !== -1) {
            this.relevantChanges.splice(revertedCommitIndex, 1);
            this.relevantChanges.splice(i, 1);
            i--;
            break;
          }
        }
      }
    }

    if (this.isVersionPlans) {
      this.conventionalCommitsConfig = {
        types: {
          feat: DEFAULT_CONVENTIONAL_COMMITS_CONFIG.types.feat,
          fix: DEFAULT_CONVENTIONAL_COMMITS_CONFIG.types.fix
        }
      };

      for (let i = this.relevantChanges.length - 1; i >= 0; i--) {
        if (this.relevantChanges[i]?.isBreaking) {
          const change = this.relevantChanges[i];
          if (change) {
            this.additionalChangesForAuthorsSection.push(change);
            const line = this.formatChange(change);
            this.breakingChanges.push(line);
            this.relevantChanges.splice(i, 1);
          }
        }
      }
    } else {
      for (const change of this.relevantChanges) {
        if (change.isBreaking) {
          const breakingChangeExplanation = change.body
            ? this.extractBreakingChangeExplanation(change.body)
            : "";

          // If the change has a body, we try to extract a more detailed explanation
          this.breakingChanges.push(
            breakingChangeExplanation
              ? `- ${
                  change.scope ? `**${change.scope.trim()}:** ` : ""
                }${breakingChangeExplanation}`
              : this.formatChange(change)
          );
        }
      }
    }
  }

  /**
   * Determines if the changelog entry should be rendered as empty. This is the case when there are no relevant changes, breaking changes, or dependency bumps.
   */
  // protected override shouldRenderEmptyEntry(): boolean {
  //   return true;
  // }

  protected override renderVersionTitle(): string {
    const isMajorVersion =
      `${major(this.changelogEntryVersion)}.0.0` ===
      this.changelogEntryVersion.replace(/^v/, "");

    return isMajorVersion
      ? `# ${generateChangelogTitle(this.changelogEntryVersion, this.project!, this.workspaceConfig)}`
      : `## ${generateChangelogTitle(this.changelogEntryVersion, this.project!, this.workspaceConfig)}`;
  }

  protected override renderBreakingChanges(): string[] {
    return [
      "### Breaking Changes",
      "",
      ...Array.from(new Set(this.breakingChanges))
    ];
  }

  protected override renderDependencyBumps(): string[] {
    const markdownLines = ["", "### Updated Dependencies", ""];
    this.dependencyBumps?.forEach(({ dependencyName, newVersion }) => {
      markdownLines.push(`- Updated ${dependencyName} to ${newVersion}`);
    });

    return markdownLines;
  }

  protected override async renderAuthors(): Promise<string[]> {
    const markdownLines: string[] = [];
    const _authors = new Map<string, { email: Set<string>; github?: string }>();

    for (const change of [
      ...this.relevantChanges,
      ...this.additionalChangesForAuthorsSection
    ]) {
      if (!change.authors) {
        continue;
      }
      for (const author of change.authors) {
        const name = this.formatName(author.name);
        if (
          !name ||
          name.includes("[bot]") ||
          name === this.workspaceConfig?.bot.name
        ) {
          continue;
        }

        if (_authors.has(name)) {
          const entry = _authors.get(name);
          entry?.email.add(author.email);
        } else {
          _authors.set(name, { email: new Set([author.email]) });
        }
      }
    }

    if (
      this.config.repoData &&
      this.changelogRenderOptions.mapAuthorsToGitHubUsernames
    ) {
      await Promise.all(
        [..._authors.keys()].map(async authorName => {
          const meta = _authors.get(authorName);
          if (!meta) {
            return;
          }

          for (const email of meta.email) {
            if (email.endsWith("@users.noreply.github.com")) {
              const match = email.match(
                /^(\d+\+)?([^@]+)@users\.noreply\.github\.com$/
              );
              if (match && match[2]) {
                meta.github = match[2];
                break;
              }
            }

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
        "### " + "❤️ Thank You",
        "",
        ...authors
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(i => {
            const github = i.github ? ` @${i.github}` : "";
            return `- ${i.name}${github}`;
          })
      );
    }

    return markdownLines;
  }

  protected override formatChange(change: ChangelogChange): string {
    let description = change.description || "";
    let extraLines = [] as string[];
    let extraLinesStr = "";
    if (description.includes("\n")) {
      const lines = description.split("\n");
      if (lines.length > 1) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        description = lines[0]!;
        extraLines = lines.slice(1);
      }

      const indentation = "  ";
      extraLinesStr = extraLines
        .filter(l => l.trim().length > 0)
        .map(l => `${indentation}${l}`)
        .join("\n");
    }

    let changeLine =
      "- " +
      (!this.isVersionPlans && change.scope
        ? `**${change.scope.trim()}:** `
        : "") +
      description;
    if (this.config.repoData && change.githubReferences) {
      changeLine += this.remoteReleaseClient.formatReferences(
        change.githubReferences
      );
    }

    if (extraLinesStr) {
      changeLine += "\n\n" + extraLinesStr;
    }

    return changeLine;
  }
}
