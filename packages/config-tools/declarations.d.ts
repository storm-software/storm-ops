import type { CosmiconfigResult } from "cosmiconfig";
import type * as z from "zod";
import type { StormConfig, StormConfigInput } from "@storm-software/config";
import type {
  LogLevel,
  LogLevelLabel,
  BaseTokenizerOptions,
  ProjectTokenizerOptions
} from "./src/types";

export * from "./src/types";

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

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
 * Get the config file values for the current Storm workspace
 */
declare function getConfigFile(
  filePath?: string,
  additionalFileNames: string[] = []
): Promise<Partial<StormConfigInput>>;
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
  TExtensionName extends
    keyof StormConfig["extensions"] = keyof StormConfig["extensions"],
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

/**
 * Write a message to the console at the `fatal` log level
 *
 * @param config - The Storm configuration
 * @param message - The message to write
 */
declare function writeFatal(
  config: Partial<StormConfig>,
  message: string
): void;
export { writeFatal };

/**
 * Write a message to the console at the `error` log level
 *
 * @param config - The Storm configuration
 * @param message - The message to write
 */
declare function writeError(
  config: Partial<StormConfig>,
  message: string
): void;
export { writeError };

/**
 * Write a message to the console at the `warning` log level
 *
 * @param config - The Storm configuration
 * @param message - The message to write
 */
declare function writeWarning(
  config: Partial<StormConfig>,
  message: string
): void;
export { writeWarning };

/**
 * Write a message to the console at the `info` log level
 *
 * @param config - The Storm configuration
 * @param message - The message to write
 */
declare function writeInfo(config: Partial<StormConfig>, message: string): void;
export { writeInfo };

/**
 * Write a message to the console at the `success` log level
 *
 * @param config - The Storm configuration
 * @param message - The message to write
 */
declare function writeSuccess(
  config: Partial<StormConfig>,
  message: string
): void;
export { writeSuccess };

/**
 * Write a message to the console at the `debug` log level
 *
 * @param config - The Storm configuration
 * @param message - The message to write
 */
declare function writeDebug(
  config: Partial<StormConfig>,
  message: string
): void;
export { writeDebug };

/**
 * Write a message to the console at the `trace` log level
 *
 * @param config - The Storm configuration
 * @param message - The message to write
 */
declare function writeTrace(
  config: Partial<StormConfig>,
  message: string
): void;
export { writeTrace };

/**
 * Write a message to the console at the `all` log level
 *
 * @param config - The Storm configuration
 * @param message - The message to write
 */
declare function writeSystem(
  config: Partial<StormConfig>,
  message: string
): void;
export { writeSystem };

/**
 * Get a stopwatch function
 *
 * @param name - The name of the process
 * @returns The stopwatch function
 */
declare function getStopwatch(name: string): () => void;
export { getStopwatch };

declare const LARGE_BUFFER: number;
export type IOType = "overlapped" | "pipe" | "ignore" | "inherit";
export type StdioOptions =
  | IOType
  | Array<IOType | "ipc" | number | null | undefined>;

/**
 *  Run a command line process
 *
 * @remarks
 * A wrapper around execa to run our command line processes
 *
 * @param config - The Storm configuration object
 * @param command - The command to run
 * @param cwd - The current working directory
 * @returns The result of the command
 */
declare function run(
  config: StormConfig,
  command: string,
  cwd: string = config.workspaceRoot,
  stdio: StdioOptions = "inherit"
): any;
export { run };

declare function getLogLevel(label?: string): LogLevel;
export { getLogLevel };

declare function getLogLevelLabel(logLevel: number): LogLevelLabel;
export { getLogLevelLabel };

declare module "fs-extra/esm" {}

declare function removeExtension(filePath?: string): string;
export { removeExtension };

declare function findFileName(filePath?: string): string;
export { findFileName };

declare function applyWorkspaceBaseTokens(
  option: string,
  tokenizerOptions: BaseTokenizerOptions
): Promise<string>;
export { applyWorkspaceBaseTokens };

declare function applyWorkspaceProjectTokens(
  option: string,
  tokenizerOptions: ProjectTokenizerOptions
): Promise<string>;
export { applyWorkspaceProjectTokens };

declare function applyWorkspaceTokens<
  TConfig extends BaseTokenizerOptions = BaseTokenizerOptions
>(
  options: Record<string, any>,
  config: TConfig,
  tokenizerFn: (option: string, config: TConfig) => string | Promise<string>
): Promise<Record<string, any>>;
export { applyWorkspaceTokens };
