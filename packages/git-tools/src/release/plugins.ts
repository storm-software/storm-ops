/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import path from "path";
import type { PluginSpec } from "semantic-release";
import { ReleaseConfig, ReleaseContext } from "../types";
import defaultConfig from "./config";

const getNpmPlugin = (options: ReleaseConfig) => {
  if (!options.packageJsonDir) {
    return [];
  }

  const projectPkgPath = path.join(
    options.workspaceDir,
    options.packageJsonDir,
    "package.json"
  );
  const buildPkgRoot = options.outputPath
    ? path.join(options.workspaceDir, options.outputPath, "package.json")
    : undefined;

  console.log(
    `⚙️  Release Options: \nworkspaceDir: ${options.workspaceDir} \nbuildPkgRoot: ${buildPkgRoot} \noutputPath: ${options.outputPath} \nprojectPkgPath: ${projectPkgPath} \npackageJsonDir: ${options.packageJsonDir}`
  );

  const plugins = [];
  if (buildPkgRoot && fs.existsSync(buildPkgRoot)) {
    // Bump package.json version for built project, so that it can be published to NPM with correct version (if package is public)
    plugins.push([
      "@semantic-release/npm",
      {
        pkgRoot: options.outputPath,
        npmPublish: true
      }
    ]);
  }

  if (fs.existsSync(projectPkgPath)) {
    // Bump package.json in project itself
    plugins.push([
      "@semantic-release/npm",
      {
        pkgRoot: options.packageJsonDir,
        npmPublish: false
      }
    ]);
  }

  return formatPlugins(options, plugins);
};

export const resolvePlugins = (options: ReleaseContext): PluginSpec<any>[] => {
  if (!options.packageJsonDir) {
    return [];
  }

  if (!options.workspaceDir) {
    throw new Error("Workspace root is required in options");
  }

  const relativeProjectPkgPath = path.relative(
    options.workspaceDir,
    options.packageJsonDir
  );

  const emptyArray: never[] = [];
  const defaultPlugins = [
    [
      "@semantic-release/commit-analyzer",
      {
        parserOpts: options.parserOpts,
        releaseRules: options.releaseRules,
        preset: options.preset,
        presetConfig: options.presetConfig
      }
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        linkCompare: options.linkCompare,
        linkReferences: options.linkReferences,
        parserOpts: options.parserOpts,
        writerOpts: options.writerOpts,
        preset: options.preset,
        presetConfig: options.presetConfig
      }
    ],
    ...(options.changelog
      ? [
          [
            "@semantic-release/changelog",
            {
              changelogFile: options.changelogFile
            }
          ]
        ]
      : emptyArray),
    ...(options.npm ? getNpmPlugin(options) : emptyArray),
    ...(options.plugins ?? [])
  ];

  if (options.git) {
    defaultPlugins.push([
      "@semantic-release/git",
      {
        message: options.commitMessage,
        assets: [
          // Git requires relative paths from project root in a posix format
          path
            .relative(options.workspaceDir, options.changelogFile as string)
            .split(path.sep)
            .join(path.posix.sep),
          path
            .join(relativeProjectPkgPath, "package.json")
            .split(path.sep)
            .join(path.posix.sep),
          ...(options.gitAssets ?? [])
        ]
      }
    ]);
  }

  if (
    options.github &&
    options.workspaceDir?.toLowerCase() !==
      options.packageJsonDir?.toLowerCase()
  ) {
    defaultPlugins.push(["@semantic-release/github", options.githubOptions]);
  }

  return formatPlugins(options, defaultPlugins);
};

const formatPlugins = (
  options: ReleaseContext,
  plugins: PluginSpec<any>[]
): PluginSpec<any>[] => {
  return plugins.map((plugin: PluginSpec<any>) =>
    generatePluginOptions(options, plugin)
  );
};

const generatePluginOptions = (
  options: ReleaseContext,
  plugin: PluginSpec<any>
): PluginSpec<any> => {
  if (plugin) {
    if (Array.isArray(plugin) && plugin.length > 0) {
      const [pluginName, pluginOptions] = plugin;
      return [pluginName, { ...defaultConfig, ...options, ...pluginOptions }];
    } else if (typeof plugin === "string") {
      return [plugin, { ...defaultConfig, ...options }];
    }
  }

  return plugin;
};
