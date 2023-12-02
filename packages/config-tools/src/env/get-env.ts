import { StormConfig } from "../types";
import { getDefaultConfig } from "../utilities/get-default-config";

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
      name && (ret[name] = process.env[key]);

      return ret;
    }, {}) as TConfig;
};

/**
 * Get the config for the current Storm workspace
 *
 * @returns The config for the current Storm workspace from environment variables
 */
export const getConfigEnv = (): Partial<StormConfig> => {
  const prefix = `STORM_`;

  const defaultConfig = getDefaultConfig();
  let config: Partial<StormConfig> = {
    name: process.env[`${prefix}NAME`],
    namespace: process.env[`${prefix}NAMESPACE`],
    owner: process.env[`${prefix}OWNER`],
    worker: process.env[`${prefix}WORKER`],
    organization: process.env[`${prefix}ORGANIZATION`],
    license: process.env[`${prefix}LICENSE`],
    homepage: process.env[`${prefix}HOMEPAGE`],
    timezone: process.env[`${prefix}TIMEZONE`] ?? process.env.TZ,
    locale: process.env[`${prefix}LOCALE`] ?? process.env.LOCALE,
    configFile: process.env[`${prefix}CONFIG_FILE`],
    workspaceRoot: process.env[`${prefix}WORKSPACE_ROOT`],
    packageDirectory: process.env[`${prefix}PACKAGE_DIRECTORY`],
    buildDirectory: process.env[`${prefix}BUILD_DIRECTORY`],
    runtimeVersion: process.env[`${prefix}RUNTIME_VERSION`],
    runtimeDirectory: process.env[`${prefix}RUNTIME_DIRECTORY`],
    env: (process.env[`${prefix}ENV`] ??
      process.env.NODE_ENV ??
      process.env.ENVIRONMENT) as "development" | "staging" | "production",
    ci: Boolean(
      process.env[`${prefix}CI`] ??
        process.env.CI ??
        process.env.CONTINUOUS_INTEGRATION
    ),
    colors: {
      primary: process.env[`${prefix}COLOR_PRIMARY`],
      background: process.env[`${prefix}COLOR_BACKGROUND`],
      success: process.env[`${prefix}COLOR_SUCCESS`],
      info: process.env[`${prefix}COLOR_INFO`],
      warning: process.env[`${prefix}COLOR_WARNING`],
      error: process.env[`${prefix}COLOR_ERROR`],
      fatal: process.env[`${prefix}COLOR_FATAL`]
    },
    repository: process.env[`${prefix}REPOSITORY`],
    branch: process.env[`${prefix}BRANCH`],
    preMajor: Boolean(process.env[`${prefix}PRE_MAJOR`]),
    extensions: {}
  };

  const serializedConfig = process.env[`${prefix}CONFIG`];
  if (serializedConfig) {
    config = Object.assign(config, JSON.parse(serializedConfig));
  }

  const extensionPrefix = `${prefix}EXTENSION_`;
  return Object.keys(process.env)
    .filter(key => key.startsWith(extensionPrefix))
    .reduce((ret: StormConfig, key: string) => {
      const extensionName = key
        .substring(prefix.length, key.indexOf("_", prefix.length))
        .split("_")
        .map(i =>
          i.length > 0
            ? i.trim().charAt(0).toUpperCase() + i.trim().slice(1)
            : ""
        )
        .join("");
      extensionName &&
        (ret.extensions[extensionName] = getExtensionEnv(extensionName));

      return ret;
    }, config);
};
