import type { ZodTypeAny } from "zod";
import { getConfigFile } from "./config-file/get-config-file";
import { getConfigEnv, getExtensionEnv } from "./env/get-env";
import { setConfigEnv } from "./env/set-env";
import type { StormConfig } from "@storm-software/config";
import { StormConfigSchema } from "@storm-software/config/schema";
import { findWorkspaceRoot, writeWarning } from "./utilities";
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
  TExtensionName extends
    keyof StormConfig["extensions"] = keyof StormConfig["extensions"],
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
      [extensionName]: createConfigExtension<
        TExtensionName,
        TExtensionConfig,
        TExtensionSchema
      >(extensionName, schema)
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
  workspaceRoot?: string
): Promise<StormConfig> => {
  let config = {} as StormConfig;

  let _workspaceRoot = workspaceRoot;
  if (!_workspaceRoot) {
    _workspaceRoot = findWorkspaceRoot();
  }

  const configFile = await getConfigFile(_workspaceRoot);
  if (!configFile) {
    writeWarning(
      "No Storm config file found in the current workspace. Please ensure this is the expected behavior - you can add a `storm.config.js` file to the root of your workspace if it is not.\n",
      { logLevel: "all" }
    );
  }

  config = StormConfigSchema.parse(
    await getDefaultConfig(
      {
        ...getConfigEnv(),
        ...configFile
      } as Partial<StormConfig>,
      _workspaceRoot
    )
  );
  setConfigEnv(config);

  return config;
};
