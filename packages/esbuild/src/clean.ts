import { hfs } from "@humanfs/node";
import { StormConfig } from "@storm-software/config";
import {
  getStopwatch,
  writeDebug
} from "@storm-software/config-tools/logger/console";

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
  config?: StormConfig
) {
  writeDebug(` 🧹  Cleaning ${name} output path: ${directory}`, config);
  const stopwatch = getStopwatch(`${name} output clean`);

  await hfs.deleteAll(directory);

  stopwatch();
}
