// nx-ignore-next-line
import { createProjectGraphAsync } from "@nx/devkit";
import { calculateProjectBuildableDependencies } from "@nx/js/src/utils/buildable-libs-utils";
import {
  getHelperDependency,
  HelperDependency
} from "@nx/js/src/utils/compiler-helper-dependency";
import type { Plugin } from "rollup"; // only used  for types
import tsPlugin from "rollup-plugin-typescript2";
import { UnbuildOptions, UnbuildResolvedOptions } from "../types";
import { createTsCompilerOptions } from "../utilities/helpers";

export const tscPlugin = async (
  options: UnbuildOptions,
  resolvedOptions: UnbuildResolvedOptions
): Promise<Plugin<any>> => {
  const projectGraph = await createProjectGraphAsync({
    exitOnError: true
  });

  const result = calculateProjectBuildableDependencies(
    undefined,
    projectGraph,
    resolvedOptions.config.workspaceRoot,
    resolvedOptions.projectName,
    process.env.NX_TASK_TARGET_TARGET || "build",
    process.env.NX_TASK_TARGET_CONFIGURATION || "production",
    true
  );
  let dependencies = result.dependencies;

  const tsLibDependency = getHelperDependency(
    HelperDependency.tsc,
    resolvedOptions.tsconfig,
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

  return tsPlugin({
    check: options.emitTypes !== false,
    tsconfig: resolvedOptions.tsconfig,
    tsconfigOverride: {
      compilerOptions: await createTsCompilerOptions(
        resolvedOptions.config,
        resolvedOptions.tsconfig,
        resolvedOptions.projectRoot,
        dependencies
      )
    }
  });
};
