import { type DependentBuildableProjectNode } from "@nx/js/src/utils/buildable-libs-utils.js";
import type { StormConfig } from "@storm-software/config";
import merge from "deepmerge";
import { extname, relative } from "node:path";
import { pathToFileURL } from "node:url";
import type { PackageJson } from "nx/src/utils/package-json.js";
import { defineBuildConfig, type BuildConfig } from "unbuild";
import type { UnbuildBuildOptions } from "../types";
import { getFileBanner } from "../utils/get-file-banner";

export async function getUnbuildBuildOptions(
  config: StormConfig,
  options: UnbuildBuildOptions,
  dependencies: DependentBuildableProjectNode[],
  packageJson: PackageJson
): Promise<BuildConfig[]> {
  if (options.configPath) {
    const configFile = await loadConfig(options.configPath as string);
    options = configFile ? merge(options, configFile) : options;
  }

  const externals = config.externalPackagePatterns.map(dep => {
    let regex = dep;
    if (!dep.endsWith("*")) {
      if (!dep.endsWith("/")) {
        regex = dep + "/";
      }
      regex += "*";
    }

    return new RegExp(regex);
  });

  const buildConfig: BuildConfig = {
    clean: false,
    name: options.projectName,
    rootDir: options.projectRoot,
    entries: options.entry
      ? [
          options.entry.startsWith("./") || options.entry.startsWith("C:")
            ? options.entry
            : `./${options.entry}`
        ]
      : [],
    outDir: relative(options.projectRoot, options.outputPath),
    externals,
    declaration: "compatible",
    rollup: {
      esbuild: {
        minify: options.minify
      }
    }
  };

  if (packageJson.dependencies) {
    buildConfig.dependencies = dependencies
      .filter(
        dep =>
          dep.node.type === "npm" ||
          dep.node.type === "lib" ||
          dep.node.type === "app"
      )
      .map(dep => dep.name);

    // buildConfig.dependencies = Object.keys(packageJson.dependencies);
  }
  if (packageJson.devDependencies) {
    buildConfig.devDependencies = Object.keys(packageJson.devDependencies);
  }
  if (packageJson.peerDependencies) {
    buildConfig.peerDependencies = Object.keys(packageJson.peerDependencies);
  }

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
      input: "./src/",
      outDir: "./"
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
