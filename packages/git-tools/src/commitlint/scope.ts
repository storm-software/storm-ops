/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProjectGraph } from "@nx/devkit";
import { StormWorkspaceConfig } from "@storm-software/config";
import {
  createProjectGraphAsync,
  readCachedProjectGraph,
  readProjectsConfigurationFromProjectGraph
} from "nx/src/project-graph/project-graph";
import { RuleConfigCondition, RuleConfigSeverity } from "../types";

export async function getNxScopes(context: {
  config: StormWorkspaceConfig;
}): Promise<string[]> {
  let projectGraph!: ProjectGraph;
  try {
    projectGraph = readCachedProjectGraph();
  } catch {
    await createProjectGraphAsync();
    projectGraph = readCachedProjectGraph();
  }

  if (!projectGraph) {
    throw new Error(
      "The commit process failed because the project graph is not available. Please run the build command again."
    );
  }

  const projectConfigs =
    readProjectsConfigurationFromProjectGraph(projectGraph);

  const result = (
    Object.entries(projectConfigs.projects || {})
      .map(([name, project]) => ({
        name,
        ...project
      }))
      .filter(
        project =>
          project.name &&
          project.root &&
          project.root !== "." &&
          project.root !== context.config.workspaceRoot &&
          !project.name.includes("e2e")
      )
      .filter(project => project.targets)
      .map(project => project.name)
      // .map(name => (name.charAt(0) === "@" ? name.split("/")[1] : name))
      .filter(Boolean) as string[]
  ).sort((a, b) => a.localeCompare(b));
  result.unshift("monorepo");

  return result;
}

export function getScopeEnumUtil(context: { config: StormWorkspaceConfig }) {
  return (): Promise<string[]> => getScopeEnum(context);
}

export function getScopeEnum(context: {
  config: StormWorkspaceConfig;
}): Promise<string[]> {
  return getNxScopes(context);
}

export function getRuleFromScopeEnum(
  scopeEnum: string[]
): [RuleConfigSeverity, RuleConfigCondition, string[]] {
  if (!scopeEnum?.filter(Boolean).length) {
    throw new Error("No scopes found in the Storm workspace.");
  }

  return [
    RuleConfigSeverity.Error,
    "always",
    scopeEnum.filter(Boolean) as string[]
  ];
}
