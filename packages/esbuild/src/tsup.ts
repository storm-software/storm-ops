import {
  getStopwatch,
  writeDebug
} from "@storm-software/config-tools/logger/console";
import { joinPaths } from "@storm-software/config-tools/utilities/correct-paths";
import { BuildOptions, build as tsup } from "@storm-software/tsup";
import { ESBuildContext } from "./types";

/**
 * Execute tsup with all the configurations we pass
 *
 * @param context - The build context
 * @returns The build context
 */
export async function executeTsup(context: ESBuildContext) {
  writeDebug(
    `  🚀  Running ${context.options.name} build`,
    context.workspaceConfig
  );
  const stopwatch = getStopwatch(`${context.options.name} build`);

  await tsup({
    ...context.options,
    outDir: context.options.distDir
      ? joinPaths(context.outputPath, context.options.distDir)
      : context.outputPath,
    workspaceConfig: context.workspaceConfig
  } as BuildOptions);

  stopwatch();

  return context;
}
