import { type CosmiconfigResult, cosmiconfig } from "cosmiconfig";
import type { StormConfigInput } from "../types";

let _static_cache: StormConfigInput | undefined = undefined;

const getConfigFileName = (
  fileName: string,
  filePath?: string
): Promise<CosmiconfigResult | undefined> =>
  cosmiconfig(fileName, { cache: true }).search(filePath);

/**
 * Get the config file for the current Storm workspace
 *
 * @returns The config file for the current Storm workspace
 */
export const getConfigFile = async (filePath?: string): Promise<StormConfigInput> => {
  if (_static_cache) {
    return _static_cache as StormConfigInput;
  }

  let cosmiconfigResult = await getConfigFileName("storm", filePath);
  if (!cosmiconfigResult || cosmiconfigResult.isEmpty) {
    cosmiconfigResult = await getConfigFileName("storm-software", filePath);
    if (!cosmiconfigResult || cosmiconfigResult.isEmpty) {
      cosmiconfigResult = await getConfigFileName("storm-stack", filePath);
      if (!cosmiconfigResult || cosmiconfigResult.isEmpty) {
        cosmiconfigResult = await getConfigFileName("storm-cloud", filePath);
        if (!cosmiconfigResult || cosmiconfigResult.isEmpty) {
          cosmiconfigResult = await getConfigFileName("acidic", filePath);
          if (!cosmiconfigResult || cosmiconfigResult.isEmpty) {
            cosmiconfigResult = await getConfigFileName("acid", filePath);
          }
        }
      }
    }
  }

  if (
    !cosmiconfigResult ||
    Object.keys(cosmiconfigResult).length === 0 ||
    cosmiconfigResult.isEmpty ||
    !cosmiconfigResult.filepath
  ) {
    console.warn(
      "No Storm config file found in the current workspace. Please ensure this is the expected behavior - you can add a `storm.config.js` file to the root of your workspace if it is not."
    );
    return undefined;
  }

  const config: Partial<StormConfigInput> = cosmiconfigResult.config ?? {};
  if (cosmiconfigResult.filepath) {
    config.configFile = cosmiconfigResult.filepath;
  }
  config.runtimeVersion = "0.0.1";

  _static_cache = config;
  return config;
};
