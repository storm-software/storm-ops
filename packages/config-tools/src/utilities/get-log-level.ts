import { LogLevel, LogLevelLabel } from "../types";

/**
 * Convert the log level label to a log level
 *
 * @param label - The log level label to convert
 * @returns The log level
 */
export const getLogLevel = (label?: string): LogLevel => {
  switch (label) {
    case "all":
      return LogLevel.ALL;
    case "trace":
      return LogLevel.TRACE;
    case "debug":
      return LogLevel.DEBUG;
    case "info":
      return LogLevel.INFO;
    case "warn":
      return LogLevel.WARN;
    case "error":
      return LogLevel.ERROR;
    case "fatal":
      return LogLevel.FATAL;
    case "silent":
      return LogLevel.SILENT;
    default:
      return LogLevel.INFO;
  }
};

/**
 * Convert the log level to a log level label
 *
 * @param logLevel - The log level to convert
 * @returns The log level label
 */
export const getLogLevelLabel = (
  logLevel: number = LogLevel.INFO
): LogLevelLabel => {
  if (logLevel >= LogLevel.ALL) {
    return LogLevelLabel.ALL;
  }
  if (logLevel >= LogLevel.TRACE) {
    return LogLevelLabel.TRACE;
  }
  if (logLevel >= LogLevel.DEBUG) {
    return LogLevelLabel.DEBUG;
  }
  if (logLevel >= LogLevel.INFO) {
    return LogLevelLabel.INFO;
  }
  if (logLevel >= LogLevel.WARN) {
    return LogLevelLabel.WARN;
  }
  if (logLevel >= LogLevel.ERROR) {
    return LogLevelLabel.ERROR;
  }
  if (logLevel >= LogLevel.FATAL) {
    return LogLevelLabel.FATAL;
  }
  if (logLevel <= LogLevel.SILENT) {
    return LogLevelLabel.SILENT;
  }
  return LogLevelLabel.INFO;
};
