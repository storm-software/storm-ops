/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ProjectConfiguration } from "nx/src/config/workspace-json-project-json";
import {
  readCachedProjectGraph,
  readProjectsConfigurationFromProjectGraph,
} from "nx/src/project-graph/project-graph";
import { RuleConfigCondition, RuleConfigSeverity } from "../types";

export async function getNxScopes(
  context?: any,
  selector = (params?: ProjectConfiguration) => true,
): Promise<string[]> {
  const ctx = context || {};

  const workspaceRoot =
    process.env.NX_WORKSPACE_ROOT_PATH ||
    process.env.STORM_WORKSPACE_ROOT ||
    ctx.cwd ||
    process.cwd();
  process.env.NX_WORKSPACE_ROOT_PATH ??= workspaceRoot;

  // const projectGraph = await createProjectGraphAsync({
  //   exitOnError: false,
  //   resetDaemonClient: true
  // });
  const projectGraph = readCachedProjectGraph();

  const projectConfigs =
    readProjectsConfigurationFromProjectGraph(projectGraph);

  const result = Object.entries(projectConfigs.projects || {})
    .map(([name, project]) => ({
      name,
      ...project,
    }))
    .filter(selector)
    .filter((project) => project.targets)
    .map((project) => project.name)
    .map((name) => (name.charAt(0) === "@" ? name.split("/")[1] : name))
    .filter(Boolean) as string[];
  result.unshift("monorepo");

  return result;
}

export const getScopeEnum = async (context?: any): Promise<string[]> => {
  return await getNxScopes(
    context,
    (projectConfig?: ProjectConfiguration) =>
      !!projectConfig?.name && !projectConfig.name.includes("e2e"),
  );
};

export const getRuleFromScopeEnum = (
  scopeEnum: string[],
): [RuleConfigSeverity, RuleConfigCondition, string[]] => {
  if (!scopeEnum?.filter(Boolean).length) {
    throw new Error("No scopes found in the Storm workspace.");
  }

  return [
    RuleConfigSeverity.Error,
    "always",
    scopeEnum.filter(Boolean) as string[],
  ];
};

export const getScopeEnumRule = async (
  context?: any,
): Promise<[RuleConfigSeverity, RuleConfigCondition, string[]]> => {
  return getRuleFromScopeEnum(await getScopeEnum(context));
};
