/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type { ProjectConfiguration } from "nx/src/config/workspace-json-project-json";
import {
  createProjectGraphAsync,
  readProjectsConfigurationFromProjectGraph
} from "nx/src/project-graph/project-graph.js";

export async function getNxScopes(
  context: any,
  selector = (_params?: ProjectConfiguration) => true
) {
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
    .map(name => (name.charAt(0) === "@" ? name.split("/")[1] : name));
}
