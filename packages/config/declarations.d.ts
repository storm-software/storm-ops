import type * as z from "zod";
import type { StormConfigSchema } from "./src/schema";

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
