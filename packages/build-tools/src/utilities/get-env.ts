import { DEFAULT_ENVIRONMENT, DEFAULT_ORGANIZATION } from "../config";
import { TypeScriptBuildEnv, TypeScriptBuildResolvedOptions } from "../types";

export const getEnv = (
  builder: string,
  options: Pick<
    TypeScriptBuildResolvedOptions,
    "name" | "mode" | "orgName" | "platform" | "target" | "format"
  >,
): TypeScriptBuildEnv => {
  return {
    STORM_BUILD: builder,
    STORM_ORG: options.orgName || DEFAULT_ORGANIZATION,
    STORM_NAME: options.name,
    STORM_MODE: options.mode || DEFAULT_ENVIRONMENT,
    STORM_PLATFORM: options.platform,
    STORM_FORMAT: JSON.stringify(options.format),
    STORM_TARGET: JSON.stringify(options.target),
    ...(options as Partial<TypeScriptBuildResolvedOptions>).env,
  };
};
