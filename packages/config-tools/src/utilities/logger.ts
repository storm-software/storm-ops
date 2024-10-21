import type { ColorConfig, StormConfig } from "@storm-software/config";
import { LogLevel, LogLevelLabel } from "../types";
import { getChalk } from "./chalk";
import { DEFAULT_COLOR_CONFIG } from "./get-default-config";
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
  config: Partial<StormConfig> = {}
): ((message?: any) => void) => {
  const _chalk = getChalk();

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

  const configLogLevel = (config.logLevel ??
    process.env?.STORM_LOG_LEVEL ??
    LogLevelLabel.INFO) as LogLevelLabel;

  if (
    (typeof logLevel === "number" &&
      (logLevel >= getLogLevel(configLogLevel) ||
        logLevel <= LogLevel.SILENT)) ||
    (typeof logLevel === "string" &&
      getLogLevel(logLevel) >= getLogLevel(configLogLevel))
  ) {
    return (_: string) => {
      /* noop */
    };
  }

  if (
    (typeof logLevel === "number" && LogLevel.FATAL >= logLevel) ||
    (typeof logLevel === "string" && LogLevel.FATAL >= getLogLevel(logLevel))
  ) {
    return (message?: any) => {
      console.error(
        `\n${_chalk.bold.hex(colors.error ?? "#f85149")(">")} ${_chalk.bold
          .bgHex(colors.fatal ?? "#7d1a1a")
          .whiteBright(
            " 💀 Fatal "
          )}  ${_chalk.hex(colors.error ?? "#f85149")(formatLogMessage(message))}\n`
      );
    };
  }

  if (
    (typeof logLevel === "number" && LogLevel.ERROR >= logLevel) ||
    (typeof logLevel === "string" && LogLevel.ERROR >= getLogLevel(logLevel))
  ) {
    return (message?: any) => {
      console.error(
        `\n${_chalk.bold.hex(colors.error ?? "#f85149")(">")} ${_chalk.bold
          .bgHex(colors.error ?? "#f85149")
          .whiteBright(
            " ✘  Error "
          )}  ${_chalk.hex(colors.error ?? "#f85149")(formatLogMessage(message))}\n`
      );
    };
  }

  if (
    (typeof logLevel === "number" && LogLevel.WARN >= logLevel) ||
    (typeof logLevel === "string" && LogLevel.WARN >= getLogLevel(logLevel))
  ) {
    return (message?: any) => {
      console.warn(
        `\n${_chalk.bold.hex(colors.warning ?? "#e3b341")(">")} ${_chalk.bold
          .bgHex(colors.warning ?? "#e3b341")
          .whiteBright(
            "  ⚠ Warn  "
          )}  ${_chalk.hex(colors.warning ?? "#e3b341")(formatLogMessage(message))}\n`
      );
    };
  }

  if (
    (typeof logLevel === "number" && LogLevel.SUCCESS >= logLevel) ||
    (typeof logLevel === "string" && LogLevel.SUCCESS >= getLogLevel(logLevel))
  ) {
    return (message?: any) => {
      console.info(
        `\n${_chalk.bold.hex(colors.success ?? "#56d364")(">")} ${_chalk.bold
          .bgHex(colors.success ?? "#56d364")
          .whiteBright(
            " ✓ Success "
          )}  ${_chalk.hex(colors.success ?? "#56d364")(formatLogMessage(message))}\n`
      );
    };
  }

  if (
    (typeof logLevel === "number" && LogLevel.INFO >= logLevel) ||
    (typeof logLevel === "string" && LogLevel.INFO >= getLogLevel(logLevel))
  ) {
    return (message?: any) => {
      console.info(
        `\n${_chalk.bold.hex(colors.info ?? "#58a6ff")(">")} ${_chalk.bold
          .bgHex(colors.info ?? "#58a6ff")
          .whiteBright(
            "  ℹ Info  "
          )}  ${_chalk.hex(colors.info ?? "#58a6ff")(formatLogMessage(message))}\n`
      );
    };
  }

  if (
    (typeof logLevel === "number" && LogLevel.DEBUG >= logLevel) ||
    (typeof logLevel === "string" && LogLevel.DEBUG >= getLogLevel(logLevel))
  ) {
    return (message?: any) => {
      console.debug(
        `\n${_chalk.bold.hex(colors.brand ?? "#1fb2a6")(">")} ${_chalk.bold
          .bgHex(colors.brand ?? "#1fb2a6")
          .whiteBright(
            " 🛠  Debug "
          )}  ${_chalk.hex(colors.brand ?? "#1fb2a6")(formatLogMessage(message))}\n`
      );
    };
  }

  return (message?: any) => {
    console.log(
      `\n${_chalk.bold.hex(colors.brand ?? "#1fb2a6")(">")} ${_chalk.bold
        .bgHex(colors.brand ?? "#1fb2a6")
        .whiteBright(
          " ✉ System "
        )}  ${_chalk.hex(colors.brand ?? "#1fb2a6")(formatLogMessage(message))}\n`
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
      `\n>  ⏱️  The${name ? ` ${name}` : ""} process took ${Math.round(
        end[0] * 1000 + end[1] / 1000000
      )}ms to complete\n\n`
    );
  };
};

const MAX_DEPTH = 6;

export const formatLogMessage = (
  message?: any,
  prefix = "-",
  depth = 0
): string => {
  if (depth > MAX_DEPTH) {
    return "<max depth>";
  }

  return typeof message === "undefined" ||
    message === null ||
    (!message && typeof message !== "boolean")
    ? "<none>"
    : typeof message === "string"
      ? message
      : Array.isArray(message)
        ? `\n${message.map((item, index) => ` ${prefix}> #${index} = ${formatLogMessage(item, `${prefix}-`, depth + 1)}`).join("\n")}`
        : typeof message === "object"
          ? `\n${Object.keys(message)
              .map(
                key =>
                  ` ${prefix}> ${key} = ${
                    _isFunction(message[key])
                      ? "<function>"
                      : typeof message[key] === "object"
                        ? formatLogMessage(
                            message[key],
                            `${prefix}-`,
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
    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
  } catch (e) {
    return false;
  }
};
