/* eslint-disable @typescript-eslint/no-explicit-any */

import type { StormWorkspaceConfig } from "@storm-software/config";
import { stormWorkspaceConfigSchema } from "@storm-software/config/schema";
import defu from "defu";
import * as z from "zod";
import { getConfigFile } from "./config-file/get-config-file";
import { getConfigEnv, getExtensionEnv } from "./env/get-env";
import { setConfigEnv } from "./env/set-env";
import { formatLogMessage, writeTrace, writeWarning } from "./logger/console";
import { findWorkspaceRoot } from "./utilities/find-workspace-root";
import {
  applyDefaultConfig,
  getPackageJsonConfig
} from "./utilities/get-default-config";

const _extension_cache = new WeakMap<{ extensionName: string }, any>();

type StaticCache = { data: StormWorkspaceConfig; timestamp: number };
let _static_cache = undefined as StaticCache | undefined;

/**
 * Get the config for the current Storm workspace
 *
 * @param extensionName - The name of the config extension
 * @param schema - The schema for the config extension
 * @param workspaceRoot - The root directory of the workspace
 * @param skipLogs - Skip writing logs to the console
 * @param useDefault - Whether to use the default config if no config file is found
 * @returns The config for the current Storm workspace
 */
export const createStormWorkspaceConfig = async <
  TExtensionName extends
    keyof StormWorkspaceConfig["extensions"] = keyof StormWorkspaceConfig["extensions"],
  TExtensionConfig = any,
  TExtensionSchema extends z.ZodType = z.ZodType,
  TUseDefault extends boolean | undefined = boolean | undefined,
  TResult = TUseDefault extends true
    ? StormWorkspaceConfig<TExtensionName, TExtensionConfig>
    : StormWorkspaceConfig<TExtensionName, TExtensionConfig> | undefined
>(
  extensionName?: TExtensionName,
  schema?: TExtensionSchema,
  workspaceRoot?: string,
  skipLogs = false,
  useDefault: TUseDefault = true as TUseDefault
): Promise<TResult> => {
  let result!: StormWorkspaceConfig<TExtensionName, TExtensionConfig>;
  if (
    !_static_cache?.data ||
    !_static_cache?.timestamp ||
    _static_cache.timestamp < Date.now() - 8000
  ) {
    let _workspaceRoot = workspaceRoot;
    if (!_workspaceRoot) {
      _workspaceRoot = findWorkspaceRoot();
    }

    const configEnv = getConfigEnv() as StormWorkspaceConfig & {
      [extensionName in TExtensionName]: TExtensionConfig;
    };

    const configFile = await getConfigFile(_workspaceRoot);
    if (!configFile) {
      if (!skipLogs) {
        writeWarning(
          "No Storm Workspace configuration file found in the current repository. Please ensure this is the expected behavior - you can add a `storm-workspace.json` file to the root of your workspace if it is not.\n",
          { logLevel: "all" }
        );
      }

      if (useDefault === false) {
        return undefined as TResult;
      }
    }

    const defaultConfig = await getPackageJsonConfig(_workspaceRoot);
    const configInput = defu(
      configEnv,
      configFile,
      defaultConfig
    ) as StormWorkspaceConfig<TExtensionName, TExtensionConfig>;
    try {
      result = applyDefaultConfig(
        await stormWorkspaceConfigSchema.parseAsync(configInput)
      ) as StormWorkspaceConfig<TExtensionName, TExtensionConfig>;
      result.workspaceRoot ??= _workspaceRoot;
    } catch (error) {
      throw new Error(
        `Failed to parse Storm Workspace configuration${error?.message ? `: ${error.message}` : ""}

Please ensure your configuration file is valid JSON and matches the expected schema. The current workspace configuration input is: ${formatLogMessage(
          configInput
        )}`,
        {
          cause: error
        }
      );
    }
  } else {
    result = _static_cache.data as StormWorkspaceConfig<
      TExtensionName,
      TExtensionConfig
    >;
  }

  if (schema && extensionName) {
    result.extensions = {
      ...result.extensions,
      [extensionName]: createConfigExtension<
        TExtensionName,
        TExtensionConfig,
        TExtensionSchema
      >(extensionName, schema)
    };
  }

  _static_cache = {
    timestamp: Date.now(),
    data: result
  };
  return result as TResult;
};

/**
 * Get the config for a specific Storm config Extension
 *
 * @param extensionName - The name of the config extension
 * @param options - The options for the config extension
 * @returns The config for the specified Storm config extension. If the extension does not exist, `undefined` is returned.
 */
export const createConfigExtension = <
  TExtensionName extends
    keyof StormWorkspaceConfig["extensions"] = keyof StormWorkspaceConfig["extensions"],
  TExtensionConfig = any,
  TExtensionSchema extends z.ZodType = z.ZodType
>(
  extensionName: TExtensionName,
  schema: TExtensionSchema
): TExtensionConfig => {
  const extension_cache_key = { extensionName };
  if (_extension_cache.has(extension_cache_key)) {
    return _extension_cache.get(extension_cache_key) as TExtensionConfig;
  }

  let extension = getExtensionEnv(extensionName);
  if (schema) {
    extension = schema.parse(extension) as TExtensionSchema;
  }

  _extension_cache.set(extension_cache_key, extension);
  return extension as TExtensionConfig;
};

/**
 * Load the config file values for the current Storm workspace into environment variables
 *
 * @param workspaceRoot - The root directory of the workspace
 * @param skipLogs - Skip writing logs to the console
 * @returns The config for the current Storm workspace, throws an error if the config file could not be loaded
 */
export const loadStormWorkspaceConfig = async (
  workspaceRoot?: string,
  skipLogs = false
): Promise<StormWorkspaceConfig> => {
  const config = await createStormWorkspaceConfig(
    undefined,
    undefined,
    workspaceRoot,
    skipLogs,
    true
  );
  setConfigEnv(config);

  if (!skipLogs && !config.skipConfigLogging) {
    writeTrace(
      `⚙️  Using Storm Workspace configuration: \n${formatLogMessage(config)}`,
      config
    );
  }

  return config;
};

/**
 * Try to load the config file values for the current Storm workspace into environment variables
 *
 * @param workspaceRoot - The root directory of the workspace
 * @param skipLogs - Skip writing logs to the console
 * @param useDefault - Whether to use the default config if no config file is found
 * @returns The config for the current Storm workspace, or undefined if the config file could not be loaded
 */
export const tryLoadStormWorkspaceConfig = async (
  workspaceRoot?: string,
  skipLogs = true,
  useDefault = false
): Promise<StormWorkspaceConfig | undefined> => {
  try {
    const config = await createStormWorkspaceConfig(
      undefined,
      undefined,
      workspaceRoot,
      skipLogs,
      useDefault
    );
    if (!config) {
      return undefined;
    }

    setConfigEnv(config);

    if (!skipLogs && !config.skipConfigLogging) {
      writeTrace(
        `⚙️  Using Storm Workspace configuration: \n${formatLogMessage(config)}`,
        config
      );
    }

    return config;
  } catch (error) {
    if (!skipLogs) {
      writeWarning(
        `⚠️  Failed to load Storm Workspace configuration: ${error}`,
        { logLevel: "all" }
      );
    }
    return undefined;
  }
};
