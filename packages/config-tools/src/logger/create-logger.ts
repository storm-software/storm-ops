import { StormWorkspaceConfig } from "@storm-software/config/types";
import chalk from "chalk";
import { Logger, LogLevel } from "../types";
import { findWorkspaceRoot } from "../utilities/find-workspace-root";
import { getLogFn, getStopwatch } from "./console";

export async function createLogger(
  config?: Partial<StormWorkspaceConfig>
): Promise<Logger> {
  const workspaceRoot = findWorkspaceRoot();
  if (!workspaceRoot) {
    throw new Error("Cannot find workspace root");
  }

  /*const jiti = createJiti(config?.workspaceRoot || workspaceRoot, {
    fsCache: "node_modules/.cache/storm/jiti",
    interopDefault: true
  });

  const chalk = await jiti.import<any>("chalk");*/

  const writeFatal = getLogFn(LogLevel.FATAL, config, chalk);
  const writeError = getLogFn(LogLevel.ERROR, config, chalk);
  const writeWarning = getLogFn(LogLevel.WARN, config, chalk);
  const writeInfo = getLogFn(LogLevel.INFO, config, chalk);
  const writeSuccess = getLogFn(LogLevel.SUCCESS, config, chalk);
  const writeDebug = getLogFn(LogLevel.DEBUG, config, chalk);
  const writeTrace = getLogFn(LogLevel.DEBUG, config, chalk);

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
