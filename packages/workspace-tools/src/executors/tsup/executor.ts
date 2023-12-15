/* eslint-disable @typescript-eslint/no-explicit-any */
import { esbuildDecorators } from "@anatine/esbuild-decorators";
import {
  ExecutorContext,
  joinPathFragments,
  readCachedProjectGraph,
  readJsonFile
} from "@nx/devkit";
import { copyAssets } from "@nx/js";
import { normalizeOptions } from "@nx/js/src/executors/tsc/lib/normalize-options";
import { createTypeScriptCompilationOptions } from "@nx/js/src/executors/tsc/tsc.impl";
import { DependentBuildableProjectNode } from "@nx/js/src/utils/buildable-libs-utils";
import { TypeScriptCompilationOptions } from "@nx/workspace/src/utilities/typescript/compilation";
import { load } from "decky";
import { environmentPlugin } from "esbuild-plugin-environment";
import { readFileSync, writeFileSync } from "fs";
import { removeSync } from "fs-extra";
import { writeFile } from "fs/promises";
import { Path, globSync } from "glob";
import { fileExists } from "nx/src/utils/fileutils";
import { dirname, join } from "path";
import { Options as PrettierOptions, format } from "prettier";
import { Options, defineConfig, build as tsup } from "tsup";
import * as ts from "typescript";
import { withRunExecutor } from "../../base/base-executor";
import { removeExtension } from "../../utils/file-path-utils";
import { getProjectConfigurations } from "../../utils/get-project-configurations";
import { getExternalDependencies } from "../../utils/get-project-deps";
import { getWorkspaceRoot } from "../../utils/get-workspace-root";
import { getConfig, legacyConfig, modernConfig } from "./get-config";
import { TsupExecutorSchema } from "./schema";

type PackageConfiguration = {
  version: string;
  packageName: string;
  hash?: string;
};

export async function tsupExecutorFn(
  options: TsupExecutorSchema,
  context: ExecutorContext
) {
  try {
    console.log("📦  Running Storm build executor on the workspace");

    // #region Apply default options

    options.verbose &&
      console.log(
        `⚙️  Executor options:
${Object.keys(options)
  .map(
    key =>
      `${key}: ${
        !options[key] || isPrimitive(options[key])
          ? options[key]
          : JSON.stringify(options[key])
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
    const projectRoot =
      context.projectsConfigurations.projects[context.projectName].root;
    const sourceRoot =
      context.projectsConfigurations.projects[context.projectName].sourceRoot;

    // #endregion Prepare build context variables

    // #region Clean output directory

    if (options.clean !== false) {
      console.log(`🧹 Cleaning output path: ${options.outputPath}`);
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

    const workspacePackageJson = readJsonFile(
      join(workspaceRoot, "package.json")
    );

    options.external = options.external || [];
    if (workspacePackageJson?.dependencies) {
      options.external = Object.keys(workspacePackageJson?.dependencies).reduce(
        (ret: string[], key: string) => {
          if (!options.external.includes(key)) {
            ret.push(key);
          }

          return ret;
        },
        options.external
      );
    }

    let externalDependencies: DependentBuildableProjectNode[] =
      options.external.reduce((acc, name) => {
        const externalNode = context.projectGraph.externalNodes[`npm:${name}`];
        if (externalNode) {
          acc.push({
            name,
            outputs: [],
            node: externalNode
          });
        }

        return acc;
      }, []);

    const implicitDependencies =
      context.projectsConfigurations.projects[context.projectName]
        .implicitDependencies;
    const internalDependencies: string[] = [];

    const projectConfigs = await Promise.resolve(getProjectConfigurations());
    console.log("Project Configs:");
    console.log(projectConfigs);

    if (implicitDependencies && implicitDependencies.length > 0) {
      options.external = implicitDependencies.reduce(
        (ret: string[], key: string) => {
          console.log(`⚡ Adding implicit dependency: ${key}`);

          const projectConfig = projectConfigs[key];
          if (projectConfig?.targets?.build) {
            const packageJson = readJsonFile(
              projectConfig.targets?.build.options.project
            );

            if (
              packageJson?.name &&
              !options.external.includes(packageJson.name)
            ) {
              ret.push(packageJson.name);
              internalDependencies.push(packageJson.name);
            }
          }

          return ret;
        },
        options.external
      );
    }

    if (options.bundle === false) {
      for (const thirdPartyDependency of getExternalDependencies(
        context.projectName,
        context.projectGraph
      )) {
        const packageConfig = thirdPartyDependency.node
          .data as PackageConfiguration;
        if (packageConfig?.packageName) {
          options.external.push(packageConfig.packageName);
          externalDependencies.push(thirdPartyDependency);
        }
      }
    }

    console.log(`Building with the following dependencies marked as external:
${externalDependencies
  .map(dep => {
    return `name: ${dep.name}, node: ${dep.node}, outputs: ${dep.outputs}`;
  })
  .join("\n")}`);

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
    if (options.emitOnAll !== false) {
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

      let propertyKey = joinPathFragments(
        filePath.path,
        removeExtension(filePath.name)
      )
        .replaceAll("\\", "/")
        .replaceAll(formattedPath, "")
        .replaceAll(sourceRoot, "")
        .replaceAll(projectRoot, "");

      if (propertyKey) {
        while (propertyKey.startsWith("/")) {
          propertyKey = propertyKey.substring(1);
        }

        console.debug(
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

    if (options.generatePackageJson !== false) {
      const projectGraph = readCachedProjectGraph();
      const pathToPackageJson = join(context.root, projectRoot, "package.json");
      const packageJson = fileExists(pathToPackageJson)
        ? readJsonFile(pathToPackageJson)
        : { name: context.projectName, version: "0.0.1" };

      delete packageJson.dependencies;
      externalDependencies.forEach(externalDependency => {
        const packageConfig = externalDependency.node
          .data as PackageConfiguration;
        if (
          packageConfig?.packageName &&
          !!(
            projectGraph.externalNodes[externalDependency.node.name]?.type ===
            "npm"
          )
        ) {
          const { packageName, version } = packageConfig;
          if (
            workspacePackageJson.dependencies?.[packageName] ||
            workspacePackageJson.devDependencies?.[packageName]
          ) {
            return;
          }

          packageJson.dependencies ??= {};
          packageJson.dependencies[packageName] = !!projectGraph.nodes[
            externalDependency.node.name
          ]
            ? "latest"
            : version;
        }
      });

      internalDependencies.forEach(packageName => {
        packageJson.dependencies ??= {};
        packageJson.dependencies[packageName] = "latest";
      });

      packageJson.type = "module";
      packageJson.exports ??= {
        ".": {
          import: {
            types: "./dist/modern/index.d.ts",
            default: "./dist/modern/index.js"
          },
          require: {
            types: "./dist/modern/index.d.cts",
            default: "./dist/modern/index.cjs"
          },
          default: {
            types: "./dist/modern/index.d.ts",
            default: "./dist/modern/index.js"
          },
          ...(options.additionalEntryPoints ?? []).map(entryPoint => ({
            [removeExtension(entryPoint).replace(sourceRoot, "")]: {
              types: join(
                "./dist/modern",
                `${removeExtension(entryPoint.replace(sourceRoot, ""))}.d.ts`
              ),
              default: join(
                "./dist/modern",
                `${removeExtension(entryPoint.replace(sourceRoot, ""))}.js`
              )
            }
          }))
        },
        "./package.json": "./package.json"
      };

      packageJson.exports = Object.keys(entry).reduce(
        (ret: Record<string, any>, key: string) => {
          let packageJsonKey = key.startsWith("./") ? key : `./${key}`;
          packageJsonKey = packageJsonKey.replaceAll("/index", "");

          if (!ret[packageJsonKey]) {
            ret[packageJsonKey] = {
              import: {
                types: `./dist/modern/${key}.d.ts`,
                default: `./dist/modern/${key}.js`
              },
              require: {
                types: `./dist/modern/${key}.d.cts`,
                default: `./dist/modern/${key}.cjs`
              },
              default: {
                types: `./dist/modern/${key}.d.ts`,
                default: `./dist/modern/${key}.js`
              }
            };
          }

          return ret;
        },
        packageJson.exports
      );

      packageJson.funding ??= workspacePackageJson.funding;

      packageJson.types ??= "dist/legacy/index.d.ts";
      packageJson.typings ??= "dist/legacy/index.d.ts";
      packageJson.typescript ??= {
        definition: "dist/legacy/index.d.ts"
      };

      packageJson.main ??= "dist/legacy/index.cjs";
      packageJson.module ??= "dist/legacy/index.js";
      options.platform &&
        options.platform !== "node" &&
        (packageJson.browser ??= "dist/modern/index.global.js");

      if (options.includeSrc === true) {
        let distSrc = sourceRoot.replace(projectRoot, "");
        if (distSrc.startsWith("/")) {
          distSrc = distSrc.substring(1);
        }

        packageJson.source ??= `${join(distSrc, "index.ts").replaceAll(
          "\\",
          "/"
        )}`;
      }

      packageJson.sideEffects ??= false;

      packageJson.files ??= ["dist/**/*"];
      if (options.includeSrc === true && !packageJson.files.includes("src")) {
        packageJson.files.push("src/**/*");
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

      const packageJsonPath = join(
        context.root,
        options.outputPath,
        "package.json"
      );
      console.log(`⚡ Writing package.json file to: ${packageJsonPath}`);

      writeFileSync(
        packageJsonPath,
        await format(JSON.stringify(packageJson), {
          ...prettierOptions,
          parser: "json"
        })
      );
    }

    if (options.includeSrc === true) {
      const files = globSync([
        joinPathFragments(context.root, options.outputPath, "src/**/*.ts"),
        joinPathFragments(context.root, options.outputPath, "src/**/*.tsx"),
        joinPathFragments(context.root, options.outputPath, "src/**/*.js"),
        joinPathFragments(context.root, options.outputPath, "src/**/*.jsx")
      ]);
      await Promise.allSettled(
        files.map(async file =>
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
      .filter(key => key.startsWith("STORM_"))
      .reduce((ret, key) => {
        ret[key] = options.env[key];
        return ret;
      }, {});

    options.plugins.push(await load());
    options.plugins.push(
      esbuildDecorators({
        tsconfig: options.tsConfig,
        cwd: workspaceRoot
      })
    );
    options.plugins.push(environmentPlugin(stormEnv));

    // #endregion Add default plugins

    // #region Run the build process

    console.log("⚡ Building with the following entry points: ", entry);
    const config = defineConfig(
      Object.keys(entry).reduce((ret: Options[], key: string) => {
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
                  main: entry[key],
                  transformers: []
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
          entry: entry[key]
        };

        ret.push(
          getConfig(context.root, projectRoot, legacyConfig, getConfigOptions)
        );
        ret.push(
          getConfig(context.root, projectRoot, modernConfig, getConfigOptions)
        );

        return ret;
      }, [])
    );

    if (typeof config === "function") {
      await build(await Promise.resolve(config({})));
    } else {
      await build(config);
    }

    // #endregion Run the build process

    console.log("⚡ The Build process has completed successfully");
    return {
      success: true
    };
  } catch (e) {
    console.error(e);
    return {
      success: false
    };
  }
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
        declaration: true,
        declarationMap: true,
        emitDeclarationOnly: true,
        declarationDir: join(workspaceRoot, "tmp", ".tsup", "declaration")
      }
    },
    ts.sys,
    dirname(options.tsConfig)
  );

  tsConfig.options.pathsBasePath = workspaceRoot;
  if (tsConfig.options.incremental && !tsConfig.options.tsBuildInfoFile) {
    tsConfig.options.tsBuildInfoFile = joinPathFragments(
      outputPath,
      "tsconfig.tsbuildinfo"
    );
  }

  return tsConfig;
}

const build = async (options: Options | Options[]) => {
  Array.isArray(options)
    ? options.length > 0
      ? options[0].silent
      : false
    : options.silent && console.log("⚙️  Tsup build config: \n", options, "\n");

  if (Array.isArray(options)) {
    await Promise.all(options.map(buildOptions => tsup(buildOptions)));
  } else {
    await tsup(options);
  }
};

const isPrimitive = (value: unknown): boolean => {
  try {
    return (
      value === undefined ||
      value === null ||
      (typeof value !== "object" && typeof value !== "function")
    );
  } catch (e) {
    return false;
  }
};

export const applyDefaultOptions = (
  options: TsupExecutorSchema
): TsupExecutorSchema => {
  options.entry ??= "{sourceRoot}/index.ts";
  options.outputPath ??= "dist/{projectRoot}";
  options.tsConfig ??= "tsconfig.json";
  options.generatePackageJson ??= true;
  options.splitting ??= true;
  options.treeshake ??= true;
  options.platform ??= "neutral";
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
  options.emitOnAll ??= true;
  options.define ??= {};
  options.env ??= {};
  options.verbose ??= !!process.env.CI;

  return options;
};

export default withRunExecutor<TsupExecutorSchema>(
  "TypeScript Build using tsup",
  tsupExecutorFn,
  {
    skipReadingConfig: false,
    hooks: {
      applyDefaultOptions
    }
  }
);
