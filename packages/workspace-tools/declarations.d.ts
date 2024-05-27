import type { StormConfig } from "@storm-software/config";
import type { TsupExecutorSchema } from "./src/executors/tsup/schema";
import type { GeneratorCallback, Tree, ExecutorContext } from "@nx/devkit";
import type { Options } from "tsup";
import type { TsupGetConfigOptions } from "./src/types";
import type {
  Program,
  Diagnostic,
  TransformerFactory,
  SourceFile,
  ParsedCommandLine
} from "typescript";
import type { NormalizedSchema } from "@nx/js/src/generators/library/library";
import type { LibraryGeneratorSchema } from "@nx/js/src/utils/schema";

export interface TsupContext {
  projectRoot: string;
  sourceRoot: string;
  projectName: string;
  main: string;
}

export type BuildOptions = Options;
export type Entry = string | string[] | Record<string, string>;
export type GetConfigParams = Omit<
  TsupGetConfigOptions,
  "entry" | "assets" | "clean" | "outputPath" | "tsConfig" | "main"
> & {
  entry: Entry;
  outDir: string;
  projectRoot: string;
  workspaceRoot: string;
  tsconfig: string;
  shims?: boolean;
  apiReport?: boolean;
  docModel?: boolean;
  tsdocMetadata?: boolean;
  dtsTsConfig: ParsedCommandLine;
  getTransform?: (
    program: Program,
    diagnostics: Diagnostic[]
  ) => TransformerFactory<SourceFile>;
};

declare function outExtension({ format }: { format?: string }): {
  js: string;
  dts: string;
};
export { outExtension };

declare function applyDefaultOptions(
  options: TsupExecutorSchema
): TsupExecutorSchema;
export { applyDefaultOptions };

declare function runTsupBuild(
  context: TsupContext,
  config: Partial<StormConfig>,
  options: TsupExecutorSchema
): Promise<void>;
export { runTsupBuild };

declare function tsupExecutorFn(
  options: TsupExecutorSchema,
  context: ExecutorContext,
  config?: StormConfig
): Promise<{
  success: boolean;
}>;
export { tsupExecutorFn };

export interface BaseExecutorSchema extends Record<string, any> {
  main?: string;
  outputPath?: string;
  tsConfig?: string;
}

export interface WorkspaceToolHooks<TSchema = any> {
  applyDefaultOptions?: (
    options: Partial<TSchema>,
    config?: StormConfig
  ) => Promise<TSchema> | TSchema;
  preProcess?: (options: TSchema, config?: StormConfig) => Promise<void> | void;
  postProcess?: (config?: StormConfig) => Promise<void> | void;
}

export interface BaseWorkspaceToolOptions<TSchema = any> {
  skipReadingConfig?: boolean;
  hooks?: WorkspaceToolHooks<TSchema>;
}

export interface BaseExecutorOptions<
  TExecutorSchema extends BaseExecutorSchema = BaseExecutorSchema
> extends BaseWorkspaceToolOptions<TExecutorSchema> {}

export interface BaseExecutorResult {
  error?: Error;
  success?: boolean;
}

declare function withRunExecutor<
  TExecutorSchema extends BaseExecutorSchema = BaseExecutorSchema
>(
  name: string,
  executorFn: (
    options: TExecutorSchema,
    context: ExecutorContext,
    config?: StormConfig
  ) =>
    | Promise<BaseExecutorResult | null | undefined>
    | AsyncGenerator<any, BaseExecutorResult | null | undefined>
    | BaseExecutorResult
    | null
    | undefined,
  executorOptions: BaseExecutorOptions<TExecutorSchema>
): (
  _options: TExecutorSchema,
  context: ExecutorContext
) => Promise<{ success: boolean }>;
export { withRunExecutor };

export interface BaseGeneratorSchema extends Record<string, any> {
  main?: string;
  outputPath?: string;
  tsConfig?: string;
}

export interface BaseGeneratorOptions<
  TGeneratorSchema extends BaseGeneratorSchema = BaseGeneratorSchema
> extends BaseWorkspaceToolOptions<TGeneratorSchema> {}

export interface BaseGeneratorResult extends Record<string, any> {
  error?: Error;
  success?: boolean;
  data?: any;
}

declare function withRunGenerator<TGeneratorSchema = any>(
  name: string,
  generatorFn: (
    tree: Tree,
    options: TGeneratorSchema,
    config?: StormConfig
  ) =>
    | Promise<BaseGeneratorResult | null | undefined>
    | BaseGeneratorResult
    | null
    | undefined,
  generatorOptions: BaseGeneratorOptions<TGeneratorSchema> = {
    skipReadingConfig: false
  }
): (
  tree: Tree,
  _options: TGeneratorSchema
) => Promise<GeneratorCallback | BaseGeneratorResult>;
export { withRunGenerator };

export type TypeScriptLibraryGeneratorSchema = Omit<
  LibraryGeneratorSchema,
  | "js"
  | "pascalCaseFiles"
  | "skipFormat"
  | "skipTsConfig"
  | "skipPackageJson"
  | "includeBabelRc"
  | "unitTestRunner"
  | "linter"
  | "testEnvironment"
  | "config"
  | "compiler"
  | "bundler"
  | "skipTypeCheck"
  | "minimal"
> & {
  name: string;
  description: string;
  buildExecutor: string;
  platform?: Platform;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  peerDependenciesMeta?: Record<string, any>;
  tsConfigOptions?: Record<string, any>;
};

export type TypeScriptLibraryGeneratorNormalizedSchema =
  TypeScriptLibraryGeneratorSchema & NormalizedSchema;

declare function typeScriptLibraryGeneratorFn(
  tree: Tree,
  schema: TypeScriptLibraryGeneratorSchema
): Promise<any>;
export { typeScriptLibraryGeneratorFn };
