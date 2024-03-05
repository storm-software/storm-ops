import type { StormConfig } from "@storm-software/config";
import type { ExecutorContext } from "@nx/devkit";
import type { Tree } from "@nx/devkit";
import type { Options } from "tsup";
import type {
  Program,
  Diagnostic,
  TransformerFactory,
  SourceFile,
  ParsedCommandLine,
} from "typescript";
import type {
  TypeScriptBuildOptions,
  TsupContext,
  GetConfigParams,
  BuildOptions,
} from "./src/types";

export * from "./src/types";

declare function outExtension({ format }: { format?: string }): {
  js: string;
  dts: string;
};
export { outExtension };

declare function applyDefaultOptions(
  options: TypeScriptBuildOptions,
): TypeScriptBuildOptions;
export { applyDefaultOptions };

declare function runTsupBuild(
  context: TsupContext,
  config: Partial<StormConfig>,
  options: TypeScriptBuildOptions,
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
