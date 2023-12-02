import { Schema, wrap } from "@decs/typeschema";
import { getConfigEnv, getExtensionEnv } from "./env/get-env";
import { StormConfig, wrapped_StormConfig } from "./types";

const _extension_cache = new WeakMap<{ extensionName: string }, any>();
let _static_cache: StormConfig | undefined = undefined;

/**
 * Get the config for the current Storm workspace
 *
 * @returns The config for the current Storm workspace
 */
export const createStormConfig = async <
  TExtensionName extends string = string,
  TExtensionConfig = any
>(
  extensionName?: TExtensionName,
  schema?: Schema
): Promise<StormConfig<TExtensionName, TExtensionConfig>> => {
  let result!: StormConfig<TExtensionName, TExtensionConfig>;
  if (!_static_cache) {
    let config = getConfigEnv() as StormConfig & {
      [moduleName in TExtensionName]: TExtensionConfig;
    };
    result = (await wrapped_StormConfig.parse(config)) as StormConfig<
      TModuleName,
      TModuleConfig
    >;
  } else {
    result = _static_cache as StormConfig<TModuleName, TModuleConfig>;
  }

  if (schema && extensionName) {
    const moduleConfig = await createConfigExtension(schema, extensionName);
    result.modules[extensionName] = moduleConfig;
  }

  _static_cache = result;
  return result;
};

/**
 * Get the config for a specific Storm config Extension
 *
 * @param moduleName - The name of the config module
 * @param options - The options for the config module
 * @returns The config for the specified Storm config module. If the module does not exist, `undefined` is returned.
 */
export const createConfigExtension = async <TExtensionConfig = any>(
  extensionName: string,
  schema: Schema
): Promise<TExtensionConfig> => {
  const extension_cache_key = { extensionName };
  if (_extension_cache.has(extension_cache_key)) {
    return _extension_cache.get(extension_cache_key) as TExtensionConfig;
  }

  let extension = getExtensionEnv(extensionName);
  if (schema) {
    extension = await wrap(schema).parse(extension);
  }

  _extension_cache.set(extension_cache_key, extension);
  return extension as TExtensionConfig;
};
