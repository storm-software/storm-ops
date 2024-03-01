import { readFileSync, writeFileSync } from "node:fs";
import { joinPathFragments, readCachedProjectGraph, readJsonFile } from "@nx/devkit";
import type { ExecutorContext, ProjectGraph } from "@nx/devkit";
import { copyAssets } from "@nx/js";
import type { DependentBuildableProjectNode } from "@nx/js/src/utils/buildable-libs-utils.js";
import type { StormConfig } from "@storm-software/config";
import { removeSync, writeFile } from "fs-extra";
import { type Path, globSync } from "glob";
import { fileExists } from "nx/src/utils/fileutils.js";
import { withRunExecutor } from "../../base/base-executor";
import { removeExtension } from "../../utils/file-path-utils";
import { getProjectConfigurations } from "../../utils/get-project-configurations";
import { getExtraDependencies } from "../../utils/get-project-deps";
import { applyDefaultOptions, runTsupBuild } from "../../utils/run-tsup-build";
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
  const {
    LogLevel,
    getLogLevel,
    writeDebug,
    writeInfo,
    writeSuccess,
    writeTrace,
    writeWarning,
    findWorkspaceRoot
  } = await import("@storm-software/config-tools");

  writeInfo(config, "📦  Running Storm build executor on the workspace");

  // #region Apply default options

  writeDebug(
    config,
    `⚙️  Executor options:
${Object.keys(options)
  .map(
    (key) =>
      `${key}: ${
        !options[key] || _isPrimitive(options[key])
          ? options[key]
          : _isFunction(options[key])
            ? "<function>"
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

  const workspaceRoot = findWorkspaceRoot();
  const projectRoot =
    context.projectsConfigurations.projects[context.projectName]?.root ?? workspaceRoot;
  const sourceRoot =
    context.projectsConfigurations.projects[context.projectName]?.sourceRoot ?? workspaceRoot;

  // #endregion Prepare build context variables

  // #region Clean output directory

  if (options.clean !== false) {
    writeInfo(config, `🧹 Cleaning output path: ${options.outputPath}`);
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

  const pathToPackageJson = joinPathFragments(context.root, projectRoot, "package.json");
  const packageJson = fileExists(pathToPackageJson)
    ? readJsonFile(pathToPackageJson)
    : { name: context.projectName, version: "0.0.1" };
  const workspacePackageJson = readJsonFile(joinPathFragments(workspaceRoot, "package.json"));

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
    (ret: DependentBuildableProjectNode[], name: string) => {
      if (!packageJson?.devDependencies?.[name]) {
        const externalNode = context.projectGraph?.externalNodes?.[`npm:${name}`];
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
    context.projectsConfigurations.projects[context.projectName]?.implicitDependencies;
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

        if (projectPackageJson?.name && !options.external?.includes(projectPackageJson.name)) {
          ret.push(projectPackageJson.name);
          internalDependencies.push(projectPackageJson.name);
        }
      }

      return ret;
    }, options.external);
  }

  for (const thirdPartyDependency of getExtraDependencies(
    context.projectName,
    context.projectGraph as ProjectGraph
  )) {
    const packageConfig = thirdPartyDependency?.node?.data as PackageConfiguration;
    if (
      packageConfig?.packageName &&
      config?.externalPackagePatterns?.some((pattern) =>
        packageConfig.packageName.includes(pattern)
      ) &&
      !externalDependencies?.some(
        (externalDependency) => externalDependency.name === packageConfig.packageName
      )
    ) {
      externalDependencies.push(thirdPartyDependency);
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

  // const prettier = await import("prettier");
  // const prettierOptions = {
  //   plugins: ["prettier-plugin-packagejson"],
  //   trailingComma: "none" as "all" | "none" | "es5",
  //   tabWidth: 2,
  //   semi: true,
  //   singleQuote: false,
  //   quoteProps: "preserve" as "preserve" | "as-needed" | "consistent",
  //   insertPragma: false,
  //   bracketSameLine: true,
  //   printWidth: 80,
  //   bracketSpacing: true,
  //   arrowParens: "avoid" as "avoid" | "always",
  //   endOfLine: "lf" as "lf" | "auto" | "crlf" | "cr"
  // };

  let entryPoints: string[] = [];
  if (options.entry) {
    entryPoints.push(options.entry);
  }
  if (options.additionalEntryPoints) {
    entryPoints.push(...options.additionalEntryPoints);
  }

  if (options.emitOnAll === true) {
    entryPoints = globSync(joinPathFragments(sourceRoot, "**/*.{ts,tsx}"), {
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

        if (!ret.includes(propertyKey)) {
          ret.push(joinPathFragments(filePath.path, filePath.name));
        }
      }

      return ret;
    }, entryPoints);
  }

  if (options.generatePackageJson !== false) {
    const projectGraph = readCachedProjectGraph();

    if (options.bundle === false) {
      packageJson.dependencies = undefined;
      for (const externalDependency of externalDependencies) {
        const packageConfig = externalDependency?.node?.data as PackageConfiguration;
        if (
          packageConfig?.packageName &&
          !!(projectGraph.externalNodes?.[externalDependency.node.name]?.type === "npm")
        ) {
          const { packageName, version } = packageConfig;
          if (
            !workspacePackageJson.dependencies?.[packageName] &&
            !workspacePackageJson.devDependencies?.[packageName] &&
            !packageJson?.devDependencies?.[packageName]
          ) {
            packageJson.dependencies ??= {};
            packageJson.dependencies[packageName] = projectGraph.nodes[externalDependency.node.name]
              ? "latest"
              : version;
          }

          if (!options.external.includes(packageName)) {
            options.external.push(packageName);
          }
        }
      }
    }

    for (const packageName of internalDependencies) {
      if (!packageJson?.devDependencies?.[packageName]) {
        packageJson.dependencies ??= {};
        packageJson.dependencies[packageName] = "latest";
      }
    }

    // const distPaths: string[] =
    //   !options?.getConfig || _isFunction(options.getConfig)
    //     ? ["dist/"]
    //     : Object.keys(options.getConfig).map((key) => `${key}/`);

    const distPaths: string[] = ["dist/"];

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
          }
        },
        "./package.json": "./package.json"
      };

      for (const entryPoint of entryPoints) {
        let formattedEntryPoint = removeExtension(entryPoint).replace(sourceRoot, "");
        if (formattedEntryPoint.startsWith(".")) {
          formattedEntryPoint = formattedEntryPoint.substring(1);
        }
        if (formattedEntryPoint.startsWith("/")) {
          formattedEntryPoint = formattedEntryPoint.substring(1);
        }

        packageJson.exports[`./${formattedEntryPoint}`] = {
          import: {
            types: `./${joinPathFragments(distPaths[0] ?? "./", formattedEntryPoint)}.d.ts`,
            default: `./${joinPathFragments(distPaths[0] ?? "./", formattedEntryPoint)}.js`
          },
          require: {
            types: `./${joinPathFragments(distPaths[0] ?? "./", formattedEntryPoint)}.d.cts`,
            default: `./${joinPathFragments(distPaths[0] ?? "./", formattedEntryPoint)}.cjs`
          },
          default: {
            types: `./${joinPathFragments(distPaths[0] ?? "./", formattedEntryPoint)}.d.ts`,
            default: `./${joinPathFragments(distPaths[0] ?? "./", formattedEntryPoint)}.js`
          }
        };
      }

      /*packageJson.exports = Object.keys(entry).reduce((ret: Record<string, any>, key: string) => {
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
      }, packageJson.exports);*/

      packageJson.sideEffects ??= false;
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

      if (options.useJsxModule) {
        packageJson["module:jsx"] &&= `${
          distPaths.length > 1 ? distPaths[1] : distPaths[0]
        }index.jsx`;
      }

      if (options.includeSrc === true) {
        let distSrc = sourceRoot.replace(projectRoot, "");
        if (distSrc.startsWith("/")) {
          distSrc = distSrc.substring(1);
        }

        packageJson.source ??= `${joinPathFragments(distSrc, "index.ts").replaceAll("\\", "/")}`;
      }

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
      : joinPathFragments("packages", context.projectName);

    const packageJsonPath = joinPathFragments(context.root, options.outputPath, "package.json");

    writeDebug(config, `⚡ Writing package.json file to: ${packageJsonPath}`);

    // writeFileSync(
    //   packageJsonPath,
    //   await prettier.format(JSON.stringify(packageJson), {
    //     ...prettierOptions,
    //     parser: "json"
    //   })
    // );

    writeFileSync(packageJsonPath, JSON.stringify(packageJson));
  } else {
    writeWarning(config, "Skipping writing to package.json file");
  }

  // #endregion Generate the package.json file

  if (options.includeSrc === true) {
    const files = globSync([
      joinPathFragments(workspaceRoot, options.outputPath, "src/**/*.ts"),
      joinPathFragments(workspaceRoot, options.outputPath, "src/**/*.tsx"),
      joinPathFragments(workspaceRoot, options.outputPath, "src/**/*.js"),
      joinPathFragments(workspaceRoot, options.outputPath, "src/**/*.jsx")
    ]);
    // await Promise.allSettled(
    //   files.map(async (file) =>
    //     writeFile(
    //       file,
    //       await prettier.format(
    //         `${
    //           options.banner
    //             ? options.banner.startsWith("//")
    //               ? options.banner
    //               : `// ${options.banner}`
    //             : ""
    //         }\n\n${readFileSync(file, "utf-8")}`,
    //         {
    //           ...prettierOptions,
    //           parser: "typescript"
    //         }
    //       ),
    //       "utf-8"
    //     )
    //   )
    // );

    options.verbose = options.verbose || getLogLevel(config?.logLevel) >= LogLevel.DEBUG;
    await Promise.allSettled(
      files.map(async (file) =>
        writeFile(
          file,
          `${
            options.banner
              ? options.banner.startsWith("//")
                ? options.banner
                : `// ${options.banner}`
              : ""
          }\n\n${readFileSync(file, "utf-8")}`,
          "utf-8"
        )
      )
    );
  }

  await Promise.allSettled(
    entryPoints.map((entryPoint: string) =>
      runTsupBuild(
        {
          main: entryPoint,
          projectRoot,
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          projectName: context.projectName!,
          sourceRoot
        },
        config ?? {},
        options
      )
    )
  );

  // #endregion Run the build process

  writeSuccess(config, "⚡ The Build process has completed successfully");

  return {
    success: true
  };
}

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
