import type { ProjectConfiguration } from "@nx/devkit";
import { retrieveProjectConfigurationsWithoutPluginInference } from "nx/src/project-graph/utils/retrieve-workspace-files";

/**
 * Retrieve the project configurations from the workspace.
 *
 * @returns The project configurations.
 */
export const getProjectConfigurations = async <
  TConfig extends ProjectConfiguration = ProjectConfiguration
>(): Promise<Record<string, TConfig>> => {
  const { findWorkspaceRoot } = await import("@storm-software/config-tools");

  return retrieveProjectConfigurationsWithoutPluginInference(
    findWorkspaceRoot()
  ) as Promise<Record<string, TConfig>>;
};

/**
 * Retrieve the project configurations from the workspace.
 *
 * @returns The project configurations.
 */
export const getProjectConfiguration = <
  TConfig extends ProjectConfiguration = ProjectConfiguration
>(
  projectName: string
): TConfig | undefined => getProjectConfigurations<TConfig>()?.[projectName];
