import { StormConfig } from "@storm-software/config";
import {
  getStopwatch,
  writeDebug,
} from "@storm-software/config-tools/logger/console";
import { rm } from "node:fs/promises";

/**
 * Clean the ESBuild output path
 *
 * @param name - The name of the executor
 * @param directory - The directory to clean
 * @param config - The StormConfig object
 */
export async function clean(
  name = "ESBuild",
  directory: string,
  config?: StormConfig,
) {
  writeDebug(` 🧹  Cleaning ${name} output path: ${directory}`, config);
  const stopwatch = getStopwatch(`${name} output clean`);

  await cleanDirectories(name, directory, config);

  stopwatch();
}

/**
 * Clean the ESBuild output path
 *
 * @param name - The name of the executor
 * @param directory - The directory to clean
 * @param config - The StormConfig object
 */
export async function cleanDirectories(
  name = "ESBuild",
  directory: string,
  config?: StormConfig,
) {
  await rm(directory, { recursive: true, force: true });
}
