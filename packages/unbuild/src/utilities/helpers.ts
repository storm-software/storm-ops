import { joinPathFragments } from "@nx/devkit";
import {
  computeCompilerOptionsPaths,
  DependentBuildableProjectNode
} from "@nx/js/src/utils/buildable-libs-utils";
import { StormWorkspaceConfig } from "@storm-software/config";
import { writeTrace } from "@storm-software/config-tools/logger/console";
import { dirname, extname } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";
import { RollupBuildOptions } from "unbuild";

/**
 * Load a rolldown configuration file
 */
export async function loadConfig(
  configPath: string
): Promise<RollupBuildOptions | undefined> {
  if (!/\.(js|mjs)$/.test(extname(configPath))) {
    throw new Error("Unsupported config file format");
  }
  return import(pathToFileURL(configPath).toString()).then(
    config => config.default
  );
}

export async function createTsCompilerOptions(
  config: StormWorkspaceConfig,
  tsConfigPath: string,
  projectRoot: string,
  dependencies?: DependentBuildableProjectNode[]
) {
  const tsConfigFile = ts.readConfigFile(
    joinPathFragments(config.workspaceRoot, projectRoot, tsConfigPath),
    ts.sys.readFile
  );
  const tsConfig = ts.parseJsonConfigFileContent(
    tsConfigFile.config,
    ts.sys,
    dirname(joinPathFragments(config.workspaceRoot, projectRoot, tsConfigPath))
  );

  const compilerOptions = {
    rootDir: projectRoot,
    declaration: true,
    paths: computeCompilerOptionsPaths(tsConfig, dependencies ?? [])
  };
  writeTrace(compilerOptions, config);

  return compilerOptions;
}
