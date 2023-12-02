import { LogLevel, LogLevelLabel } from "../types";

/**
 * Convert the log level label to a log level
 *
 * @param label - The log level label to convert
 * @returns The log level
 */
export const getLogLevel = (label: string): LogLevel => {
  switch (label) {
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
export const getLogLevelLabel = (logLevel: number): LogLevelLabel => {
  if (logLevel >= LogLevel.TRACE) {
    return LogLevelLabel.TRACE;
  } else if (logLevel >= LogLevel.DEBUG) {
    return LogLevelLabel.DEBUG;
  } else if (logLevel >= LogLevel.INFO) {
    return LogLevelLabel.INFO;
  } else if (logLevel >= LogLevel.WARN) {
    return LogLevelLabel.WARN;
  } else if (logLevel >= LogLevel.ERROR) {
    return LogLevelLabel.ERROR;
  } else if (logLevel >= LogLevel.FATAL) {
    return LogLevelLabel.FATAL;
  } else if (logLevel <= LogLevel.SILENT) {
    return LogLevelLabel.SILENT;
  } else {
    return LogLevelLabel.INFO;
  }
};
