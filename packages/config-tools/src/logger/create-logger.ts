import { StormWorkspaceConfig } from "@storm-software/config/types";
import chalk from "chalk";
import { Logger, LogLevel } from "../types";
import { getLogFn, getStopwatch } from "./console";

/**
 * Create a logger instance with the specified configuration.
 *
 * @param config - Optional partial configuration for the logger.
 * @returns A promise that resolves to a Logger instance.
 */
export async function createLogger(
  config?: Partial<StormWorkspaceConfig>
): Promise<Logger> {
  const writeFatal = getLogFn(LogLevel.FATAL, config, chalk);
  const writeError = getLogFn(LogLevel.ERROR, config, chalk);
  const writeWarning = getLogFn(LogLevel.WARN, config, chalk);
  const writeInfo = getLogFn(LogLevel.INFO, config, chalk);
  const writeSuccess = getLogFn(LogLevel.SUCCESS, config, chalk);
  const writeDebug = getLogFn(LogLevel.DEBUG, config, chalk);
  const writeTrace = getLogFn(LogLevel.TRACE, config, chalk);

  return {
    fatal: writeFatal,
    error: writeError,
    warning: writeWarning,
    info: writeInfo,
    success: writeSuccess,
    debug: writeDebug,
    trace: writeTrace,
    getStopwatch
  };
}
