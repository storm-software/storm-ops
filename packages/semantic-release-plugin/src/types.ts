/* eslint-disable @typescript-eslint/no-explicit-any */

import { ProjectGraph, ProjectsConfigurations } from "nx/src/devkit-exports";

export type ReleaseConfig = any & {
  npm: boolean;
  github: boolean;
  githubOptions?: Record<string, unknown>;
  buildTarget?: string;
  changelog?: boolean;
  changelogFile?: string;
  outputPath?: string;
  commitMessage?: string;
  gitAssets?: string[];
  packageJsonDir?: string;
  parserOpts?: Record<string, unknown>;
  writerOpts?: Record<string, unknown>;
  linkCompare?: boolean;
  linkReferences?: boolean;
  releaseRules?:
    | string
    | { release: string | boolean; [key: string]: unknown }[];
  preset?: string;
  presetConfig?: Record<string, unknown>;
  plugins?: any[];
  tagFormat?: string;
  git: boolean;
};

export type ReleaseContext = ReleaseConfig & {
  projectName: string;
  workspaceDir: string;
  projectGraph: ProjectGraph;
  projectConfigs: ProjectsConfigurations;
};
