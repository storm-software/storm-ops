import { copyAssets } from "@storm-software/build-tools";
import {
  getStopwatch,
  writeDebug
} from "@storm-software/config-tools/logger/console";
import { ESBuildContext } from "./types";

/**
 * Copy the assets to the build directory
 *
 * @param context - The build context
 * @returns The build context
 */
export async function copyBuildAssets(context: ESBuildContext) {
  if (!context.result?.errors.length && context.options.assets?.length) {
    writeDebug(
      `  📋  Copying ${context.options.assets.length} asset files to output directory: ${context.outputPath}`,
      context.workspaceConfig
    );
    const stopwatch = getStopwatch(`${context.options.name} asset copy`);

    await copyAssets(
      context.workspaceConfig,
      context.options.assets ?? [],
      context.outputPath,
      context.options.projectRoot,
      context.sourceRoot,
      true,
      false
    );

    stopwatch();
  }

  return context;
}
