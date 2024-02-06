import type { StormConfig } from "@storm-software/config-tools";
import type { TsupExecutorSchema } from "./src/executors/tsup/schema";
import type { ExecutorContext } from "@nx/devkit";
import type { Tree } from "@nx/devkit";

export interface TsupContext {
  projectRoot: string;
  sourceRoot: string;
  projectName: string;
  main: string;
}

declare function applyDefaultOptions(options: TsupExecutorSchema): TsupExecutorSchema;
export { applyDefaultOptions };

declare function runTsupBuild(
  context: TsupContext,
  config: Partial<StormConfig>,
  options: TsupExecutorSchema
): Promise<void>;
export { runTsupBuild };

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

declare function withRunExecutor<TExecutorSchema extends BaseExecutorSchema = BaseExecutorSchema>(
  name: string,
  executorFn: (
    options: TExecutorSchema,
    context: ExecutorContext,
    config?: StormConfig
  ) => Promise<BaseExecutorResult | null | undefined> | BaseExecutorResult | null | undefined,
  executorOptions: BaseExecutorOptions<TExecutorSchema>
): (_options: TExecutorSchema, context: ExecutorContext) => Promise<{ success: boolean }>;
export { withRunExecutor };

export interface BaseGeneratorSchema extends Record<string, any> {
  main?: string;
  outputPath?: string;
  tsConfig?: string;
}

export interface BaseGeneratorOptions<
  TGeneratorSchema extends BaseGeneratorSchema = BaseGeneratorSchema
> extends BaseWorkspaceToolOptions<TGeneratorSchema> {}

export interface BaseGeneratorResult {
  error?: Error;
  success?: boolean;
}

declare function withRunGenerator<TGeneratorSchema = any>(
  name: string,
  generatorFn: (
    tree: Tree,
    options: TGeneratorSchema,
    config?: StormConfig
  ) => Promise<BaseGeneratorResult | null | undefined> | BaseGeneratorResult | null | undefined,
  generatorOptions: BaseGeneratorOptions<TGeneratorSchema> = {
    skipReadingConfig: false
  }
): (tree: Tree, _options: TGeneratorSchema) => Promise<{ success: boolean }>;
export { withRunGenerator };
