import { ProjectConfiguration } from "@nx/devkit";
import { getWorkspaceRoot } from "./get-workspace-root";

export interface BaseTokenizerConfig {
  workspaceRoot?: string;
}

export type ExecutorTokenizerConfig = BaseTokenizerConfig &
  ProjectConfiguration & {
    projectName: string;
    projectRoot: string;
    sourceRoot: string;
  };

export const applyWorkspaceExecutorTokens = (
  option: string,
  config: ExecutorTokenizerConfig
): string => {
  let result = option;
  if (!result) {
    return result;
  }

  let projectName!: string;
  let projectRoot!: string;
  let sourceRoot!: string;
  if ((config as ExecutorTokenizerConfig)?.projectName) {
    const context = config as ExecutorTokenizerConfig;
    projectName = context.projectName;
    projectRoot = context.root;
    sourceRoot = context.sourceRoot;
  } else {
    const projectConfig = config as ProjectConfiguration;
    projectName = projectConfig.name;
    projectRoot = projectConfig.root;
    sourceRoot = projectConfig.sourceRoot;
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
      config.workspaceRoot ?? getWorkspaceRoot()
    );
  }

  return result;
};

export const applyWorkspaceGeneratorTokens = (
  option: string,
  config: BaseTokenizerConfig
): string => {
  let result = option;
  if (!result) {
    return result;
  }

  if (result.includes("{workspaceRoot}")) {
    result = result.replaceAll(
      "{workspaceRoot}",
      config.workspaceRoot ?? getWorkspaceRoot()
    );
  }

  return result;
};

export const applyWorkspaceTokens = <
  TConfig extends BaseTokenizerConfig = BaseTokenizerConfig
>(
  options: Record<string, any>,
  config: TConfig,
  tokenizerFn: (option: string, config: TConfig) => string
): Record<string, any> => {
  let result = options;
  if (!result) {
    return {};
  }

  return Object.keys(options).reduce(
    (ret: Record<string, any>, option: string) => {
      if (
        options[option] === undefined ||
        options[option] === null ||
        typeof options[option] === "number" ||
        typeof options[option] === "boolean" ||
        typeof options[option] === "string"
      ) {
        ret[option] = tokenizerFn(option, config);
      } else if (Array.isArray(options[option])) {
        ret[option] = options[option].map((item: any) =>
          tokenizerFn(item, config)
        );
      } else if (typeof options[option] === "object") {
        ret[option] = tokenizerFn(options[option], config);
      }

      return ret;
    },
    {}
  );
};
