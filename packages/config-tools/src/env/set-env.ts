import type {
  ColorConfigMap,
  DarkThemeColorConfig,
  LightThemeColorConfig,
  MultiThemeColorConfig,
  SingleThemeColorConfig,
  StormConfig
} from "@storm-software/config";
import { getLogLevel } from "../logger/get-log-level";
import { LogLevel } from "../types";
import { correctPaths } from "../utilities/correct-paths";

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
  for (const key of Object.keys(extension ?? {})) {
    if (extension[key]) {
      const result =
        key
          ?.replace(/([A-Z])+/g, (input?: string) =>
            input ? input[0]?.toUpperCase() + input.slice(1) : ""
          )
          .split(/(?=[A-Z])|[.\-\s_]/)
          .map((x: string) => x.toLowerCase()) ?? [];

      let extensionKey: string;
      if (result.length === 0) {
        return;
      }
      if (result.length === 1) {
        extensionKey = result[0]?.toUpperCase() ?? "";
      } else {
        extensionKey = result.reduce((ret: string, part: string) => {
          return `${ret}_${part.toLowerCase()}`;
        });
      }

      process.env[
        `STORM_EXTENSION_${extensionName.toUpperCase()}_${extensionKey.toUpperCase()}`
      ] = extension[key];
    }
  }
};

/**
 * Get the config for the current Storm workspace
 *
 * @returns The config for the current Storm workspace from environment variables
 */
export const setConfigEnv = (config: StormConfig) => {
  const prefix = "STORM_";

  if (config.extends) {
    process.env[`${prefix}EXTENDS`] = Array.isArray(config.extends)
      ? JSON.stringify(config.extends)
      : config.extends;
  }
  if (config.name) {
    process.env[`${prefix}NAME`] = config.name;
  }
  if (config.namespace) {
    process.env[`${prefix}NAMESPACE`] = config.namespace;
  }
  if (config.owner) {
    process.env[`${prefix}OWNER`] = config.owner;
  }
  if (config.bot) {
    process.env[`${prefix}BOT_NAME`] = config.bot.name;
    process.env[`${prefix}BOT_EMAIL`] = config.bot.email;
  }
  if (config.release) {
    process.env[`${prefix}RELEASE_BANNER`] = config.release.banner;
    process.env[`${prefix}RELEASE_HEADER`] = config.release.header;
    process.env[`${prefix}RELEASE_FOOTER`] = config.release.footer;
  }
  if (config.organization) {
    process.env[`${prefix}ORGANIZATION`] = config.organization;
  }
  if (config.packageManager) {
    process.env[`${prefix}PACKAGE_MANAGER`] = config.packageManager;
  }
  if (config.license) {
    process.env[`${prefix}LICENSE`] = config.license;
  }
  if (config.homepage) {
    process.env[`${prefix}HOMEPAGE`] = config.homepage;
  }
  if (config.docs) {
    process.env[`${prefix}DOCS`] = config.docs;
  }
  if (config.licensing) {
    process.env[`${prefix}LICENSING`] = config.licensing;
  }
  if (config.timezone) {
    process.env[`${prefix}TIMEZONE`] = config.timezone;
    process.env.TZ = config.timezone;
    process.env.DEFAULT_TIMEZONE = config.timezone;
  }
  if (config.locale) {
    process.env[`${prefix}LOCALE`] = config.locale;
    process.env.LOCALE = config.locale;
    process.env.DEFAULT_LOCALE = config.locale;
    process.env.LANG = config.locale
      ? `${config.locale.replaceAll("-", "_")}.UTF-8`
      : "en_US.UTF-8";
  }
  if (config.configFile) {
    process.env[`${prefix}CONFIG_FILE`] = correctPaths(config.configFile);
  }
  if (config.workspaceRoot) {
    process.env[`${prefix}WORKSPACE_ROOT`] = correctPaths(config.workspaceRoot);
    process.env.NX_WORKSPACE_ROOT = correctPaths(config.workspaceRoot);
    process.env.NX_WORKSPACE_ROOT_PATH = correctPaths(config.workspaceRoot);
  }

  if (config.directories) {
    if (!config.skipCache && config.directories.cache) {
      process.env[`${prefix}CACHE_DIR`] = correctPaths(
        config.directories.cache
      );
    }
    if (config.directories.data) {
      process.env[`${prefix}DATA_DIR`] = correctPaths(config.directories.data);
    }
    if (config.directories.config) {
      process.env[`${prefix}CONFIG_DIR`] = correctPaths(
        config.directories.config
      );
    }
    if (config.directories.temp) {
      process.env[`${prefix}TEMP_DIR`] = correctPaths(config.directories.temp);
    }
    if (config.directories.log) {
      process.env[`${prefix}LOG_DIR`] = correctPaths(config.directories.log);
    }
    if (config.directories.build) {
      process.env[`${prefix}BUILD_DIR`] = correctPaths(
        config.directories.build
      );
    }
  }

  if (config.skipCache !== undefined) {
    process.env[`${prefix}SKIP_CACHE`] = String(config.skipCache);
    if (config.skipCache) {
      process.env.NX_SKIP_NX_CACHE ??= String(config.skipCache);
      process.env.NX_CACHE_PROJECT_GRAPH ??= String(config.skipCache);
    }
  }
  if (config.mode) {
    process.env[`${prefix}MODE`] = config.mode;
    process.env.NODE_ENV = config.mode;
    process.env.ENVIRONMENT = config.mode;
  }
  // if (config.ci) {
  //   process.env[`${prefix}CI`] = String(config.ci);
  //   process.env.CI = String(config.ci);
  //   process.env.CONTINUOUS_INTEGRATION = String(config.ci);
  // }

  // Check if the color configuration is set using separate dark and light color
  // palettes or a single multi-theme color palettes
  if (
    (config.colors as ColorConfigMap)?.base?.light ||
    (config.colors as ColorConfigMap)?.base?.dark
  ) {
    for (const key of Object.keys(config.colors as ColorConfigMap)) {
      setThemeColorConfigEnv(`${prefix}COLOR_${key}_`, config.colors[key]);
    }
  } else {
    setThemeColorConfigEnv(
      `${prefix}COLOR_`,
      config.colors as MultiThemeColorConfig | SingleThemeColorConfig
    );
  }

  if (config.repository) {
    process.env[`${prefix}REPOSITORY`] = config.repository;
  }
  if (config.branch) {
    process.env[`${prefix}BRANCH`] = config.branch;
  }
  if (config.preid) {
    process.env[`${prefix}PRE_ID`] = String(config.preid);
  }
  if (config.externalPackagePatterns) {
    process.env[`${prefix}EXTERNAL_PACKAGE_PATTERNS`] = JSON.stringify(
      config.externalPackagePatterns
    );
  }
  if (config.registry) {
    if (config.registry.github) {
      process.env[`${prefix}REGISTRY_GITHUB`] = String(config.registry.github);
    }
    if (config.registry.npm) {
      process.env[`${prefix}REGISTRY_NPM`] = String(config.registry.npm);
    }
    if (config.registry.cargo) {
      process.env[`${prefix}REGISTRY_CARGO`] = String(config.registry.cargo);
    }
    if (config.registry.cyclone) {
      process.env[`${prefix}REGISTRY_CYCLONE`] = String(
        config.registry.cyclone
      );
    }
    if (config.registry.container) {
      process.env[`${prefix}REGISTRY_CONTAINER`] = String(
        config.registry.cyclone
      );
    }
  }
  if (config.logLevel) {
    process.env[`${prefix}LOG_LEVEL`] = String(config.logLevel);
    process.env.LOG_LEVEL = String(config.logLevel);
    process.env.NX_VERBOSE_LOGGING = String(
      getLogLevel(config.logLevel) >= LogLevel.DEBUG ? true : false
    );
    process.env.RUST_BACKTRACE =
      getLogLevel(config.logLevel) >= LogLevel.DEBUG ? "full" : "none";
  }
  if (config.skipConfigLogging !== undefined) {
    process.env[`${prefix}SKIP_CONFIG_LOGGING`] = String(
      config.skipConfigLogging
    );
  }

  process.env[`${prefix}CONFIG`] = JSON.stringify(config);

  for (const key of Object.keys(config.extensions ?? {})) {
    if (config.extensions[key] && Object.keys(config.extensions[key])) {
      setExtensionEnv(key, config.extensions[key]);
    }
  }
};

const setThemeColorConfigEnv = (
  prefix: string,
  config: MultiThemeColorConfig | SingleThemeColorConfig
) => {
  // Check if the color configuration is set using separate dark and light color
  // palettes or a single multi-theme color palettes
  return (config as MultiThemeColorConfig)?.light?.brand ||
    (config as MultiThemeColorConfig)?.dark?.brand
    ? setMultiThemeColorConfigEnv(prefix, config as MultiThemeColorConfig)
    : setSingleThemeColorConfigEnv(prefix, config as SingleThemeColorConfig);
};

const setSingleThemeColorConfigEnv = (
  prefix: string,
  config: SingleThemeColorConfig
) => {
  if (config.dark) {
    process.env[`${prefix}DARK`] = config.dark;
  }
  if (config.light) {
    process.env[`${prefix}LIGHT`] = config.light;
  }
  if (config.brand) {
    process.env[`${prefix}BRAND`] = config.brand;
  }
  if (config.alternate) {
    process.env[`${prefix}ALTERNATE`] = config.alternate;
  }
  if (config.accent) {
    process.env[`${prefix}ACCENT`] = config.accent;
  }
  if (config.link) {
    process.env[`${prefix}LINK`] = config.link;
  }
  if (config.help) {
    process.env[`${prefix}HELP`] = config.help;
  }
  if (config.success) {
    process.env[`${prefix}SUCCESS`] = config.success;
  }
  if (config.info) {
    process.env[`${prefix}INFO`] = config.info;
  }
  if (config.warning) {
    process.env[`${prefix}WARNING`] = config.warning;
  }
  if (config.danger) {
    process.env[`${prefix}DANGER`] = config.danger;
  }
  if (config.fatal) {
    process.env[`${prefix}FATAL`] = config.fatal;
  }
  if (config.positive) {
    process.env[`${prefix}POSITIVE`] = config.positive;
  }
  if (config.negative) {
    process.env[`${prefix}NEGATIVE`] = config.negative;
  }
};

const setMultiThemeColorConfigEnv = (
  prefix: string,
  config: MultiThemeColorConfig
) => {
  return {
    light: setBaseThemeColorConfigEnv(`${prefix}LIGHT_`, config.light),
    dark: setBaseThemeColorConfigEnv(`${prefix}DARK_`, config.dark)
  };
};

const setBaseThemeColorConfigEnv = (
  prefix: string,
  config: DarkThemeColorConfig | LightThemeColorConfig
) => {
  if (config.foreground) {
    process.env[`${prefix}FOREGROUND`] = config.foreground;
  }
  if (config.background) {
    process.env[`${prefix}BACKGROUND`] = config.background;
  }
  if (config.brand) {
    process.env[`${prefix}BRAND`] = config.brand;
  }
  if (config.alternate) {
    process.env[`${prefix}ALTERNATE`] = config.alternate;
  }
  if (config.accent) {
    process.env[`${prefix}ACCENT`] = config.accent;
  }
  if (config.link) {
    process.env[`${prefix}LINK`] = config.link;
  }
  if (config.help) {
    process.env[`${prefix}HELP`] = config.help;
  }
  if (config.success) {
    process.env[`${prefix}SUCCESS`] = config.success;
  }
  if (config.info) {
    process.env[`${prefix}INFO`] = config.info;
  }
  if (config.warning) {
    process.env[`${prefix}WARNING`] = config.warning;
  }
  if (config.danger) {
    process.env[`${prefix}DANGER`] = config.danger;
  }
  if (config.fatal) {
    process.env[`${prefix}FATAL`] = config.fatal;
  }
  if (config.positive) {
    process.env[`${prefix}POSITIVE`] = config.positive;
  }
  if (config.negative) {
    process.env[`${prefix}NEGATIVE`] = config.negative;
  }
};
