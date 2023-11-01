/* eslint-disable @typescript-eslint/no-explicit-any */

import writer from "conventional-changelog-writer";
import filter from "conventional-commits-filter";
import { sync as parser } from "conventional-commits-parser";
import getStream from "get-stream";
import importFrom from "import-from";
import intoStream from "into-stream";
import { find, merge } from "lodash-es";
import { dirname } from "node:path";
import { readPackageUp } from "read-pkg-up";
import { PluginFn } from "semantic-release-plugin-decorators";
import { format } from "url";
import { HOSTS_CONFIG } from "../constants";
import { getWorkspaceRoot } from "./utils";

export const generateReleaseNotes =
  (_verbose?: boolean) =>
  (_plugin: PluginFn) =>
  async (config: any, context: any) => {
    const { commits, lastRelease, nextRelease, options, cwd } = context;
    const repositoryUrl = options.repositoryUrl.replace(/\.git$/i, "");

    const { parserOpts, writerOpts } = await loadChangelogConfig(
      config,
      context
    );

    const [match, auth, host, path] =
      /^(?!.+:\/\/)(?:(?<auth>.*)@)?(?<host>.*?):(?<path>.*)$/.exec(
        repositoryUrl
      ) || [];
    const url = new URL(
      match ? `ssh://${auth ? `${auth}@` : ""}${host}/${path}` : repositoryUrl
    );

    let { port, protocol } = url;
    const { hostname, pathname } = url;

    port = protocol.includes("ssh") ? "" : port;
    protocol = protocol && /http[^s]/.test(protocol) ? "http" : "https";
    const [, owner, repository] =
      /^\/(?<owner>[^/]+)?\/?(?<repository>.+)?$/.exec(pathname);

    const { issue, commit, referenceActions, issuePrefixes } =
      find(HOSTS_CONFIG, conf => conf.hostname === hostname) ||
      HOSTS_CONFIG.default;
    const parsedCommits = filter(
      commits
        .filter(({ message, hash }) => {
          if (!message.trim()) {
            console.debug("Skip commit %s with empty message", hash);
            return false;
          }

          return true;
        })
        .map(rawCommit => ({
          ...rawCommit,
          ...parser(rawCommit.message, {
            referenceActions,
            issuePrefixes,
            ...parserOpts
          })
        }))
    );
    const previousTag = lastRelease.gitTag || lastRelease.gitHead;
    const currentTag = nextRelease.gitTag || nextRelease.gitHead;
    const {
      host: hostConfig,
      linkCompare,
      linkReferences,
      commit: commitConfig,
      issue: issueConfig
    } = config;
    const changelogContext = merge(
      {
        version: nextRelease.version,
        host: format({ protocol, hostname, port }),
        owner,
        repository,
        previousTag,
        currentTag,
        linkCompare: currentTag && previousTag,
        issue,
        commit,
        packageData: ((await readPackageUp({ normalize: false, cwd })) || {})
          .packageJson
      },
      {
        host: hostConfig,
        linkCompare,
        linkReferences,
        commit: commitConfig,
        issue: issueConfig
      }
    );

    console.debug("version: %o", changelogContext.version);
    console.debug("host: %o", changelogContext.hostname);
    console.debug("owner: %o", changelogContext.owner);
    console.debug("repository: %o", changelogContext.repository);
    console.debug("previousTag: %o", changelogContext.previousTag);
    console.debug("currentTag: %o", changelogContext.currentTag);
    console.debug("host: %o", changelogContext.host);
    console.debug("linkReferences: %o", changelogContext.linkReferences);
    console.debug("issue: %o", changelogContext.issue);
    console.debug("commit: %o", changelogContext.commit);

    return getStream(
      intoStream
        .object(parsedCommits)
        .pipe(writer(changelogContext, writerOpts))
    );
  };

export const loadChangelogConfig = async (
  { preset, config, parserOpts, writerOpts, presetConfig },
  { cwd }
) => {
  let loadedConfig;
  const __dirname = dirname(getWorkspaceRoot());

  if (preset) {
    const presetPackage = `conventional-changelog-${preset.toLowerCase()}`;
    loadedConfig = await (
      importFrom.silent(__dirname, presetPackage) ||
      importFrom(cwd, presetPackage)
    )(presetConfig);
  } else if (config) {
    loadedConfig = await (
      importFrom.silent(__dirname, config) || importFrom(cwd, config)
    )();
  }

  return {
    parserOpts: { ...loadedConfig.parserOpts, ...parserOpts },
    writerOpts: { ...loadedConfig.writerOpts, ...writerOpts }
  };
};
