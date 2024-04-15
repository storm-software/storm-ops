import type { StormConfigInput } from "@storm-software/config";
import { findWorkspaceRoot } from "../utilities/find-workspace-root";
import { loadConfig } from "c12";
import merge from "deepmerge";

// let _cosmiconfig: any = undefined;
// let defaultExplorer: PublicExplorer | undefined;

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
): Promise<Partial<StormConfigInput> | undefined> => {
  const workspacePath = filePath ? filePath : findWorkspaceRoot(filePath);

  return loadConfig<Partial<StormConfigInput>>({
    cwd: workspacePath,
    packageJson: true,
    name: fileName,
    envName: fileName?.toUpperCase(),
    jitiOptions: {
      debug: true,
      cache: process.env.STORM_CACHE ? process.env.STORM_CACHE_DIRECTORY : false
    }
  });
};

/**
 * Get the config file for the current Storm workspace
 *
 * @returns The config file for the current Storm workspace
 */
export const getConfigFile = async (
  filePath?: string,
  additionalFileNames: string[] = []
): Promise<Partial<StormConfigInput> | undefined> => {
  const workspacePath = filePath ? filePath : findWorkspaceRoot(filePath);

  let { config, configFile } = await loadConfig<Partial<StormConfigInput>>({
    cwd: workspacePath,
    name: "storm"
  });

  if (additionalFileNames && additionalFileNames.length > 0) {
    const results = await Promise.all(
      additionalFileNames.map(fileName =>
        loadConfig({
          cwd: workspacePath,
          name: fileName
        })
      )
    );

    for (const result of results) {
      if (result) {
        config = merge(config ?? {}, result.config ?? {});
      }
    }
  }

  if (!config) {
    return undefined;
  }

  config.configFile = configFile;
  config.runtimeVersion = "0.0.1";

  return config;
};
