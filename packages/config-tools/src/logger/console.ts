/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Colors, StormWorkspaceConfig } from "@storm-software/config";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { LogLevel, LogLevelLabel } from "../types";
import { DEFAULT_COLOR_CONFIG, getColor } from "../utilities/colors";
import { getChalk } from "./chalk";
import { CONSOLE_ICONS } from "./console-icons";
import { formatTimestamp } from "./format-timestamp";
import { getLogLevel } from "./get-log-level";

export interface GetLogFnOptions {
  /**
   * Whether to include the full date and time in the log message (defaults to `false`, which only includes the time)
   *
   * @defaultValue false
   */
  fullDateTime?: boolean;

  /**
   * Whether to hide the date and time in the log message (defaults to `false`, which includes the date and time based on the `fullDateTime` option)
   *
   * @defaultValue false
   */
  hideDateTime?: boolean;

  /**
   * The color configuration to use for the log message (defaults to the default Storm color configuration)
   */
  chalk?: ReturnType<typeof getChalk>;
}

/**
 * Get the log function for a log level
 *
 * @param logLevel - The log level
 * @param config - The Storm configuration
 * @returns The log function
 */
export const getLogFn = (
  logLevel: number | LogLevel = LogLevel.INFO,
  config: Partial<StormWorkspaceConfig> = {},
  options: GetLogFnOptions = {}
): ((message?: any) => void) => {
  const {
    chalk: _chalk = getChalk(),
    fullDateTime = false,
    hideDateTime = false
  } = options;

  const colors =
    !(config.colors as Colors)?.dark &&
    !config.colors?.["base"] &&
    !config.colors?.["base"]?.dark
      ? DEFAULT_COLOR_CONFIG
      : (config.colors as Colors)?.dark &&
          typeof (config.colors as Colors).dark === "string"
        ? config.colors
        : config.colors?.["base"]?.dark &&
            typeof config.colors["base"].dark === "string"
          ? config.colors["base"].dark
          : config.colors?.["base"]
            ? config.colors?.["base"]
            : DEFAULT_COLOR_CONFIG;

  // (config.colors?.dark && typeof config.colors.dark === "string"
  //   ? config.colors
  //   : typeof config?.colors?.dark === "object" ?) ?? DEFAULT_COLOR_CONFIG;

  const configLogLevel = (config.logLevel ||
    process.env.STORM_LOG_LEVEL ||
    LogLevelLabel.INFO) as LogLevelLabel;

  if (
    logLevel > getLogLevel(configLogLevel) ||
    logLevel <= LogLevel.SILENT ||
    getLogLevel(configLogLevel) <= LogLevel.SILENT
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (_: string) => {
      /* noop */
    };
  }

  if (typeof logLevel === "number" && LogLevel.FATAL >= logLevel) {
    return (message?: any) => {
      console.error(
        `
${
  hideDateTime ? "" : `${_chalk.gray(formatTimestamp(fullDateTime))} `
}${_chalk.hex(colors.fatal ?? DEFAULT_COLOR_CONFIG.dark.fatal)(
          `[${CONSOLE_ICONS[LogLevelLabel.FATAL]} Fatal] `
        )}${_chalk.bold.whiteBright(formatLogMessage(message))}
`
      );
    };
  }

  if (typeof logLevel === "number" && LogLevel.ERROR >= logLevel) {
    return (message?: any) => {
      console.error(
        `
${
  hideDateTime ? "" : `${_chalk.gray(formatTimestamp(fullDateTime))} `
}${_chalk.hex(colors.danger ?? DEFAULT_COLOR_CONFIG.dark.danger)(
          `[${CONSOLE_ICONS[LogLevelLabel.ERROR]} Error] `
        )}${_chalk.bold.whiteBright(formatLogMessage(message))}
`
      );
    };
  }

  if (typeof logLevel === "number" && LogLevel.WARN >= logLevel) {
    return (message?: any) => {
      console.warn(
        `
${
  hideDateTime ? "" : `${_chalk.gray(formatTimestamp(fullDateTime))} `
}${_chalk.hex(colors.warning ?? DEFAULT_COLOR_CONFIG.dark.warning)(
          `[${CONSOLE_ICONS[LogLevelLabel.WARN]} Warn] `
        )}${_chalk.bold.whiteBright(formatLogMessage(message))}
`
      );
    };
  }

  if (typeof logLevel === "number" && LogLevel.SUCCESS >= logLevel) {
    return (message?: any) => {
      console.info(
        `
${
  hideDateTime ? "" : `${_chalk.gray(formatTimestamp(fullDateTime))} `
}${_chalk.hex(colors.success ?? DEFAULT_COLOR_CONFIG.dark.success)(
          `[${CONSOLE_ICONS[LogLevelLabel.SUCCESS]} Success] `
        )}${_chalk.bold.whiteBright(formatLogMessage(message))}
`
      );
    };
  }

  if (typeof logLevel === "number" && LogLevel.INFO >= logLevel) {
    return (message?: any) => {
      console.info(
        `
${
  hideDateTime ? "" : `${_chalk.gray(formatTimestamp(fullDateTime))} `
}${_chalk.hex(colors.info ?? DEFAULT_COLOR_CONFIG.dark.info)(
          `[${CONSOLE_ICONS[LogLevelLabel.INFO]} Info] `
        )}${_chalk.bold.whiteBright(formatLogMessage(message))}
`
      );
    };
  }

  if (typeof logLevel === "number" && LogLevel.PERFORMANCE >= logLevel) {
    return (message?: any) => {
      console.debug(
        `
${
  hideDateTime ? "" : `${_chalk.gray(formatTimestamp(fullDateTime))} `
}${_chalk.hex(colors.performance ?? DEFAULT_COLOR_CONFIG.dark.performance)(
          `[${CONSOLE_ICONS[LogLevelLabel.PERFORMANCE]} Performance] `
        )}${_chalk.bold.whiteBright(formatLogMessage(message))}
`
      );
    };
  }

  if (typeof logLevel === "number" && LogLevel.DEBUG >= logLevel) {
    return (message?: any) => {
      console.debug(
        `
${
  hideDateTime ? "" : `${_chalk.gray(formatTimestamp(fullDateTime))} `
}${_chalk.hex(colors.debug ?? DEFAULT_COLOR_CONFIG.dark.debug)(
          `[${CONSOLE_ICONS[LogLevelLabel.DEBUG]} Debug] `
        )}${_chalk.bold.whiteBright(formatLogMessage(message))}
`
      );
    };
  }

  if (typeof logLevel === "number" && LogLevel.TRACE >= logLevel) {
    return (message?: any) => {
      console.debug(
        `
${
  hideDateTime ? "" : `${_chalk.gray(formatTimestamp(fullDateTime))} `
}${_chalk.hex("#bbbbbb")(
          `[${CONSOLE_ICONS[LogLevelLabel.TRACE]} Trace] `
        )}${_chalk.bold.whiteBright(formatLogMessage(message))}
`
      );
    };
  }

  return (message?: any) => {
    console.log(
      `
${
  hideDateTime ? "" : `${_chalk.gray(formatTimestamp(fullDateTime))} `
}${_chalk.hex(colors.brand ?? DEFAULT_COLOR_CONFIG.dark.brand)(
        `[${CONSOLE_ICONS[LogLevelLabel.ALL]} System] `
      )}${_chalk.bold.whiteBright(formatLogMessage(message))}
`
    );
  };
};

/**
 * Write a message to the console at the `fatal` log level
 *
 * @param message - The message to write
 * @param config - The Storm configuration
 */
export const writeFatal = (
  message?: any,
  config?: Partial<StormWorkspaceConfig>
) => getLogFn(LogLevel.FATAL, config)(message);

/**
 * Write a message to the console at the `error` log level
 *
 * @param message - The message to write
 * @param config - The Storm configuration
 */
export const writeError = (
  message?: any,
  config?: Partial<StormWorkspaceConfig>
) => getLogFn(LogLevel.ERROR, config)(message);

/**
 * Write a message to the console at the `warning` log level
 *
 * @param message - The message to write
 * @param config - The Storm configuration
 */
export const writeWarning = (
  message?: any,
  config?: Partial<StormWorkspaceConfig>
) => getLogFn(LogLevel.WARN, config)(message);

/**
 * Write a message to the console at the `info` log level
 *
 * @param message - The message to write
 * @param config - The Storm configuration
 */
export const writeInfo = (
  message?: any,
  config?: Partial<StormWorkspaceConfig>
) => getLogFn(LogLevel.INFO, config)(message);

/**
 * Write a message to the console at the `success` log level
 *
 * @param message - The message to write
 * @param config - The Storm configuration
 */
export const writeSuccess = (
  message?: any,
  config?: Partial<StormWorkspaceConfig>
) => getLogFn(LogLevel.SUCCESS, config)(message);

/**
 * Write a message to the console at the `performance` log level
 *
 * @param message - The message to write
 * @param config - The Storm configuration
 */
export const writePerformance = (
  message?: any,
  config?: Partial<StormWorkspaceConfig>
) => getLogFn(LogLevel.PERFORMANCE, config)(message);

/**
 * Write a message to the console at the `debug` log level
 *
 * @param message - The message to write
 * @param config - The Storm configuration
 */
export const writeDebug = (
  message?: any,
  config?: Partial<StormWorkspaceConfig>
) => getLogFn(LogLevel.DEBUG, config)(message);

/**
 * Write a message to the console at the `trace` log level
 *
 * @param message - The message to write
 * @param config - The Storm configuration
 */
export const writeTrace = (
  message?: any,
  config?: Partial<StormWorkspaceConfig>
) => getLogFn(LogLevel.TRACE, config)(message);

/**
 * Write a message to the console at the `all` log level
 *
 * @param message - The message to write
 * @param config - The Storm configuration
 */
export const writeSystem = (
  message?: any,
  config?: Partial<StormWorkspaceConfig>
) => getLogFn(LogLevel.ALL, config)(message);

/**
 * Get a stopwatch function
 *
 * @param name - The name of the process
 * @returns The stopwatch function
 */
export const getStopwatch = (name: string) => {
  const start = new Date();
  return () => {
    writePerformance(
      `The${name ? ` ${name}` : ""} process took ${formatDistanceToNow(start, {
        includeSeconds: true
      })} to complete`
    );
  };
};

const MAX_DEPTH = 6;

export type FormatLogMessageOptions = {
  prefix?: string;
  skip?: string[];
};

export const formatLogMessage = (
  message?: any,
  options: FormatLogMessageOptions = {},
  depth = 0
): string => {
  if (depth > MAX_DEPTH) {
    return "<max depth>";
  }

  const prefix = options.prefix ?? "-";
  const skip = options.skip ?? [];

  return typeof message === "undefined" ||
    message === null ||
    (!message && typeof message !== "boolean")
    ? "<none>"
    : typeof message === "string"
      ? message
      : Array.isArray(message)
        ? `\n${message.map((item, index) => ` ${prefix}> #${index} = ${formatLogMessage(item, { prefix: `${prefix}-`, skip }, depth + 1)}`).join("\n")}`
        : typeof message === "object"
          ? `\n${Object.keys(message)
              .filter(key => !skip.includes(key))
              .map(
                key =>
                  ` ${prefix}> ${key} = ${
                    _isFunction(message[key])
                      ? "<function>"
                      : typeof message[key] === "object"
                        ? formatLogMessage(
                            message[key],
                            { prefix: `${prefix}-`, skip },
                            depth + 1
                          )
                        : message[key]
                  }`
              )
              .join("\n")}`
          : message;
};

const _isFunction = (
  value: unknown
): value is ((params?: unknown) => unknown) & ((param?: any) => any) => {
  try {
    return (
      value instanceof Function ||
      typeof value === "function" ||
      !!(value?.constructor && (value as any)?.call && (value as any)?.apply)
    );
  } catch {
    return false;
  }
};

/**
 * Get the brand icon for the console
 *
 * @param config - The Storm configuration
 * @param _chalk - The chalk instance
 * @returns The brand icon
 */
export const brandIcon = (
  config: Partial<StormWorkspaceConfig> = {},
  _chalk: ReturnType<typeof getChalk> = getChalk()
) => _chalk.hex(getColor("brand", config))("🗲");
