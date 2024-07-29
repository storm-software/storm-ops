import {
  type ColorConfig,
  type StormConfig,
  StormConfigSchema
} from "@storm-software/config";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { findWorkspaceRoot } from "./find-workspace-root";

/**
 * Storm theme config values used for styling various workspace elements
 */
export const DEFAULT_COLOR_CONFIG: ColorConfig = {
  light: {
    background: "#f4f4f5",
    foreground: "#1d232a",
    brand: "#1fb2a6",
    brand2: "#7434DB",
    brand3: "#00C2CE",
    help: "#8250df",
    success: "#087f5b",
    info: "#0550ae",
    warning: "#e3b341",
    error: "#a40e26"
  },
  dark: {
    background: "#22272E",
    foreground: "#fcfcf5",
    brand: "#1fb2a6",
    brand2: "#7434DB",
    brand3: "#00C2CE",
    help: "#8256D0",
    success: "#087f5b",
    info: "#316DCA",
    warning: "#F3D371",
    error: "#d1242f"
  }
};

/**
 * Storm Workspace config values used during various dev-ops processes
 */
export const DEFAULT_STORM_CONFIG: any = {
  name: "storm",
  namespace: "storm-software",
  license: "Apache 2.0",
  homepage: "https://stormsoftware.com",
  owner: "@storm-software/development",
  worker: "stormie-bot",
  runtimeDirectory: "node_modules/.storm",
  cacheDirectory: "node_modules/.cache/storm",
  skipCache: false,
  packageManager: "npm",
  timezone: "America/New_York",
  locale: "en-US",
  env: "production",
  branch: "main",
  organization: "storm-software",
  ci: true,
  configFile: null,
  runtimeVersion: "1.0.0",
  colors: { ...DEFAULT_COLOR_CONFIG },
  extensions: {}
};

/**
 * Get the default Storm config values used during various dev-ops processes
 *
 * @returns The default Storm config values
 */
export const getDefaultConfig = (
  config: Partial<StormConfig> = {},
  root?: string
): StormConfig => {
  let name = "storm-workspace";
  let namespace = "storm-software";
  let repository = "https://github.com/storm-software/storm-ops";

  let license = DEFAULT_STORM_CONFIG.license;
  let homepage = DEFAULT_STORM_CONFIG.homepage;

  const workspaceRoot = findWorkspaceRoot(root);
  if (existsSync(join(workspaceRoot, "package.json"))) {
    const file = readFileSync(join(workspaceRoot, "package.json"), {
      encoding: "utf-8"
    });
    if (file) {
      const packageJson = JSON.parse(file);

      if (packageJson.name) {
        name = packageJson.name;
      }
      if (packageJson.namespace) {
        namespace = packageJson.namespace;
      }
      if (packageJson.repository?.url) {
        repository = packageJson.repository?.url;
      }
      if (packageJson.license) {
        license = packageJson.license;
      }
      if (packageJson.homepage) {
        homepage = packageJson.homepage;
      }
    }
  }

  return StormConfigSchema.parse({
    ...(DEFAULT_STORM_CONFIG as Required<StormConfig>),
    ...Object.keys(config).reduce((ret, key) => {
      if (typeof config[key] === "string" && !config[key]) {
        ret[key] = undefined;
      } else {
        ret[key] = config[key];
      }

      return ret;
    }, {}),
    colors: { ...DEFAULT_COLOR_CONFIG, ...config.colors },
    workspaceRoot,
    name,
    namespace,
    repository,
    license: license ?? DEFAULT_STORM_CONFIG.license,
    homepage: homepage ?? DEFAULT_STORM_CONFIG.homepage,
    extensions: {
      ...config.extensions
    }
  }) as StormConfig;
};
