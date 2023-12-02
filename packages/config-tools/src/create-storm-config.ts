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
      [extensionName in TExtensionName]: TExtensionConfig;
    };
    result = (await wrapped_StormConfig.parse(config)) as StormConfig<
      TExtensionName,
      TExtensionConfig
    >;
  } else {
    result = _static_cache as StormConfig<TExtensionName, TExtensionConfig>;
  }

  if (schema && extensionName) {
    const extensionConfig = await createConfigExtension(extensionName, schema);
    result.extensions[extensionName] = extensionConfig;
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
