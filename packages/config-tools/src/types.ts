import type { StormConfig } from "@storm-software/config";

export type LogLevel = 0 | 10 | 20 | 30 | 35 | 40 | 60 | 70 | 100;
export const LogLevel = {
  SILENT: 0 as LogLevel,
  FATAL: 10 as LogLevel,
  ERROR: 20 as LogLevel,
  WARN: 30 as LogLevel,
  SUCCESS: 35 as LogLevel,
  INFO: 40 as LogLevel,
  DEBUG: 60 as LogLevel,
  TRACE: 70 as LogLevel,
  ALL: 100 as LogLevel
} as const;

export type LogLevelLabel =
  | "silent"
  | "fatal"
  | "error"
  | "warn"
  | "info"
  | "debug"
  | "trace"
  | "all";
export const LogLevelLabel = {
  SILENT: "silent" as LogLevelLabel,
  FATAL: "fatal" as LogLevelLabel,
  ERROR: "error" as LogLevelLabel,
  WARN: "warn" as LogLevelLabel,
  INFO: "info" as LogLevelLabel,
  DEBUG: "debug" as LogLevelLabel,
  TRACE: "trace" as LogLevelLabel,
  ALL: "all" as LogLevelLabel
} as const;

export interface BaseTokenizerOptions {
  workspaceRoot?: string;
  config?: StormConfig;
}

export interface ProjectTokenizerOptions extends BaseTokenizerOptions {
  projectRoot?: string;
  projectName?: string;
  sourceRoot?: string;
}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
