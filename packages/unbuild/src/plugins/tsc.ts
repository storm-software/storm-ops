import {
  createProjectGraphAsync,
  ProjectGraph,
  readCachedProjectGraph
} from "@nx/devkit";
import { calculateProjectBuildableDependencies } from "@nx/js/src/utils/buildable-libs-utils";
import {
  getHelperDependency,
  HelperDependency
} from "@nx/js/src/utils/compiler-helper-dependency";
import type { Plugin } from "rollup";
import ts2Plugin from "rollup-plugin-typescript2";
import { UnbuildResolvedOptions } from "../types";
import { createTsCompilerOptions } from "../utilities/helpers";

export const tscPlugin = async (
  options: UnbuildResolvedOptions
): Promise<Plugin<any>> => {
  let projectGraph!: ProjectGraph;
  try {
    projectGraph = readCachedProjectGraph();
  } catch {
    await createProjectGraphAsync();
    projectGraph = readCachedProjectGraph();
  }

  if (!projectGraph) {
    throw new Error(
      "The build process failed because the project graph is not available. Please run the build command again."
    );
  }

  const result = calculateProjectBuildableDependencies(
    undefined,
    projectGraph,
    options.config.workspaceRoot,
    options.projectName,
    process.env.NX_TASK_TARGET_TARGET || "build",
    process.env.NX_TASK_TARGET_CONFIGURATION || "production",
    true
  );
  let dependencies = result.dependencies;

  const tsLibDependency = getHelperDependency(
    HelperDependency.tsc,
    options.tsconfig,
    dependencies,
    projectGraph,
    true
  );
  if (tsLibDependency) {
    dependencies = dependencies.filter(
      deps => deps.name !== tsLibDependency.name
    );
    dependencies.push(tsLibDependency);
  }

  const compilerOptions = await createTsCompilerOptions(
    options.config,
    options.tsconfig,
    options.projectRoot,
    dependencies
  );

  return ts2Plugin({
    check: options.declaration !== false,
    tsconfig: options.tsconfig,
    tsconfigOverride: compilerOptions
  });
};
