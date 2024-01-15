import type * as z from "zod";
import type { ColorConfigSchema, StormConfigSchema } from "./schema";

export type ColorConfig = z.infer<typeof ColorConfigSchema>;
export type ColorConfigInput = z.input<typeof ColorConfigSchema>;

type TStormConfig = z.infer<typeof StormConfigSchema>;
export type StormConfigInput = z.input<typeof StormConfigSchema>;

export type StormConfig<
  TExtensionName extends keyof TStormConfig["extensions"] = keyof TStormConfig["extensions"],
  TExtensionConfig extends
    TStormConfig["extensions"][TExtensionName] = TStormConfig["extensions"][TExtensionName]
> = TStormConfig & {
  extensions?:
    | (TStormConfig["extensions"] & {
        [extensionName in TExtensionName]: TExtensionConfig;
      })
    | Record<string, any>;
};

export type LogLevel = 0 | 10 | 20 | 30 | 40 | 45 | 60 | 70 | 100;
export const LogLevel = {
  SILENT: 0 as LogLevel,
  FATAL: 10 as LogLevel,
  ERROR: 20 as LogLevel,
  WARN: 30 as LogLevel,
  INFO: 40 as LogLevel,
  SUCCESS: 45 as LogLevel,
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
