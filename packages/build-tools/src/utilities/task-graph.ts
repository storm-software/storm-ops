import type { NxJsonConfiguration, ProjectGraph, TaskGraph } from "@nx/devkit";
import {
  createTaskGraph,
  mapTargetDefaultsToDependencies,
} from "nx/src/tasks-runner/create-task-graph";

export function getAllWorkspaceTaskGraphs(
  nxJson: NxJsonConfiguration,
  projectGraph: ProjectGraph,
): {
  taskGraphs: Record<string, TaskGraph>;
  errors: Record<string, string>;
} {
  const defaultDependencyConfigs = mapTargetDefaultsToDependencies(
    nxJson.targetDefaults,
  );

  const taskGraphs: Record<string, TaskGraph> = {};
  const taskGraphErrors: Record<string, string> = {};

  for (const projectName in projectGraph.nodes) {
    const project = projectGraph.nodes[projectName];
    const targets = Object.keys(project?.data.targets ?? {});

    for (const target of targets) {
      const taskId = createTaskId(projectName, target);
      try {
        taskGraphs[taskId] = createTaskGraph(
          projectGraph,
          defaultDependencyConfigs,
          [projectName],
          [target],
          undefined,
          {},
        );
      } catch (err) {
        taskGraphs[taskId] = {
          tasks: {},
          dependencies: {},
          roots: [],
        };

        taskGraphErrors[taskId] = err.message;
      }

      const configurations = Object.keys(
        project?.data?.targets?.[target]?.configurations || {},
      );
      if (configurations.length > 0) {
        for (const configuration of configurations) {
          const taskId = createTaskId(projectName, target, configuration);
          try {
            taskGraphs[taskId] = createTaskGraph(
              projectGraph,
              defaultDependencyConfigs,
              [projectName],
              [target],
              configuration,
              {},
            );
          } catch (err) {
            taskGraphs[taskId] = {
              tasks: {},
              dependencies: {},
              roots: [],
            };

            taskGraphErrors[taskId] = err.message;
          }
        }
      }
    }
  }

  return { taskGraphs, errors: taskGraphErrors };
}

export function createTaskId(
  projectId: string,
  targetId: string,
  configurationId?: string,
) {
  if (configurationId) {
    return `${projectId}:${targetId}:${configurationId}`;
  }
  return `${projectId}:${targetId}`;
}
