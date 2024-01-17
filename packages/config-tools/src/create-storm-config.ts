import type { ZodTypeAny } from "zod";
import { getConfigFile } from "./config-file/get-config-file";
import { getConfigEnv, getExtensionEnv } from "./env/get-env";
import { setConfigEnv } from "./env/set-env";
import { StormConfigSchema } from "./schema";
import type { StormConfig } from "./types";
import { findWorkspaceRoot } from "./utilities";
import { getDefaultConfig } from "./utilities/get-default-config";

const _extension_cache = new WeakMap<{ extensionName: string }, any>();
let _static_cache: StormConfig | undefined = undefined;

/**
 * Get the config for the current Storm workspace
 *
 * @returns The config for the current Storm workspace
 */
export const createConfig = (workspaceRoot?: string): StormConfig => {
  return createStormConfig(undefined, undefined, workspaceRoot);
};

/**
 * Get the config for the current Storm workspace
 *
 * @returns The config for the current Storm workspace
 */
export const createStormConfig = <
  TExtensionName extends keyof StormConfig["extensions"] = keyof StormConfig["extensions"],
  TExtensionConfig = any,
  TExtensionSchema extends ZodTypeAny = ZodTypeAny
>(
  extensionName?: TExtensionName,
  schema?: TExtensionSchema,
  workspaceRoot?: string
): StormConfig<TExtensionName, TExtensionConfig> => {
  let result!: StormConfig<TExtensionName, TExtensionConfig>;
  if (!_static_cache) {
    const config = getConfigEnv() as StormConfig & {
      [extensionName in TExtensionName]: TExtensionConfig;
    };
    const defaultConfig = getDefaultConfig(config, workspaceRoot);

    result = StormConfigSchema.parse({
      ...defaultConfig,
      ...config,
      colors: {
        ...defaultConfig?.colors,
        ...config.colors
      }
    }) as StormConfig<TExtensionName, TExtensionConfig>;
  } else {
    result = _static_cache as StormConfig<TExtensionName, TExtensionConfig>;
  }

  if (schema && extensionName) {
    result.extensions = {
      ...result.extensions,
      [extensionName]: createConfigExtension<TExtensionName, TExtensionConfig, TExtensionSchema>(
        extensionName,
        schema
      )
    };
  }

  _static_cache = result;
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
  TExtensionName extends keyof StormConfig["extensions"] = keyof StormConfig["extensions"],
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
export const loadStormConfig = async (workspaceRoot?: string): Promise<StormConfig> => {
  let _workspaceRoot = workspaceRoot;
  if (!_workspaceRoot) {
    _workspaceRoot = findWorkspaceRoot();
  }

  const configFile = await getConfigFile(_workspaceRoot);
  const configEnv = getConfigEnv();

  for (const key of Object.keys(configEnv)) {
    if (configEnv[key] !== undefined && configEnv[key] !== null) {
      if (key === "colors") {
        configFile.colors = {
          primary: process.env.STORM_COLOR_PRIMARY ?? configFile.colors?.primary,
          background: process.env.STORM_COLOR_BACKGROUND ?? configFile.colors?.background,
          success: process.env.STORM_COLOR_SUCCESS ?? configFile.colors?.success,
          info: process.env.STORM_COLOR_INFO ?? configFile.colors?.info,
          warning: process.env.STORM_COLOR_WARNING ?? configFile.colors?.warning,
          error: process.env.STORM_COLOR_ERROR ?? configFile.colors?.error,
          fatal: process.env.STORM_COLOR_FATAL ?? configFile.colors?.fatal
        };
      } else {
        configFile[key] = configEnv[key];
      }
    }
  }

  const config = StormConfigSchema.parse(configFile);
  setConfigEnv(config);

  console.debug("\r\n\r\n");
  console.debug(`Loaded Storm config from ${config.configFile}`);
  for (const key of Object.keys(configFile)) {
    console.debug(`
 ----- ${key} ----- `);
    console.debug(configFile[key]);
  }
  console.debug("\r\n\r\n");

  return config;
};
