import { getEnv } from "@storm-software/build-tools";
import { getWorkspaceConfig } from "@storm-software/config-tools/get-config";
import {
  formatLogMessage,
  getStopwatch,
  writeDebug
} from "@storm-software/config-tools/logger/console";
import { joinPaths } from "@storm-software/config-tools/utilities/correct-paths";
import defu from "defu";
import { existsSync } from "node:fs";
import hf from "node:fs/promises";
import { findWorkspaceRoot } from "nx/src/utils/find-workspace-root";
import { DEFAULT_BUILD_OPTIONS } from "./constants";
import { BuildOptions, ResolvedBuildOptions } from "./types";

/**
 * Apply defaults to the original build options
 *
 * @param userOptions - the original build options provided by the user
 * @returns the build options with defaults applied
 */
export async function resolveOptions(
  userOptions: BuildOptions
): Promise<ResolvedBuildOptions> {
  const projectRoot = userOptions.projectRoot;

  const workspaceRoot = findWorkspaceRoot(projectRoot);
  if (!workspaceRoot) {
    throw new Error("Cannot find Nx workspace root");
  }

  const workspaceConfig = await getWorkspaceConfig(true, {
    workspaceRoot: workspaceRoot.dir
  });

  if (!userOptions.silent) {
    writeDebug("  ⚙️   Resolving build options", workspaceConfig);
  }

  const stopwatch = getStopwatch("Build options resolution");

  const projectJsonPath = joinPaths(
    workspaceRoot.dir,
    projectRoot,
    "project.json"
  );
  if (!existsSync(projectJsonPath)) {
    throw new Error("Cannot find project.json configuration");
  }

  const projectJsonFile = await hf.readFile(projectJsonPath, "utf8");
  const projectJson = JSON.parse(projectJsonFile);
  const projectName = projectJson.name || userOptions.name;

  const options = defu(userOptions, DEFAULT_BUILD_OPTIONS) as BuildOptions;
  options.name ??= projectName;

  const packageJsonPath = joinPaths(
    workspaceRoot.dir,
    options.projectRoot,
    "package.json"
  );
  if (!existsSync(packageJsonPath)) {
    throw new Error("Cannot find package.json configuration");
  }

  const env = getEnv("esbuild", options as Parameters<typeof getEnv>[1]);

  const resolvedOptions = {
    name: projectName,
    entry: [joinPaths(workspaceRoot.dir, projectRoot, "src/index.ts")],
    clean: true,
    workspaceConfig,
    ...options,
    outDir:
      options.outputPath ||
      joinPaths(workspaceConfig.workspaceRoot, "dist", options.projectRoot),
    tsconfig:
      userOptions.tsconfig === null
        ? undefined
        : userOptions.tsconfig
          ? userOptions.tsconfig
          : joinPaths(workspaceRoot.dir, projectRoot, "tsconfig.json"),
    env: Object.keys(env)
      .filter(key => env[key] !== undefined)
      .reduce((ret, key) => {
        const value = JSON.stringify(env[key]);
        const safeKey = key.replaceAll("(", "").replaceAll(")", "");

        return {
          ...ret,
          [`process.env.${safeKey}`]: value,
          [`import.meta.env.${safeKey}`]: value
        };
      }, {})
  } satisfies ResolvedBuildOptions;

  if (!resolvedOptions.silent) {
    stopwatch();

    if (resolvedOptions.verbose) {
      writeDebug(
        `  ⚙️   Build options resolved: \n\n${formatLogMessage(resolvedOptions)}`,
        { ...workspaceConfig, logLevel: "all" }
      );
    }
  }

  return resolvedOptions;
}
