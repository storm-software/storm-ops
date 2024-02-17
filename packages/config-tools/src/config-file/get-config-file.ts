import type { CosmiconfigResult } from "cosmiconfig";
import type { StormConfigInput } from "@storm-software/config";

let _static_cache: StormConfigInput | undefined = undefined;

/**
 * Get the config file for the current Storm workspace
 *
 * @param fileName - The name of the config file to search for
 * @param filePath - The path to search for the config file in
 * @returns The config file for the current Storm workspace
 */
export const getConfigFileByName = async (
  fileName: string,
  filePath?: string
): Promise<CosmiconfigResult> => {
  const cosmiconfig = await import("cosmiconfig");

  return cosmiconfig?.cosmiconfig?.(fileName, { cache: true }).search(filePath);
};

/**
 * Get the config file for the current Storm workspace
 *
 * @returns The config file for the current Storm workspace
 */
export const getConfigFile = async (filePath?: string): Promise<StormConfigInput> => {
  if (_static_cache) {
    return _static_cache as StormConfigInput;
  }

  let cosmiconfigResult = await getConfigFileByName("storm", filePath);
  if (!cosmiconfigResult || cosmiconfigResult.isEmpty) {
    cosmiconfigResult = await getConfigFileByName("storm-software", filePath);
    if (!cosmiconfigResult || cosmiconfigResult.isEmpty) {
      cosmiconfigResult = await getConfigFileByName("storm-stack", filePath);
      if (!cosmiconfigResult || cosmiconfigResult.isEmpty) {
        cosmiconfigResult = await getConfigFileByName("storm-cloud", filePath);
      }
    }
  }

  if (
    !cosmiconfigResult ||
    Object.keys(cosmiconfigResult).length === 0 ||
    cosmiconfigResult.isEmpty ||
    !cosmiconfigResult.filepath
  ) {
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
