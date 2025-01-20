import { StormConfig } from "@storm-software/config";
import {
  getStopwatch,
  writeDebug
} from "@storm-software/config-tools/logger/console";
import { rm } from "node:fs/promises";

/**
 * Clean the Unbuild output path
 *
 * @param name - The name of the executor
 * @param directory - The directory to clean
 * @param config - The StormConfig object
 */
export async function clean(
  name = "Unbuild",
  directory: string,
  config?: StormConfig
) {
  writeDebug(` 🧹  Cleaning ${name} output path: ${directory}`, config);
  const stopwatch = getStopwatch(`${name} output clean`);

  await rm(directory, { recursive: true, force: true });

  stopwatch();
}
