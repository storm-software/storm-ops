import type { ProjectConfiguration } from "@nx/devkit";
import {
  findWorkspaceRoot,
  type BaseTokenizerOptions,
} from "@storm-software/config-tools";

export type ExecutorTokenizerOptions = BaseTokenizerOptions &
  ProjectConfiguration & {
    projectName: string;
    projectRoot: string;
    sourceRoot: string;
  };

export const applyWorkspaceExecutorTokens = async (
  option: string,
  tokenizerOptions: ExecutorTokenizerOptions,
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
          result = result.replaceAll(
            `{${configKey}}`,
            tokenizerOptions.config[configKey],
          );
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
      tokenizerOptions.workspaceRoot ?? findWorkspaceRoot(),
    );
  }

  return result;
};
