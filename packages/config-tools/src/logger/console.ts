/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColorConfig, StormConfig } from "@storm-software/config";
import { LogLevel, LogLevelLabel } from "../types";
import { DEFAULT_COLOR_CONFIG } from "../utilities/get-default-config";
import { getChalk } from "./chalk";
import { CONSOLE_ICONS } from "./console-icons";
import { formatTimestamp } from "./format-timestamp";
import { getLogLevel } from "./get-log-level";

/**
 * Get the log function for a log level
 *
 * @param logLevel - The log level
 * @param config - The Storm configuration
 * @returns The log function
 */
export const getLogFn = (
  logLevel: number | LogLevel = LogLevel.INFO,
  config: Partial<StormConfig> = {},
  _chalk: ReturnType<typeof getChalk> = getChalk(),
): ((message?: any) => void) => {
  const colors =
    !(config.colors as ColorConfig)?.dark &&
    !config.colors?.["base"] &&
    !config.colors?.["base"]?.dark
      ? DEFAULT_COLOR_CONFIG
      : (config.colors as ColorConfig)?.dark &&
          typeof (config.colors as ColorConfig).dark === "string"
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
    return (_: string) => {
      /* noop */
    };
  }

  if (typeof logLevel === "number" && LogLevel.FATAL >= logLevel) {
    return (message?: any) => {
      console.error(
        `
${_chalk.gray(formatTimestamp())} ${_chalk.hex(colors.fatal ?? "#7d1a1a")(`[${CONSOLE_ICONS[LogLevelLabel.FATAL]} Fatal] `)}${_chalk.bold.whiteBright(formatLogMessage(message))}
`,
      );
    };
  }

  if (typeof logLevel === "number" && LogLevel.ERROR >= logLevel) {
    return (message?: any) => {
      console.error(
        `
${_chalk.gray(formatTimestamp())} ${_chalk.hex(colors.danger ?? "#f85149")(`[${CONSOLE_ICONS[LogLevelLabel.ERROR]} Error] `)}${_chalk.bold.whiteBright(formatLogMessage(message))}
`,
      );
    };
  }

  if (typeof logLevel === "number" && LogLevel.WARN >= logLevel) {
    return (message?: any) => {
      console.warn(
        `
${_chalk.gray(formatTimestamp())} ${_chalk.hex(colors.warning ?? "#e3b341")(`[${CONSOLE_ICONS[LogLevelLabel.WARN]} Warn] `)}${_chalk.bold.whiteBright(formatLogMessage(message))}
`,
      );
    };
  }

  if (typeof logLevel === "number" && LogLevel.SUCCESS >= logLevel) {
    return (message?: any) => {
      console.info(
        `
${_chalk.gray(formatTimestamp())} ${_chalk.hex(colors.success ?? "#56d364")(`[${CONSOLE_ICONS[LogLevelLabel.SUCCESS]} Success] `)}${_chalk.bold.whiteBright(formatLogMessage(message))}
`,
      );
    };
  }

  if (typeof logLevel === "number" && LogLevel.INFO >= logLevel) {
    return (message?: any) => {
      console.info(
        `
${_chalk.gray(formatTimestamp())} ${_chalk.hex(colors.info ?? "#58a6ff")(`[${CONSOLE_ICONS[LogLevelLabel.INFO]} Info] `)}${_chalk.bold.whiteBright(formatLogMessage(message))}
`,
      );
    };
  }

  if (typeof logLevel === "number" && LogLevel.DEBUG >= logLevel) {
    return (message?: any) => {
      console.debug(
        `
${_chalk.gray(formatTimestamp())} ${_chalk.hex(colors.brand ?? "#1fb2a6")(`[${CONSOLE_ICONS[LogLevelLabel.DEBUG]}  Debug] `)}${_chalk.bold.whiteBright(formatLogMessage(message))}
`,
      );
    };
  }

  if (typeof logLevel === "number" && LogLevel.TRACE >= logLevel) {
    return (message?: any) => {
      console.debug(
        `
${_chalk.gray(formatTimestamp())} ${_chalk.hex(colors.brand ?? "#1fb2a6")(`[${CONSOLE_ICONS[LogLevelLabel.TRACE]}  Trace] `)}${_chalk.bold.whiteBright(formatLogMessage(message))}
`,
      );
    };
  }

  return (message?: any) => {
    console.log(
      `
${_chalk.gray(formatTimestamp())} ${_chalk.hex(colors.brand ?? "#1fb2a6")(`[${CONSOLE_ICONS[LogLevelLabel.ALL]}  System] `)}${_chalk.bold.whiteBright(formatLogMessage(message))}
`,
    );
  };
};

/**
 * Write a message to the console at the `fatal` log level
 *
 * @param message - The message to write
 * @param config - The Storm configuration
 */
export const writeFatal = (message?: any, config?: Partial<StormConfig>) =>
  getLogFn(LogLevel.FATAL, config)(message);

/**
 * Write a message to the console at the `error` log level
 *
 * @param message - The message to write
 * @param config - The Storm configuration
 */
export const writeError = (message?: any, config?: Partial<StormConfig>) =>
  getLogFn(LogLevel.ERROR, config)(message);

/**
 * Write a message to the console at the `warning` log level
 *
 * @param message - The message to write
 * @param config - The Storm configuration
 */
export const writeWarning = (message?: any, config?: Partial<StormConfig>) =>
  getLogFn(LogLevel.WARN, config)(message);

/**
 * Write a message to the console at the `info` log level
 *
 * @param message - The message to write
 * @param config - The Storm configuration
 */
export const writeInfo = (message?: any, config?: Partial<StormConfig>) =>
  getLogFn(LogLevel.INFO, config)(message);

/**
 * Write a message to the console at the `success` log level
 *
 * @param message - The message to write
 * @param config - The Storm configuration
 */
export const writeSuccess = (message?: any, config?: Partial<StormConfig>) =>
  getLogFn(LogLevel.SUCCESS, config)(message);

/**
 * Write a message to the console at the `debug` log level
 *
 * @param message - The message to write
 * @param config - The Storm configuration
 */
export const writeDebug = (message?: any, config?: Partial<StormConfig>) =>
  getLogFn(LogLevel.DEBUG, config)(message);

/**
 * Write a message to the console at the `trace` log level
 *
 * @param message - The message to write
 * @param config - The Storm configuration
 */
export const writeTrace = (message?: any, config?: Partial<StormConfig>) =>
  getLogFn(LogLevel.TRACE, config)(message);

/**
 * Write a message to the console at the `all` log level
 *
 * @param message - The message to write
 * @param config - The Storm configuration
 */
export const writeSystem = (message?: any, config?: Partial<StormConfig>) =>
  getLogFn(LogLevel.ALL, config)(message);

/**
 * Get a stopwatch function
 *
 * @param name - The name of the process
 * @returns The stopwatch function
 */
export const getStopwatch = (name: string) => {
  const start = process.hrtime();
  return () => {
    const end = process.hrtime(start);
    console.info(
      `
>  ⏱️  The${name ? ` ${name}` : ""} process took ${Math.round(
        end[0] * 1000 + end[1] / 1000000,
      )}ms to complete
`,
    );
  };
};

const MAX_DEPTH = 4;

export type FormatLogMessageOptions = {
  prefix?: string;
  skip?: string[];
};

export const formatLogMessage = (
  message?: any,
  options: FormatLogMessageOptions = {},
  depth = 0,
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
              .filter((key) => !skip.includes(key))
              .map(
                (key) =>
                  ` ${prefix}> ${key} = ${
                    _isFunction(message[key])
                      ? "<function>"
                      : typeof message[key] === "object"
                        ? formatLogMessage(
                            message[key],
                            { prefix: `${prefix}-`, skip },
                            depth + 1,
                          )
                        : message[key]
                  }`,
              )
              .join("\n")}`
          : message;
};

const _isFunction = (
  value: unknown,
): value is ((params?: unknown) => unknown) & ((param?: any) => any) => {
  try {
    return (
      value instanceof Function ||
      typeof value === "function" ||
      !!(value?.constructor && (value as any)?.call && (value as any)?.apply)
    );
  } catch (e) {
    return false;
  }
};
