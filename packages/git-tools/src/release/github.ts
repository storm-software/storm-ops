/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { joinPathFragments, output } from "@nx/devkit";
import { StormWorkspaceConfig } from "@storm-software/config/types";
import type { AxiosRequestConfig } from "axios";
import axios from "axios";
import { prompt } from "enquirer";
import { execSync } from "node:child_process";
import { existsSync, promises as fsp } from "node:fs";
import { homedir } from "node:os";
import { ResolvedCreateRemoteReleaseProvider } from "nx/src/command-line/release/config/config";
import { printDiff } from "nx/src/command-line/release/utils/print-changes";
import {
  defaultCreateReleaseProvider,
  GithubRemoteReleaseClient
} from "nx/src/command-line/release/utils/remote-release-clients/github";
import { RemoteRepoData } from "nx/src/command-line/release/utils/remote-release-clients/remote-release-client";
import {
  noDiffInChangelogMessage,
  ReleaseVersion
} from "nx/src/command-line/release/utils/shared";
import { NxReleaseChangelogConfiguration } from "nx/src/config/nx-json";
import { parse } from "yaml";
import { generateChangelogTitle } from "../utilities/changelog-utils";
import { titleCase } from "../utilities/title-case";

/**
 * Extended {@link GithubRemoteReleaseClient} with Storm Software specific release APIs
 */
export class StormGithubRemoteReleaseClient extends GithubRemoteReleaseClient {
  #remoteRepoData: RemoteRepoData | null;
  #workspaceConfig: StormWorkspaceConfig;

  /**
   * Creates an instance of {@link StormGithubRemoteReleaseClient}.
   *
   * @param remoteRepoData - Data about the remote repository
   * @param createReleaseConfig - Configuration for creating releases
   * @param tokenData - Token data for authentication
   * @param workspaceConfig - The Storm workspace configuration object, which is loaded from the storm-workspace.json file.
   */
  public constructor(
    remoteRepoData: RemoteRepoData | null,
    createReleaseConfig: false | ResolvedCreateRemoteReleaseProvider,
    tokenData: {
      token: string;
      headerName: string;
    } | null,
    workspaceConfig: StormWorkspaceConfig
  ) {
    super(remoteRepoData, createReleaseConfig, tokenData);

    this.#remoteRepoData = remoteRepoData;
    this.#workspaceConfig = workspaceConfig;
  }

  /**
   * Creates or updates a GitHub release with Storm Software specific release notes formatting.
   *
   * @param releaseVersion - The version information for the release
   * @param changelogContents - The contents of the changelog for the release
   * @param latestCommit - The latest commit hash associated with the release
   * @param dryRun - Whether to perform a dry run without making actual changes
   */
  public override createOrUpdateRelease(
    releaseVersion: ReleaseVersion,
    changelogContents: string,
    latestCommit: string,
    { dryRun }: { dryRun: boolean }
  ): Promise<void> {
    if (!this.#workspaceConfig) {
      return this.createOrUpdateRelease(
        releaseVersion,
        changelogContents,
        latestCommit,
        { dryRun }
      );
    }

    const name = releaseVersion.gitTag.includes("@")
      ? releaseVersion.gitTag.replace(/@.*$/, "")
      : releaseVersion.gitTag;

    return super.createOrUpdateRelease(
      releaseVersion,
      `![${
        (typeof this.#workspaceConfig.release.banner === "string"
          ? this.#workspaceConfig.organization
            ? titleCase(
                typeof this.#workspaceConfig.organization === "string"
                  ? this.#workspaceConfig.organization
                  : this.#workspaceConfig.organization.name
              )
            : undefined
          : this.#workspaceConfig.release.banner.alt) || "Release banner header"
      }](${
        typeof this.#workspaceConfig.release.banner === "string"
          ? this.#workspaceConfig.release.banner
          : this.#workspaceConfig.release.banner?.url
      })
${this.#workspaceConfig.release.header || ""}

# ${name ? `${titleCase(name)} ` : ""}v${releaseVersion.rawVersion}

We at [${
        this.#workspaceConfig.organization
          ? titleCase(
              typeof this.#workspaceConfig.organization === "string"
                ? this.#workspaceConfig.organization
                : this.#workspaceConfig.organization.name
            )
          : ""
      }](${this.#workspaceConfig.homepage}) are very excited to announce the v${
        releaseVersion.rawVersion
      } release of the ${
        name
          ? this.#workspaceConfig.name
            ? `${titleCase(this.#workspaceConfig.name)} - ${titleCase(name)}`
            : titleCase(name)
          : this.#workspaceConfig.name
            ? titleCase(this.#workspaceConfig.name)
            : "Storm Software"
      } project! 🚀

These changes are released under the ${
        this.#workspaceConfig.license.includes("license")
          ? this.#workspaceConfig.license
          : `${this.#workspaceConfig.license} license`
      }. You can find more details on [our licensing page](${this.#workspaceConfig.licensing}). You can find guides, API references, and other documentation around this release (and much more) on [our documentation site](${
        this.#workspaceConfig.docs
      }).

If you have any questions or comments, feel free to reach out to the team on [Discord](${
        this.#workspaceConfig.socials.discord
      }) or [our contact page](${this.#workspaceConfig.contact}). Please help us spread the word by giving [this repository](https://github.com/${
        typeof this.#workspaceConfig.organization === "string"
          ? this.#workspaceConfig.organization
          : this.#workspaceConfig.organization?.name
      }/${this.#workspaceConfig.name}) a star ⭐ on GitHub or [posting on X (Twitter)](https://x.com/intent/tweet?text=Check%20out%20the%20latest%20@${
        this.#workspaceConfig.socials.twitter
      }%20release%20${
        name ? `${titleCase(name)?.replaceAll(" ", "%20")}%20` : ""
      }v${releaseVersion.rawVersion}%20%F0%9F%9A%80%0D%0A%0D%0Ahttps://github.com/${
        typeof this.#workspaceConfig.organization === "string"
          ? this.#workspaceConfig.organization
          : this.#workspaceConfig.organization?.name
      }/${this.#workspaceConfig.name}/releases/tag/${releaseVersion.gitTag}) about this release!

## Release Notes

${changelogContents
  .replaceAll(
    `## ${generateChangelogTitle(
      releaseVersion.rawVersion,
      name,
      this.#workspaceConfig
    )}`,
    ""
  )
  .replaceAll(
    `# ${generateChangelogTitle(releaseVersion.rawVersion, name, this.#workspaceConfig)}`,
    ""
  )}

---

${this.#workspaceConfig.release.footer}
`,
      latestCommit,
      { dryRun }
    );
  }

  /**
   * Get remote repository data, attempting to resolve it if not already set.
   */
  public override getRemoteRepoData<T extends RemoteRepoData>(): T | null {
    if (!this.#remoteRepoData) {
      let githubRepoData = super.getRemoteRepoData<T>();
      if (!githubRepoData) {
        githubRepoData = getGitHubRepoData() as T;
        if (!githubRepoData) {
          output.error({
            title: `Unable to create a GitHub release because the GitHub repo slug could not be determined.`,
            bodyLines: [
              `Please ensure you have a valid GitHub remote configured. You can run \`git remote -v\` to list your current remotes.`
            ]
          });
          process.exit(1);
        }
      }

      this.#remoteRepoData = githubRepoData;
    }

    return this.#remoteRepoData as T;
  }
}

export type RepoSlug = `${string}/${string}`;

interface GithubRequestConfig {
  repo: string;
  hostname: string;
  apiBaseUrl: string;
  token: string | null;
}

// https://docs.github.com/en/rest/releases/releases?apiVersion=2022-11-28#create-a-release--parameters
interface GithubRelease {
  id?: string;
  tag_name: string;
  target_commitish?: string;
  name?: string;
  body?: string;
  draft?: boolean;
  prerelease?: boolean;
  make_latest?: "legacy" | boolean;
}

export function getGitHubRepoData(
  remoteName = "origin",
  createReleaseConfig: NxReleaseChangelogConfiguration["createRelease"] = "github"
): RemoteRepoData | undefined {
  try {
    const remoteUrl = execSync(`git remote get-url ${remoteName}`, {
      encoding: "utf8",
      stdio: "pipe"
    }).trim();

    // Use the default provider (github.com) if custom one is not specified or releases are disabled
    let hostname = defaultCreateReleaseProvider.hostname;
    let apiBaseUrl = defaultCreateReleaseProvider.apiBaseUrl;
    if (createReleaseConfig && typeof createReleaseConfig !== "string") {
      hostname = createReleaseConfig.hostname;
      apiBaseUrl = createReleaseConfig.apiBaseUrl!;
    }

    // Extract the 'user/repo' part from the URL
    const escapedHostname = hostname.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regexString = `${escapedHostname}[/:]([\\w.-]+/[\\w.-]+)(\\.git)?`;
    const regex = new RegExp(regexString);
    const match = remoteUrl?.match(regex);

    if (match && match[1]) {
      return {
        hostname,
        apiBaseUrl,
        // Ensure any trailing .git is stripped
        slug: match[1].replace(/\.git$/, "") as RepoSlug
      };
    } else {
      throw new Error(
        `Could not extract "user/repo" data from the resolved remote URL: ${remoteUrl}`
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    output.error({
      title: `Failed to get GitHub repo data`,
      bodyLines: [error.message]
    });

    return undefined;
  }
}

export async function createOrUpdateGithubRelease(
  createReleaseConfig: NxReleaseChangelogConfiguration["createRelease"],
  releaseVersion: ReleaseVersion,
  changelogContents: string,
  latestCommit: string,
  { dryRun }: { dryRun: boolean }
): Promise<void> {
  const githubRepoData = getGitHubRepoData(undefined, createReleaseConfig);
  if (!githubRepoData) {
    output.error({
      title: `Unable to create a GitHub release because the GitHub repo slug could not be determined.`,
      bodyLines: [
        `Please ensure you have a valid GitHub remote configured. You can run \`git remote -v\` to list your current remotes.`
      ]
    });
    process.exit(1);
  }

  const tokenData = await resolveTokenData(githubRepoData.hostname);
  const githubRequestConfig: GithubRequestConfig = {
    repo: githubRepoData.slug,
    hostname: githubRepoData.hostname,
    apiBaseUrl: githubRepoData.apiBaseUrl,
    token: tokenData?.token || null
  };

  let existingGithubReleaseForVersion: GithubRelease | undefined;
  try {
    existingGithubReleaseForVersion = await getGithubReleaseByTag(
      githubRequestConfig,
      releaseVersion.gitTag
    );
  } catch (err) {
    if (err.response?.status === 401) {
      output.error({
        title: `Unable to resolve data via the GitHub API. You can use any of the following options to resolve this:`,
        bodyLines: [
          "- Set the `GITHUB_TOKEN` or `GH_TOKEN` environment variable to a valid GitHub token with `repo` scope",
          "- Have an active session via the official gh CLI tool (https://cli.github.com) in your current terminal"
        ]
      });
      process.exit(1);
    }
    if (err.response?.status === 404) {
      // No existing release found, this is fine
    } else {
      // Rethrow unknown errors for now
      throw err;
    }
  }

  const logTitle = `https://${githubRepoData.hostname}/${githubRepoData.slug}/releases/tag/${releaseVersion.gitTag}`;
  if (existingGithubReleaseForVersion) {
    console.error(`UPDATE ${logTitle}${dryRun ? " [dry-run]" : ""}`);
  } else {
    console.error(`CREATE ${logTitle}${dryRun ? " [dry-run]" : ""}`);
  }

  console.log("");
  printDiff(
    existingGithubReleaseForVersion?.body
      ? existingGithubReleaseForVersion.body
      : "",
    changelogContents,
    3,
    noDiffInChangelogMessage
  );

  if (!dryRun) {
    await createOrUpdateGithubReleaseInternal(
      githubRequestConfig,
      {
        version: releaseVersion.gitTag,
        prerelease: releaseVersion.isPrerelease,
        body: changelogContents,
        commit: latestCommit
      },
      existingGithubReleaseForVersion
    );
  }
}

interface GithubReleaseOptions {
  version: string;
  body: string;
  prerelease: boolean;
  commit: string;
}

async function createOrUpdateGithubReleaseInternal(
  githubRequestConfig: GithubRequestConfig,
  release: GithubReleaseOptions,
  existingGithubReleaseForVersion?: GithubRelease
) {
  const result = await syncGithubRelease(
    githubRequestConfig,
    release,
    existingGithubReleaseForVersion
  );

  /**
   * If something went wrong POSTing to Github we can still pre-populate the web form on github.com
   * to allow the user to manually complete the release if they so choose.
   */
  if (result.status === "manual") {
    if (result.error) {
      process.exitCode = 1;

      if (result.error.response?.data) {
        // There's a nicely formatted error from GitHub we can display to the user
        output.error({
          title: `A GitHub API Error occurred when creating/updating the release`,
          bodyLines: [
            `GitHub Error: ${JSON.stringify(result.error.response.data)}`,
            `---`,
            `Request Data:`,
            `Repo: ${githubRequestConfig.repo}`,
            `Token: ${githubRequestConfig.token}`,
            `Body: ${JSON.stringify(result.requestData)}`
          ]
        });
      } else {
        console.log(result.error);
        console.error(
          `An unknown error occurred while trying to create a release on GitHub, please report this on https://github.com/nrwl/nx (NOTE: make sure to redact your GitHub token from the error message!)`
        );
      }
    }

    const shouldContinueInGitHub = await promptForContinueInGitHub();
    if (!shouldContinueInGitHub) {
      return;
    }

    const open = require("open");
    await open(result.url)
      .then(() => {
        console.info(
          `\nFollow up in the browser to manually create the release:\n\n` +
            result.url +
            `\n`
        );
      })
      .catch(() => {
        console.info(
          `Open this link to manually create a release: \n` + result.url + "\n"
        );
      });

    /**
     * If something went wrong POSTing to Github we can still pre-populate the web form on github.com
     * to allow the user to manually complete the release.
     */

    if (result.error) {
      console.error(result.error);
      process.exitCode = 1;
    }

    await open(result.url)
      .then(() => {
        console.info(
          `Follow up in the browser to manually create the release.`
        );
      })
      .catch(() => {
        console.info(
          `Open this link to manually create a release: \n` + result.url + "\n"
        );
      });
  }
}

async function promptForContinueInGitHub(): Promise<boolean> {
  try {
    const reply = await prompt<{ open: "Yes" | "No" }>([
      {
        name: "open",
        message:
          "Do you want to finish creating the release manually in your browser?",
        type: "autocomplete",
        choices: [
          {
            name: "Yes",
            hint: "It will pre-populate the form for you"
          },
          {
            name: "No"
          }
        ],
        initial: 0
      }
    ]);
    return reply.open === "Yes";
  } catch {
    // Ensure the cursor is always restored before exiting
    process.stdout.write("\u001b[?25h");
    // Handle the case where the user exits the prompt with ctrl+c
    process.exit(1);
  }
}

async function syncGithubRelease(
  githubRequestConfig: GithubRequestConfig,
  release: GithubReleaseOptions,
  existingGithubReleaseForVersion?: GithubRelease
) {
  const ghRelease: GithubRelease = {
    tag_name: release.version,
    name: release.version,
    body: release.body,
    prerelease: release.prerelease,
    // legacy specifies that the latest release should be determined based on the release creation date and higher semantic version.
    make_latest: "legacy"
  };

  try {
    const newGhRelease = await (existingGithubReleaseForVersion
      ? updateGithubRelease(
          githubRequestConfig,
          existingGithubReleaseForVersion.id!,
          ghRelease
        )
      : createGithubRelease(githubRequestConfig, {
          ...ghRelease,
          target_commitish: release.commit
        }));
    return {
      status: existingGithubReleaseForVersion ? "updated" : "created",
      id: newGhRelease.id,
      url: newGhRelease.html_url
    };
  } catch (error) {
    if (process.env.CI) {
      console.error(
        `An error occurred while trying to create a release on GitHub, please report this on https://github.com/storm-software/storm-ops (NOTE: make sure to redact your GitHub token from the error message!): ${typeof error?.message === "string" ? error?.message : `\n\n${error}`}`
      );

      throw new Error(
        "`An error occurred while trying to create a release on GitHub in a CI environment",
        {
          cause: error
        }
      );
    }

    return {
      status: "manual",
      error,
      url: githubNewReleaseURL(githubRequestConfig, release),
      requestData: ghRelease
    };
  }
}

/**
 * Resolve a GitHub token from environment variables or gh CLI
 */
async function resolveTokenData(
  hostname: string
): Promise<{ token: string; headerName: string }> {
  // Try and resolve from the environment
  const tokenFromEnv =
    process.env.STORM_BOT_GITHUB_TOKEN ||
    process.env.GITHUB_TOKEN ||
    process.env.GH_TOKEN;
  if (tokenFromEnv) {
    return { token: tokenFromEnv, headerName: "Authorization" };
  }

  // Try and resolve from gh CLI installation
  const ghCLIPath = joinPathFragments(
    process.env.XDG_CONFIG_HOME || joinPathFragments(homedir(), ".config"),
    "gh",
    "hosts.yml"
  );
  if (existsSync(ghCLIPath)) {
    const yamlContents = await fsp.readFile(ghCLIPath, "utf8");

    const ghCLIConfig = parse(yamlContents) as Record<
      string,
      {
        user: string;
        oauth_token?: { token: string; headerName: string };
        git_protocol?: "https" | "ssh";
      }
    >;
    if (ghCLIConfig[hostname]) {
      // Web based session (the token is already embedded in the config)
      if (ghCLIConfig[hostname].oauth_token) {
        return ghCLIConfig[hostname].oauth_token;
      }
      // SSH based session (we need to dynamically resolve a token using the CLI)
      if (
        ghCLIConfig[hostname].user &&
        ghCLIConfig[hostname].git_protocol === "ssh"
      ) {
        const token = execSync(`gh auth token`, {
          encoding: "utf8",
          stdio: "pipe",
          windowsHide: false
        }).trim();
        return { token, headerName: "Authorization" };
      }
    }
  }
  if (hostname !== "github.com") {
    console.log(
      `Warning: It was not possible to automatically resolve a GitHub token from your environment for hostname ${hostname}. If you set the GITHUB_TOKEN or GH_TOKEN environment variable, that will be used for GitHub API requests.`
    );
  }

  throw new Error(
    `Unable to resolve a GitHub token for hostname ${hostname}. Please set the GITHUB_TOKEN or GH_TOKEN environment variable, or ensure you have an active session via the official gh CLI tool (https://cli.github.com).`
  );
}

export async function getGithubReleaseByTag(
  config: GithubRequestConfig,
  tag: string
): Promise<GithubRelease> {
  return (
    await makeGithubRequest(
      config,
      `/repos/${config.repo}/releases/tags/${tag}`,
      {}
    )
  ).data as GithubRelease;
}

export async function makeGithubRequest(
  config: GithubRequestConfig,
  url: string,
  opts: AxiosRequestConfig = {}
) {
  return await axios(url, {
    ...opts,
    baseURL: config.apiBaseUrl,
    headers: {
      ...(opts.headers as any),
      Authorization: config.token ? `Bearer ${config.token}` : undefined
    }
  });
}

async function createGithubRelease(
  config: GithubRequestConfig,
  body: GithubRelease
) {
  return (
    await makeGithubRequest(config, `/repos/${config.repo}/releases`, {
      method: "POST",
      data: body
    })
  ).data;
}

async function updateGithubRelease(
  config: GithubRequestConfig,
  id: string,
  body: GithubRelease
) {
  return (
    await makeGithubRequest(config, `/repos/${config.repo}/releases/${id}`, {
      method: "PATCH",
      data: body
    })
  ).data;
}

function githubNewReleaseURL(
  config: GithubRequestConfig,
  release: GithubReleaseOptions
) {
  // Parameters taken from https://github.com/isaacs/github/issues/1410#issuecomment-442240267
  let url = `https://${config.hostname}/${config.repo}/releases/new?tag=${
    release.version
  }&title=${release.version}&body=${encodeURIComponent(release.body)}&target=${
    release.commit
  }`;
  if (release.prerelease) {
    url += "&prerelease=true";
  }
  return url;
}

/**
 * Factory function to create a remote release client based on the given configuration
 */
export async function createGithubRemoteReleaseClient(
  workspaceConfig: StormWorkspaceConfig,
  remoteName = "origin"
): Promise<StormGithubRemoteReleaseClient> {
  const repoData = getGitHubRepoData(remoteName, "github");
  if (!repoData) {
    throw new Error(
      `Unable to create a remote release client because the GitHub repo slug could not be determined. Please ensure you have a valid GitHub remote configured.`
    );
  }

  return new StormGithubRemoteReleaseClient(
    repoData,
    {
      provider: "github",
      hostname: repoData.hostname,
      apiBaseUrl: repoData.apiBaseUrl
    },
    await resolveTokenData(repoData.hostname),
    workspaceConfig
  );
}

export async function isUserAnOrganizationMember(
  userId: string,
  config: StormWorkspaceConfig,
  remoteName = "origin"
): Promise<boolean> {
  try {
    const repoData = getGitHubRepoData(remoteName, "github");
    if (!repoData) {
      throw new Error(
        `Unable to validate GitHub actor because the GitHub repo slug could not be determined. Please ensure you have a valid GitHub remote configured.`
      );
    }

    const tokenData = await resolveTokenData(repoData.hostname);
    if (!tokenData.token) {
      throw new Error(
        `Unable to validate GitHub actor because no token was provided. Please set the GITHUB_TOKEN or GH_TOKEN environment variable, or ensure you have an active session via the official gh CLI tool (https://cli.github.com).`
      );
    }

    const result = await makeGithubRequest(
      {
        repo: repoData.slug,
        hostname: repoData.hostname,
        apiBaseUrl: repoData.apiBaseUrl,
        token: tokenData?.token || null
      },
      `/orgs/${
        typeof config.organization === "string"
          ? config.organization
          : config.organization?.name
      }/members/${userId}`,
      {}
    );
    if (result.status !== 204) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
