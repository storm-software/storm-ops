import { RollupExecutorOptions } from "@nx/rollup/src/executors/rollup/schema.d";
import type { BaseExecutorSchema } from "../../../declarations";

// biome-ignore lint/suspicious/noRedeclare: <explanation>
export type RollupExecutorSchema = RollupExecutorOptions & BaseExecutorSchema;
