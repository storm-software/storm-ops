/*-------------------------------------------------------------------

                  ⚡ Storm Software - Storm Stack

 This code was released as part of the Storm Stack project. Storm Stack
 is maintained by Storm Software under the Apache-2.0 License, and is
 free for commercial and private use. For more information, please visit
 our licensing page.

 Website:         https://stormsoftware.com
 Repository:      https://github.com/storm-software/storm-ops
 Documentation:   https://stormsoftware.com/projects/storm-ops/docs
 Contact:         https://stormsoftware.com/contact
 License:         https://stormsoftware.com/projects/storm-ops/license

 -------------------------------------------------------------------*/

import {
  createProjectGraphAsync,
  ProjectGraph,
  readCachedProjectGraph,
  writeJsonFile
} from "@nx/devkit";
import { getHelperDependency, HelperDependency } from "@nx/js";
import { calculateProjectBuildableDependencies } from "@nx/js/src/utils/buildable-libs-utils";
import {
  addPackageDependencies,
  addWorkspacePackageJsonFields,
  copyAssets
} from "@storm-software/build-tools";
import { getConfig } from "@storm-software/config-tools/get-config";
import {
  formatLogMessage,
  getStopwatch,
  writeDebug,
  writeFatal,
  writeSuccess,
  writeTrace
} from "@storm-software/config-tools/logger/console";
import { isVerbose } from "@storm-software/config-tools/logger/get-log-level";
import { LogLevelLabel } from "@storm-software/config-tools/types";
import {
  correctPaths,
  joinPaths
} from "@storm-software/config-tools/utilities/correct-paths";
import { StormWorkspaceConfig } from "@storm-software/config/types";
import defu from "defu";
import { LogLevel } from "esbuild";
import { Glob } from "glob";
import { type MkdistOptions } from "mkdist";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { relative } from "node:path";
import { findWorkspaceRoot } from "nx/src/utils/find-workspace-root";
import {
  type BuildConfig,
  type BuildContext,
  BuildEntry,
  MkdistBuildEntry,
  RollupOptions,
  build as unbuild
} from "unbuild";
import { cleanDirectories } from "./clean";
import { analyzePlugin } from "./plugins/analyze";
import { onErrorPlugin } from "./plugins/on-error";
import { tscPlugin } from "./plugins/tsc";
import type { UnbuildOptions, UnbuildResolvedOptions } from "./types";
import { loadConfig } from "./utilities/helpers";

/**
 * Get the build options for the unbuild process
 *
 * @param options - the unbuild options
 * @returns the resolved options
 */
export async function resolveOptions(
  options: UnbuildOptions,
  config: StormWorkspaceConfig
): Promise<UnbuildResolvedOptions> {
  writeDebug("  ⚙️   Resolving build options", config);
  const stopwatch = getStopwatch("Build options resolution");

  if (options.configPath) {
    const configFile = await loadConfig(options.configPath as string);
    if (configFile) {
      options = defu(options, configFile) as UnbuildOptions;
    }
  }

  const outputPath =
    options.outputPath || joinPaths("dist", options.projectRoot);

  let projectGraph!: ProjectGraph;
  try {
    projectGraph = readCachedProjectGraph();
  } catch {
    await createProjectGraphAsync();
    projectGraph = readCachedProjectGraph();
  }

  if (!projectGraph) {
    throw new Error(
      "The build process failed because the project graph is not available. Please run the build command again."
    );
  }

  const projectJsonPath = joinPaths(
    config.workspaceRoot,
    options.projectRoot,
    "project.json"
  );
  if (!existsSync(projectJsonPath)) {
    throw new Error("Cannot find project.json configuration");
  }

  const projectJsonContent = await readFile(projectJsonPath, "utf8");
  const projectJson = JSON.parse(projectJsonContent);

  const projectName = projectJson.name;

  const packageJsonPath = joinPaths(
    config.workspaceRoot,
    options.projectRoot,
    "package.json"
  );
  if (!existsSync(packageJsonPath)) {
    throw new Error("Cannot find package.json configuration");
  }

  const packageJsonContent = await readFile(packageJsonPath, "utf8");
  const packageJson = JSON.parse(packageJsonContent);

  let tsconfig = options.tsconfig;
  if (!tsconfig) {
    tsconfig = joinPaths(options.projectRoot, "tsconfig.json");
  }
  if (!tsconfig.startsWith(config.workspaceRoot)) {
    tsconfig = joinPaths(config.workspaceRoot, tsconfig);
  }

  if (!existsSync(tsconfig)) {
    throw new Error("Cannot find tsconfig.json configuration");
  }

  let sourceRoot = projectJson.sourceRoot as string;
  if (!sourceRoot) {
    sourceRoot = joinPaths(options.projectRoot, "src");
  }

  if (!existsSync(sourceRoot)) {
    throw new Error("Cannot find sourceRoot directory");
  }

  const result = calculateProjectBuildableDependencies(
    undefined,
    projectGraph,
    config.workspaceRoot,
    projectName,
    process.env.NX_TASK_TARGET_TARGET || "build",
    process.env.NX_TASK_TARGET_CONFIGURATION || "production",
    true
  );
  let dependencies = result.dependencies;

  const tsLibDependency = getHelperDependency(
    HelperDependency.tsc,
    tsconfig,
    dependencies,
    projectGraph,
    true
  );
  if (tsLibDependency) {
    dependencies = dependencies.filter(
      deps => deps.name !== tsLibDependency.name
    );
    dependencies.push(tsLibDependency);
  }

  const name = options.name || projectName;
  const entries = options.entry ?? [sourceRoot];

  const resolvedOptions: UnbuildResolvedOptions = {
    ...options,
    name,
    config,
    projectRoot: options.projectRoot,
    sourceRoot,
    projectName,
    tsconfig,
    platform: options.platform || "neutral",
    generatePackageJson: true,
    clean: false,
    entries: entries.reduce((ret, entry) => {
      let entryPath = entry.replace(options.projectRoot, "");
      while (entryPath.startsWith(".")) {
        entryPath = entryPath.substring(1);
      }
      while (entryPath.startsWith("/")) {
        entryPath = entryPath.substring(1);
      }

      const outDir = joinPaths(
        relative(
          joinPaths(config.workspaceRoot, options.projectRoot),
          config.workspaceRoot
        ),
        outputPath,
        "dist"
      );

      ret.push({
        name: `${name}-esm`,
        builder: "mkdist",
        input: `./${entryPath}`,
        outDir,
        declaration: options.dts !== false ? "compatible" : false,
        format: "esm",
        ext: "mjs"
      } as MkdistBuildEntry);

      ret.push({
        name: `${name}-cjs`,
        builder: "mkdist",
        input: `./${entryPath}`,
        outDir,
        declaration: options.dts !== false ? "compatible" : false,
        format: "cjs",
        ext: "cjs"
      } as MkdistBuildEntry);

      return ret;
    }, [] as BuildEntry[]),
    declaration: options.dts !== false ? "compatible" : false,
    failOnWarn: false,
    sourcemap: options.sourcemap ?? !!options.debug,
    outDir: outputPath,
    parallel: true,
    externals: options.external,
    dependencies: [] as string[],
    peerDependencies: [] as string[],
    devDependencies: [] as string[],
    hooks: {},
    alias: {},
    replace: {},
    rollup: {
      replace: {},
      alias: {},
      json: {},
      commonjs: {
        sourceMap: options.sourcemap ?? true
      },
      emitCJS: true,
      cjsBridge: true,
      dts: {
        respectExternal: true,
        tsconfig
      },
      output: {
        banner:
          options.banner ||
          `
//      ⚡ Built by Storm Software
  `,
        footer: options.footer
      },
      resolve: {
        preferBuiltins: true,
        extensions: [
          ".tsx",
          ".ts",
          ".cts",
          ".mts",
          ".jsx",
          ".js",
          ".cjs",
          ".mjs",
          ".css",
          ".json"
        ]
      },
      esbuild: {
        minify: options.minify ?? !options.debug,
        sourceMap: options.sourcemap ?? !!options.debug,
        splitting: options.splitting !== false,
        treeShaking: options.treeShaking !== false,
        platform: options.platform || "neutral",
        color: true,
        logLevel: (config.logLevel === LogLevelLabel.FATAL
          ? LogLevelLabel.ERROR
          : isVerbose()
            ? "verbose"
            : config.logLevel) as LogLevel
      }
    }
  } as any;

  dependencies = dependencies.filter(
    dep =>
      dep.node.type === "npm" ||
      dep.node.type === "lib" ||
      dep.node.type === "app"
  );
  if (dependencies.length > 0) {
    resolvedOptions.dependencies = dependencies.map(dep => dep.name);
  }
  if (packageJson.devDependencies) {
    resolvedOptions.devDependencies = Object.keys(packageJson.devDependencies);
  }
  if (packageJson.peerDependencies) {
    resolvedOptions.peerDependencies = Object.keys(
      packageJson.peerDependencies
    );
  }

  if (options.rollup) {
    let rollup = {};
    if (typeof options.rollup === "string") {
      const rollupFile = await loadConfig(options.rollup as string);
      if (rollupFile) {
        rollup = rollupFile;
      }
    } else {
      rollup = options.rollup;
    }

    resolvedOptions.rollup = defu(resolvedOptions.rollup ?? {}, rollup);
  }

  resolvedOptions.hooks = {
    "rollup:options": async (ctx: BuildContext, opts: RollupOptions) => {
      if (options.plugins && options.plugins.length > 0) {
        writeDebug(
          `  🧩   Found ${options.plugins.length} plugins in provided build options`,
          config
        );
        opts.plugins = options.plugins;
      } else {
        writeDebug(
          `  🧩   No plugins found in provided build options, using default plugins`,
          config
        );
        opts.plugins = await Promise.all([
          analyzePlugin(resolvedOptions),
          tscPlugin(resolvedOptions),
          onErrorPlugin(resolvedOptions)
        ]);
      }
    },
    "mkdist:entry:options": async (
      ctx: BuildContext,
      entry: MkdistBuildEntry,
      opts: MkdistOptions
    ) => {
      opts.esbuild ||= {};
      opts.esbuild.platform ??= resolvedOptions.platform;
      opts.esbuild.minify ??= resolvedOptions.minify ?? !resolvedOptions.debug;
      opts.esbuild.sourcemap ??= resolvedOptions.sourcemap ?? !!options.debug;

      if (options.loaders) {
        if (typeof options.loaders === "function") {
          opts.loaders = await Promise.resolve(
            options.loaders(ctx, entry, opts)
          );
        } else {
          opts.loaders = options.loaders;
        }
      }
    }
  };

  stopwatch();

  return resolvedOptions;
}

const addPackageJsonExport = (
  file: string,
  type: "commonjs" | "module" = "module",
  sourceRoot: string,
  projectRoot: string
): Record<string, any> => {
  let root = sourceRoot.replace(projectRoot, "");
  while (root.startsWith(".")) {
    root = root.substring(1);
  }
  while (root.startsWith("/")) {
    root = root.substring(1);
  }

  let entry = file.replaceAll("\\", "/").replace(sourceRoot, "");
  while (entry.startsWith(".")) {
    entry = entry.substring(1);
  }
  while (entry.startsWith("/")) {
    entry = entry.substring(1);
  }

  return {
    import: {
      types: `./dist/${entry}.d.ts`,
      default: `./dist/${entry}.mjs`
    },
    require: {
      types: `./dist/${entry}.d.ts`,
      default: `./dist/${entry}.cjs`
    },
    default: {
      types: `./dist/${entry}.d.ts`,
      default:
        type === "commonjs" ? `./dist/${entry}.cjs` : `./dist/${entry}.mjs`
    }
  };
};

export async function generatePackageJson(options: UnbuildResolvedOptions) {
  if (
    options.generatePackageJson !== false &&
    existsSync(joinPaths(options.projectRoot, "package.json"))
  ) {
    writeDebug("  ✍️   Writing package.json file", options.config);
    const stopwatch = getStopwatch("Write package.json file");

    const packageJsonPath = joinPaths(options.projectRoot, "project.json");
    if (!existsSync(packageJsonPath)) {
      throw new Error("Cannot find package.json configuration");
    }

    const packageJsonContent = await readFile(
      joinPaths(
        options.config.workspaceRoot,
        options.projectRoot,
        "package.json"
      ),
      "utf8"
    );
    if (!packageJsonContent) {
      throw new Error("Cannot find package.json configuration file");
    }

    let packageJson = JSON.parse(packageJsonContent);
    packageJson = await addPackageDependencies(
      options.config.workspaceRoot,
      options.projectRoot,
      options.projectName,
      packageJson
    );

    packageJson = await addWorkspacePackageJsonFields(
      options.config,
      options.projectRoot,
      options.sourceRoot,
      options.projectName,
      false,
      packageJson
    );

    packageJson.exports ??= {};

    await Promise.all(
      options.entries
        .reduce((ret, entry) => {
          let entryPath = typeof entry === "string" ? entry : entry.input;

          entryPath = entryPath.replaceAll("\\", "/");
          while (entryPath.startsWith(".")) {
            entryPath = entryPath.substring(1);
          }
          while (entryPath.startsWith("/")) {
            entryPath = entryPath.substring(1);
          }

          entryPath = `./${joinPaths(options.projectRoot, entryPath)}`;
          if (!ret.includes(entryPath)) {
            ret.push(entryPath);
          }

          return ret;
        }, [] as string[])
        .map(async entryPath => {
          const files = await new Glob("**/*.{ts,tsx}", {
            absolute: false,
            cwd: entryPath,
            root: entryPath
          }).walk();
          files.forEach(file => {
            addPackageJsonExport(
              file,
              packageJson.type,
              options.sourceRoot,
              options.projectRoot
            );

            const split = file.split(".");
            split.pop();
            const entry = split.join(".").replaceAll("\\", "/");

            packageJson.exports[`./${entry}`] ??= addPackageJsonExport(
              entry,
              packageJson.type,
              options.sourceRoot,
              options.projectRoot
            );
          });
        })
    );

    packageJson.main ??= "./dist/index.cjs";
    packageJson.module ??= "./dist/index.mjs";
    packageJson.types ??= "./dist/index.d.ts";

    packageJson.exports ??= {};
    packageJson.exports = Object.keys(packageJson.exports).reduce(
      (ret, key) => {
        if (key.endsWith("/index") && !ret[key.replace("/index", "")]) {
          ret[key.replace("/index", "")] = packageJson.exports[key];
        }

        return ret;
      },
      packageJson.exports
    );

    packageJson.exports["./package.json"] ??= "./package.json";
    packageJson.exports["."] ??= addPackageJsonExport(
      "index",
      packageJson.type,
      options.sourceRoot,
      options.projectRoot
    );

    await writeJsonFile(joinPaths(options.outDir, "package.json"), packageJson);

    stopwatch();
  }

  return options;
}

/**
 * Execute Unbuild with all the configurations we pass
 */
export async function executeUnbuild(options: UnbuildResolvedOptions) {
  writeDebug(
    `  🚀  Running ${options.name} (${options.projectRoot}) build`,
    options.config
  );
  const stopwatch = getStopwatch(
    `${options.name} (${options.projectRoot}) build`
  );

  try {
    // const unbuild = await resolveUnbuild(options);

    const config = {
      ...options,
      config: null,
      rootDir: joinPaths(options.config.workspaceRoot, options.projectRoot)
    } as BuildConfig;

    writeTrace(
      `Running with unbuild configuration:
${formatLogMessage({ ...config, env: "<Hidden>" })}
`,
      options.config
    );

    await unbuild(options.projectRoot, false, config);
  } finally {
    stopwatch();
  }

  return options;
}

/**
 * Copy the assets to the build directory
 */
export async function copyBuildAssets(options: UnbuildResolvedOptions) {
  writeDebug(
    `  📋  Copying asset files to output directory: ${options.outDir}`,
    options.config
  );
  const stopwatch = getStopwatch(`${options.name} asset copy`);

  await copyAssets(
    options.config,
    options.assets ?? [],
    options.outDir,
    options.projectRoot,
    options.sourceRoot,
    options.generatePackageJson,
    options.includeSrc
  );

  stopwatch();

  return options;
}

/**
 * Clean the output path
 *
 * @param options - the build options
 */
export async function cleanOutputPath(options: UnbuildResolvedOptions) {
  if (options.clean !== false && options.outDir) {
    writeDebug(
      ` 🧹  Cleaning ${options.name} output path: ${options.outDir}`,
      options.config
    );
    const stopwatch = getStopwatch(`${options.name} output clean`);

    await cleanDirectories(options.name, options.outDir, options.config);

    stopwatch();
  }

  return options;
}

/**
 * Execution pipeline that applies a set of actions
 *
 * @param options - the build options
 * @returns the build result
 */
export async function build(options: UnbuildOptions) {
  const projectRoot = options.projectRoot;
  if (!projectRoot) {
    throw new Error("Cannot find project root");
  }

  const workspaceRoot = findWorkspaceRoot(projectRoot);
  if (!workspaceRoot) {
    throw new Error("Cannot find workspace root");
  }

  const config = await getConfig(workspaceRoot.dir);

  writeDebug(` ⚡  Executing Storm Unbuild pipeline`, config);
  const stopwatch = getStopwatch("Unbuild pipeline");

  try {
    options.projectRoot = correctPaths(projectRoot);
    const resolvedOptions = await resolveOptions(options, config);

    await cleanOutputPath(resolvedOptions);

    if (options.buildOnly !== true) {
      await generatePackageJson(resolvedOptions);
    }

    await executeUnbuild(resolvedOptions);

    if (options.buildOnly !== true) {
      await copyBuildAssets(resolvedOptions);
    }

    writeSuccess(
      `  🏁  The ${resolvedOptions.name} build completed successfully`,
      config
    );
  } catch (error) {
    writeFatal(
      "Fatal errors that the build process could not recover from have occured. The build process has been terminated.",
      config
    );

    throw error;
  } finally {
    stopwatch();
  }
}
