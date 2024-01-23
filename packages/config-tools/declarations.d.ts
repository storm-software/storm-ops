import type { CosmiconfigResult } from "cosmiconfig";
import type * as z from "zod";
import type { StormConfigSchema } from "./src/schema";

type TStormConfig = z.infer<typeof StormConfigSchema>;

declare type StormConfig<
  TExtensionName extends keyof TStormConfig["extensions"] = keyof TStormConfig["extensions"],
  TExtensionConfig extends
    TStormConfig["extensions"][TExtensionName] = TStormConfig["extensions"][TExtensionName]
> = TStormConfig & {
  extensions:
    | (TStormConfig["extensions"] & {
        [extensionName in TExtensionName]: TExtensionConfig;
      })
    | NonNullable;
};
export type { StormConfig };

declare type StormConfigInput = z.input<typeof StormConfigSchema>;
export type { StormConfigInput };

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
declare function findWorkspaceRootSafe(pathInsideMonorepo?: string): string | undefined;
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
 * Get the config file values for the current Storm workspace
 */
declare function getConfigFile(): Promise<Partial<StormConfigInput>>;
export { getConfigFile };

/**
 * Load the config file values for the current Storm workspace into environment variables
 */
declare function loadStormConfig(workspaceRoot?: string): Promise<void>;
export { loadStormConfig };

/**
 * Type-check to determine if `obj` is a `StormError` object
 *
 * @param value - the object to check
 * @returns The function isStormError is returning a boolean value.
 */
declare function createStormConfig<
  TExtensionName extends keyof StormConfig["extensions"] = keyof StormConfig["extensions"],
  TExtensionConfig = any,
  TExtensionSchema extends z.ZodTypeAny = z.ZodTypeAny
>(
  extensionName?: TExtensionName,
  schema?: TExtensionSchema,
  workspaceRoot?: string
): StormConfig<TExtensionName, TExtensionConfig>;
export { createStormConfig };

/**
 * Get the config file for the current Storm workspace
 *
 * @param fileName - The name of the config file to search for
 * @param filePath - The path to search for the config file in
 * @returns The config file for the current Storm workspace
 */
declare function getConfigFileByName(
  fileName: string,
  filePath?: string
): Promise<CosmiconfigResult>;
export { getConfigFileByName };

/**
 * Get the config file for the current Storm workspace
 *
 * @returns The config file for the current Storm workspace
 */
declare function defineConfig(input: StormConfigInput): StormConfigInput;
export { defineConfig };

declare function exitWithError(config?: StormConfig): void;
export { exitWithError };

declare function exitWithSuccess(config?: StormConfig): void;
export { exitWithSuccess };

declare function handleProcess(config?: StormConfig): void;
export { handleProcess };
