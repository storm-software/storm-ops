import { wrap, type Infer, type InferIn } from "@decs/typeschema";
import { ColorConfigSchema, StormConfigSchema } from "./schema";

export type ColorConfig = Infer<typeof ColorConfigSchema>;
export type ColorConfigInput = InferIn<typeof ColorConfigSchema>;
export const wrapped_ColorConfig = wrap(ColorConfigSchema);

type TStormConfig = Infer<typeof StormConfigSchema>;
export type StormConfigInput = InferIn<typeof StormConfigSchema>;
export const wrapped_StormConfig = wrap(StormConfigSchema);

export type StormConfig<
  TExtensionName extends string = string,
  TExtensionConfig = any
> = TStormConfig & {
  extensions: Record<string, any> & {
    [extensionName in TExtensionName]: TExtensionConfig;
  };
};

export type LogLevel = 0 | 10 | 20 | 30 | 40 | 60 | 70;
export const LogLevel = {
  SILENT: 0 as LogLevel,
  FATAL: 10 as LogLevel,
  ERROR: 20 as LogLevel,
  WARN: 30 as LogLevel,
  INFO: 40 as LogLevel,
  DEBUG: 60 as LogLevel,
  TRACE: 70 as LogLevel
} as const;

export type LogLevelLabel =
  | "silent"
  | "fatal"
  | "error"
  | "warn"
  | "info"
  | "debug"
  | "trace";
export const LogLevelLabel = {
  SILENT: "silent" as LogLevelLabel,
  FATAL: "fatal" as LogLevelLabel,
  ERROR: "error" as LogLevelLabel,
  WARN: "warn" as LogLevelLabel,
  INFO: "info" as LogLevelLabel,
  DEBUG: "debug" as LogLevelLabel,
  TRACE: "trace" as LogLevelLabel
} as const;
