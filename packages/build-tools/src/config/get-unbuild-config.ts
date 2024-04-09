import type { UnbuildBuildOptions } from "../types";
import { getFileBanner } from "../utils/get-file-banner";
import { pathToFileURL } from "node:url";
import { join } from "node:path";
import merge from "deepmerge";
import { type DependentBuildableProjectNode } from "@nx/js/src/utils/buildable-libs-utils.js";
import type { PackageJson } from "nx/src/utils/package-json.js";
import type { StormConfig } from "@storm-software/config";
import { extname } from "node:path";
import { defineBuildConfig, type BuildConfig } from "unbuild";

export async function getUnbuildBuildOptions(
  config: StormConfig,
  options: UnbuildBuildOptions,
  dependencies: DependentBuildableProjectNode[],
  packageJson: PackageJson,
  npmDeps: string[]
): Promise<BuildConfig[]> {
  const configFile = await loadConfig(options.configPath as string);
  options = configFile ? merge(options, configFile) : options;

  const buildConfig = {
    ...options,
    name: options.projectName,
    rootDir: options.projectRoot,
    entries: options.entry ? [options.entry] : [],
    outDir: join(config.workspaceRoot!, options.outputPath),
    externals: options.external,
    dependencies: npmDeps
  } as BuildConfig;

  if (
    options.additionalEntryPoints &&
    options.additionalEntryPoints.length > 0
  ) {
    for (const additionalEntryPoint of options.additionalEntryPoints) {
      buildConfig.entries!.push(additionalEntryPoint);
    }
  }

  buildConfig.entries!.push(
    // mkdist builder transpiles file-to-file keeping original sources structure
    {
      builder: "mkdist",
      input: "./src",
      outDir: "./lib"
    }
  );

  const buildOptions = defineBuildConfig(buildConfig);
  for (const buildOpt of buildOptions) {
    let rollupConfig: any = options.rollup;
    if (rollupConfig && typeof rollupConfig === "string") {
      const rollupConfigFile = await loadConfig(rollupConfig as string);
      rollupConfig = rollupConfigFile;
    }
    if (!rollupConfig) {
      rollupConfig = {};
    }

    buildOpt.rollup = {
      ...rollupConfig,
      output: {
        ...rollupConfig?.output,
        banner: getFileBanner(options.projectName),
        footer: options.footer,
        sourcemap: options.sourcemap
      },
      esbuild: {
        ...rollupConfig?.esbuild,
        minify: options.minify
      }
    };
  }

  return buildOptions;
}

/**
 * Load a rolldown configuration file
 */
async function loadConfig(
  configPath: string
): Promise<UnbuildBuildOptions | undefined> {
  if (!/\.(js|mjs)$/.test(extname(configPath))) {
    throw new Error("Unsupported config file format");
  }
  return import(pathToFileURL(configPath).toString()).then(
    config => config.default
  );
}
