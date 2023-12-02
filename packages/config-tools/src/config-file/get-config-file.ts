import { CosmiconfigResult, cosmiconfig } from "cosmiconfig";
import { StormConfigInput } from "../types";

let _static_cache: Partial<StormConfigInput> | undefined = undefined;

const getConfigFileName = (
  fileName: string
): Promise<CosmiconfigResult | undefined> =>
  cosmiconfig(fileName, { cache: true }).search();

/**
 * Get the config file for the current Storm workspace
 *
 * @returns The config file for the current Storm workspace
 */
export const getConfigFile = async (): Promise<Partial<StormConfigInput>> => {
  if (_static_cache) {
    return _static_cache as Partial<StormConfigInput>;
  }

  let cosmiconfigResult = await getConfigFileName("storm");
  if (!cosmiconfigResult || cosmiconfigResult.isEmpty) {
    cosmiconfigResult = await getConfigFileName("storm-software");
    if (!cosmiconfigResult || cosmiconfigResult.isEmpty) {
      cosmiconfigResult = await getConfigFileName("storm-stack");
      if (!cosmiconfigResult || cosmiconfigResult.isEmpty) {
        cosmiconfigResult = await getConfigFileName("storm-cloud");
        if (!cosmiconfigResult || cosmiconfigResult.isEmpty) {
          cosmiconfigResult = await getConfigFileName("acidic");
          if (!cosmiconfigResult || cosmiconfigResult.isEmpty) {
            cosmiconfigResult = await getConfigFileName("acid");
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
  cosmiconfigResult.filepath &&
    (config.configFile = cosmiconfigResult.filepath);
  config.runtimeVersion = "0.0.1";

  _static_cache = config;
  return config;
};
