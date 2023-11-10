import { ExecutorContext, ProjectConfiguration } from "@nx/devkit";
import { getWorkspaceRoot } from "./get-workspace-root";

export const applyWorkspaceTokens = (
  option: string,
  config: ProjectConfiguration | ExecutorContext
): string => {
  let result = option;
  if (!result) {
    return result;
  }

  const workspaceRoot = getWorkspaceRoot();

  let projectName!: string;
  let projectRoot!: string;
  let sourceRoot!: string;
  if (
    (config as ExecutorContext)?.projectsConfigurations?.projects &&
    (config as ExecutorContext)?.projectName
  ) {
    const context = config as ExecutorContext;
    projectName = context.projectName;
    projectRoot = context.projectsConfigurations.projects[projectName].root;
    sourceRoot =
      context.projectsConfigurations.projects[projectName].sourceRoot;
  } else {
    const projectConfig = config as ProjectConfiguration;
    projectName = projectConfig.name;
    projectRoot = projectConfig.root;
    sourceRoot = projectConfig.sourceRoot;
  }

  if (result.includes("{projectName}")) {
    result = result.replaceAll("{projectName}", projectName);
  }
  if (result.includes("{projectRoot}")) {
    result = result.replaceAll("{projectRoot}", projectRoot);
  }
  if (result.includes("{sourceRoot}")) {
    result = result.replaceAll("{sourceRoot}", sourceRoot);
  }
  if (result.includes("{workspaceRoot}")) {
    result = result.replaceAll("{workspaceRoot}", workspaceRoot);
  }

  return result;
};
