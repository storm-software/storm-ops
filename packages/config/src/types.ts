import type z from "zod";
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
