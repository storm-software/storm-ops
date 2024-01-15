import * as chalk from "chalk";
import { LogLevel, type StormConfig } from "../types";
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
    return (message: string) => {
      /* noop */
    };
  }

  if (
    (typeof logLevel === "number" && LogLevel.FATAL >= logLevel) ||
    (typeof logLevel === "string" && LogLevel.FATAL >= getLogLevel(logLevel))
  ) {
    return (message: string) => {
      console.error(
        ` ${chalk.bold
          .bgHex(config?.colors?.fatal ? config.colors.fatal : "#1fb2a6")
          .inverse("\n\n  💀 Fatal  ")} ${chalk.reset.hex(
          config?.colors?.fatal ? config.colors.fatal : "#1fb2a6"
        )(message)} \n`
      );
    };
  }

  if (
    (typeof logLevel === "number" && LogLevel.ERROR >= logLevel) ||
    (typeof logLevel === "string" && LogLevel.ERROR >= getLogLevel(logLevel))
  ) {
    return (message: string) => {
      console.error(
        ` ${chalk.bold
          .bgHex(config?.colors?.error ? config.colors.error : "#7d1a1a")
          .inverse("\n\n  🛑 Error  ")} ${chalk.reset.hex(
          config?.colors?.error ? config.colors.error : "#7d1a1a"
        )(message)} \n`
      );
    };
  }

  if (
    (typeof logLevel === "number" && LogLevel.WARN >= logLevel) ||
    (typeof logLevel === "string" && LogLevel.WARN >= getLogLevel(logLevel))
  ) {
    return (message: string) => {
      console.warn(
        ` ${chalk.bold
          .bgHex(config?.colors?.warning ? config.colors.warning : "#fcc419")
          .inverse("\n\n  ⚠️ Warn  ")} ${chalk.reset.hex(
          config?.colors?.warning ? config.colors.warning : "#fcc419"
        )(message)} \n`
      );
    };
  }

  if (
    (typeof logLevel === "number" && LogLevel.INFO >= logLevel) ||
    (typeof logLevel === "string" && LogLevel.INFO >= getLogLevel(logLevel))
  ) {
    return (message: string) => {
      console.info(
        ` ${chalk.bold
          .bgHex(config?.colors?.info ? config.colors.info : "#0ea5e9")
          .inverse("\n\n  📬 Info  ")} ${chalk.reset.hex(
          config?.colors?.info ? config.colors.info : "#0ea5e9"
        )(message)} \n`
      );
    };
  }

  if (
    (typeof logLevel === "number" && LogLevel.INFO >= logLevel) ||
    (typeof logLevel === "string" && LogLevel.INFO >= getLogLevel(logLevel))
  ) {
    return (message: string) => {
      console.info(
        ` ${chalk.bold
          .bgHex(config?.colors?.success ? config.colors.success : "#087f5b")
          .inverse("\n\n  🎉 Success  ")} ${chalk.reset.hex(
          config?.colors?.success ? config.colors.success : "#087f5b"
        )(message)} \n`
      );
    };
  }

  if (
    (typeof logLevel === "number" && LogLevel.DEBUG >= logLevel) ||
    (typeof logLevel === "string" && LogLevel.DEBUG >= getLogLevel(logLevel))
  ) {
    return (message: string) => {
      console.debug(
        ` ${chalk.bold
          .bgHex(config?.colors?.primary ? config.colors.primary : "#1fb2a6")
          .inverse("\n\n  🧪 Debug  ")} ${chalk.reset.hex(
          config?.colors?.primary ? config.colors.primary : "#1fb2a6"
        )(message)} \n`
      );
    };
  }

  return (message: string) => {
    console.log(
      ` ${chalk.bold
        .bgHex(config?.colors?.primary ? config.colors.primary : "#1fb2a6")
        .inverse("\n\n  📢 System  ")} ${chalk.bold.hex(
        config?.colors?.primary ? config.colors.primary : "#1fb2a6"
      )(message)} \n`
    );
  };
};

/**
 * Write a message to the console at the `fatal` log level
 *
 * @param config - The Storm configuration
 * @param message - The message to write
 */
export const writeFatal = (config: StormConfig, message: string) =>
  getLogFn(config, LogLevel.FATAL)(message);

/**
 * Write a message to the console at the `error` log level
 *
 * @param config - The Storm configuration
 * @param message - The message to write
 */
export const writeError = (config: StormConfig, message: string) =>
  getLogFn(config, LogLevel.ERROR)(message);

/**
 * Write a message to the console at the `warning` log level
 *
 * @param config - The Storm configuration
 * @param message - The message to write
 */
export const writeWarning = (config: StormConfig, message: string) =>
  getLogFn(config, LogLevel.WARN)(message);

/**
 * Write a message to the console at the `info` log level
 *
 * @param config - The Storm configuration
 * @param message - The message to write
 */
export const writeInfo = (config: StormConfig, message: string) =>
  getLogFn(config, LogLevel.INFO)(message);

/**
 * Write a message to the console at the `success` log level
 *
 * @param config - The Storm configuration
 * @param message - The message to write
 */
export const writeSuccess = (config: StormConfig, message: string) =>
  getLogFn(config, LogLevel.SUCCESS)(message);

/**
 * Write a message to the console at the `debug` log level
 *
 * @param config - The Storm configuration
 * @param message - The message to write
 */
export const writeDebug = (config: StormConfig, message: string) =>
  getLogFn(config, LogLevel.DEBUG)(message);

/**
 * Write a message to the console at the `trace` log level
 *
 * @param config - The Storm configuration
 * @param message - The message to write
 */
export const writeTrace = (config: StormConfig, message: string) =>
  getLogFn(config, LogLevel.TRACE)(message);

/**
 * Write a message to the console at the `all` log level
 *
 * @param config - The Storm configuration
 * @param message - The message to write
 */
export const writeSystem = (config: StormConfig, message: string) =>
  getLogFn(config, LogLevel.ALL)(message);
