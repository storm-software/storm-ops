import { readFileSync, writeFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { esbuildDecorators } from "@anatine/esbuild-decorators";
import { createProjectGraphAsync, joinPathFragments, readJsonFile } from "@nx/devkit";
import type { ExecutorContext } from "@nx/devkit";
import { copyAssets } from "@nx/js";
import { normalizeOptions } from "@nx/js/src/executors/tsc/lib/normalize-options";
import { createTypeScriptCompilationOptions } from "@nx/js/src/executors/tsc/tsc.impl";
import type { DependentBuildableProjectNode } from "@nx/js/src/utils/buildable-libs-utils";
import type { TypeScriptCompilationOptions } from "@nx/workspace/src/utilities/typescript/compilation";
import {
  LogLevel,
  type StormConfig,
  getLogLevel,
  writeDebug,
  writeInfo,
  writeSuccess,
  writeTrace,
  writeWarning
} from "@storm-software/config-tools";
import { environmentPlugin } from "esbuild-plugin-environment";
import { removeSync } from "fs-extra";
import { type Path, globSync } from "glob";
import { fileExists } from "nx/src/utils/fileutils";
import { type Options as PrettierOptions, format } from "prettier";
import { type Options, build as tsup, defineConfig } from "tsup";
import * as ts from "typescript";
import { withRunExecutor } from "../../base/base-executor";
import { defaultConfig, getConfig } from "../../base/get-tsup-config";
import { removeExtension } from "../../utils/file-path-utils";
import { getProjectConfigurations } from "../../utils/get-project-configurations";
import { getExternalDependencies } from "../../utils/get-project-deps";
import { getWorkspaceRoot } from "../../utils/get-workspace-root";
import { getTypiaTransform } from "../../utils/typia-transform";
import type { TsupExecutorSchema } from "./schema";

type PackageConfiguration = {
  version: string;
  packageName: string;
  hash?: string;
};

export async function tsupExecutorFn(
  options: TsupExecutorSchema,
  context: ExecutorContext,
  config?: StormConfig
) {
  writeInfo(config, "📦  Running Storm build executor on the workspace");

  // #region Apply default options

  getLogLevel(config?.logLevel) >= LogLevel.TRACE &&
    writeDebug(
      config,
      `⚙️  Executor options:
${Object.keys(options)
  .map(
    (key) =>
      `${key}: ${
        !options[key] || _isPrimitive(options[key]) ? options[key] : JSON.stringify(options[key])
      }`
  )
  .join("\n")}
`
    );

  // #endregion Apply default options

  // #region Prepare build context variables

  if (
    !context.projectsConfigurations?.projects ||
    !context.projectName ||
    !context.projectsConfigurations.projects[context.projectName]
  ) {
    throw new Error(
      "The Build process failed because the context is not valid. Please run this command from a workspace."
    );
  }

  const workspaceRoot = getWorkspaceRoot();
  const projectRoot = context.projectsConfigurations.projects[context.projectName].root;
  const sourceRoot = context.projectsConfigurations.projects[context.projectName].sourceRoot;

  // #endregion Prepare build context variables

  // #region Clean output directory

  if (options.clean !== false) {
    if (getLogLevel(config?.logLevel) >= LogLevel.DEBUG) {
      writeInfo(config, `🧹 Cleaning output path: ${options.outputPath}`);
    }

    removeSync(options.outputPath);
  }

  // #endregion Clean output directory

  // #region Copy asset files to output directory

  const assets = Array.from(options.assets);
  assets.push({
    input: projectRoot,
    glob: "*.md",
    output: "/"
  });
  assets.push({
    input: "",
    glob: "LICENSE",
    output: "."
  });

  if (options.generatePackageJson === false) {
    assets.push({
      input: projectRoot,
      glob: "**/package.json",
      output: "."
    });
  }

  if (options.includeSrc === true) {
    assets.push({
      input: sourceRoot,
      glob: "**/{*.ts,*.tsx,*.js,*.jsx}",
      output: "src/"
    });
  }

  const result = await copyAssets(
    { assets, watch: options.watch, outputPath: options.outputPath },
    context
  );
  if (!result.success) {
    throw new Error("The Build process failed trying to copy assets");
  }

  // #endregion Copy asset files to output directory

  // #region Generate the package.json file

  const pathToPackageJson = join(context.root, projectRoot, "package.json");
  const packageJson = fileExists(pathToPackageJson)
    ? readJsonFile(pathToPackageJson)
    : { name: context.projectName, version: "0.0.1" };
  const workspacePackageJson = readJsonFile(join(workspaceRoot, "package.json"));

  options.external = options.external || [];
  if (workspacePackageJson?.dependencies) {
    options.external = Object.keys(workspacePackageJson?.dependencies).reduce(
      (ret: string[], key: string) => {
        if (!ret.includes(key)) {
          ret.push(key);
        }

        return ret;
      },
      options.external
    );
  }

  const externalDependencies: DependentBuildableProjectNode[] = options.external.reduce(
    (ret, name) => {
      if (!packageJson?.devDependencies?.[name]) {
        const externalNode = context.projectGraph.externalNodes[`npm:${name}`];
        if (externalNode) {
          ret.push({
            name,
            outputs: [],
            node: externalNode
          });
        }
      }

      return ret;
    },
    []
  );

  const implicitDependencies =
    context.projectsConfigurations.projects[context.projectName].implicitDependencies;
  const internalDependencies: string[] = [];

  const projectConfigs = await Promise.resolve(getProjectConfigurations());
  if (getLogLevel(config?.logLevel) >= LogLevel.TRACE) {
    writeDebug(config, "Project Configs:");
    console.log(projectConfigs);
  }

  if (implicitDependencies && implicitDependencies.length > 0) {
    options.external = implicitDependencies.reduce((ret: string[], key: string) => {
      writeDebug(config, `⚡ Adding implicit dependency: ${key}`);

      const projectConfig = projectConfigs[key];
      if (projectConfig?.targets?.build) {
        const projectPackageJson = readJsonFile(projectConfig.targets?.build.options.project);

        if (projectPackageJson?.name && !options.external.includes(projectPackageJson.name)) {
          ret.push(projectPackageJson.name);
          internalDependencies.push(projectPackageJson.name);
        }
      }

      return ret;
    }, options.external);
  }

  if (options.bundle === false) {
    for (const thirdPartyDependency of getExternalDependencies(
      context.projectName,
      context.projectGraph
    )) {
      const packageConfig = thirdPartyDependency.node.data as PackageConfiguration;
      if (packageConfig?.packageName) {
        options.external.push(packageConfig.packageName);
        if (!packageJson?.devDependencies?.[packageConfig.packageName]) {
          externalDependencies.push(thirdPartyDependency);
        }
      }
    }
  }

  writeTrace(
    config,
    `Building with the following dependencies marked as external:
${externalDependencies
  .map((dep) => {
    return `name: ${dep.name}, node: ${dep.node}, outputs: ${dep.outputs}`;
  })
  .join("\n")}`
  );

  const prettierOptions: PrettierOptions = {
    plugins: ["prettier-plugin-packagejson"],
    trailingComma: "none",
    tabWidth: 2,
    semi: true,
    singleQuote: false,
    quoteProps: "preserve",
    insertPragma: false,
    bracketSameLine: true,
    printWidth: 80,
    bracketSpacing: true,
    arrowParens: "avoid",
    endOfLine: "lf"
  };

  const entryPoints = [];
  if (options.entry) {
    entryPoints.push(options.entry);
  }
  if (options.emitOnAll === true) {
    entryPoints.push(joinPathFragments(sourceRoot, "**/*.{ts,tsx}"));
  }
  if (options.additionalEntryPoints) {
    entryPoints.push(...options.additionalEntryPoints);
  }

  const entry = globSync(entryPoints, {
    withFileTypes: true
  }).reduce((ret, filePath: Path) => {
    let formattedPath = workspaceRoot.replaceAll("\\", "/");
    if (formattedPath.toUpperCase().startsWith("C:")) {
      // Handle starting pattern for Window's paths
      formattedPath = formattedPath.substring(2);
    }

    let propertyKey = joinPathFragments(filePath.path, removeExtension(filePath.name))
      .replaceAll("\\", "/")
      .replaceAll(formattedPath, "")
      .replaceAll(sourceRoot, "")
      .replaceAll(projectRoot, "");

    if (propertyKey) {
      while (propertyKey.startsWith("/")) {
        propertyKey = propertyKey.substring(1);
      }

      writeDebug(
        config,
        `Trying to add entry point ${propertyKey} at "${joinPathFragments(
          filePath.path,
          filePath.name
        )}"`
      );

      if (!(propertyKey in ret)) {
        ret[propertyKey] = joinPathFragments(filePath.path, filePath.name);
      }
    }

    return ret;
  }, {});

  console.log("Conditional before checking entry points");
  if (options.generatePackageJson !== false) {
    console.log("Checking entry points");
    const projectGraph = await createProjectGraphAsync({
      exitOnError: true
    });
    console.log("Read project graph");

    packageJson.dependencies = undefined;
    for (const externalDependency of externalDependencies) {
      console.log(externalDependency);
      const packageConfig = externalDependency.node.data as PackageConfiguration;
      if (packageConfig?.packageName && externalDependency.node.type === "npm") {
        console.log("In if statement");
        console.log(packageConfig);

        const { packageName, version } = packageConfig;
        if (
          workspacePackageJson.dependencies?.[packageName] ||
          workspacePackageJson.devDependencies?.[packageName] ||
          packageJson?.devDependencies?.[packageName]
        ) {
          return null;
        }

        packageJson.dependencies ??= {};
        packageJson.dependencies[packageName] = projectGraph.nodes[externalDependency.node.name]
          ? "latest"
          : version;
      }
    }

    console.log("Checking entry points - internalDependencies");
    for (const packageName of internalDependencies) {
      if (!packageJson?.devDependencies?.[packageName]) {
        packageJson.dependencies ??= {};
        packageJson.dependencies[packageName] = "latest";
      }
    }

    const distPaths: string[] =
      !options?.getConfig || _isFunction(options.getConfig)
        ? ["dist/"]
        : Object.keys(options.getConfig).map((key) => `${key}/`);

    packageJson.type = "module";
    if (distPaths.length > 0) {
      packageJson.exports ??= {
        ".": {
          import: {
            types: `./${distPaths[0]}index.d.ts`,
            default: `./${distPaths[0]}index.js`
          },
          require: {
            types: `./${distPaths[0]}index.d.cts`,
            default: `./${distPaths[0]}index.cjs`
          },
          default: {
            types: `./${distPaths[0]}index.d.ts`,
            default: `./${distPaths[0]}index.js`
          },
          ...(options.additionalEntryPoints ?? []).map((entryPoint) => ({
            [removeExtension(entryPoint).replace(sourceRoot, "")]: {
              types: join(
                `./${distPaths[0]}`,
                `${removeExtension(entryPoint.replace(sourceRoot, ""))}.d.ts`
              ),
              default: join(
                `./${distPaths[0]}`,
                `${removeExtension(entryPoint.replace(sourceRoot, ""))}.js`
              )
            }
          }))
        },
        "./package.json": "./package.json"
      };

      console.log("Checking entry points - packageJson.exports");
      packageJson.exports = Object.keys(entry).reduce((ret: Record<string, any>, key: string) => {
        let packageJsonKey = key.startsWith("./") ? key : `./${key}`;
        packageJsonKey = packageJsonKey.replaceAll("/index", "");

        if (!ret[packageJsonKey]) {
          ret[packageJsonKey] = {
            import: {
              types: `./${distPaths[0]}index.d.ts`,
              default: `./${distPaths[0]}${key}.js`
            },
            require: {
              types: `./${distPaths[0]}index.d.cts`,
              default: `./${distPaths[0]}${key}.cjs`
            },
            default: {
              types: `./${distPaths[0]}index.d.ts`,
              default: `./${distPaths[0]}${key}.js`
            }
          };
        }

        return ret;
      }, packageJson.exports);

      packageJson.funding ??= workspacePackageJson.funding;

      packageJson.types ??= `${distPaths.length > 1 ? distPaths[1] : distPaths[0]}index.d.ts`;
      packageJson.typings ??= `${distPaths.length > 1 ? distPaths[1] : distPaths[0]}index.d.ts`;
      packageJson.typescript ??= {
        definition: `${distPaths.length > 1 ? distPaths[1] : distPaths[0]}index.d.ts`
      };

      packageJson.main ??= `${distPaths.length > 1 ? distPaths[1] : distPaths[0]}index.cjs`;
      packageJson.module ??= `${distPaths.length > 1 ? distPaths[1] : distPaths[0]}index.js`;

      if (options.platform && options.platform !== "node") {
        packageJson.browser ??= `${distPaths[0]}index.global.js`;
      }

      if (options.includeSrc === true) {
        let distSrc = sourceRoot.replace(projectRoot, "");
        if (distSrc.startsWith("/")) {
          distSrc = distSrc.substring(1);
        }

        packageJson.source ??= `${join(distSrc, "index.ts").replaceAll("\\", "/")}`;
      }

      packageJson.sideEffects ??= false;

      packageJson.files ??= ["dist/**/*"];
      if (options.includeSrc === true && !packageJson.files.includes("src")) {
        packageJson.files.push("src/**/*");
      }
    }

    packageJson.publishConfig ??= {
      access: "public"
    };

    packageJson.description ??= workspacePackageJson.description;
    packageJson.homepage ??= workspacePackageJson.homepage;
    packageJson.bugs ??= workspacePackageJson.bugs;
    packageJson.author ??= workspacePackageJson.author;
    packageJson.license ??= workspacePackageJson.license;
    packageJson.keywords ??= workspacePackageJson.keywords;

    packageJson.repository ??= workspacePackageJson.repository;
    packageJson.repository.directory ??= projectRoot
      ? projectRoot
      : join("packages", context.projectName);

    console.log("Checking entry points - packageJsonPath");
    const packageJsonPath = join(context.root, options.outputPath, "package.json");

    writeDebug(config, `⚡ Writing package.json file to: ${packageJsonPath}`);

    writeFileSync(
      packageJsonPath,
      await format(JSON.stringify(packageJson), {
        ...prettierOptions,
        parser: "json"
      })
    );
  } else {
    writeWarning(config, "Skipping writing to package.json file");
  }

  console.log("Checking entry points - options.includeSrc");
  if (options.includeSrc === true) {
    const files = globSync([
      joinPathFragments(context.root, options.outputPath, "src/**/*.ts"),
      joinPathFragments(context.root, options.outputPath, "src/**/*.tsx"),
      joinPathFragments(context.root, options.outputPath, "src/**/*.js"),
      joinPathFragments(context.root, options.outputPath, "src/**/*.jsx")
    ]);
    await Promise.allSettled(
      files.map(async (file) =>
        writeFile(
          file,
          await format(
            `${
              options.banner
                ? options.banner.startsWith("//")
                  ? options.banner
                  : `// ${options.banner}`
                : ""
            }\n\n${readFileSync(file, "utf-8")}`,
            {
              ...prettierOptions,
              parser: "typescript"
            }
          ),
          "utf-8"
        )
      )
    );
  }

  // #endregion Generate the package.json file

  // #region Add default plugins

  const stormEnv = Object.keys(options.env)
    .filter((key) => key.startsWith("STORM_"))
    .reduce((ret, key) => {
      ret[key] = options.env[key];
      return ret;
    }, {});
  options.plugins.push(
    esbuildDecorators({
      tsconfig: options.tsConfig,
      cwd: workspaceRoot
    })
  );
  options.plugins.push(environmentPlugin(stormEnv));

  // #endregion Add default plugins

  // #region Run the build process

  const getConfigOptions = {
    ...options,
    define: {
      __STORM_CONFIG: JSON.stringify(stormEnv)
    },
    env: {
      __STORM_CONFIG: JSON.stringify(stormEnv),
      ...stormEnv
    },
    dtsTsConfig: getNormalizedTsConfig(
      context.root,
      options.outputPath,
      createTypeScriptCompilationOptions(
        normalizeOptions(
          {
            ...options,
            watch: false,
            main: options.entry,
            transformers: options.skipTypia ? [] : ["typia/lib/transform"]
          },
          context.root,
          sourceRoot,
          workspaceRoot
        ),
        context
      )
    ),
    banner: options.banner
      ? {
          js: `${options.banner}\n\n`,
          css: `/* \n${options.banner}\n */\n\n`
        }
      : undefined,
    outputPath: options.outputPath,
    entry,
    getTransform: options.skipTypia ? undefined : getTypiaTransform
  };

  if (options.getConfig) {
    writeInfo(config, "⚡ Running the Build process");

    const getConfigFns = _isFunction(options.getConfig)
      ? [options.getConfig]
      : Object.keys(options.getConfig).map((key) => options.getConfig[key]);

    const tsupConfig = defineConfig(
      getConfigFns.map((getConfigFn) =>
        getConfig(context.root, projectRoot, getConfigFn, getConfigOptions)
      )
    );

    if (_isFunction(tsupConfig)) {
      await build(await Promise.resolve(tsupConfig({})), config);
    } else {
      await build(tsupConfig, config);
    }
  } else if (getLogLevel(config?.logLevel) >= LogLevel.WARN) {
    writeWarning(
      config,
      "The Build process did not run because no `getConfig` parameter was provided"
    );
  }

  // #endregion Run the build process

  writeSuccess(config, "⚡ The Build process has completed successfully");

  return {
    success: true
  };
}

function getNormalizedTsConfig(
  workspaceRoot: string,
  outputPath: string,
  options: TypeScriptCompilationOptions
) {
  const config = ts.readConfigFile(options.tsConfig, ts.sys.readFile).config;
  const tsConfig = ts.parseJsonConfigFileContent(
    {
      ...config,
      compilerOptions: {
        ...config.compilerOptions,
        outDir: outputPath,
        rootDir: workspaceRoot,
        baseUrl: workspaceRoot,
        allowJs: true,
        noEmit: false,
        esModuleInterop: true,
        downlevelIteration: true,
        forceConsistentCasingInFileNames: true,
        emitDeclarationOnly: true,
        declaration: true,
        declarationMap: true,
        declarationDir: join(workspaceRoot, "tmp", ".tsup", "declaration")
      }
    },
    ts.sys,
    dirname(options.tsConfig)
  );

  tsConfig.options.pathsBasePath = workspaceRoot;
  if (tsConfig.options.incremental && !tsConfig.options.tsBuildInfoFile) {
    tsConfig.options.tsBuildInfoFile = joinPathFragments(outputPath, "tsconfig.tsbuildinfo");
  }

  return tsConfig;
}

const build = async (options: Options | Options[], config?: StormConfig) => {
  try {
    if (Array.isArray(options)) {
      await Promise.all(options.map((buildOptions) => build(buildOptions, config)));
    } else {
      if (getLogLevel(config?.logLevel) >= LogLevel.TRACE && !options.silent) {
        console.log("⚙️  Tsup build config: \n", options, "\n");
      }

      await tsup(options);
    }
  } catch (e) {
    console.error("⚠️  A failure occured during the Tsup Build executor");
    console.error(e);
  }
};

export const applyDefaultOptions = (options: TsupExecutorSchema): TsupExecutorSchema => {
  options.entry ??= "{sourceRoot}/index.ts";
  options.outputPath ??= "dist/{projectRoot}";
  options.tsConfig ??= "tsconfig.json";
  options.generatePackageJson ??= true;
  options.splitting ??= true;
  options.treeshake ??= true;
  options.platform ??= "neutral";
  options.format ??= ["cjs", "esm"];
  options.verbose ??= false;
  options.external ??= [];
  options.additionalEntryPoints ??= [];
  options.assets ??= [];
  options.plugins ??= [];
  options.includeSrc ??= false;
  options.clean ??= true;
  options.bundle ??= true;
  options.debug ??= false;
  options.watch ??= false;
  options.apiReport ??= true;
  options.docModel ??= true;
  options.tsdocMetadata ??= true;
  options.emitOnAll ??= false;
  options.metafile ??= false;
  options.skipTypia ??= false;
  options.define ??= {};
  options.env ??= {};
  options.getConfig ??= { dist: defaultConfig };

  return options;
};

export default withRunExecutor<TsupExecutorSchema>("TypeScript Build using tsup", tsupExecutorFn, {
  skipReadingConfig: false,
  hooks: {
    applyDefaultOptions
  }
});

const _isPrimitive = (value: unknown): boolean => {
  try {
    return (
      value === undefined ||
      value === null ||
      (typeof value !== "object" && typeof value !== "function")
    );
    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
  } catch (e) {
    return false;
  }
};

const _isFunction = (
  value: unknown
): value is ((params?: unknown) => unknown) & ((param?: any) => any) => {
  try {
    return (
      value instanceof Function ||
      typeof value === "function" ||
      !!(value?.constructor && (value as any)?.call && (value as any)?.apply)
    );
    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
  } catch (e) {
    return false;
  }
};
