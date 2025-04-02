import type z from "zod";
import type {
  ColorConfigMapSchema,
  ColorConfigSchema,
  DarkThemeColorConfigSchema,
  LightThemeColorConfigSchema,
  MultiThemeColorConfigSchema,
  SingleThemeColorConfigSchema,
  stormWorkspaceConfigSchema
} from "./schema";

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

type TStormWorkspaceConfig = z.infer<typeof stormWorkspaceConfigSchema>;
export type StormWorkspaceConfigInput = z.input<
  typeof stormWorkspaceConfigSchema
>;

/**
 * The Storm workspace's configuration object
 *
 * @remarks
 * This type is used to define the configuration object for the entire Storm workspace/monorepo. The value is extracted from the `storm-workspace.json` file in the workspace root and the currently configuration environment variables. The value can be obtained by calling `getWorkspaceConfig()` in `@storm-software/config-tools`.
 *
 * @deprecated
 * This type is deprecated and will be removed in the next major version. Use `StormWorkspaceConfig` instead.
 */
export type StormConfig<
  TExtensionName extends
    keyof TStormWorkspaceConfig["extensions"] = keyof TStormWorkspaceConfig["extensions"],
  TExtensionConfig extends
    TStormWorkspaceConfig["extensions"][TExtensionName] = TStormWorkspaceConfig["extensions"][TExtensionName]
> = TStormWorkspaceConfig & {
  extensions:
    | (TStormWorkspaceConfig["extensions"] & {
        [extensionName in TExtensionName]: TExtensionConfig;
      })
    | NonNullable<Record<string, any>>;
};

/**
 * The Storm workspace's configuration object
 *
 * @remarks
 * This type is used to define the configuration object for the entire Storm workspace/monorepo. The value is extracted from the `storm-workspace.json` file in the workspace root and the currently configuration environment variables. The value can be obtained by calling `getWorkspaceConfig()` in `@storm-software/config-tools`.
 */
export type StormWorkspaceConfig<
  TExtensionName extends
    keyof TStormWorkspaceConfig["extensions"] = keyof TStormWorkspaceConfig["extensions"],
  TExtensionConfig extends
    TStormWorkspaceConfig["extensions"][TExtensionName] = TStormWorkspaceConfig["extensions"][TExtensionName]
> = TStormWorkspaceConfig & {
  extensions:
    | (TStormWorkspaceConfig["extensions"] & {
        [extensionName in TExtensionName]: TExtensionConfig;
      })
    | NonNullable<Record<string, any>>;
};

export const COLOR_KEYS = [
  "dark",
  "light",
  "base",
  "brand",
  "alternate",
  "accent",
  "link",
  "success",
  "help",
  "info",
  "warning",
  "danger",
  "fatal",
  "positive",
  "negative"
];
