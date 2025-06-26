import {
  ColorConfig,
  ColorConfigMap,
  StormWorkspaceConfig
} from "@storm-software/config/types";
import { DEFAULT_COLOR_CONFIG } from "./get-default-config";

/**
 * Get the color configuration from the Storm workspace configuration.
 *
 * @param config - An optional, partial color configuration for the Storm workspace.
 * @returns The color configuration, or the default color configuration if not defined.
 */
export function getColorConfig(
  config?: Partial<Pick<StormWorkspaceConfig, "colors">>
): ColorConfig {
  if (
    !config?.colors ||
    typeof config.colors !== "object" ||
    (!(config.colors as ColorConfigMap)["dark"] &&
      (!config.colors["base"] ||
        typeof config.colors !== "object" ||
        !config.colors["base"]?.["dark"]))
  ) {
    return DEFAULT_COLOR_CONFIG;
  }

  if (config.colors["base"]) {
    if (typeof config.colors["base"]["dark"] === "object") {
      return config.colors["base"]["dark"] as ColorConfig;
    } else if (config.colors["base"]["dark"] === "string") {
      return config.colors["base"];
    }
  }

  if (typeof (config.colors as ColorConfigMap)["dark"] === "object") {
    return config.colors["dark"] as ColorConfig;
  }

  return (config.colors ?? DEFAULT_COLOR_CONFIG) as ColorConfig;
}

/**
 * Get a specific color from the Storm workspace configuration.
 *
 * @param key - The key of the color to retrieve.
 * @param config - An optional, partial color configuration for the Storm workspace.
 * @returns The color value for the specified key, or a default value if not defined.
 */
export function getColor(
  key:
    | "background"
    | "foreground"
    | "brand"
    | "help"
    | "success"
    | "info"
    | "warning"
    | "danger"
    | "positive"
    | "negative"
    | "alternate"
    | "accent"
    | "link"
    | "fatal",
  config?: Partial<Pick<StormWorkspaceConfig, "colors">>
): string {
  const colors = getColorConfig(config);

  const result =
    (typeof colors["dark"] === "object" ? colors["dark"][key] : colors[key]) ||
    DEFAULT_COLOR_CONFIG["dark"][key] ||
    DEFAULT_COLOR_CONFIG[key];
  if (result) {
    return result;
  }

  if (key === "link") {
    return getColor("info", config);
  } else if (key === "fatal") {
    return getColor("danger", config);
  }

  return getColor("brand", config);
}
