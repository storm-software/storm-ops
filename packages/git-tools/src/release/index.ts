import { execSync } from "node:child_process";
import { join } from "node:path";
import type { ProjectGraph, ProjectsConfigurations } from "@nx/devkit";
import "es6-weak-map";
import { getAffectedGraphNodes } from "nx/src/command-line/affected/affected.js";
import { buildProjectGraphAndSourceMapsWithoutDaemon } from "nx/src/project-graph/project-graph.js";
import type { Commit, LastRelease, NextRelease, Release } from "semantic-release";
import type { ReleaseConfig, ReleaseContext } from "../types";
import defaultConfig from "./config";
import { resolvePlugins } from "./plugins";
import { applyTokensToReleaseConfig } from "./tokens";

const LARGE_BUFFER = 1024 * 1000000;

export async function runRelease(
  projectName?: string,
  releaseConfig = "@storm-software/git-tools/release/config.js",
  plugin = "@storm-software/git-tools/semantic-release-plugin",
  base?: string,
  head?: string
) {
  const { readProjectsConfigurationFromProjectGraph } = await import("@nx/devkit");

  const { projectGraph } = await buildProjectGraphAndSourceMapsWithoutDaemon();

  const projectConfigs = readProjectsConfigurationFromProjectGraph(projectGraph);

  let config: ReleaseConfig = defaultConfig as ReleaseConfig;
  if (releaseConfig !== "@storm-software/git-tools/release/config.js") {
    let userConfig = (await import(releaseConfig))?.default;
    if (userConfig?.default) {
      // Handle CommonJS modules that export default as a property
      userConfig = userConfig?.default;
    }

    config = {
      ...config,
      ...userConfig
    };
  }

  console.log("Running release process with the following config options:");
  console.log(config);

  const results = [];
  if (projectName) {
    results.push(
      await runProjectRelease(config, projectConfigs, projectGraph, projectName, plugin)
    );
  } else {
    let currentBase = base ? base : process.env.NX_BASE;
    let currentHead = head ? head : process.env.NX_HEAD;
    if (!currentBase && !currentHead) {
      const baseHead = execSync("git merge-base --fork-point origin/main HEAD").toString();
      const [base, head] = baseHead.split("\n");
      baseHead && (process.env.NX_BASE = base);
      baseHead && (process.env.NX_HEAD = head);

      if (!currentBase && !currentHead) {
        currentBase = execSync("git rev-parse origin/main").toString();
        currentHead = execSync("git rev-parse HEAD").toString();
      }

      if (!currentBase && !currentHead) {
        throw new Error("Base and head are not specified and cannot be determined automatically.");
      }
    }

    const projects = await getAffectedGraphNodes(
      {
        base: currentBase,
        head: currentHead,
        parallel: 1
      },
      projectGraph
    );
    for (const project of projects) {
      console.log(`Running release processing for project: ${project.name}`);

      const result = await runProjectRelease(
        config,
        projectConfigs,
        projectGraph,
        project.name,
        plugin
      );
      console.log(`Completed release processing for project: ${project.name}`);

      results.push(result);
    }
  }

  const commits = results.filter((result) => result.commits.length > 0);
  const releases = results.filter((result) => result.releases.length > 0);

  commits.length > 0
    ? console.log(
        `⚡Processed the following commits: ${[
          ...commits.map((result) => result.commits.map((commit) => commit.subject).join("\n"))
        ]}`
      )
    : console.log("ℹ No commits were processed.");
  releases.length > 0
    ? console.log(
        `⚡Completed the following releases successfully: ${[
          ...releases.map((result) =>
            result.releases
              .map(
                (release) =>
                  `${release.pluginName ? `${release.pluginName}: ` : ""}${
                    release.name ? `${release.name}: ` : "<missing>"
                  } v${release.version ? release.version : "<missing>"}`
              )
              .join("\n")
          )
        ]}`
      )
    : console.log("ℹ No releases were processed.");
}

export async function runProjectRelease(
  _config: ReleaseConfig,
  projectConfigs: ProjectsConfigurations,
  projectGraph: ProjectGraph,
  projectName: string,
  plugin = "@storm-software/git-tools/semantic-release-plugin"
): Promise<{
  lastRelease?: LastRelease;
  commits: Commit[];
  nextRelease?: NextRelease;
  releases: Release[];
}> {
  let config = _config;

  const projectConfig = projectConfigs.projects[projectName];
  if (projectConfig.targets?.build) {
    execSync(`pnpm nx run ${projectName}:build`, {
      maxBuffer: LARGE_BUFFER
    });
  }

  if (projectConfig.root === ".") {
    console.warn(`✘ Skipping release for workspace root project - ${projectName}`);
    return {
      commits: [],
      releases: []
    };
  }

  config.packageJsonDir = projectConfig.root;
  const workspaceDir = process.env.STORM_WORKSPACE_ROOT
    ? process.env.STORM_WORKSPACE_ROOT
    : process.cwd();

  if (!workspaceDir) {
    throw new Error("Workspace root is required in options");
  }

  config = applyTokensToReleaseConfig(config, {
    projectName,
    projectDir: projectConfig.root,
    workspaceDir
  });

  let pluginPath = plugin;
  if (!pluginPath.startsWith("@")) {
    pluginPath = join(workspaceDir, pluginPath);
  }

  const context: ReleaseContext = {
    ...config,
    outputPath: join("dist", config.packageJsonDir),
    projectName,
    workspaceDir,
    projectGraph,
    projectConfigs
  };

  const plugins = resolvePlugins(context);
  const tagFormat = config.tagFormat ? parseTag(config.tagFormat) : config.tagFormat;

  let result!:
    | {
        lastRelease?: LastRelease;
        commits: Commit[];
        nextRelease?: NextRelease;
        releases: Release[];
      }
    | boolean;

  try {
    result = await import("semantic-release").then((mod) =>
      mod.default(
        {
          extends: pluginPath,
          ...context,
          options: context,
          tagFormat,
          plugins
        },
        {
          cwd: workspaceDir,
          env: prepareEnv(context, process.env)
        }
      )
    );
  } catch (e) {
    console.error(`An error occurred while running semantic-release for ${projectName}`);
    console.error(e);
  }

  if (!result || typeof result === "boolean") {
    console.warn(`✘ No release ran for ${projectName}`);

    return {
      commits: [],
      releases: []
    };
  }

  return result;
}

// Replace our token that is used for consistency with token required by semantic-release
function parseTag(tag: string) {
  return tag.replace("${VERSION}", (match) => match.toLowerCase());
}

// Replace our token that is used for consistency with token required by semantic-release
function prepareEnv(context: ReleaseContext, env: Record<string, string> = process.env) {
  const authorName = env.GITHUB_ACTOR
    ? env.GITHUB_ACTOR
    : env.STORM_WORKER
      ? env.STORM_WORKER
      : env.STORM_OWNER;
  const committerName = env.STORM_WORKER ? env.STORM_WORKER : env.STORM_OWNER;

  return Object.assign(env, {
    CI: true,
    GIT_AUTHOR_NAME: authorName,
    GIT_AUTHOR_EMAIL: `${authorName}@users.noreply.github.com`,
    GIT_COMMITTER_NAME: committerName,
    GIT_COMMITTER_EMAIL: `${committerName}@users.noreply.github.com`,
    ...env,
    STORM_REPOSITORY: context.workspaceDir ? context.workspaceDir : env.STORM_REPOSITORY
  });
}
