import {
  createProjectGraphAsync,
  readProjectsConfigurationFromProjectGraph
} from "@nx/devkit";
import { getEnv } from "@storm-software/build-tools";
import { getWorkspaceConfig } from "@storm-software/config-tools/get-config";
import {
  getStopwatch,
  writeDebug
} from "@storm-software/config-tools/logger/console";
import { joinPaths } from "@storm-software/config-tools/utilities/correct-paths";
import defu from "defu";
import { existsSync } from "node:fs";
import hf from "node:fs/promises";
import { findWorkspaceRoot } from "nx/src/utils/find-workspace-root";
import { DEFAULT_BUILD_OPTIONS } from "./config";
import { resolvePathsPlugin } from "./plugins/resolve-paths";
import { ESBuildContext, type ESBuildOptions } from "./types";

/**
 * Apply defaults to the original build options
 *
 * @param userOptions - the original build options provided by the user
 * @returns the build options with defaults applied
 */
export async function resolveContext(
  userOptions: ESBuildOptions
): Promise<ESBuildContext> {
  const projectRoot = userOptions.projectRoot;

  const workspaceRoot = findWorkspaceRoot(projectRoot);
  if (!workspaceRoot) {
    throw new Error("Cannot find Nx workspace root");
  }

  const workspaceConfig = await getWorkspaceConfig(true, {
    workspaceRoot: workspaceRoot.dir
  });

  writeDebug("  ⚙️   Resolving build options", workspaceConfig);
  const stopwatch = getStopwatch("Build options resolution");

  const projectGraph = await createProjectGraphAsync({
    exitOnError: true
  });

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

  const projectConfigurations =
    readProjectsConfigurationFromProjectGraph(projectGraph);
  if (!projectConfigurations?.projects?.[projectName]) {
    throw new Error(
      "The Build process failed because the project does not have a valid configuration in the project.json file. Check if the file exists in the root of the project."
    );
  }

  const options = defu(userOptions, DEFAULT_BUILD_OPTIONS) as ESBuildOptions;
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
  const define = defu(options.define ?? {}, env ?? {});

  const resolvedOptions = {
    ...options,
    tsconfig: joinPaths(
      projectRoot,
      userOptions.tsconfig
        ? userOptions.tsconfig.replace(projectRoot, "")
        : "tsconfig.json"
    ),
    metafile: userOptions.mode === "development",
    clean: false,
    env,
    define: {
      STORM_FORMAT: JSON.stringify(options.format),
      ...Object.keys(define)
        .filter(key => define[key] !== undefined)
        .reduce((res, key) => {
          const value = JSON.stringify(define[key]);
          const safeKey = key.replaceAll("(", "").replaceAll(")", "");

          return {
            ...res,
            [`process.env.${safeKey}`]: value,
            [`import.meta.env.${safeKey}`]: value
          };
        }, {})
    }
  } satisfies ESBuildOptions;

  stopwatch();

  const context = {
    options: resolvedOptions,
    clean: userOptions.clean !== false,
    workspaceConfig,
    projectConfigurations,
    projectName,
    projectGraph,
    sourceRoot:
      resolvedOptions.sourceRoot ||
      projectJson.sourceRoot ||
      joinPaths(resolvedOptions.projectRoot, "src"),
    outputPath:
      resolvedOptions.outputPath ||
      joinPaths(
        workspaceConfig.workspaceRoot,
        "dist",
        resolvedOptions.projectRoot
      ),
    minify: resolvedOptions.minify || resolvedOptions.mode === "production"
  } as ESBuildContext;

  context.options.esbuildPlugins = [
    resolvePathsPlugin(context),
    ...(context.options.esbuildPlugins ?? [])
  ];

  return context;
}
