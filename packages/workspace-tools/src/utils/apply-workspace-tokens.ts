import type { ProjectConfiguration } from "@nx/devkit";
import type { StormConfig } from "@storm-software/config";

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

export const applyWorkspaceExecutorTokens = async (
  option: string,
  tokenizerOptions: ExecutorTokenizerOptions
): Promise<string> => {
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
    projectRoot = projectConfig.root;

    if (projectConfig.name) {
      projectName = projectConfig.name;
    }
    if (projectConfig.sourceRoot) {
      sourceRoot = projectConfig.sourceRoot;
    }
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
    const { findWorkspaceRoot } = await import("@storm-software/config-tools");

    result = result.replaceAll(
      "{workspaceRoot}",
      tokenizerOptions.workspaceRoot ?? findWorkspaceRoot()
    );
  }

  return result;
};

export const applyWorkspaceGeneratorTokens = async (
  option: string,
  tokenizerOptions: BaseTokenizerOptions
): Promise<string> => {
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
    const { findWorkspaceRoot } = await import("@storm-software/config-tools");

    result = result.replaceAll(
      "{workspaceRoot}",
      tokenizerOptions.workspaceRoot ??
        tokenizerOptions.config?.workspaceRoot ??
        findWorkspaceRoot()
    );
  }

  return result;
};

export const applyWorkspaceTokens = async <
  TConfig extends BaseTokenizerOptions = BaseTokenizerOptions
>(
  options: Record<string, any>,
  config: TConfig,
  tokenizerFn: (option: string, config: TConfig) => string | Promise<string>
): Promise<Record<string, any>> => {
  if (!options) {
    return {};
  }

  const result: Record<string, any> = {};

  for (const option of Object.keys(options)) {
    if (typeof options[option] === "string") {
      result[option] = await Promise.resolve(tokenizerFn(options[option], config));
    } else if (Array.isArray(options[option])) {
      result[option] = await Promise.all(
        options[option].map(async (item: any) =>
          typeof item === "string" ? await Promise.resolve(tokenizerFn(item, config)) : item
        )
      );
    } else if (typeof options[option] === "object") {
      result[option] = await applyWorkspaceTokens(options[option], config, tokenizerFn);
    }
  }

  return result;
};
