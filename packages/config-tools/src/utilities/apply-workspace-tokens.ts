import { BaseTokenizerOptions, ProjectTokenizerOptions } from "../types";
import { findWorkspaceRoot } from "./find-workspace-root";

export const applyWorkspaceBaseTokens = async <
  TTokenizerOptions extends BaseTokenizerOptions = BaseTokenizerOptions,
>(
  option: string,
  tokenParams: TTokenizerOptions,
): Promise<string> => {
  let result = option;
  if (!result) {
    return result;
  }

  if (tokenParams) {
    const optionKeys = Object.keys(tokenParams);
    if (optionKeys.some((optionKey) => result.includes(`{${optionKey}}`))) {
      for (const optionKey of optionKeys) {
        if (result.includes(`{${optionKey}}`)) {
          result = result.replaceAll(
            `{${optionKey}}`,
            tokenParams?.[optionKey] || "",
          );
        }
      }
    }
  }

  if (tokenParams.config) {
    const configKeys = Object.keys(tokenParams.config);
    if (configKeys.some((configKey) => result.includes(`{${configKey}}`))) {
      for (const configKey of configKeys) {
        if (result.includes(`{${configKey}}`)) {
          result = result.replaceAll(
            `{${configKey}}`,
            tokenParams.config[configKey] || "",
          );
        }
      }
    }
  }

  if (result.includes("{workspaceRoot}")) {
    result = result.replaceAll(
      "{workspaceRoot}",
      tokenParams.workspaceRoot ??
        tokenParams.config?.workspaceRoot ??
        findWorkspaceRoot(),
    );
  }

  return result;
};

export const applyWorkspaceProjectTokens = <
  TTokenizerOptions extends ProjectTokenizerOptions = ProjectTokenizerOptions,
>(
  option: string,
  tokenParams: TTokenizerOptions,
): Promise<string> => {
  return applyWorkspaceBaseTokens(option, tokenParams);
};

export const applyWorkspaceTokens = async <
  TTokenizerOptions extends BaseTokenizerOptions = BaseTokenizerOptions,
>(
  options: Record<string, any>,
  tokenParams: TTokenizerOptions,
  tokenizerFn: (
    option: string,
    tokenParams: TTokenizerOptions,
  ) => string | Promise<string>,
): Promise<Record<string, any>> => {
  if (!options) {
    return {};
  }

  const result: Record<string, any> = {};

  for (const option of Object.keys(options)) {
    if (typeof options[option] === "string") {
      result[option] = await Promise.resolve(
        tokenizerFn(options[option], tokenParams),
      );
    } else if (Array.isArray(options[option])) {
      result[option] = await Promise.all(
        options[option].map(async (item: any) =>
          typeof item === "string"
            ? await Promise.resolve(tokenizerFn(item, tokenParams))
            : item,
        ),
      );
    } else if (typeof options[option] === "object") {
      result[option] = await applyWorkspaceTokens(
        options[option],
        tokenParams,
        tokenizerFn,
      );
    } else {
      result[option] = options[option];
    }
  }

  return result;
};
