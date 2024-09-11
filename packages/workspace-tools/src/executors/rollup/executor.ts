/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { type ExecutorContext, type PromiseExecutor } from "@nx/devkit";
import { createAsyncIterable } from "@nx/devkit/src/utils/async-iterable";
import { loadConfigFile } from "@nx/devkit/src/utils/config-utils";
import { calculateProjectBuildableDependencies } from "@nx/js/src/utils/buildable-libs-utils";
import { NormalizedRollupExecutorOptions } from "@nx/rollup/src/executors/rollup/lib/normalize";
import { pluginName as generatePackageJsonPluginName } from "@nx/rollup/src/plugins/package-json/generate-package-json";
import type { AssetGlob } from "@storm-software/build-tools";
import type { StormConfig } from "@storm-software/config";
import { removeSync } from "fs-extra";
import { Glob } from "glob";
import { join, parse, resolve } from "path";
import * as rollup from "rollup";
import { withRunExecutor } from "../../base/base-executor";
import { RollupExecutorSchema } from "./schema";
import { withRollupConfig } from "./utils/get-options";

export async function* rollupExecutorFn(
  options: RollupExecutorSchema,
  context: ExecutorContext,
  config?: StormConfig
) {
  const {
    writeDebug,
    writeTrace,
    writeInfo,
    writeError,
    writeWarning,
    formatLogMessage,
    findWorkspaceRoot,
    correctPaths
  } = await import("@storm-software/config-tools");

  if (
    !context?.projectName ||
    !context?.projectsConfigurations?.projects?.[context.projectName]?.root
  ) {
    throw new Error("Nx executor context was invalid");
  }

  const workspaceRoot = findWorkspaceRoot();
  const projectRoot =
    context?.projectsConfigurations?.projects[context.projectName!]?.root;
  const sourceRoot =
    context.projectsConfigurations.projects[context.projectName]?.sourceRoot ??
    projectRoot;

  // #region Clean output directory

  if (options.clean !== false) {
    writeDebug(`🧹 Cleaning output path: ${options.outputPath}`, config);
    removeSync(options.outputPath);
  }

  // #endregion Clean output directory

  // #region Copy asset files to output directory

  writeDebug(
    `📦  Copying asset files to output directory: ${options.outputPath}`,
    config
  );

  const assets = Array.from(options.assets ?? []);
  if (!options.assets?.some((asset: AssetGlob) => asset?.glob === "*.md")) {
    assets.push({
      input: projectRoot,
      glob: "*.md",
      output: "/"
    });
  }

  if (!options.assets?.some((asset: AssetGlob) => asset?.glob === "LICENSE")) {
    assets.push({
      input: "",
      glob: "LICENSE",
      output: "."
    });
  }

  if (options.fileLevelInput !== false) {
    const files = await new Glob("**/*.{ts,mts,cts,tsx}", {
      absolute: true,
      cwd: sourceRoot,
      root: workspaceRoot
    }).walk();
    options.additionalEntryPoints = files
      .reduce(
        (ret, file) => {
          const corrected = correctPaths(file);
          if (!corrected.includes("node_modules") && !ret.includes(corrected)) {
            ret.push(corrected);
          }

          return ret;
        },
        (options.additionalEntryPoints?.map(entry =>
          correctPaths(join(workspaceRoot, entry))
        ) ?? []) as string[]
      )
      .map(entry => {
        const formatted = entry.replace(workspaceRoot, "");
        return formatted.startsWith("/") ? formatted.slice(1) : formatted;
      });
  }

  writeDebug(
    `📦  Running Storm Rollup build process on the ${context?.projectName} project`,
    config
  );

  writeTrace(`Rollup schema options ⚙️ \n${formatLogMessage(options)}`, config);

  process.env.NODE_ENV ??= "production";
  const normalizedOptions = {
    ...options,
    main: options.entry,
    rollupConfig: [],
    projectRoot: context.projectGraph?.nodes[context.projectName!]?.data.root,
    skipTypeCheck: options.skipTypeCheck || false,
    logLevel: convertRollupLogLevel(config?.logLevel ?? "info"),
    onLog: ((level: rollup.LogLevel, log: rollup.RollupLog) => {
      writeTrace(log, config);
    }) as rollup.LogHandlerWithDefault,
    onwarn: ((warning: rollup.RollupLog) => {
      writeWarning(warning, config);
    }) as rollup.WarningHandlerWithDefault,
    perf: true,
    treeshake: true
  } as NormalizedRollupExecutorOptions;

  const rollupOptions = await createRollupOptions(
    normalizedOptions,
    context,
    config
  );
  const outfile = resolveOutfile(context, normalizedOptions);

  if (normalizedOptions.watch) {
    // region Watch build
    return yield* createAsyncIterable(({ next }) => {
      const watcher = rollup.watch(rollupOptions);
      watcher.on("event", data => {
        if (data.code === "START") {
          writeInfo(`Bundling ${context.projectName}...`, config);
        } else if (data.code === "END") {
          writeInfo("Bundle complete. Watching for file changes...", config);
          next({ success: true, outfile });
        } else if (data.code === "ERROR") {
          writeInfo(`Error during bundle: ${data.error.message}`, config);

          next({ success: false });
        }
      });
      const processExitListener = () => () => {
        watcher.close();
      };
      process.once("SIGTERM", processExitListener);
      process.once("SIGINT", processExitListener);
      process.once("SIGQUIT", processExitListener);
    });
    // endregion
  } else {
    // region Single build
    try {
      writeInfo(`Bundling ${context.projectName}...`, config);

      const start = process.hrtime.bigint();
      const allRollupOptions = Array.isArray(rollupOptions)
        ? rollupOptions
        : [rollupOptions];

      for (const opts of allRollupOptions) {
        const bundle = await rollup.rollup(opts);
        const output = Array.isArray(opts.output) ? opts.output : [opts.output];

        for (const o of output) {
          if (o) {
            await bundle.write(o);
          }
        }
      }

      const end = process.hrtime.bigint();
      const duration = `${(Number(end - start) / 1_000_000_000).toFixed(2)}s`;
      writeInfo(`⚡ Done in ${duration}`, config);

      return { success: true, outfile };
    } catch (e) {
      if (e.formatted) {
        writeInfo(e.formatted, config);
      } else if (e.message) {
        writeInfo(e.message, config);
      }
      writeError(e, config);
      writeError(`Bundle failed: ${context.projectName}`, config);

      return { success: false };
    }
    // endregion
  }
}

async function createRollupOptions(
  options: NormalizedRollupExecutorOptions,
  context: ExecutorContext,
  config?: StormConfig
): Promise<rollup.RollupOptions | rollup.RollupOptions[]> {
  if (!context.projectGraph) {
    throw new Error("Nx project graph was not found");
  }
  if (!context.root) {
    throw new Error("Nx root was not found");
  }
  if (!context.projectName) {
    throw new Error("Nx project name was not found");
  }
  if (!context.targetName) {
    throw new Error("Nx target name was not found");
  }
  if (!context.configurationName) {
    throw new Error("Nx configuration name was not found");
  }

  const { dependencies } = calculateProjectBuildableDependencies(
    context.taskGraph,
    context.projectGraph,
    context.root,
    context.projectName,
    context.targetName,
    context.configurationName,
    true
  );

  const rollupConfig = await withRollupConfig(
    options,
    {},
    config!,
    dependencies
  );

  // `generatePackageJson` is a plugin rather than being embedded into @nx/rollup:rollup.
  // Make sure the plugin is always present to keep the previous before of Nx < 19.4, where it was not a plugin.
  const generatePackageJsonPlugin = Array.isArray(rollupConfig.plugins)
    ? rollupConfig.plugins.find(
        p => p?.["name"] === generatePackageJsonPluginName
      )
    : null;

  const userDefinedRollupConfigs = options.rollupConfig.map(plugin =>
    loadConfigFile(plugin)
  );
  let finalConfig: rollup.RollupOptions = rollupConfig;
  for (const _config of userDefinedRollupConfigs) {
    const config = await _config;
    if (typeof config === "function") {
      finalConfig = config(finalConfig, options);
    } else {
      finalConfig = {
        ...finalConfig,
        ...config,
        plugins: [
          ...(Array.isArray(finalConfig.plugins) &&
          finalConfig.plugins?.length > 0
            ? finalConfig.plugins
            : []),
          ...(config.plugins?.length > 0 ? config.plugins : [])
        ]
      };
    }
  }

  if (
    generatePackageJsonPlugin &&
    Array.isArray(finalConfig.plugins) &&
    !finalConfig.plugins.some(
      p => p?.["name"] === generatePackageJsonPluginName
    )
  ) {
    finalConfig.plugins.push(generatePackageJsonPlugin);
  }

  return finalConfig;
}

function convertRollupLogLevel(logLevel: string): rollup.LogLevelOption {
  switch (logLevel) {
    case "info":
      return "info";
    case "debug":
    case "trace":
    case "all":
      return "debug";
    default:
      return "warn";
  }
}

function resolveOutfile(
  context: ExecutorContext,
  options: NormalizedRollupExecutorOptions
) {
  if (!options.format?.includes("cjs")) return undefined;
  const { name } = parse(options.outputFileName ?? options.main);
  return resolve(context.root, options.outputPath, `${name}.cjs.js`);
}

export default withRunExecutor<RollupExecutorSchema>(
  "Rollup build",
  rollupExecutorFn,
  {
    skipReadingConfig: false,
    hooks: {
      applyDefaultOptions: (options: RollupExecutorSchema) => {
        options.entry ??= "{sourceRoot}/index.ts";
        options.outputPath ??= "dist/{projectRoot}";
        options.tsConfig ??= "{projectRoot}/tsconfig.json";
        options.assets ??= [];
        options.fileLevelInput ??= true;
        options.generatePackageJson ??= true;
        options.platform ??= "neutral";
        options.verbose ??= false;
        options.external ??= (
          process.env.STORM_EXTERNAL_PACKAGE_PATTERNS &&
          process.env.STORM_EXTERNAL_PACKAGE_PATTERNS.split(",")?.length > 0
            ? process.env.STORM_EXTERNAL_PACKAGE_PATTERNS.split(",")
            : []
        ) as string[];
        options.additionalEntryPoints ??= [];
        options.assets ??= [];
        options.clean ??= true;
        options.watch ??= false;
        options.babelUpwardRootMode ??= true;
        options.sourcemap ??= true;
        options.compiler ??= "babel";

        return options as RollupExecutorSchema;
      }
    }
  }
) as PromiseExecutor<RollupExecutorSchema>;
