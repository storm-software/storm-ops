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
 * Find the root of the current monorepo
 *
 * @param pathInsideMonorepo - The path inside the monorepo
 */
declare function findWorkspaceRoot(pathInsideMonorepo?: string): string;
export { findWorkspaceRoot };

/**
 * Find the root of the current monorepo safely (do not throw an error if it cannot be found)
 *
 * @param pathInsideMonorepo - The path inside the monorepo
 */
declare function findWorkspaceRootSafe(
  pathInsideMonorepo?: string
): string | undefined;
export { findWorkspaceRootSafe };

/**
 * Type-check to determine if `obj` is a `StormError` object
 *
 * @param value - the object to check
 * @returns The function isStormError is returning a boolean value.
 */
declare function createConfig(workspaceRoot?: string): StormConfig;
export { createConfig };

/**
 * Type-check to determine if `obj` is a `StormError` object
 *
 * @param value - the object to check
 * @returns The function isStormError is returning a boolean value.
 */
declare function createStormConfig<
  TExtensionName extends
    keyof StormConfig["extensions"] = keyof StormConfig["extensions"],
  TExtensionConfig extends any = any,
  TExtensionSchema extends z.ZodTypeAny = z.ZodTypeAny
>(
  extensionName?: TExtensionName,
  schema?: TExtensionSchema,
  workspaceRoot?: string
): StormConfig<TExtensionName, TExtensionConfig>;
export { createStormConfig };
