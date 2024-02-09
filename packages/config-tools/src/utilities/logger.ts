import * as chalk from "chalk";
import { LogLevel } from "../types";
import type { StormConfig } from "@storm-software/config";
import { getLogLevel } from "./get-log-level";

/**
 * Get the log function for a log level
 *
 * @param config - The Storm configuration
 * @param logLevel - The log level
 * @returns The log function
 */
export const getLogFn = (
  config: Partial<StormConfig> = {},
  logLevel: number | LogLevel = LogLevel.INFO
): ((message: string) => void) => {
  if (
    (typeof logLevel === "number" &&
      (logLevel >= getLogLevel(config.logLevel ?? process.env?.STORM_LOG_LEVEL) ||
        logLevel <= LogLevel.SILENT)) ||
    (typeof logLevel === "string" &&
      getLogLevel(logLevel) >= getLogLevel(config.logLevel ?? process.env?.STORM_LOG_LEVEL))
  ) {
    return (_: string) => {
      /* noop */
    };
  }

  if (
    (typeof logLevel === "number" && LogLevel.FATAL >= logLevel) ||
    (typeof logLevel === "string" && LogLevel.FATAL >= getLogLevel(logLevel))
  ) {
    return (message: string) => {
      console.error(
        `
${chalk.bold.hex(config?.colors?.error ? config.colors.error : "#7d1a1a")(">")} ${chalk.bold
          .bgHex(config?.colors?.fatal ? config.colors.fatal : "#7d1a1a")
          .whiteBright(" 💀 Fatal ")}  ${chalk.hex(
          config?.colors?.error ? config.colors.error : "#1fb2a6"
        )(message)}

`
      );
    };
  }

  if (
    (typeof logLevel === "number" && LogLevel.ERROR >= logLevel) ||
    (typeof logLevel === "string" && LogLevel.ERROR >= getLogLevel(logLevel))
  ) {
    return (message: string) => {
      console.error(
        `
${chalk.bold.hex(config?.colors?.error ? config.colors.error : "#7d1a1a")(">")} ${chalk.bold
          .bgHex(config?.colors?.error ? config.colors.error : "#7d1a1a")
          .whiteBright(" ✘ Error ")}  ${chalk.hex(
          config?.colors?.error ? config.colors.error : "#7d1a1a"
        )(message)}
`
      );
    };
  }

  if (
    (typeof logLevel === "number" && LogLevel.WARN >= logLevel) ||
    (typeof logLevel === "string" && LogLevel.WARN >= getLogLevel(logLevel))
  ) {
    return (message: string) => {
      console.warn(
        `
${chalk.bold.hex(config?.colors?.warning ? config.colors.warning : "#fcc419")("> ")} ${chalk.bold
          .bgHex(config?.colors?.warning ? config.colors.warning : "#fcc419")
          .whiteBright(" ⚠ Warn ")}  ${chalk.hex(
          config?.colors?.warning ? config.colors.warning : "#fcc419"
        )(message)}
`
      );
    };
  }

  if (
    (typeof logLevel === "number" && LogLevel.INFO >= logLevel) ||
    (typeof logLevel === "string" && LogLevel.INFO >= getLogLevel(logLevel))
  ) {
    return (message: string) => {
      console.info(
        `
${chalk.bold.hex(config?.colors?.info ? config.colors.info : "#0ea5e9")(">")} ${chalk.bold
          .bgHex(config?.colors?.info ? config.colors.info : "#0ea5e9")
          .whiteBright(" ℹ Info ")}  ${chalk.hex(
          config?.colors?.info ? config.colors.info : "#0ea5e9"
        )(message)}
`
      );
    };
  }

  if (
    (typeof logLevel === "number" && LogLevel.INFO >= logLevel) ||
    (typeof logLevel === "string" && LogLevel.INFO >= getLogLevel(logLevel))
  ) {
    return (message: string) => {
      console.info(
        `
${chalk.bold.hex(config?.colors?.success ? config.colors.success : "#087f5b")(">")} ${chalk.bold
          .bgHex(config?.colors?.success ? config.colors.success : "#087f5b")
          .whiteBright(" ✓ Success ")}  ${chalk.hex(
          config?.colors?.success ? config.colors.success : "#087f5b"
        )(message)}
`
      );
    };
  }

  if (
    (typeof logLevel === "number" && LogLevel.DEBUG >= logLevel) ||
    (typeof logLevel === "string" && LogLevel.DEBUG >= getLogLevel(logLevel))
  ) {
    return (message: string) => {
      console.debug(
        `
${chalk.bold.hex(config?.colors?.primary ? config.colors.primary : "#1fb2a6")(">")} ${chalk.bold
          .bgHex(config?.colors?.primary ? config.colors.primary : "#1fb2a6")
          .whiteBright(" 🛠  Debug ")}  ${chalk.hex(
          config?.colors?.primary ? config.colors.primary : "#1fb2a6"
        )(message)}
`
      );
    };
  }

  return (message: string) => {
    console.log(
      `
${chalk.bold.hex(config?.colors?.primary ? config.colors.primary : "#1fb2a6")(">")} ${chalk.bold
        .bgHex(config?.colors?.primary ? config.colors.primary : "#1fb2a6")
        .whiteBright(" ✉ System ")}  ${chalk.hex(
        config?.colors?.primary ? config.colors.primary : "#1fb2a6"
      )(message)}
`
    );
  };
};

/**
 * Write a message to the console at the `fatal` log level
 *
 * @param config - The Storm configuration
 * @param message - The message to write
 */
export const writeFatal = (config: Partial<StormConfig>, message: string) =>
  getLogFn(config, LogLevel.FATAL)(message);

/**
 * Write a message to the console at the `error` log level
 *
 * @param config - The Storm configuration
 * @param message - The message to write
 */
export const writeError = (config: Partial<StormConfig>, message: string) =>
  getLogFn(config, LogLevel.ERROR)(message);

/**
 * Write a message to the console at the `warning` log level
 *
 * @param config - The Storm configuration
 * @param message - The message to write
 */
export const writeWarning = (config: Partial<StormConfig>, message: string) =>
  getLogFn(config, LogLevel.WARN)(message);

/**
 * Write a message to the console at the `info` log level
 *
 * @param config - The Storm configuration
 * @param message - The message to write
 */
export const writeInfo = (config: Partial<StormConfig>, message: string) =>
  getLogFn(config, LogLevel.INFO)(message);

/**
 * Write a message to the console at the `success` log level
 *
 * @param config - The Storm configuration
 * @param message - The message to write
 */
export const writeSuccess = (config: Partial<StormConfig>, message: string) =>
  getLogFn(config, LogLevel.SUCCESS)(message);

/**
 * Write a message to the console at the `debug` log level
 *
 * @param config - The Storm configuration
 * @param message - The message to write
 */
export const writeDebug = (config: Partial<StormConfig>, message: string) =>
  getLogFn(config, LogLevel.DEBUG)(message);

/**
 * Write a message to the console at the `trace` log level
 *
 * @param config - The Storm configuration
 * @param message - The message to write
 */
export const writeTrace = (config: Partial<StormConfig>, message: string) =>
  getLogFn(config, LogLevel.TRACE)(message);

/**
 * Write a message to the console at the `all` log level
 *
 * @param config - The Storm configuration
 * @param message - The message to write
 */
export const writeSystem = (config: Partial<StormConfig>, message: string) =>
  getLogFn(config, LogLevel.ALL)(message);

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
      chalk.dim(
        `\n⏱️  The${name ? ` ${name}` : ""} process took ${Math.round(
          end[0] * 1000 + end[1] / 1000000
        )}ms to complete\n\n`
      )
    );
  };
};
