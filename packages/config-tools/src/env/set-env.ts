import { LogLevel, StormConfig } from "../types";
import { getLogLevel } from "../utilities/get-log-level";

/**
 * Get the config for an extension module of Storm workspace from environment variables
 *
 * @param extensionName - The name of the extension module
 * @returns The config for the specified Storm extension module. If the module does not exist, `undefined` is returned.
 */
export const setExtensionEnv = <
  TConfig extends Record<string, any> = Record<string, any>
>(
  extensionName: string,
  extension: TConfig
) => {
  Object.keys(extension ?? {}).forEach((key: string) => {
    if (extension[key]) {
      let result =
        key
          ?.replace(/([A-Z])+/g, (input?: string) =>
            input ? input[0].toUpperCase() + input.slice(1) : ""
          )
          .split(/(?=[A-Z])|[\.\-\s_]/)
          .map((x: string) => x.toLowerCase()) ?? [];

      let extensionKey;
      if (result.length === 0) {
        return;
      } else if (result.length === 1) {
        extensionKey = result[0].toUpperCase();
      } else {
        extensionKey = result.reduce((ret: string, part: string) => {
          return `${ret}_${part.toLowerCase()}`;
        });
      }

      process.env[
        `STORM_EXTENSION_${extensionName.toUpperCase()}_${extensionKey.toUpperCase()}`
      ] = extension[key];
    }
  });
};

/**
 * Get the config for the current Storm workspace
 *
 * @returns The config for the current Storm workspace from environment variables
 */
export const setConfigEnv = (config: StormConfig) => {
  const prefix = `STORM_`;

  config.name && (process.env[`${prefix}NAME`] = config.name);
  config.namespace && (process.env[`${prefix}NAMESPACE`] = config.namespace);
  config.owner && (process.env[`${prefix}OWNER`] = config.owner);
  config.worker && (process.env[`${prefix}WORKER`] = config.worker);
  config.organization &&
    (process.env[`${prefix}ORGANIZATION`] = config.organization);
  config.packageManager &&
    (process.env[`${prefix}PACKAGE_MANAGER`] = config.packageManager);
  config.license && (process.env[`${prefix}LICENSE`] = config.license);
  config.homepage && (process.env[`${prefix}HOMEPAGE`] = config.homepage);
  config.timezone && (process.env[`${prefix}TIMEZONE`] = config.timezone);
  config.timezone && (process.env.TZ = config.timezone);
  config.timezone && (process.env.DEFAULT_TIMEZONE = config.timezone);
  config.locale && (process.env[`${prefix}LOCALE`] = config.locale);
  config.locale && (process.env.LOCALE = config.locale);
  config.locale && (process.env.DEFAULT_LOCALE = config.locale);
  config.locale &&
    (process.env.LANG = config.locale
      ? `${config.locale.replaceAll("-", "_")}.UTF-8`
      : "en_US.UTF-8");
  config.configFile &&
    (process.env[`${prefix}CONFIG_FILE`] = config.configFile);
  config.workspaceRoot &&
    (process.env[`${prefix}WORKSPACE_ROOT`] = config.workspaceRoot);
  config.workspaceRoot &&
    (process.env.NX_WORKSPACE_ROOT = config.workspaceRoot);
  config.workspaceRoot &&
    (process.env.NX_WORKSPACE_ROOT_PATH = config.workspaceRoot);
  config.packageDirectory &&
    (process.env[`${prefix}PACKAGE_DIRECTORY`] = config.packageDirectory);
  config.buildDirectory &&
    (process.env[`${prefix}BUILD_DIRECTORY`] = config.buildDirectory);
  config.runtimeVersion &&
    (process.env[`${prefix}RUNTIME_VERSION`] = config.runtimeVersion);
  config.runtimeDirectory &&
    (process.env[`${prefix}RUNTIME_DIRECTORY`] = config.runtimeDirectory);
  config.env && (process.env[`${prefix}ENV`] = config.env);
  config.env && (process.env.NODE_ENV = config.env);
  config.env && (process.env.ENVIRONMENT = config.env);
  config.ci && (process.env[`${prefix}CI`] = String(config.ci));
  config.ci && (process.env.CI = String(config.ci));
  config.ci && (process.env.CONTINUOUS_INTEGRATION = String(config.ci));
  config.colors.primary &&
    (process.env[`${prefix}COLOR_PRIMARY`] = config.colors.primary);
  config.colors.background &&
    (process.env[`${prefix}COLOR_BACKGROUND`] = config.colors.background);
  config.colors.success &&
    (process.env[`${prefix}COLOR_SUCCESS`] = config.colors.success);
  config.colors.info &&
    (process.env[`${prefix}COLOR_INFO`] = config.colors.info);
  config.colors.warning &&
    (process.env[`${prefix}COLOR_WARNING`] = config.colors.warning);
  config.colors.error &&
    (process.env[`${prefix}COLOR_ERROR`] = config.colors.error);
  config.colors.fatal &&
    (process.env[`${prefix}COLOR_FATAL`] = config.colors.fatal);
  config.repository && (process.env[`${prefix}REPOSITORY`] = config.repository);
  config.branch && (process.env[`${prefix}BRANCH`] = config.branch);
  config.preMajor &&
    (process.env[`${prefix}PRE_MAJOR`] = String(config.preMajor));
  config.logLevel &&
    (process.env[`${prefix}LOG_LEVEL`] = String(config.logLevel));
  config.logLevel && (process.env.LOG_LEVEL = String(config.logLevel));
  config.logLevel &&
    (process.env.NX_VERBOSE_LOGGING = String(
      getLogLevel(config.logLevel) >= LogLevel.DEBUG ? true : false
    ));
  config.logLevel &&
    (process.env.RUST_BACKTRACE =
      getLogLevel(config.logLevel) >= LogLevel.DEBUG ? "full" : "none");

  config && (process.env[`${prefix}CONFIG`] = JSON.stringify(config));

  Object.keys(config.extensions ?? {}).forEach((key: string) => {
    config.extensions[key] &&
      Object.keys(config.extensions[key]) &&
      setExtensionEnv(key, config.extensions[key]);
  });
};
