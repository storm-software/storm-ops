import {
  ProjectGraph,
  ProjectsConfigurations,
  readProjectsConfigurationFromProjectGraph
} from "@nx/devkit";
import { execSync } from "node:child_process";
import { getAffectedGraphNodes } from "nx/src/command-line/affected/affected";
import { buildProjectGraphWithoutDaemon } from "nx/src/project-graph/project-graph";
import type release from "semantic-release";
import { setReleaseContext } from "../semantic-release-plugin";
import { ReleaseConfig } from "../types";
import defaultOptions from "./config";
import { resolvePlugins } from "./plugins";

const LARGE_BUFFER = 1024 * 1000000;

export async function runRelease(
  projectName?: string,
  releaseConfig = "@storm-software/git-tools/release/config.js",
  plugin = "@storm-software/git-tools/semantic-release-plugin",
  base?: string,
  head?: string
) {
  const projectGraph = await buildProjectGraphWithoutDaemon();

  const projectConfigs =
    readProjectsConfigurationFromProjectGraph(projectGraph);

  let config: ReleaseConfig = defaultOptions as ReleaseConfig;
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

  if (projectName) {
    await runProjectRelease(
      config,
      projectConfigs,
      projectGraph,
      projectName,
      plugin
    );
  } else {
    const projects = await getAffectedGraphNodes(
      {
        base: base ? base : process.env.NX_BASE,
        head: head ? head : process.env.NX_HEAD,
        parallel: 1
      },
      projectGraph
    );
    for (const project of projects) {
      await runProjectRelease(
        config,
        projectConfigs,
        projectGraph,
        project.name,
        plugin
      );
    }
  }
}

export async function runProjectRelease(
  config: ReleaseConfig,
  projectConfigs: ProjectsConfigurations,
  projectGraph: ProjectGraph,
  projectName: string,
  plugin = "@storm-software/git-tools/semantic-release-plugin"
) {
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

  setReleaseContext({
    ...config,
    projectName,
    workspaceDir,
    projectGraph,
    projectConfigs
  });

  const plugins = resolvePlugins(config, workspaceDir);
  const tagFormat = config.tagFormat
    ? parseTag(config.tagFormat)
    : config.tagFormat;

  const release = await getSemanticRelease();

  await release({
    extends: plugin,
    ...config,
    tagFormat,
    plugins
  });
}

/**
 * @FIXME Recently semantic-release became esm only, but until NX will support plugins in ESM, we have to use this dirty hack :/
 * */
function getSemanticRelease() {
  const fn = new Function(
    'return import("semantic-release").then(m => m.default)'
  );

  return fn() as Promise<typeof release>;
}

// Replace our token that is used for consistency with token required by semantic-release
function parseTag(tag: string) {
  return tag.replace("${VERSION}", match => match.toLowerCase());
}
