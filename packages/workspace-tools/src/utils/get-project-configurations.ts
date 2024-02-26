import type { ProjectConfiguration } from "@nx/devkit";
import { retrieveProjectConfigurationsWithoutPluginInference } from "nx/src/project-graph/utils/retrieve-workspace-files";
import { findWorkspaceRoot } from "@storm-software/config-tools";

/**
 * Retrieve the project configurations from the workspace.
 *
 * @returns The project configurations.
 */
export const getProjectConfigurations = <
  TConfig extends ProjectConfiguration = ProjectConfiguration
>(): Promise<Record<string, TConfig>> =>
  retrieveProjectConfigurationsWithoutPluginInference(findWorkspaceRoot()) as Promise<
    Record<string, TConfig>
  >;

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
