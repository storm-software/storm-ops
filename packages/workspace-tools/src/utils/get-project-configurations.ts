import { ProjectConfiguration } from "@nx/devkit";
import { retrieveProjectConfigurationsWithoutPluginInference } from "nx/src/project-graph/utils/retrieve-workspace-files";
import { getWorkspaceRoot } from "./get-workspace-root";

/**
 * Retrieve the project configurations from the workspace.
 *
 * @returns The project configurations.
 */
export const getProjectConfigurations = <
  TConfig extends ProjectConfiguration = ProjectConfiguration
>(): Record<string, TConfig> =>
  retrieveProjectConfigurationsWithoutPluginInference(
    getWorkspaceRoot()
  ) as Record<string, TConfig>;
