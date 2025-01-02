import type { StormConfigInput } from "@storm-software/config";
import { loadConfig, ResolvedConfig, type LoadConfigOptions } from "c12";
import defu from "defu";
import { writeSystem } from "../logger/console";
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
  options: LoadConfigOptions<Partial<StormConfigInput>> = {}
): Promise<ResolvedConfig<Partial<StormConfigInput>>> => {
  const workspacePath = filePath || findWorkspaceRoot(filePath);

  let config = loadConfig<Partial<StormConfigInput>>({
    cwd: workspacePath,
    packageJson: true,
    name: fileName,
    envName: fileName?.toUpperCase(),
    jitiOptions: {
      debug: false,
      cache:
        process.env.STORM_SKIP_CACHE === "true"
          ? false
          : joinPaths(
              process.env.STORM_CACHE_DIR || "node_modules/.cache",
              "storm"
            )
    },
    ...options
  });
  if (!config || Object.keys(config).length === 0) {
    config = loadConfig<Partial<StormConfigInput>>({
      cwd: workspacePath,
      packageJson: true,
      name: fileName,
      envName: fileName?.toUpperCase(),
      jitiOptions: {
        debug: false,
        cache:
          process.env.STORM_SKIP_CACHE === "true"
            ? false
            : joinPaths(
                process.env.STORM_CACHE_DIR || "node_modules/.cache",
                "storm"
              )
      },
      configFile: fileName,
      ...options
    });
  }

  return config;
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

  const result = await getConfigFileByName("storm", workspacePath);

  let config = result.config;
  const configFile = result.configFile;
  if (config && configFile && Object.keys(config).length > 0) {
    writeSystem(
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
        writeSystem(
          `Found alternative configuration file "${
            result.configFile.includes(`${workspacePath}/`)
              ? result.configFile.replace(`${workspacePath}/`, "")
              : result.configFile
          }" at "${workspacePath}"`,
          {
            logLevel: "all"
          }
        );

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
