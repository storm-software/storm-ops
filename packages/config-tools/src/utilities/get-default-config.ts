import { existsSync } from "fs";
import { readFile } from "fs/promises";
import { findWorkspaceRoot } from "nx/src/utils/find-workspace-root.js";
import { join } from "path";
import { ColorConfig, StormConfig } from "../types";

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
  colors: { ...DefaultColorConfig },
  extensions: {}
};

/**
 * Get the default Storm config values used during various dev-ops processes
 *
 * @returns The default Storm config values
 */
export const getDefaultConfig = async (
  config: Partial<StormConfig> = {}
): Promise<StormConfig> => {
  let name = "storm-workspace";
  let namespace = "storm-software";
  let repository = "https://github.com/storm-software/storm-stack";

  let license = DefaultStormConfig.license;
  let homepage = DefaultStormConfig.homepage;

  const workspaceRoot = getWorkspaceRoot() ?? process.cwd();
  if (existsSync(join(workspaceRoot, "package.json"))) {
    const file = await readFile(join(workspaceRoot, "package.json"), {
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

  return {
    ...(DefaultStormConfig as Required<StormConfig>),
    colors: { ...DefaultColorConfig, ...config },
    workspaceRoot,
    name,
    namespace,
    repository,
    license: license ?? DefaultStormConfig.license!,
    homepage: homepage ?? DefaultStormConfig.homepage!,
    timezone: "America/New_York",
    locale: "en-US",
    env: "production",
    branch: "main",
    organization: "storm-software",
    extensions: {},
    ci: true,
    configFile: join(workspaceRoot, "storm.config.js"),
    runtimeVersion: "1.0.0",
    ...config
  };
};

const getWorkspaceRoot = () => {
  const root = findWorkspaceRoot(process.cwd());
  process.env.STORM_REPO_ROOT ??= root?.dir;
  process.env.NX_WORKSPACE_ROOT_PATH ??= root?.dir;

  return root?.dir;
};
