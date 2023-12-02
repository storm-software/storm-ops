import { StormConfig } from "../types";

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
  process.env[`${prefix}NAME`] = config.name;
  process.env[`${prefix}NAMESPACE`] = config.namespace;
  process.env[`${prefix}OWNER`] = config.owner;
  process.env[`${prefix}WORKER`] = config.worker;
  process.env[`${prefix}ORGANIZATION`] = config.organization;
  process.env[`${prefix}LICENSE`] = config.license;
  process.env[`${prefix}HOMEPAGE`] = config.homepage;
  process.env[`${prefix}TIMEZONE`] = config.timezone;
  process.env.TZ = config.timezone;
  process.env[`${prefix}LOCALE`] = config.locale;
  process.env.LOCALE = config.locale;
  process.env[`${prefix}CONFIG_FILE`] = config.configFile;
  process.env[`${prefix}WORKSPACE_ROOT`] = config.workspaceRoot;
  process.env[`${prefix}PACKAGE_DIRECTORY`] = config.packageDirectory;
  process.env[`${prefix}BUILD_DIRECTORY`] = config.buildDirectory;
  process.env[`${prefix}RUNTIME_VERSION`] = config.runtimeVersion;
  process.env[`${prefix}RUNTIME_DIRECTORY`] = config.runtimeDirectory;
  process.env[`${prefix}ENV`] = config.env;
  process.env.NODE_ENV = config.env;
  process.env.ENVIRONMENT = config.env;
  process.env[`${prefix}CI`] = String(config.ci);
  process.env.CI = String(config.ci);
  process.env.CONTINUOUS_INTEGRATION = String(config.ci);
  process.env[`${prefix}COLOR_PRIMARY`] = config.colors.primary;
  process.env[`${prefix}COLOR_BACKGROUND`] = config.colors.background;
  process.env[`${prefix}COLOR_SUCCESS`] = config.colors.success;
  process.env[`${prefix}COLOR_INFO`] = config.colors.info;
  process.env[`${prefix}COLOR_WARNING`] = config.colors.warning;
  process.env[`${prefix}COLOR_ERROR`] = config.colors.error;
  process.env[`${prefix}COLOR_FATAL`] = config.colors.fatal;
  process.env[`${prefix}REPOSITORY`] = config.repository;
  process.env[`${prefix}BRANCH`] = config.branch;
  process.env[`${prefix}PRE_MAJOR`] = String(config.preMajor);
  process.env[`${prefix}CONFIG`] = JSON.stringify(config);

  Object.keys(config.extensions ?? {}).forEach((key: string) => {
    config.extensions[key] &&
      Object.keys(config.extensions[key]) &&
      setExtensionEnv(key, config.extensions[key]);
  });
};
