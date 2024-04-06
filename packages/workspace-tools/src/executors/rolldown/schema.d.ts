import type { RolldownOptions } from "@storm-software/build-tools";

export type Platform = "browser" | "neutral" | "node" | "worker";

// biome-ignore lint/suspicious/noRedeclare: <explanation>
export type RolldownExecutorSchema = RolldownOptions;
