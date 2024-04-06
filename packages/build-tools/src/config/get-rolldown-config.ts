import type Rolldown from "rolldown";
import { defineConfig } from "rolldown";
import esbuild from "rollup-plugin-esbuild";
import type {
  RolldownBuildOptions,
  RolldownOptions,
  RolldownUserDefinedConfig
} from "../types";
import { pathToFileURL } from "node:url";
import merge from "deepmerge";
import { createEntryPoints } from "@nx/js/src/utils/package-json/create-entry-points";
import { joinPathFragments } from "@nx/devkit";
import ts from "typescript";
import {
  computeCompilerOptionsPaths,
  type DependentBuildableProjectNode
} from "@nx/js/src/utils/buildable-libs-utils";
import type { PackageJson } from "nx/src/utils/package-json";
import type { StormConfig } from "@storm-software/config";
import { analyze } from "../plugins/analyze-plugin";
import { typeDefinitions } from "@nx/js/src/plugins/rollup/type-definitions";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import nodeResolve from "@rollup/plugin-node-resolve";
import deepClone from "deep-clone";
import autoprefixer from "autoprefixer";
import { dirname, extname } from "node:path";
import { loadConfigFile } from "@nx/devkit/src/utils/config-utils";

// These use require because the ES import isn't correct.
const commonjs = require("@rollup/plugin-commonjs");
const image = require("@rollup/plugin-image");
const json = require("@rollup/plugin-json");
const postcss = require("rollup-plugin-postcss");

export const DefaultConfig = {
  input: "./src/index.ts",
  plugins: [
    esbuild({
      loaders: {
        ".svg": "dataurl",
        ".node": "file"
      }
    }) as Rolldown.Plugin
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".svg", ".node"]
  }
} as RolldownBuildOptions;

export async function getRolldownBuildOptions(
  config: StormConfig,
  options: RolldownOptions,
  dependencies: DependentBuildableProjectNode[],
  packageJson: PackageJson,
  npmDeps: string[]
): Promise<RolldownBuildOptions[]> {
  const buildOptions = defineConfig(
    merge(DefaultConfig, options)
  ) as RolldownBuildOptions;

  buildOptions.output ??= DefaultConfig.output;
  buildOptions.output!.dir = options?.outputPath;
  buildOptions.resolve = options.resolve;
  buildOptions.plugins = options.plugins;
  buildOptions.output!.exports = options.exports;
  buildOptions.platform = options.platform;
  buildOptions.external = options.external;
  buildOptions.output!.sourcemap = options.sourcemap;
  buildOptions.output!.banner = options.banner;
  buildOptions.output!.footer = options.footer;
  buildOptions.cwd = config.workspaceRoot as string;

  const tsConfigPath = joinPathFragments(
    config.workspaceRoot ?? "./",
    options.tsConfig
  );
  const configFile = ts.readConfigFile(tsConfigPath, ts.sys.readFile);
  const tsconfig = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    dirname(tsConfigPath)
  );

  let externalPackages = [...Object.keys(packageJson.peerDependencies || {})];
  externalPackages.push(
    ...Object.keys(packageJson.dependencies || {}).filter(
      dep =>
        !npmDeps.includes(dep) &&
        (!options.external || !options.external(dep, undefined, true))
    )
  );
  externalPackages = [...new Set(externalPackages)];

  const buildOptionsList = [] as RolldownBuildOptions[];
  if (options.additionalEntryPoints) {
    for (const entry of [
      options.entry,
      ...createEntryPoints(options.additionalEntryPoints, options.projectRoot)
    ]) {
      const buildOpts = deepClone(buildOptions as { [key: string]: any });
      buildOpts.input = entry;

      buildOpts.plugins.push([
        image(),
        json(),
        // Needed to generate type definitions, even if we're using babel or swc.
        !options.skipTypeCheck &&
          require("rollup-plugin-typescript2")({
            check: !options.skipTypeCheck,
            tsconfig: options.tsConfig,
            tsconfigOverride: {
              compilerOptions: createTsCompilerOptions(
                tsconfig,
                dependencies,
                options
              )
            }
          }),
        typeDefinitions({
          main: entry,
          projectRoot: options.projectRoot
        }),
        peerDepsExternal({
          packageJsonPath: joinPathFragments(
            options.projectRoot,
            "package.json"
          )
        }),
        postcss({
          inject: true,
          extract: options.extractCss,
          autoModules: true,
          plugins: [autoprefixer],
          use: {
            less: {
              javascriptEnabled: true
            }
          }
        }),
        nodeResolve({
          preferBuiltins: true,
          extensions: DefaultConfig.resolve?.extensions
        }),
        commonjs(),
        analyze()
      ]);

      let nextConfig = {
        ...buildOpts,
        plugins: buildOpts.plugins.map(plugin => loadConfigFile(plugin)),
        external: (id: string) =>
          externalPackages.some(
            name => id === name || id.startsWith(`${name}/`)
          ),
        cwd: config.workspaceRoot,
        platform: options.platform
      } as RolldownBuildOptions;

      let customConfigs = [] as RolldownUserDefinedConfig[];
      if (options.rolldownConfig) {
        if (!Array.isArray(options.rolldownConfig)) {
          customConfigs = [options.rolldownConfig];
        } else {
          customConfigs = options.rolldownConfig;
        }
      }

      for (const customConfig of customConfigs) {
        if (typeof customConfig === "function") {
          nextConfig = await Promise.resolve(customConfig(nextConfig));
        } else if (typeof customConfig === "string") {
          const customConfigFile = await loadConfig(customConfig as string);
          nextConfig = customConfigFile
            ? merge(nextConfig, customConfigFile)
            : nextConfig;
        } else {
          nextConfig = merge(nextConfig, customConfig);
        }
      }

      buildOptionsList.push(nextConfig);
    }
  }

  return buildOptionsList;
}

function createTsCompilerOptions(
  config: ts.ParsedCommandLine,
  dependencies: DependentBuildableProjectNode[],
  options: RolldownOptions
) {
  const compilerOptionPaths = computeCompilerOptionsPaths(config, dependencies);
  const compilerOptions: Record<string, any> = {
    rootDir: options.projectRoot,
    declaration: true,
    paths: compilerOptionPaths
  };
  if (config.options.module === ts.ModuleKind.CommonJS) {
    compilerOptions.module = "ESNext";
  }

  return compilerOptions;
}

/**
 * Load a rolldown configuration file
 */
export async function loadConfig(
  configPath: string
): Promise<RolldownBuildOptions | undefined> {
  if (!isSupportedFormat(configPath)) {
    throw new Error("Unsupported config file format");
  }
  return import(pathToFileURL(configPath).toString()).then(
    config => config.default
  );
}

/**
 * Check whether the configuration file is supported
 */
function isSupportedFormat(configPath: string): boolean {
  const ext = extname(configPath);
  return /\.(js|mjs)$/.test(ext);
}

// // biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
// function normalizePluginPath(pluginPath: void | string, root: string) {
//   if (!pluginPath) {
//     return "";
//   }
//   try {
//     return require.resolve(pluginPath);
//   } catch {
//     return resolve(root, pluginPath);
//   }
// }

// export function normalizeRolldownOptions(
//   options: RolldownBuildOptions,
//   context: ExecutorContext,
//   sourceRoot: string
// ): RolldownBuildOptions {
//   const { root } = context;
//   const main = `${root}/${options.main}`;
//   const entryRoot = dirname(main);

//   const project = options.project ? `${root}/${options.project}` : join(root, "package.json");
//   const projectRoot = dirname(project);
//   const outputPath = `${root}/${options.outputPath}`;

//   return {
//     ...options,
//     format: Array.from(new Set(options.format)),
//     main,
//     entryRoot,
//     project,
//     projectRoot,
//     outputPath,
//     skipTypeCheck: options.skipTypeCheck || false,
//     additionalEntryPoints: createEntryPoints(options.additionalEntryPoints, context.root)
//   };
// }
