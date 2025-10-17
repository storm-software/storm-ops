import {
  getStopwatch,
  writeDebug
} from "@storm-software/config-tools/logger/console";
import { Options, build as tsup } from "tsup";

export * from "./constants";
export * from "./options";
export * from "./types";

/**
 * Execute tsup with all the configurations we pass
 *
 * @param context - The build context
 * @returns The build context
 */
export async function build(options: Options) {
  if (!options.silent) {
    writeDebug(
      `  🚀  Running ${options.name || "tsup"} build`,
      options.workspaceConfig
    );
  }
  const stopwatch = getStopwatch(`${options.name || "tsup"} build`);

  await tsup(options);

  if (!options.silent) {
    stopwatch();
  }
}
