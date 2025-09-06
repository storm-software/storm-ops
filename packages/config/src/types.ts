/* eslint-disable @typescript-eslint/no-explicit-any */
import * as z from "zod";
import type {
  colorsSchema,
  darkColorsSchema,
  lightColorsSchema,
  multiColorsSchema,
  organizationSchema,
  singleColorsSchema,
  themeColorsSchema,
  variantSchema,
  workspaceConfigSchema
} from "./schema";

export type DarkThemeColors = z.infer<typeof darkColorsSchema>;
export type DarkThemeColorsInput = z.input<typeof darkColorsSchema>;

export type LightThemeColors = z.infer<typeof lightColorsSchema>;
export type LightThemeColorsInput = z.input<typeof lightColorsSchema>;

export type MultiThemeColors = z.infer<typeof multiColorsSchema>;
export type MultiThemeColorsInput = z.input<typeof multiColorsSchema>;

export type SingleThemeColors = z.infer<typeof singleColorsSchema>;
export type SingleThemeColorsInput = z.input<typeof singleColorsSchema>;

export type Colors = z.infer<typeof colorsSchema>;
export type ColorsInput = z.input<typeof colorsSchema>;

export type ColorsMap = z.infer<typeof themeColorsSchema>;
export type ColorsMapInput = z.input<typeof themeColorsSchema>;

export type OrganizationConfig = z.infer<typeof organizationSchema>;
export type OrganizationConfigInput = z.input<typeof organizationSchema>;

export type Variant = z.infer<typeof variantSchema>;
export type VariantInput = z.input<typeof variantSchema>;

type TStormWorkspaceConfig = z.infer<typeof workspaceConfigSchema>;
export type StormWorkspaceConfigInput = z.input<typeof workspaceConfigSchema>;

/**
 * The Storm workspace's configuration object
 *
 * @remarks
 * This type is used to define the configuration object for the entire Storm workspace/monorepo. The value is extracted from the `storm-workspace.json` file in the workspace root and the currently configuration environment variables. The value can be obtained by calling `getWorkspaceConfig()` in `@storm-software/config-tools`.
 *
 * @deprecated
 * This type is deprecated and will be removed in the next major version. Use {@link StormWorkspaceConfig} instead.
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
> = StormConfig<TExtensionName, TExtensionConfig>;

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
