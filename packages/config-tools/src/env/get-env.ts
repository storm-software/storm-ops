import {
  type ColorConfigInput,
  type DarkThemeColorConfigInput,
  type LightThemeColorConfigInput,
  type MultiThemeColorConfigInput,
  type SingleThemeColorConfigInput,
  type StormWorkspaceConfig,
  COLOR_KEYS,
  STORM_DEFAULT_DOCS,
  STORM_DEFAULT_HOMEPAGE,
  STORM_DEFAULT_LICENSING
} from "@storm-software/config";
import { getLogLevelLabel } from "../logger/get-log-level";
import type { DeepPartial, LogLevelLabel } from "../types";
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
export const getConfigEnv = (): DeepPartial<StormWorkspaceConfig> => {
  const prefix = "STORM_";

  let config: DeepPartial<StormWorkspaceConfig> = {
    extends: process.env[`${prefix}EXTENDS`] || undefined,
    name: process.env[`${prefix}NAME`] || undefined,
    namespace: process.env[`${prefix}NAMESPACE`] || undefined,
    owner: process.env[`${prefix}OWNER`] || undefined,
    bot: {
      name: process.env[`${prefix}BOT_NAME`] || undefined,
      email: process.env[`${prefix}BOT_EMAIL`] || undefined
    },
    release: {
      banner: process.env[`${prefix}RELEASE_BANNER`] || undefined,
      header: process.env[`${prefix}RELEASE_HEADER`] || undefined,
      footer: process.env[`${prefix}RELEASE_FOOTER`] || undefined
    },
    error: {
      codesFile: process.env[`${prefix}ERROR_CODES_FILE`] || undefined,
      url: process.env[`${prefix}ERROR_URL`] || undefined
    },
    account: {
      twitter: process.env[`${prefix}ACCOUNT_TWITTER`] || undefined,
      discord: process.env[`${prefix}ACCOUNT_DISCORD`] || undefined,
      telegram: process.env[`${prefix}ACCOUNT_TELEGRAM`] || undefined,
      slack: process.env[`${prefix}ACCOUNT_SLACK`] || undefined,
      medium: process.env[`${prefix}ACCOUNT_MEDIUM`] || undefined,
      github: process.env[`${prefix}ACCOUNT_GITHUB`] || undefined
    },
    organization: process.env[`${prefix}ORGANIZATION`] || undefined,
    packageManager:
      (process.env[
        `${prefix}PACKAGE_MANAGER`
      ] as StormWorkspaceConfig["packageManager"]) || undefined,
    license: process.env[`${prefix}LICENSE`] || undefined,
    homepage: process.env[`${prefix}HOMEPAGE`] || undefined,
    docs: process.env[`${prefix}DOCS`] || undefined,
    licensing: process.env[`${prefix}LICENSING`] || undefined,
    contact: process.env[`${prefix}CONTACT`] || undefined,
    timezone: process.env[`${prefix}TIMEZONE`] || process.env.TZ || undefined,
    locale: process.env[`${prefix}LOCALE`] || process.env.LOCALE || undefined,
    configFile: process.env[`${prefix}CONFIG_FILE`]
      ? correctPaths(process.env[`${prefix}CONFIG_FILE`])
      : undefined,
    workspaceRoot: process.env[`${prefix}WORKSPACE_ROOT`]
      ? correctPaths(process.env[`${prefix}WORKSPACE_ROOT`])
      : undefined,
    directories: {
      cache: process.env[`${prefix}CACHE_DIR`]
        ? correctPaths(process.env[`${prefix}CACHE_DIR`])
        : undefined,
      data: process.env[`${prefix}DATA_DIR`]
        ? correctPaths(process.env[`${prefix}DATA_DIR`])
        : undefined,
      config: process.env[`${prefix}CONFIG_DIR`]
        ? correctPaths(process.env[`${prefix}CONFIG_DIR`])
        : undefined,
      temp: process.env[`${prefix}TEMP_DIR`]
        ? correctPaths(process.env[`${prefix}TEMP_DIR`])
        : undefined,
      log: process.env[`${prefix}LOG_DIR`]
        ? correctPaths(process.env[`${prefix}LOG_DIR`])
        : undefined,
      build: process.env[`${prefix}BUILD_DIR`]
        ? correctPaths(process.env[`${prefix}BUILD_DIR`])
        : undefined
    },
    skipCache:
      process.env[`${prefix}SKIP_CACHE`] !== undefined
        ? Boolean(process.env[`${prefix}SKIP_CACHE`])
        : undefined,
    mode:
      ((process.env[`${prefix}MODE`] ??
        process.env.NODE_ENV ??
        process.env.ENVIRONMENT) as StormWorkspaceConfig["mode"]) || undefined,
    // ci:
    //   process.env[`${prefix}CI`] !== undefined
    //     ? Boolean(
    //         process.env[`${prefix}CI`] ??
    //           process.env.CI ??
    //           process.env.CONTINUOUS_INTEGRATION
    //       )
    //     : undefined,

    repository: process.env[`${prefix}REPOSITORY`] || undefined,
    branch: process.env[`${prefix}BRANCH`] || undefined,
    preid: process.env[`${prefix}PRE_ID`] || undefined,
    externalPackagePatterns: process.env[`${prefix}EXTERNAL_PACKAGE_PATTERNS`]
      ? JSON.parse(process.env[`${prefix}EXTERNAL_PACKAGE_PATTERNS`] as string)
      : [],
    registry: {
      github: process.env[`${prefix}REGISTRY_GITHUB`] || undefined,
      npm: process.env[`${prefix}REGISTRY_NPM`] || undefined,
      cargo: process.env[`${prefix}REGISTRY_CARGO`] || undefined,
      cyclone: process.env[`${prefix}REGISTRY_CYCLONE`] || undefined,
      container: process.env[`${prefix}REGISTRY_CONTAINER`] || undefined
    },
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
        : undefined,
    skipConfigLogging:
      process.env[`${prefix}SKIP_CONFIG_LOGGING`] !== undefined
        ? Boolean(process.env[`${prefix}SKIP_CONFIG_LOGGING`])
        : undefined
  };

  const themeNames = Object.keys(process.env).filter(
    envKey =>
      envKey.startsWith(`${prefix}COLOR_`) &&
      COLOR_KEYS.every(
        colorKey =>
          !envKey.startsWith(`${prefix}COLOR_LIGHT_${colorKey}`) &&
          !envKey.startsWith(`${prefix}COLOR_DARK_${colorKey}`)
      )
  );

  config.colors =
    themeNames.length > 0
      ? themeNames.reduce(
          (ret: Record<string, ColorConfigInput>, themeName: string) => {
            ret[themeName] = getThemeColorConfigEnv(prefix, themeName);

            return ret;
          },
          {}
        )
      : getThemeColorConfigEnv(prefix);

  if (config.docs === STORM_DEFAULT_DOCS) {
    if (config.homepage === STORM_DEFAULT_HOMEPAGE) {
      config.docs = `${STORM_DEFAULT_HOMEPAGE}/projects/${config.name}/docs`;
    } else {
      config.docs = `${config.homepage}/docs`;
    }
  }

  if (config.licensing === STORM_DEFAULT_LICENSING) {
    if (config.homepage === STORM_DEFAULT_HOMEPAGE) {
      config.licensing = `${STORM_DEFAULT_HOMEPAGE}/projects/${config.name}/licensing`;
    } else {
      config.licensing = `${config.homepage}/docs`;
    }
  }

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
    .reduce((ret: StormWorkspaceConfig, key: string) => {
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

const getThemeColorConfigEnv = (
  prefix: string,
  theme?: string
): ColorConfigInput => {
  const themeName =
    `COLOR_${theme && theme !== "base" ? `${theme}_` : ""}`.toUpperCase();

  return process.env[`${prefix}${themeName}LIGHT_BRAND`] ||
    process.env[`${prefix}${themeName}DARK_BRAND`]
    ? getMultiThemeColorConfigEnv(prefix + themeName)
    : getSingleThemeColorConfigEnv(prefix + themeName);
};

const getSingleThemeColorConfigEnv = (
  prefix: string
): SingleThemeColorConfigInput => {
  return {
    dark: process.env[`${prefix}DARK`],
    light: process.env[`${prefix}LIGHT`],
    brand: process.env[`${prefix}BRAND`],
    alternate: process.env[`${prefix}ALTERNATE`],
    accent: process.env[`${prefix}ACCENT`],
    link: process.env[`${prefix}LINK`],
    help: process.env[`${prefix}HELP`],
    success: process.env[`${prefix}SUCCESS`],
    info: process.env[`${prefix}INFO`],
    warning: process.env[`${prefix}WARNING`],
    danger: process.env[`${prefix}DANGER`],
    fatal: process.env[`${prefix}FATAL`],
    positive: process.env[`${prefix}POSITIVE`],
    negative: process.env[`${prefix}NEGATIVE`]
  };
};

const getMultiThemeColorConfigEnv = (
  prefix: string
): MultiThemeColorConfigInput => {
  return {
    light: getBaseThemeColorConfigEnv<"light", typeof prefix>(
      `${prefix}_LIGHT_`
    ),
    dark: getBaseThemeColorConfigEnv<"dark", typeof prefix>(`${prefix}_DARK_`)
  };
};

type ColorThemeTypes = "dark" | "light";

const getBaseThemeColorConfigEnv = <
  TColorThemeType extends ColorThemeTypes = ColorThemeTypes,
  TExistingPrefix extends string = string,
  TResult = TColorThemeType extends "dark"
    ? DarkThemeColorConfigInput
    : LightThemeColorConfigInput
>(
  prefix: `${TExistingPrefix}_${Uppercase<TColorThemeType>}_`
): TResult => {
  return {
    foreground: process.env[`${prefix}FOREGROUND`],
    background: process.env[`${prefix}BACKGROUND`],
    brand: process.env[`${prefix}BRAND`],
    alternate: process.env[`${prefix}ALTERNATE`],
    accent: process.env[`${prefix}ACCENT`],
    link: process.env[`${prefix}LINK`],
    help: process.env[`${prefix}HELP`],
    success: process.env[`${prefix}SUCCESS`],
    info: process.env[`${prefix}INFO`],
    warning: process.env[`${prefix}WARNING`],
    danger: process.env[`${prefix}DANGER`],
    fatal: process.env[`${prefix}FATAL`],
    positive: process.env[`${prefix}POSITIVE`],
    negative: process.env[`${prefix}NEGATIVE`]
  } as TResult;
};
