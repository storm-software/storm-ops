import type * as z from "zod";
import {
  ColorConfigMapSchema,
  ColorConfigSchema,
  DarkThemeColorConfigSchema,
  LightThemeColorConfigSchema,
  MultiThemeColorConfigSchema,
  SingleThemeColorConfigSchema,
  StormConfigSchema
} from "./src/schema";

export type DarkThemeColorConfig = z.infer<typeof DarkThemeColorConfigSchema>;
export type DarkThemeColorConfigInput = z.input<
  typeof DarkThemeColorConfigSchema
>;

export type LightThemeColorConfig = z.infer<typeof LightThemeColorConfigSchema>;
export type LightThemeColorConfigInput = z.input<
  typeof LightThemeColorConfigSchema
>;

export type MultiThemeColorConfig = z.infer<typeof MultiThemeColorConfigSchema>;
export type MultiThemeColorConfigInput = z.input<
  typeof MultiThemeColorConfigSchema
>;

export type SingleThemeColorConfig = z.infer<
  typeof SingleThemeColorConfigSchema
>;
export type SingleThemeColorConfigInput = z.input<
  typeof SingleThemeColorConfigSchema
>;

export type ColorConfig = z.infer<typeof ColorConfigSchema>;
export type ColorConfigInput = z.input<typeof ColorConfigSchema>;

export type ColorConfigMap = z.infer<typeof ColorConfigMapSchema>;
export type ColorConfigMapInput = z.input<typeof ColorConfigMapSchema>;

type TStormConfig = z.infer<typeof StormConfigSchema>;

declare type StormConfig<
  TExtensionName extends
    keyof TStormConfig["extensions"] = keyof TStormConfig["extensions"],
  TExtensionConfig extends
    TStormConfig["extensions"][TExtensionName] = TStormConfig["extensions"][TExtensionName]
> = TStormConfig & {
  extensions:
    | (TStormConfig["extensions"] & {
        [extensionName in TExtensionName]: TExtensionConfig;
      })
    | NonNullable<Record<string, any>>;
};
export type { StormConfig };

declare type StormConfigInput = z.input<typeof StormConfigSchema>;
export type { StormConfigInput };

export { StormConfigSchema } from "./src/schema";

export const COLOR_KEYS = [
  "dark",
  "light",
  "primary",
  "secondary",
  "tertiary",
  "accent",
  "success",
  "info",
  "warning",
  "error",
  "fatal"
];
