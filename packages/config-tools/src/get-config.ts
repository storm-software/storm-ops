import { StormWorkspaceConfig } from "@storm-software/config/types";
import { loadStormWorkspaceConfig } from "./create-storm-config";

/**
 * Get the config for the current Storm workspace
 *
 * @param workspaceRoot - The root directory of the workspace
 * @param skipLogs - Skip writing logs to the console
 * @returns The config for the current Storm workspace
 */
export const getConfig = (
  workspaceRoot?: string,
  skipLogs = false
): Promise<StormWorkspaceConfig> => {
  return loadStormWorkspaceConfig(workspaceRoot, skipLogs);
};

/**
 * Get the config for the current Storm workspace
 *
 * @param skipLogs - Skip writing logs to the console
 * @returns The config for the current Storm workspace
 */
export const getWorkspaceConfig = (
  skipLogs = false
): Promise<StormWorkspaceConfig> => {
  return getConfig(undefined, skipLogs);
};
