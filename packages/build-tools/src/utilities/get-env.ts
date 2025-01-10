import { DEFAULT_ENVIRONMENT, DEFAULT_ORGANIZATION } from "../config";
import { TypeScriptBuildEnv, TypeScriptBuildResolvedOptions } from "../types";

export const getEnv = (
  builder: string,
  options: Pick<
    TypeScriptBuildResolvedOptions,
    "name" | "environment" | "organization" | "platform" | "target" | "format"
  >
): TypeScriptBuildEnv => {
  return {
    STORM_BUILD: builder,
    STORM_ORGANIZATION: options.organization || DEFAULT_ORGANIZATION,
    STORM_NAME: options.name,
    STORM_ENV: options.environment || DEFAULT_ENVIRONMENT,
    STORM_PLATFORM: options.platform,
    STORM_FORMAT: JSON.stringify(options.format),
    STORM_TARGET: JSON.stringify(options.target),
    ...(options as Partial<TypeScriptBuildResolvedOptions>).env
  };
};
