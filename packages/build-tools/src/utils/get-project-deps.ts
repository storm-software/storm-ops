import type {
  ProjectGraph,
  ProjectGraphDependency,
  ProjectGraphExternalNode,
  ProjectGraphProjectNode
} from "@nx/devkit";
import type { DependentBuildableProjectNode } from "@nx/js/src/utils/buildable-libs-utils.js";

export function getExtraDependencies(
  projectName: string,
  graph: ProjectGraph
): DependentBuildableProjectNode[] {
  const deps = new Map<string, DependentBuildableProjectNode>();
  recur(projectName);

  function recur(currProjectName) {
    const allDeps = graph.dependencies[currProjectName];
    const externalDeps =
      allDeps?.reduce(
        (acc: ProjectGraphExternalNode[], node: ProjectGraphDependency) => {
          const found = graph.externalNodes?.[node.target];
          if (found) {
            acc.push(found);
          }
          return acc;
        },
        []
      ) ?? [];
    const internalDeps =
      allDeps?.reduce(
        (acc: ProjectGraphProjectNode[], node: ProjectGraphDependency) => {
          const found = graph.nodes[node.target];
          if (found) acc.push(found);
          return acc;
        },
        []
      ) ?? [];

    for (const externalDep of externalDeps) {
      deps.set(externalDep.name, {
        name: externalDep.name,
        outputs: [],
        node: externalDep
      });
    }

    for (const internalDep of internalDeps) {
      recur(internalDep.name);
    }
  }

  return Array.from(deps.values());
}

export function getInternalDependencies(
  projectName: string,
  graph: ProjectGraph
): ProjectGraphProjectNode[] {
  const allDeps = graph.dependencies[projectName] ?? [];

  return Array.from(
    allDeps.reduce(
      (acc: ProjectGraphProjectNode[], node: ProjectGraphDependency) => {
        const found = graph.nodes[node.target];
        if (found) acc.push(found);
        return acc;
      },
      []
    )
  );
}

export function getExternalDependencies(
  projectName: string,
  graph: ProjectGraph
): ProjectGraphExternalNode[] {
  const allDeps = graph.dependencies[projectName];

  return (
    Array.from(
      allDeps?.reduce(
        (acc: ProjectGraphExternalNode[], node: ProjectGraphDependency) => {
          const found = graph.externalNodes?.[node.target];
          if (found) acc.push(found);
          return acc;
        },
        []
      ) ?? []
    ) ?? []
  );
}
