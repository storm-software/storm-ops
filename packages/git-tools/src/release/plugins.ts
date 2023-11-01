import fs from "fs";
import path from "path";
import { ReleaseConfig } from "../types";

const getNpmPlugin = (options: ReleaseConfig) => {
  if (!options.packageJsonDir) {
    return [];
  }

  const projectPkgPath = path.join(options.packageJsonDir, "package.json");
  const buildPkgRoot = options.outputPath
    ? path.join(options.outputPath, "package.json")
    : undefined;

  const plugins = [];
  if (buildPkgRoot && fs.existsSync(buildPkgRoot)) {
    // Bump package.json version for built project, so that it can be published to NPM with correct version (if package is public)
    plugins.push([
      "@semantic-release/npm",
      {
        pkgRoot: options.outputPath
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

  return plugins;
};

export const resolvePlugins = (
  options: ReleaseConfig,
  workspaceRoot: string,
  pluginPath: string
) => {
  if (!options.packageJsonDir) {
    return [];
  }

  const relativeProjectPkgPath = path.relative(
    workspaceRoot,
    options.packageJsonDir
  );

  const emptyArray: never[] = [];
  const defaultPlugins = [
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

  if (pluginPath) {
    defaultPlugins.unshift([
      pluginPath,
      {
        parserOpts: options.parserOpts,
        releaseRules: options.releaseRules,
        preset: options.preset,
        presetConfig: options.presetConfig
      }
    ]);
  }

  if (options.git) {
    defaultPlugins.push([
      "@semantic-release/git",
      {
        message: options.commitMessage,
        assets: [
          // Git requires relative paths from project root in a posix format
          path
            .relative(workspaceRoot, options.changelogFile as string)
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

  if (options.github) {
    defaultPlugins.push(["@semantic-release/github", options.githubOptions]);
  }

  return defaultPlugins;
};
