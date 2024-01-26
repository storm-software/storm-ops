import type { StormConfig } from "@storm-software/config-tools";
import type { TsupExecutorSchema } from "./src/executors/tsup/schema";

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
