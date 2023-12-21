import * as z from "zod";
import { getConfigEnv, getExtensionEnv } from "./env/get-env";
import { StormConfigSchema } from "./schema";
import { StormConfig } from "./types";
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
  TExtensionConfig extends any = any,
  TExtensionSchema extends z.ZodTypeAny = z.ZodTypeAny
>(
  extensionName?: TExtensionName,
  schema?: TExtensionSchema,
  workspaceRoot?: string
): StormConfig<TExtensionName, TExtensionConfig> => {
  let result!: StormConfig<TExtensionName, TExtensionConfig>;
  if (!_static_cache) {
    let config = getConfigEnv() as StormConfig & {
      [extensionName in TExtensionName]: TExtensionConfig;
    };
    config = Object.assign(getDefaultConfig({}, workspaceRoot), config);

    result = StormConfigSchema.parse(config) as StormConfig<
      TExtensionName,
      TExtensionConfig
    >;
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
  TExtensionConfig extends any = any,
  TExtensionSchema extends z.ZodTypeAny = z.ZodTypeAny
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
