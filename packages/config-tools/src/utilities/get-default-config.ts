import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { StormConfigSchema } from "../schema";
import { ColorConfig, StormConfig } from "../types";
import { findWorkspaceRoot } from "./find-workspace-root";

/**
 * Storm theme config values used for styling various workspace elements
 */
export const DefaultColorConfig: ColorConfig = {
  primary: "#1fb2a6",
  background: "#1d232a",
  success: "#087f5b",
  info: "#0ea5e9",
  warning: "#fcc419",
  error: "#990000",
  fatal: "#7d1a1a"
};

/**
 * Storm Workspace config values used during various dev-ops processes
 */
export const DefaultStormConfig: Omit<StormConfig, "name"> = {
  namespace: "storm-software",
  license: "Apache License 2.0",
  homepage: "https://stormsoftware.org",
  preMajor: false,
  owner: "@storm-software/development",
  worker: "stormie-bot",
  runtimeDirectory: "node_modules/.storm",
  timezone: "America/New_York",
  locale: "en-US",
  env: "production",
  branch: "main",
  organization: "storm-software",
  ci: true,
  configFile: null,
  runtimeVersion: "1.0.0",
  colors: { ...DefaultColorConfig },
  extensions: {}
};

/**
 * Get the default Storm config values used during various dev-ops processes
 *
 * @returns The default Storm config values
 */
export const getDefaultConfig = (
  config: Partial<StormConfig> = {}
): StormConfig => {
  let name = "storm-workspace";
  let namespace = "storm-software";
  let repository = "https://github.com/storm-software/storm-stack";

  let license = DefaultStormConfig.license;
  let homepage = DefaultStormConfig.homepage;

  const workspaceRoot = findWorkspaceRoot();
  if (existsSync(join(workspaceRoot, "package.json"))) {
    const file = readFileSync(join(workspaceRoot, "package.json"), {
      encoding: "utf-8"
    });
    if (file) {
      const packageJson = JSON.parse(file);

      packageJson.name && (name = packageJson.name);
      packageJson.namespace && (namespace = packageJson.namespace);
      packageJson.repository?.url && (repository = packageJson.repository?.url);
      packageJson.license && (license = packageJson.license);
      packageJson.homepage && (homepage = packageJson.homepage);
    }
  }

  return StormConfigSchema.parse(
    Object.assign(config, {
      ...(DefaultStormConfig as Required<StormConfig>),
      colors: { ...DefaultColorConfig },
      workspaceRoot,
      name,
      namespace,
      repository,
      license: license ?? DefaultStormConfig.license!,
      homepage: homepage ?? DefaultStormConfig.homepage!,
      extensions: {}
    })
  ) as StormConfig;
};
