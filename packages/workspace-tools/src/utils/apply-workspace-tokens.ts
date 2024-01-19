import type { ProjectConfiguration } from "@nx/devkit";
import type { StormConfig } from "@storm-software/config-tools";
import { getWorkspaceRoot } from "./get-workspace-root";

export interface BaseTokenizerOptions {
  workspaceRoot?: string;
  config?: StormConfig;
}

export type ExecutorTokenizerOptions = BaseTokenizerOptions &
  ProjectConfiguration & {
    projectName: string;
    projectRoot: string;
    sourceRoot: string;
  };

export const applyWorkspaceExecutorTokens = (
  option: string,
  tokenizerOptions: ExecutorTokenizerOptions
): string => {
  let result = option;
  if (!result) {
    return result;
  }

  let projectName!: string;
  let projectRoot!: string;
  let sourceRoot!: string;
  if ((tokenizerOptions as ExecutorTokenizerOptions)?.projectName) {
    const context = tokenizerOptions as ExecutorTokenizerOptions;
    projectName = context.projectName;
    projectRoot = context.root;
    sourceRoot = context.sourceRoot;
  } else {
    const projectConfig = tokenizerOptions as ProjectConfiguration;
    projectName = projectConfig.name;
    projectRoot = projectConfig.root;
    sourceRoot = projectConfig.sourceRoot;
  }

  if (tokenizerOptions.config) {
    const configKeys = Object.keys(tokenizerOptions.config);
    if (configKeys.some((configKey) => result.includes(`{${configKey}}`))) {
      for (const configKey of configKeys) {
        if (result.includes(`{${configKey}}`)) {
          result = result.replaceAll(`{${configKey}}`, tokenizerOptions.config[configKey]);
        }
      }
    }
  }
  if (result.includes("{projectName}")) {
    result = result.replaceAll("{projectName}", projectName);
  }
  if (result.includes("{projectRoot}")) {
    result = result.replaceAll("{projectRoot}", projectRoot);
  }
  if (result.includes("{sourceRoot}")) {
    result = result.replaceAll("{sourceRoot}", sourceRoot);
  }
  if (result.includes("{workspaceRoot}")) {
    result = result.replaceAll(
      "{workspaceRoot}",
      tokenizerOptions.workspaceRoot ?? getWorkspaceRoot()
    );
  }

  return result;
};

export const applyWorkspaceGeneratorTokens = (
  option: string,
  tokenizerOptions: BaseTokenizerOptions
): string => {
  let result = option;
  if (!result) {
    return result;
  }

  if (tokenizerOptions.config) {
    const configKeys = Object.keys(tokenizerOptions.config);
    if (configKeys.some((configKey) => result.includes(`{${configKey}}`))) {
      for (const configKey of configKeys) {
        if (result.includes(`{${configKey}}`)) {
          result = result.replaceAll(`{${configKey}}`, tokenizerOptions.config[configKey]);
        }
      }
    }
  }
  if (result.includes("{workspaceRoot}")) {
    result = result.replaceAll(
      "{workspaceRoot}",
      tokenizerOptions.workspaceRoot ?? tokenizerOptions.config.workspaceRoot ?? getWorkspaceRoot()
    );
  }

  return result;
};

export const applyWorkspaceTokens = <TConfig extends BaseTokenizerOptions = BaseTokenizerOptions>(
  options: Record<string, any>,
  config: TConfig,
  tokenizerFn: (option: string, config: TConfig) => string
): Record<string, any> => {
  const result = options;
  if (!result) {
    return {};
  }

  return Object.keys(options).reduce((ret: Record<string, any>, option: string) => {
    if (typeof options[option] === "string") {
      ret[option] = tokenizerFn(options[option], config);
    } else if (Array.isArray(options[option])) {
      ret[option] = options[option].map((item: any) =>
        typeof item === "string" ? tokenizerFn(item, config) : item
      );
    } else if (typeof options[option] === "object") {
      ret[option] = applyWorkspaceTokens(options[option], config, tokenizerFn);
    }

    return ret;
  }, {});
};
