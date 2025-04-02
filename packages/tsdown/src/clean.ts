import { StormWorkspaceConfig } from "@storm-software/config";
import {
  getStopwatch,
  writeDebug
} from "@storm-software/config-tools/logger/console";
import { rm } from "node:fs/promises";

/**
 * Clean the TSDown output path
 *
 * @param name - The name of the executor
 * @param directory - The directory to clean
 * @param config - The StormWorkspaceConfig object
 */
export async function clean(
  name = "TSDown",
  directory: string,
  config?: StormWorkspaceConfig
) {
  writeDebug(` 🧹  Cleaning ${name} output path: ${directory}`, config);
  const stopwatch = getStopwatch(`${name} output clean`);

  await cleanDirectories(name, directory, config);

  stopwatch();
}

/**
 * Clean the TSDown output path
 *
 * @param name - The name of the executor
 * @param directory - The directory to clean
 * @param config - The StormWorkspaceConfig object
 */
export async function cleanDirectories(
  name = "TSDown",
  directory: string,
  config?: StormWorkspaceConfig
) {
  await rm(directory, { recursive: true, force: true });
}
