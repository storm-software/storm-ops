import type { StormConfig } from "@storm-software/config";
import type {
  BuildOptions,
  GetConfigParams,
  TsupContext,
  TypeScriptBuildOptions
} from "./src/types";

export * from "./src/types";
export { outExtension };

declare function outExtension({ format }: { format?: string }): {
  js: string;
  dts: string;
};

declare function applyDefaultOptions(
  options: TypeScriptBuildOptions
): TypeScriptBuildOptions;
export { applyDefaultOptions };

declare function runTsupBuild(
  context: TsupContext,
  config: Partial<StormConfig>,
  options: TypeScriptBuildOptions
): Promise<void>;
export { runTsupBuild };

declare function defaultConfig(params: GetConfigParams): BuildOptions;
export { defaultConfig };

declare function browserConfig(params: GetConfigParams): BuildOptions;
export { browserConfig };

declare function neutralConfig(params: GetConfigParams): BuildOptions;
export { neutralConfig };

declare function nodeConfig(params: GetConfigParams): BuildOptions;
export { nodeConfig };

/**
 * Build the TypeScript project using the tsup build tools.
 *
 * @param config - The storm configuration.
 * @param options - The build options.
 */
declare function build(
  config: StormConfig,
  options: Partial<TypeScriptBuildOptions> = {}
): Promise<void>;
export { build };

/**
 * Build the TypeScript project using the tsup build tools.
 *
 * @param config - The storm configuration.
 * @param options - The build options.
 */
declare function buildWithOptions(
  config: StormConfig,
  options: TypeScriptBuildOptions
): Promise<void>;
export { buildWithOptions };

/**
 * Run the TypeScript compiler on the project.
 *
 * @param config - The storm configuration.
 * @param options - The TypeScript compiler options.
 */
declare function rolldown(
  config: StormConfig,
  options: Partial<RolldownOptions> = {}
): Promise<void>;
export { rolldown };

/**
 * Run the TypeScript compiler on the project.
 *
 * @param config - The storm configuration.
 * @param options - The TypeScript compiler options.
 */
declare function rolldownWithOptions(
  config: StormConfig,
  options: RolldownOptions
): Promise<void>;
export { rolldownWithOptions };

export type Platform = "browser" | "node" | "neutral";

export type FileInputOutput = {
  input: string;
  output: string;
};

export type AssetGlob = FileInputOutput & {
  glob: string;
  ignore?: string[];
  dot?: boolean;
};
