import type { ProjectGraph, ProjectsConfigurations } from "@nx/devkit";
import "es6-weak-map";
import { execSync } from "node:child_process";
import { join } from "node:path";
import { getAffectedGraphNodes } from "nx/src/command-line/affected/affected.js";
import { buildProjectGraphWithoutDaemon } from "nx/src/project-graph/project-graph.js";
import type {
  Commit,
  LastRelease,
  NextRelease,
  Release
} from "semantic-release";
import { ReleaseConfig, ReleaseContext } from "../types";
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
  const { readProjectsConfigurationFromProjectGraph } = await import(
    "@nx/devkit"
  );

  const projectGraph = await buildProjectGraphWithoutDaemon();

  const projectConfigs =
    readProjectsConfigurationFromProjectGraph(projectGraph);

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
      await runProjectRelease(
        config,
        projectConfigs,
        projectGraph,
        projectName,
        plugin
      )
    );
  } else {
    let currentBase = base ? base : process.env.NX_BASE;
    let currentHead = head ? head : process.env.NX_HEAD;
    if (!currentBase && !currentHead) {
      const baseHead = execSync(
        `git merge-base --fork-point origin/main HEAD`
      ).toString();
      const [base, head] = baseHead.split("\n");
      baseHead && (process.env.NX_BASE = base);
      baseHead && (process.env.NX_HEAD = head);

      if (!currentBase && !currentHead) {
        currentBase = execSync(`git rev-parse origin/main`).toString();
        currentHead = execSync(`git rev-parse HEAD`).toString();
      }

      if (!currentBase && !currentHead) {
        throw new Error(
          "Base and head are not specified and cannot be determined automatically."
        );
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
      console.log(
        `!!!! Running release processing for project: ${project.name} !!!!`
      );

      const result = await runProjectRelease(
        config,
        projectConfigs,
        projectGraph,
        project.name,
        plugin
      );
      console.log(
        `!!!! Completed release processing for project: ${project.name} !!!!`
      );

      results.push(result);
    }
  }

  console.log(
    `⚡Processed the following commits: ${[...results.map(r => r.commits)].join(
      "\n"
    )}`
  );
  console.log(
    `⚡Completed the following releases successfully: ${[
      ...results.map(r => r.releases)
    ].join("\n")}`
  );
}

export async function runProjectRelease(
  config: ReleaseConfig,
  projectConfigs: ProjectsConfigurations,
  projectGraph: ProjectGraph,
  projectName: string,
  plugin = "@storm-software/git-tools/semantic-release-plugin"
): Promise<{
  lastRelease: LastRelease;
  commits: Commit[];
  nextRelease: NextRelease;
  releases: Release[];
}> {
  const projectConfig = projectConfigs.projects[projectName];
  if (projectConfig.targets?.build) {
    execSync(`pnpm nx run ${projectName}:build`, {
      maxBuffer: LARGE_BUFFER
    });
  }

  config.packageJsonDir = projectConfig.root;
  const workspaceDir = process.env["DEV_REPO_ROOT"]
    ? process.env["DEV_REPO_ROOT"]
    : process.cwd();

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
    projectName,
    workspaceDir,
    projectGraph,
    projectConfigs
  };

  const plugins = resolvePlugins(context, workspaceDir);
  const tagFormat = config.tagFormat
    ? parseTag(config.tagFormat)
    : config.tagFormat;

  plugins.forEach(plugin => {
    console.log(
      `Running ${plugin[0]} semantic-release plugin with the following config:`
    );

    const config = plugin[1];
    delete config.projectGraph;

    console.log(config);
  });

  const result = await import("semantic-release").then(mod =>
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
        env: prepareEnv(context, process.env),
        stdout: process.stdout
      }
    )
  );
  if (!result) {
    throw new Error(`Release for ${projectName} has failed`);
  }

  return result;
}

// Replace our token that is used for consistency with token required by semantic-release
function parseTag(tag: string) {
  return tag.replace("${VERSION}", match => match.toLowerCase());
}

// Replace our token that is used for consistency with token required by semantic-release
function prepareEnv(
  context: ReleaseContext,
  env: Record<string, string> = process.env
) {
  const name = env.CI_REPO_WORKER ? env.CI_REPO_WORKER : env.CI_REPO_OWNER;
  const email = env.CI_REPO_OWNER_EMAIL
    ? env.CI_REPO_OWNER_EMAIL
    : `${name}@users.noreply.github.com`;

  return Object.assign(env, {
    CI: true,
    GIT_AUTHOR_NAME: name,
    GIT_AUTHOR_EMAIL: email,
    GIT_COMMITTER_NAME: name,
    GIT_COMMITTER_EMAIL: email,
    ...env,
    CI_REPO_URL: context.workspaceDir ? context.workspaceDir : env.CI_REPO_URL
  });
}
