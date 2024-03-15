import type { BaseTokenizerOptions, ProjectTokenizerOptions } from "../../declarations";
import { findWorkspaceRoot } from "./find-workspace-root";

export const applyWorkspaceBaseTokens = async (
  option: string,
  tokenizerOptions: BaseTokenizerOptions
): Promise<string> => {
  let result = option;
  if (!result) {
    return result;
  }

  if (tokenizerOptions) {
    const optionKeys = Object.keys(tokenizerOptions);
    if (optionKeys.some((optionKey) => result.includes(`{${optionKey}}`))) {
      for (const optionKey of optionKeys) {
        if (result.includes(`{${optionKey}}`)) {
          result = result.replaceAll(`{${optionKey}}`, tokenizerOptions.config?.[optionKey] ?? "");
        }
      }
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

  if (result.includes("{workspaceRoot}")) {
    result = result.replaceAll(
      "{workspaceRoot}",
      tokenizerOptions.workspaceRoot ??
        tokenizerOptions.config?.workspaceRoot ??
        findWorkspaceRoot()
    );
  }

  return result;
};

export const applyWorkspaceProjectTokens = (
  option: string,
  tokenizerOptions: ProjectTokenizerOptions
): Promise<string> => {
  return applyWorkspaceBaseTokens(option, tokenizerOptions);
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
    } else {
      result[option] = options[option];
    }
  }

  return result;
};
