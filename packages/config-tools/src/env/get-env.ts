import type { LogLevelLabel } from "../types";
import type { StormConfig } from "@storm-software/config";
import { getLogLevelLabel } from "../utilities";
import type { DeepPartial } from "../../declarations.d";
import { correctPaths } from "../utilities/correct-paths";

/**
 * Get the config for an extension module of Storm workspace from environment variables
 *
 * @param extensionName - The name of the extension module
 * @returns The config for the specified Storm extension module. If the module does not exist, `undefined` is returned.
 */
export const getExtensionEnv = <
  TConfig extends Record<string, any> = Record<string, any>
>(
  extensionName: string
): TConfig | undefined => {
  const prefix = `STORM_EXTENSION_${extensionName.toUpperCase()}_`;
  return Object.keys(process.env)
    .filter(key => key.startsWith(prefix))
    .reduce((ret: Record<string, any>, key: string) => {
      const name = key
        .replace(prefix, "")
        .split("_")
        .map(i =>
          i.length > 0
            ? i.trim().charAt(0).toUpperCase() + i.trim().slice(1)
            : ""
        )
        .join("");
      if (name) {
        ret[name] = process.env[key];
      }

      return ret;
    }, {}) as TConfig;
};

/**
 * Get the config for the current Storm workspace
 *
 * @returns The config for the current Storm workspace from environment variables
 */
export const getConfigEnv = (): DeepPartial<StormConfig> => {
  const prefix = "STORM_";

  let config: DeepPartial<StormConfig> = {
    extends: process.env[`${prefix}EXTENDS`],
    name: process.env[`${prefix}NAME`],
    namespace: process.env[`${prefix}NAMESPACE`],
    owner: process.env[`${prefix}OWNER`],
    worker: process.env[`${prefix}WORKER`],
    organization: process.env[`${prefix}ORGANIZATION`],
    packageManager: process.env[
      `${prefix}PACKAGE_MANAGER`
    ] as StormConfig["packageManager"],
    license: process.env[`${prefix}LICENSE`],
    homepage: process.env[`${prefix}HOMEPAGE`],
    timezone: process.env[`${prefix}TIMEZONE`] ?? process.env.TZ,
    locale: process.env[`${prefix}LOCALE`] ?? process.env.LOCALE,
    configFile: correctPaths(process.env[`${prefix}CONFIG_FILE`]),
    workspaceRoot: correctPaths(process.env[`${prefix}WORKSPACE_ROOT`]),
    packageDirectory: correctPaths(process.env[`${prefix}PACKAGE_DIRECTORY`]),
    buildDirectory: correctPaths(process.env[`${prefix}BUILD_DIRECTORY`]),
    skipCache:
      process.env[`${prefix}SKIP_CACHE`] !== undefined
        ? Boolean(process.env[`${prefix}SKIP_CACHE`])
        : undefined,
    cacheDirectory: correctPaths(process.env[`${prefix}CACHE_DIRECTORY`]),
    runtimeVersion: process.env[`${prefix}RUNTIME_VERSION`],
    outputDirectory: correctPaths(process.env[`${prefix}OUTPUT_DIRECTORY`]),
    env: (process.env[`${prefix}ENV`] ??
      process.env.NODE_ENV ??
      process.env.ENVIRONMENT) as StormConfig["env"],
    ci:
      process.env[`${prefix}CI`] !== undefined
        ? Boolean(
            process.env[`${prefix}CI`] ??
              process.env.CI ??
              process.env.CONTINUOUS_INTEGRATION
          )
        : undefined,
    colors: {
      primary: process.env[`${prefix}COLOR_PRIMARY`],
      dark: process.env[`${prefix}COLOR_DARK`],
      light: process.env[`${prefix}COLOR_LIGHT`],
      success: process.env[`${prefix}COLOR_SUCCESS`],
      info: process.env[`${prefix}COLOR_INFO`],
      warning: process.env[`${prefix}COLOR_WARNING`],
      error: process.env[`${prefix}COLOR_ERROR`],
      fatal: process.env[`${prefix}COLOR_FATAL`]
    },
    repository: process.env[`${prefix}REPOSITORY`],
    branch: process.env[`${prefix}BRANCH`],
    preid: process.env[`${prefix}PRE_ID`],
    externalPackagePatterns: process.env[`${prefix}EXTERNAL_PACKAGE_PATTERNS`]
      ? JSON.parse(process.env[`${prefix}EXTERNAL_PACKAGE_PATTERNS`] as string)
      : [],
    logLevel:
      process.env[`${prefix}LOG_LEVEL`] !== null &&
      process.env[`${prefix}LOG_LEVEL`] !== undefined
        ? process.env[`${prefix}LOG_LEVEL`] &&
          Number.isSafeInteger(
            Number.parseInt(process.env[`${prefix}LOG_LEVEL`] as string)
          )
          ? getLogLevelLabel(
              Number.parseInt(process.env[`${prefix}LOG_LEVEL`] as string)
            )
          : (process.env[`${prefix}LOG_LEVEL`] as LogLevelLabel)
        : undefined
  };

  const serializedConfig = process.env[`${prefix}CONFIG`];
  if (serializedConfig) {
    const parsed = JSON.parse(serializedConfig);
    config = {
      ...config,
      ...parsed,
      colors: { ...config.colors, ...parsed.colors },
      extensions: { ...config.extensions, ...parsed.extensions }
    };
  }

  return config;

  /*const extensionPrefix = `${prefix}EXTENSION_`;
  return Object.keys(process.env)
    .filter((key) => key.startsWith(extensionPrefix))
    .reduce((ret: StormConfig, key: string) => {
      const extensionName = key
        .substring(prefix.length, key.indexOf("_", prefix.length))
        .split("_")
        .map((i) => (i.length > 0 ? i.trim().charAt(0).toUpperCase() + i.trim().slice(1) : ""))
        .join("");
      if (extensionName) {
        ret.extensions[extensionName] = getExtensionEnv(extensionName);
      }

      return ret;
    }, config);*/
};
