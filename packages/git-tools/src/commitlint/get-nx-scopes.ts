/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { ProjectConfiguration } from "nx/src/config/workspace-json-project-json.js";
import {
  buildProjectGraphWithoutDaemon,
  readProjectsConfigurationFromProjectGraph
} from "nx/src/project-graph/project-graph.js";

export async function getNxScopes(
  context: any,
  selector = (_params?: ProjectConfiguration) => true
) {
  const ctx = context || {};

  process.env["NX_WORKSPACE_ROOT_PATH"] ??=
    process.env["STORM_REPO_ROOT"] ?? ctx.cwd ?? process.cwd();

  const projectConfigs = readProjectsConfigurationFromProjectGraph(
    await buildProjectGraphWithoutDaemon()
  );

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
