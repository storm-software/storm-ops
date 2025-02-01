/* eslint-disable @typescript-eslint/no-explicit-any */

import type { StormConfig } from "@storm-software/config";
import { StormConfigSchema } from "@storm-software/config/schema";
import defu from "defu";
import type { ZodTypeAny } from "zod";
import { getConfigFile } from "./config-file/get-config-file";
import { getConfigEnv, getExtensionEnv } from "./env/get-env";
import { setConfigEnv } from "./env/set-env";
import { formatLogMessage, writeTrace, writeWarning } from "./logger/console";
import { findWorkspaceRoot } from "./utilities/find-workspace-root";
import { getDefaultConfig } from "./utilities/get-default-config";

const _extension_cache = new WeakMap<{ extensionName: string }, any>();

type StaticCache = { data: StormConfig; timestamp: number };
let _static_cache = undefined as StaticCache | undefined;

/**
 * Get the config for the current Storm workspace
 *
 * @returns The config for the current Storm workspace
 */
export const createStormConfig = async <
  TExtensionName extends
    keyof StormConfig["extensions"] = keyof StormConfig["extensions"],
  TExtensionConfig = any,
  TExtensionSchema extends ZodTypeAny = ZodTypeAny
>(
  extensionName?: TExtensionName,
  schema?: TExtensionSchema,
  workspaceRoot?: string,
  skipLogs = false
): Promise<StormConfig<TExtensionName, TExtensionConfig>> => {
  let result!: StormConfig<TExtensionName, TExtensionConfig>;
  if (
    !_static_cache?.data ||
    !_static_cache?.timestamp ||
    _static_cache.timestamp < Date.now() - 8000
  ) {
    let _workspaceRoot = workspaceRoot;
    if (!_workspaceRoot) {
      _workspaceRoot = findWorkspaceRoot();
    }

    const configEnv = getConfigEnv() as StormConfig & {
      [extensionName in TExtensionName]: TExtensionConfig;
    };
    const defaultConfig = await getDefaultConfig(_workspaceRoot);

    const configFile = await getConfigFile(_workspaceRoot);
    if (!configFile && !skipLogs) {
      writeWarning(
        "No Storm Workspace configuration file found in the current repository. Please ensure this is the expected behavior - you can add a `storm-workspace.json` file to the root of your workspace if it is not.\n",
        { logLevel: "all" }
      );
    }

    result = (await StormConfigSchema.parseAsync(
      defu(configEnv, configFile, defaultConfig)
    )) as StormConfig<TExtensionName, TExtensionConfig>;
    result.workspaceRoot ??= _workspaceRoot;
  } else {
    result = _static_cache.data as StormConfig<
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
  return result;
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
    keyof StormConfig["extensions"] = keyof StormConfig["extensions"],
  TExtensionConfig = any,
  TExtensionSchema extends ZodTypeAny = ZodTypeAny
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
    extension = schema.parse(extension);
  }

  _extension_cache.set(extension_cache_key, extension);
  return extension as TExtensionConfig;
};

/**
 * Load the config file values for the current Storm workspace into environment variables
 */
export const loadStormConfig = async (
  workspaceRoot?: string,
  skipLogs = false
): Promise<StormConfig> => {
  const config = await createStormConfig(
    undefined,
    undefined,
    workspaceRoot,
    skipLogs
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
