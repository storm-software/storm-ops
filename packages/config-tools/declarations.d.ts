import * as z from "zod";
import { StormConfigSchema } from "./src/schema";

type TStormConfig = z.infer<typeof StormConfigSchema>;

declare type StormConfig<
  TExtensionName extends
    keyof TStormConfig["extensions"] = keyof TStormConfig["extensions"],
  TExtensionConfig extends
    TStormConfig["extensions"][TExtensionName] = TStormConfig["extensions"][TExtensionName]
> = TStormConfig & {
  extensions:
    | (TStormConfig["extensions"] & {
        [extensionName in TExtensionName]: TExtensionConfig;
      })
    | {};
};
export { StormConfig };

/**
 * Type-check to determine if `obj` is a `StormError` object
 *
 * @param value - the object to check
 * @returns The function isStormError is returning a boolean value.
 */
declare function createStormConfig<
  TExtensionName extends
    keyof StormConfig["extensions"] = keyof StormConfig["extensions"],
  TExtensionConfig extends Record<string, any> = Record<string, any>,
  TExtensionSchema extends
    z.ZodType<TExtensionConfig> = z.ZodType<TExtensionConfig>
>(
  extensionName?: TExtensionName,
  schema?: TExtensionSchema
): StormConfig<TExtensionName, TExtensionConfig>;
export { createStormConfig };
