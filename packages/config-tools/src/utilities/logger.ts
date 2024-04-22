import { LogLevel, LogLevelLabel } from "../types";
import type { ColorConfig, StormConfig } from "@storm-software/config";
import { getLogLevel } from "./get-log-level";
import { getChalk } from "./chalk";
import { DEFAULT_COLOR_CONFIG } from "./get-default-config";

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
): ((message?: string) => void) => {
  let _chalk = getChalk();

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
    return (message?: string) => {
      console.error(
        `
${_chalk.bold.hex(colors.error)(">")} ${_chalk.bold
          .bgHex(colors.fatal)
          .whiteBright(" 💀 Fatal ")}  ${_chalk.hex(colors.error)(message)}

`
      );
    };
  }

  if (
    (typeof logLevel === "number" && LogLevel.ERROR >= logLevel) ||
    (typeof logLevel === "string" && LogLevel.ERROR >= getLogLevel(logLevel))
  ) {
    return (message?: string) => {
      console.error(
        `
${_chalk.bold.hex(colors.error)(">")} ${_chalk.bold
          .bgHex(colors.error)
          .whiteBright(" ✘ Error ")}  ${_chalk.hex(colors.error)(message)}
`
      );
    };
  }

  if (
    (typeof logLevel === "number" && LogLevel.WARN >= logLevel) ||
    (typeof logLevel === "string" && LogLevel.WARN >= getLogLevel(logLevel))
  ) {
    return (message?: string) => {
      console.warn(
        `
${_chalk.bold.hex(colors.warning)("> ")} ${_chalk.bold
          .bgHex(colors.warning)
          .whiteBright("  ⚠ Warn  ")}  ${_chalk.hex(colors.warning)(message)}
`
      );
    };
  }

  if (
    (typeof logLevel === "number" && LogLevel.SUCCESS >= logLevel) ||
    (typeof logLevel === "string" && LogLevel.SUCCESS >= getLogLevel(logLevel))
  ) {
    return (message?: string) => {
      console.info(
        `
${_chalk.bold.hex(colors.success)(">")} ${_chalk.bold
          .bgHex(colors.success)
          .whiteBright(" ✓ Success ")}  ${_chalk.hex(colors.success)(message)}
`
      );
    };
  }

  if (
    (typeof logLevel === "number" && LogLevel.INFO >= logLevel) ||
    (typeof logLevel === "string" && LogLevel.INFO >= getLogLevel(logLevel))
  ) {
    return (message?: string) => {
      console.info(
        `
${_chalk.bold.hex(colors.info)(">")} ${_chalk.bold
          .bgHex(colors.info)
          .whiteBright("  ℹ Info  ")}  ${_chalk.hex(colors.info)(message)}
`
      );
    };
  }

  if (
    (typeof logLevel === "number" && LogLevel.DEBUG >= logLevel) ||
    (typeof logLevel === "string" && LogLevel.DEBUG >= getLogLevel(logLevel))
  ) {
    return (message?: string) => {
      console.debug(
        `
${_chalk.bold.hex(colors.primary)(">")} ${_chalk.bold
          .bgHex(colors.primary)
          .whiteBright(" 🛠  Debug ")}  ${_chalk.hex(colors.primary)(message)}
`
      );
    };
  }

  return (message?: string) => {
    console.log(
      `
${_chalk.bold.hex(colors.primary)(">")} ${_chalk.bold
        .bgHex(colors.primary)
        .whiteBright(" ✉ System ")}  ${_chalk.hex(colors.primary)(message)}
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
export const writeFatal = (message?: string, config?: Partial<StormConfig>) =>
  getLogFn(LogLevel.FATAL, config)(message);

/**
 * Write a message to the console at the `error` log level
 *
 * @param message - The message to write
 * @param config - The Storm configuration
 */
export const writeError = (message?: string, config?: Partial<StormConfig>) =>
  getLogFn(LogLevel.ERROR, config)(message);

/**
 * Write a message to the console at the `warning` log level
 *
 * @param message - The message to write
 * @param config - The Storm configuration
 */
export const writeWarning = (message?: string, config?: Partial<StormConfig>) =>
  getLogFn(LogLevel.WARN, config)(message);

/**
 * Write a message to the console at the `info` log level
 *
 * @param message - The message to write
 * @param config - The Storm configuration
 */
export const writeInfo = (message?: string, config?: Partial<StormConfig>) =>
  getLogFn(LogLevel.INFO, config)(message);

/**
 * Write a message to the console at the `success` log level
 *
 * @param message - The message to write
 * @param config - The Storm configuration
 */
export const writeSuccess = (message?: string, config?: Partial<StormConfig>) =>
  getLogFn(LogLevel.SUCCESS, config)(message);

/**
 * Write a message to the console at the `debug` log level
 *
 * @param message - The message to write
 * @param config - The Storm configuration
 */
export const writeDebug = (message?: string, config?: Partial<StormConfig>) =>
  getLogFn(LogLevel.DEBUG, config)(message);

/**
 * Write a message to the console at the `trace` log level
 *
 * @param message - The message to write
 * @param config - The Storm configuration
 */
export const writeTrace = (message?: string, config?: Partial<StormConfig>) =>
  getLogFn(LogLevel.TRACE, config)(message);

/**
 * Write a message to the console at the `all` log level
 *
 * @param message - The message to write
 * @param config - The Storm configuration
 */
export const writeSystem = (message?: string, config?: Partial<StormConfig>) =>
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
