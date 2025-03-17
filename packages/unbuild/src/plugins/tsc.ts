import { readCachedProjectGraph } from "@nx/devkit";
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
  const projectGraph = readCachedProjectGraph();

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
