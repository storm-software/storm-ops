import { StormWorkspaceConfig } from "@storm-software/config/types";
import { loadStormWorkspaceConfig } from "./create-storm-config";
import { findWorkspaceRoot } from "./utilities/find-workspace-root";

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

export type GetWorkspaceConfigOptions = {
  /**
   * The root directory of the workspace
   */
  workspaceRoot?: string;

  /**
   * A directory inside the monorepo to start searching from
   */
  cwd?: string;
};

/**
 * Get the config for the current Storm workspace
 *
 * @param skipLogs - Skip writing logs to the console
 * @param options - Options for getting the workspace config
 * @returns The config for the current Storm workspace
 */
export const getWorkspaceConfig = (
  skipLogs = false,
  options: GetWorkspaceConfigOptions = {}
): Promise<StormWorkspaceConfig> => {
  let workspaceRoot = options.workspaceRoot;
  if (!workspaceRoot) {
    workspaceRoot = findWorkspaceRoot(options.cwd);
  }

  return getConfig(workspaceRoot, skipLogs);
};
