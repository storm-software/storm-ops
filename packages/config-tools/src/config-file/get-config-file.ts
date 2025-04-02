import type { StormWorkspaceConfigInput } from "@storm-software/config";
import { loadConfig, ResolvedConfig, type LoadConfigOptions } from "c12";
import defu from "defu";
import { writeTrace } from "../logger/console";
import { joinPaths } from "../utilities";
import { findWorkspaceRoot } from "../utilities/find-workspace-root";

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
  filePath?: string,
  options: LoadConfigOptions<Partial<StormWorkspaceConfigInput>> = {}
): Promise<ResolvedConfig<Partial<StormWorkspaceConfigInput>>> => {
  const workspacePath = filePath || findWorkspaceRoot(filePath);

  const configs = await Promise.all([
    loadConfig<Partial<StormWorkspaceConfigInput>>({
      cwd: workspacePath,
      packageJson: true,
      name: fileName,
      envName: fileName?.toUpperCase(),
      jitiOptions: {
        debug: false,
        fsCache:
          process.env.STORM_SKIP_CACHE === "true"
            ? false
            : joinPaths(
                process.env.STORM_CACHE_DIR || "node_modules/.cache/storm",
                "jiti"
              )
      },
      ...options
    }),
    loadConfig<Partial<StormWorkspaceConfigInput>>({
      cwd: workspacePath,
      packageJson: true,
      name: fileName,
      envName: fileName?.toUpperCase(),
      jitiOptions: {
        debug: false,
        fsCache:
          process.env.STORM_SKIP_CACHE === "true"
            ? false
            : joinPaths(
                process.env.STORM_CACHE_DIR || "node_modules/.cache/storm",
                "jiti"
              )
      },
      configFile: fileName,
      ...options
    })
  ]);

  return defu(configs[0] ?? {}, configs[1] ?? {});
};

/**
 * Get the config file for the current Storm workspace
 *
 * @returns The config file for the current Storm workspace
 */
export const getConfigFile = async (
  filePath?: string,
  additionalFileNames: string[] = []
): Promise<Partial<StormWorkspaceConfigInput> | undefined> => {
  const workspacePath = filePath ? filePath : findWorkspaceRoot(filePath);

  const result = await getConfigFileByName("storm-workspace", workspacePath);

  let config = result.config;
  const configFile = result.configFile;
  if (
    config &&
    configFile &&
    Object.keys(config).length > 0 &&
    !config.skipConfigLogging
  ) {
    writeTrace(
      `Found Storm configuration file "${
        configFile.includes(`${workspacePath}/`)
          ? configFile.replace(`${workspacePath}/`, "")
          : configFile
      }" at "${workspacePath}"`,
      {
        logLevel: "all"
      }
    );
  }

  if (additionalFileNames && additionalFileNames.length > 0) {
    const results = await Promise.all(
      additionalFileNames.map(fileName =>
        getConfigFileByName(fileName, workspacePath)
      )
    );
    for (const result of results) {
      if (
        result?.config &&
        result?.configFile &&
        Object.keys(result.config).length > 0
      ) {
        if (!config.skipConfigLogging && !result.config.skipConfigLogging) {
          writeTrace(
            `Found alternative configuration file "${
              result.configFile.includes(`${workspacePath}/`)
                ? result.configFile.replace(`${workspacePath}/`, "")
                : result.configFile
            }" at "${workspacePath}"`,
            {
              logLevel: "all"
            }
          );
        }

        config = defu(result.config ?? {}, config ?? {});
      }
    }
  }

  if (!config) {
    return undefined;
  }

  config.configFile = configFile;

  return config;
};
