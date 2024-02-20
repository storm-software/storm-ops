import type { CosmiconfigResult, PublicExplorer, Config } from "cosmiconfig";
import type { StormConfigInput } from "@storm-software/config";
import { join } from "node:path";
import { findWorkspaceRootSafe } from "../utilities/find-workspace-root";
import { readFile, stat } from "node:fs/promises";

let _cosmiconfig: any = undefined;
let defaultExplorer: PublicExplorer | undefined;

/**
 * Get the config file for the current Storm workspace
 *
 * @param fileName - The name of the config file to search for
 * @param filePath - The path to search for the config file in
 * @returns The config file for the current Storm workspace
 */
export const getConfigFileExplorer = async (
  fileName: string
): Promise<PublicExplorer | undefined> => {
  if (!_cosmiconfig) {
    const mod = await import("cosmiconfig");
    if (mod?.cosmiconfig) {
      _cosmiconfig = mod.cosmiconfig;
    }

    if (!_cosmiconfig) {
      return undefined;
    }
  }

  return _cosmiconfig(fileName, { cache: true });
};

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
): Promise<CosmiconfigResult | undefined> => {
  return (await getConfigFileExplorer(fileName))?.search(filePath);
};

/**
 * Get the config file for the current Storm workspace
 *
 * @param fileName - The name of the config file to search for
 * @param filePath - The path to search for the config file in
 * @returns The config file for the current Storm workspace
 */
export const getJsonConfigFile = async (
  fileName: string,
  filePath?: string
): Promise<CosmiconfigResult | undefined> => {
  // const fse = await import("fs-extra/esm");

  const jsonPath = join(
    filePath ?? process.cwd(),
    fileName.endsWith(".json") ? fileName : `${fileName}.json`
  );
  const isEmpty = !!(await stat(jsonPath).catch((_) => false));

  return isEmpty
    ? {
        config: JSON.parse(await readFile(jsonPath, "utf-8")),
        filepath: jsonPath,
        isEmpty
      }
    : { config: {} as Config, filepath: jsonPath, isEmpty };
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
  const workspacePath = filePath ? filePath : findWorkspaceRootSafe(filePath);

  let cosmiconfigResult = await getJsonConfigFile("storm", workspacePath);
  if (!cosmiconfigResult || cosmiconfigResult.isEmpty) {
    if (!defaultExplorer) {
      defaultExplorer = await getConfigFileExplorer("storm");
    }

    if (defaultExplorer) {
      cosmiconfigResult = await defaultExplorer.search(workspacePath);
    }

    if ((!cosmiconfigResult || cosmiconfigResult.isEmpty) && additionalFileNames.length > 0) {
      for (const additionalFileName of additionalFileNames) {
        cosmiconfigResult = await getJsonConfigFile(additionalFileName, workspacePath);
        if (cosmiconfigResult && !cosmiconfigResult.isEmpty) {
          break;
        }

        cosmiconfigResult = await getConfigFileByName(additionalFileName, workspacePath);
        if (cosmiconfigResult && !cosmiconfigResult.isEmpty) {
          break;
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
    return undefined;
  }

  const config: Partial<StormConfigInput> = cosmiconfigResult.config ?? {};
  if (cosmiconfigResult.filepath) {
    config.configFile = cosmiconfigResult.filepath;
  }
  config.runtimeVersion = "0.0.1";

  return config;
};
