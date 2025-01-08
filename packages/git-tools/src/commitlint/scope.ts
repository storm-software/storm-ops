/* eslint-disable @typescript-eslint/no-explicit-any */
import { RuleConfigCondition, RuleConfigSeverity } from "@commitlint/types";
import type { ProjectConfiguration } from "nx/src/config/workspace-json-project-json.js";
import {
  createProjectGraphAsync,
  readProjectsConfigurationFromProjectGraph
} from "nx/src/project-graph/project-graph.js";

export async function getNxScopes(
  context?: any,
  selector = (params?: ProjectConfiguration) => true
): Promise<string[]> {
  const ctx = context || {};

  process.env.NX_WORKSPACE_ROOT_PATH ??=
    process.env.STORM_WORKSPACE_ROOT ?? ctx.cwd ?? process.cwd();

  const projectGraph = await createProjectGraphAsync({
    exitOnError: true
  });
  const projectConfigs =
    readProjectsConfigurationFromProjectGraph(projectGraph);

  return Object.entries(projectConfigs.projects || {})
    .map(([name, project]) => ({
      name,
      ...project
    }))
    .filter(selector)
    .filter(project => project.targets)
    .map(project => project.name)
    .map(name => (name.charAt(0) === "@" ? name.split("/")[1] : name))
    .filter(Boolean) as string[];
}

export const getScopeEnum = async (context?: any): Promise<string[]> => {
  return await getNxScopes(
    context,
    (projectConfig?: ProjectConfiguration) =>
      !!projectConfig?.name && !projectConfig.name.includes("e2e")
  );
};

export const getScopeEnumRule = async (
  context?: any
): Promise<[RuleConfigSeverity, RuleConfigCondition, string[]]> => {
  const scopeEnum = await getScopeEnum(context);
  if (!scopeEnum?.filter(Boolean).length) {
    throw new Error("No scopes found in the Storm workspace.");
  }

  return [
    RuleConfigSeverity.Error,
    "always",
    scopeEnum.filter(Boolean) as string[]
  ];
};
