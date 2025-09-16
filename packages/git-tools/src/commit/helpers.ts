import { StormWorkspaceConfig } from "@storm-software/config";
import { writeInfo } from "@storm-software/config-tools/logger/console";
import { createJiti } from "jiti";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { getScopeEnumUtil } from "../commitlint/scope";
import {
  CommitQuestionProps,
  DefaultMinimalCommitQuestionKeys,
  DefaultMonorepoCommitQuestionKeys,
  MinimalCommitConfig,
  MinimalCommitQuestionEnum,
  MinimalCommitResolvedConfig,
  MonorepoCommitConfig,
  MonorepoCommitQuestionEnum,
  MonorepoCommitResolvedConfig
} from "../types";
import DEFAULT_MINIMAL_COMMIT_CONFIG from "./config/minimal";
import DEFAULT_MONOREPO_COMMIT_CONFIG from "./config/monorepo";

function resolveMinimalCommitOptions(
  config: MinimalCommitConfig = DEFAULT_MINIMAL_COMMIT_CONFIG
): MinimalCommitResolvedConfig {
  return {
    parserPreset: "conventional-changelog-storm-software",
    prompt: {
      settings: config.settings,
      messages: config.messages,
      questions: config.questions as MinimalCommitQuestionEnum<
        DefaultMinimalCommitQuestionKeys,
        CommitQuestionProps
      >
    }
  };
}

function resolveMonorepoCommitOptions(
  workspaceConfig: StormWorkspaceConfig,
  config: MonorepoCommitConfig = DEFAULT_MONOREPO_COMMIT_CONFIG
): MonorepoCommitResolvedConfig {
  return {
    utils: { getScopeEnum: getScopeEnumUtil({ config: workspaceConfig }) },
    parserPreset: "conventional-changelog-storm-software",
    prompt: {
      settings: config.settings,
      messages: config.messages,
      questions: config.questions as MonorepoCommitQuestionEnum<
        DefaultMonorepoCommitQuestionKeys,
        CommitQuestionProps
      >
    }
  };
}

const jiti = createJiti(import.meta.url, { importMeta: import.meta });

export async function resolveCommitConfig<
  TWorkspaceConfig extends StormWorkspaceConfig
>(
  workspaceConfig: TWorkspaceConfig,
  configPath?: string
): Promise<
  TWorkspaceConfig["variant"] extends "minimal"
    ? MinimalCommitResolvedConfig
    : MonorepoCommitResolvedConfig
> {
  if (
    configPath &&
    configPath !== "@storm-software/git-tools/commit/minimal" &&
    configPath !== "@storm-software/git-tools/commit/monorepo"
  ) {
    writeInfo(
      `Using custom commit config file: ${configPath}`,
      workspaceConfig
    );
  } else {
    configPath =
      workspaceConfig?.variant === "minimal"
        ? "@storm-software/git-tools/commit/minimal"
        : "@storm-software/git-tools/commit/monorepo";

    writeInfo(
      `Using standard commit config file: ${configPath}`,
      workspaceConfig
    );
  }

  let config = {} as TWorkspaceConfig["variant"] extends "minimal"
    ? MinimalCommitConfig
    : MonorepoCommitConfig;
  if (
    (configPath.endsWith(".json") || configPath.endsWith(".jsonc")) &&
    !existsSync(jiti.esmResolve(configPath, workspaceConfig.workspaceRoot))
  ) {
    const configContent = await readFile(
      jiti.esmResolve(configPath, workspaceConfig.workspaceRoot),
      "utf8"
    );
    config = JSON.parse(configContent);
  } else {
    config = await jiti.import<
      TWorkspaceConfig["variant"] extends "minimal"
        ? MinimalCommitConfig
        : MonorepoCommitConfig
    >(jiti.esmResolve(configPath), { default: true });
  }

  const mergedConfig = {
    ...(config ?? {}),
    ...(workspaceConfig.variant === "minimal"
      ? DEFAULT_MINIMAL_COMMIT_CONFIG
      : DEFAULT_MONOREPO_COMMIT_CONFIG)
  };

  return (
    workspaceConfig.variant === "minimal"
      ? resolveMinimalCommitOptions(mergedConfig as MinimalCommitConfig)
      : resolveMonorepoCommitOptions(
          workspaceConfig,
          mergedConfig as MonorepoCommitConfig
        )
  ) as TWorkspaceConfig["variant"] extends "minimal"
    ? MinimalCommitResolvedConfig
    : MonorepoCommitResolvedConfig;
}
