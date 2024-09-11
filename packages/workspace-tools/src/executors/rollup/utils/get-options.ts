/* eslint-disable @typescript-eslint/no-var-requires */
import {
  type ProjectGraph,
  ProjectGraphProjectNode,
  readCachedProjectGraph,
  readJsonFile
} from "@nx/devkit";
import { typeDefinitions } from "@nx/js/src/plugins/rollup/type-definitions";
import {
  calculateProjectBuildableDependencies,
  computeCompilerOptionsPaths,
  DependentBuildableProjectNode
} from "@nx/js/src/utils/buildable-libs-utils";
import { ensureTypescript } from "@nx/js/src/utils/typescript/ensure-typescript.js";
import { generatePackageJson } from "@nx/rollup/src/plugins/package-json/generate-package-json";
import { getBabelInputPlugin } from "@rollup/plugin-babel";
import nodeResolve from "@rollup/plugin-node-resolve";
import { StormConfig } from "@storm-software/config";
import { existsSync } from "node:fs";
import { dirname, join, parse } from "node:path";
import { PackageJson } from "nx/src/utils/package-json";
import * as rollup from "rollup";
import { ModuleKind, ParsedCommandLine } from "typescript";
import {
  AssetGlobPattern,
  NormalizedRollupWithNxPluginOptions,
  normalizeOptions,
  RollupWithNxPluginOptions
} from "./normalize-options";

// These use require because the ES import isn't correct.
const commonjs = require("@rollup/plugin-commonjs");
const image = require("@rollup/plugin-image");

const json = require("@rollup/plugin-json");
const copy = require("rollup-plugin-copy");
// const postcss = require("rollup-plugin-postcss");

const fileExtensions = [".js", ".jsx", ".ts", ".tsx"];

function getProjectNode(): ProjectGraphProjectNode {
  // During graph construction, project is not necessary. Return a stub.

  const projectGraph = readCachedProjectGraph();
  const projectName = process.env.NX_TASK_TARGET_PROJECT;
  if (!projectName) {
    throw new Error(
      `NX_TASK_TARGET_PROJECT is not set. Please set it in your environment.`
    );
  }

  return projectGraph.nodes[projectName]!;
}

const formatBytes = bytes => {
  if (bytes === 0) return "0 Byte";
  const k = 1000;
  const dm = 3;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

function analyze() {
  return {
    name: "rollup-plugin-storm-analyzer",
    renderChunk(source, chunk) {
      const sourceBytes = formatBytes(source.length);
      const fileName = chunk.fileName;
      console.log(`  ${fileName} - ${sourceBytes}`);
    }
  };
}

export async function withRollupConfig(
  rawOptions: RollupWithNxPluginOptions,
  rollupConfig: rollup.RollupOptions = {},
  config: StormConfig,
  // Passed by @nx/rollup:rollup executor to previous behavior of remapping tsconfig paths based on buildable dependencies remains intact.
  dependencies: DependentBuildableProjectNode[]
): Promise<rollup.RollupOptions> {
  const { writeWarning, correctPaths } = await import(
    "@storm-software/config-tools"
  );

  const ts = ensureTypescript();

  const finalConfig: rollup.RollupOptions = { ...rollupConfig };

  // Since this is invoked by the executor, the graph has already been created and cached.
  const projectNode = getProjectNode();
  const projectRoot = correctPaths(
    join(config.workspaceRoot, projectNode.data.root)
  );

  // Cannot read in graph during construction, but we only need it during build time.
  const projectGraph: ProjectGraph | null = global.NX_GRAPH_CREATION
    ? null
    : readCachedProjectGraph();
  if (!projectGraph) {
    throw new Error(`Cannot find project graph.`);
  }
  if (!process.env.NX_TASK_TARGET_TARGET) {
    throw new Error(
      `NX_TASK_TARGET_TARGET is not set. Please set it in your environment.`
    );
  }
  if (!process.env.NX_TASK_TARGET_CONFIGURATION) {
    throw new Error(
      `NX_TASK_TARGET_CONFIGURATION is not set. Please set it in your environment.`
    );
  }

  // If dependencies are not passed from executor, calculate them from project graph.
  if (!dependencies && !global.NX_GRAPH_CREATION) {
    const result = calculateProjectBuildableDependencies(
      undefined,
      projectGraph,
      config.workspaceRoot,
      projectNode.name,
      process.env.NX_TASK_TARGET_TARGET,
      process.env.NX_TASK_TARGET_CONFIGURATION,
      true
    );
    dependencies = result.dependencies;
  }

  if (!projectNode.data.sourceRoot) {
    throw new Error(`Cannot find source root for ${projectNode.name}.`);
  }

  const options = normalizeOptions(
    projectNode.data.root,
    projectNode.data.sourceRoot,
    rawOptions,
    config!
  );

  const tsConfigPath = correctPaths(
    join(config.workspaceRoot, options.tsConfig)
  );
  const tsConfigFile = ts.readConfigFile(tsConfigPath, ts.sys.readFile);

  const tsConfigInclude = [
    ...(tsConfigFile.config?.include &&
    Array.isArray(tsConfigFile.config.include)
      ? tsConfigFile.config.include
      : []),
    join(config.workspaceRoot, "node_modules/typescript/lib/*.d.ts")
  ];

  const tsConfig = ts.parseJsonConfigFileContent(
    {
      ...tsConfigFile.config,
      include: tsConfigInclude
    },
    ts.sys,
    dirname(tsConfigPath)
  );

  if (!options.format || !options.format.length) {
    options.format = readCompatibleFormats(tsConfig);
  }

  if (
    rollupConfig.input &&
    (options.main || (options.additionalEntryPoints ?? []).length > 0)
  ) {
    writeWarning(
      `Setting "input" in rollup config overrides "main" and "additionalEntryPoints" options.`,
      config
    );
  }

  // If user provides their own input, override our defaults.
  finalConfig.input = rollupConfig.input || (await createInput(options));

  if (options.format) {
    if (Array.isArray(rollupConfig.output)) {
      throw new Error(
        `Cannot use Rollup array output option and withNx format option together. Use an object instead.`
      );
    }
    if (rollupConfig.output?.format || rollupConfig.output?.dir) {
      writeWarning(
        `"output.dir" and "output.format" are overridden by "withNx".`,
        config
      );
    }

    finalConfig.output = options.format.map(format => ({
      // These options could be overridden by the user, especially if they use a single format.
      entryFileNames: `[name].${format}.js`,
      chunkFileNames: `[name].${format}.js`,
      ...rollupConfig.output,
      // Format and dir cannot be overridden by user or else the behavior will break.
      format,
      dir: global.NX_GRAPH_CREATION
        ? // Options are not normalized with project root during graph creation due to the lack of project and project root.
          // Cannot be joined with workspace root now, but will be handled by @nx/rollup/plugin.
          options.outputPath
        : correctPaths(join(config.workspaceRoot, options.outputPath)),
      sourcemap: options.sourceMap
    }));
  }

  let packageJson = {} as PackageJson;
  if (!global.NX_GRAPH_CREATION) {
    const packageJsonPath = options.project
      ? join(config.workspaceRoot, options.project)
      : join(projectRoot, "package.json");
    if (!existsSync(packageJsonPath)) {
      throw new Error(`Cannot find ${packageJsonPath}.`);
    }

    packageJson = readJsonFile(packageJsonPath);

    if (packageJson.type === "module") {
      if (options.format.includes("cjs")) {
        writeWarning(
          `Package type is set to "module" but "cjs" format is included. Going to use "esm" format instead. You can change the package type to "commonjs" or remove type in the package.json file.`,
          config
        );
      }
      options.format = ["esm"];
    } else if (packageJson.type === "commonjs") {
      if (options.format.includes("esm")) {
        writeWarning(
          `Package type is set to "commonjs" but "esm" format is included. Going to use "cjs" format instead. You can change the package type to "module" or remove type in the package.json file.`,
          config
        );
      }
      options.format = ["cjs"];
    }
  }

  // User may wish to customize how external behaves by overriding our default.
  if (!rollupConfig.external && !global.NX_GRAPH_CREATION) {
    const npmDeps = (projectGraph?.dependencies[projectNode.name] ?? [])
      .filter(d => d.target.startsWith("npm:"))
      .map(d => d.target.slice(4));
    let externalPackages = [
      ...Object.keys(packageJson.dependencies || {}),
      ...Object.keys(packageJson.peerDependencies || {})
    ]; // If external is set to none, include all dependencies and peerDependencies in externalPackages
    if (options.external === "all") {
      externalPackages = externalPackages.concat(npmDeps);
    } else if (Array.isArray(options.external) && options.external.length > 0) {
      externalPackages = externalPackages.concat(options.external);
    }
    externalPackages = [...new Set(externalPackages)];
    finalConfig.external = (id: string) => {
      return externalPackages.some(
        name => id === name || id.startsWith(`${name}/`)
      );
    };
  }

  if (!global.NX_GRAPH_CREATION) {
    finalConfig.plugins = [
      copy({
        targets: convertCopyAssetsToRollupOptions(
          options.outputPath,
          options.assets,
          config.workspaceRoot
        )
      }),
      image(),
      json(),
      nodeResolve({
        preferBuiltins: true,
        extensions: fileExtensions
      }),
      require("rollup-plugin-typescript2")({
        cwd: correctPaths(config.workspaceRoot),
        check: !options.skipTypeCheck,
        typescript: ts,
        tsconfig: options.tsConfig,
        tsconfigOverride: {
          compilerOptions: await createTsCompilerOptions(
            tsConfig,
            options,
            dependencies,
            config
          ),
          include: tsConfigInclude
        },
        verbosity: convertRpts2LogLevel(config?.logLevel ?? "warn")
      }),
      typeDefinitions({
        projectRoot
      }),
      // postcss({
      //   inject: true,
      //   extract: options.extractCss,
      //   autoModules: true,
      //   plugins: [autoprefixer],
      //   use: {
      //     less: {
      //       javascriptEnabled: options.javascriptEnabled
      //     }
      //   }
      // }),
      getBabelInputPlugin({
        // Lets `@nx/js/babel` preset know that we are packaging.
        caller: {
          isNxPackage: true,
          supportsStaticESM: true,
          isModern: true
        },
        cwd: correctPaths(
          join(
            config.workspaceRoot,
            projectNode.data.sourceRoot ?? projectNode.data.root
          )
        ),
        rootMode: options.babelUpwardRootMode ? "upward" : undefined,
        babelrc: true,
        extensions: fileExtensions,
        babelHelpers: "bundled",
        skipPreflightCheck: true, // pre-flight check may yield false positives and also slows down the build
        exclude: /node_modules/
      }),
      commonjs(),
      analyze(),
      generatePackageJson(options, packageJson)
    ];
    if (Array.isArray(rollupConfig.plugins)) {
      finalConfig.plugins.push(...rollupConfig.plugins);
    }

    // if (options.deleteOutputPath) {
    //   finalConfig.plugins.push(
    //     deleteOutput({
    //       dirs: Array.isArray(finalConfig.output)
    //         ? finalConfig.output.map(o => o.dir)
    //         : [finalConfig.output.dir]
    //     })
    //   );
    // }
  }

  return finalConfig;
}

function convertRpts2LogLevel(logLevel: string): number {
  switch (logLevel) {
    case "warn":
      return 1;
    case "info":
      return 2;
    case "debug":
    case "trace":
    case "all":
      return 3;
    default:
      return 0;
  }
}

async function createInput(
  options: NormalizedRollupWithNxPluginOptions
): Promise<Record<string, string>> {
  const { correctPaths } = await import("@storm-software/config-tools");

  // During graph creation, these input entries don't affect target configuration, so we can skip them.
  // If convert-to-inferred generator is used, and project uses configurations, some options like main might be missing from default options.
  if (global.NX_GRAPH_CREATION) return {};
  const mainEntryFileName = options.outputFileName || options.main;
  const input: Record<string, string> = {};
  input[parse(mainEntryFileName).name] = join(
    options.config.workspaceRoot,
    options.main
  );
  options.additionalEntryPoints?.forEach(entry => {
    const entryPoint = correctPaths(join(options.config.workspaceRoot, entry));

    const entryName = `.${entryPoint.replace(
      join(options.config.workspaceRoot, options.sourceRoot).replaceAll(
        "\\",
        "/"
      ),
      ""
    )}`;

    input[entryName] = entryPoint;
  });

  return Object.keys(input).reduce((ret, key) => {
    if (key.endsWith("/index.ts") && input[key]) {
      ret[key.replace("/index.ts", "")] = input[key];
    }

    return ret;
  }, input);
}

async function createTsCompilerOptions(
  parsedCommandLine: ParsedCommandLine,
  options: RollupWithNxPluginOptions,
  dependencies?: DependentBuildableProjectNode[],
  config?: StormConfig
) {
  const { correctPaths } = await import("@storm-software/config-tools");

  if (!config?.workspaceRoot) {
    throw new Error(`Cannot find workspace root in the config.`);
  }

  const baseDir = correctPaths(config?.workspaceRoot);
  const compilerOptionPaths = computeCompilerOptionsPaths(
    parsedCommandLine,
    dependencies ?? []
  );

  const compilerOptions = {
    rootDir: baseDir,
    baseUrl: baseDir,
    declaration: true,
    skipLibCheck: true,
    skipDefaultLibCheck: true,
    paths: compilerOptionPaths
  };
  if (parsedCommandLine.options.module === ModuleKind.CommonJS) {
    compilerOptions["module"] = "ESNext";
  }
  if (options.compiler === "swc") {
    compilerOptions["emitDeclarationOnly"] = true;
  }

  return compilerOptions;
}

interface RollupCopyAssetOption {
  src: string;
  dest: string;
}

function convertCopyAssetsToRollupOptions(
  outputPath: string,
  assets: AssetGlobPattern[],
  workspaceRoot: string
): RollupCopyAssetOption[] {
  return assets
    ? assets.map(a => ({
        src: join(a.input, a.glob).replace(/\\/g, "/"),
        dest: join(workspaceRoot, outputPath, a.output).replace(/\\/g, "/")
      }))
    : [];
}

function readCompatibleFormats(config: ParsedCommandLine): ("cjs" | "esm")[] {
  switch (config.options.module) {
    case ModuleKind.CommonJS:
    case ModuleKind.UMD:
    case ModuleKind.AMD:
      return ["cjs"];
    default:
      return ["esm"];
  }
}
