import type { TypeScriptBuildOptions } from "../../declarations";
import { writeFileSync } from "node:fs";
import { joinPathFragments, readJsonFile } from "@nx/devkit";
import type { ProjectGraph } from "@nx/devkit";
import { retrieveProjectConfigurationsWithoutPluginInference } from "nx/src/project-graph/utils/retrieve-workspace-files";
import type { DependentBuildableProjectNode } from "@nx/js/src/utils/buildable-libs-utils.js";
import type { StormConfig } from "@storm-software/config";
import { fileExists } from "nx/src/utils/fileutils.js";
import { removeExtension } from "@storm-software/config-tools";
import { getExtraDependencies, getInternalDependencies } from "./get-project-deps";
import {
  findWorkspaceRoot,
  LogLevel,
  getLogLevel,
  writeDebug,
  writeTrace,
  writeWarning
} from "@storm-software/config-tools";
import { getEntryPoints } from "./get-entry-points";
import { readCachedProjectGraph } from "nx/src/project-graph/project-graph";

type DependencyNodeData = {
  version: string;
  packageName: string;
  hash?: string | undefined;
};

export const generatePackageJson = async (
  config: StormConfig,
  projectRoot: string,
  sourceRoot: string,
  projectName: string,
  options: TypeScriptBuildOptions
): Promise<Record<string, any>> => {
  // #region Generate the package.json file

  const workspaceRoot = config.workspaceRoot ? config.workspaceRoot : findWorkspaceRoot();
  const workspacePackageJson = readJsonFile(joinPathFragments(workspaceRoot, "package.json"));
  const pathToPackageJson = joinPathFragments(workspaceRoot, projectRoot, "package.json");

  // let projectName = projectRoot.replace(config.packageDirectory ?? "", "");
  // if (projectName.startsWith("/")) {
  //   projectName = projectName.substring(1);
  // }
  // if (projectName.endsWith("/")) {
  //   projectName = projectName.substring(-1);
  // }

  const packageJson: Record<string, any> | undefined = fileExists(pathToPackageJson)
    ? readJsonFile(pathToPackageJson)
    : {
        name: `@${config.namespace}/${projectName}`,
        version: "0.0.1"
      };

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

  const projectGraph = readCachedProjectGraph();
  if (!projectGraph) {
    throw new Error("No project graph found in cache");
  }

  const projectsConfigurations =
    await retrieveProjectConfigurationsWithoutPluginInference(workspaceRoot);
  if (getLogLevel(config?.logLevel) >= LogLevel.TRACE) {
    writeDebug(config, "Project Configs:");
    console.log(projectsConfigurations);
  }
  if (!projectsConfigurations) {
    throw new Error("No project configurations found");
  }

  const externalDependencies: DependentBuildableProjectNode[] = options.external.reduce(
    (ret: DependentBuildableProjectNode[], name: string) => {
      if (!packageJson?.devDependencies?.[name]) {
        const externalNode = projectGraph?.externalNodes?.[`npm:${name}`];
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

  const implicitDependencies = projectsConfigurations.projects?.[projectName]?.implicitDependencies;
  const internalDependencies: string[] = [];

  if (implicitDependencies && implicitDependencies.length > 0) {
    options.external = implicitDependencies.reduce((ret: string[], key: string) => {
      writeDebug(config, `⚡ Adding implicit dependency: ${key}`);

      const projectConfig = projectsConfigurations[key];
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

  for (const internalDependency of getInternalDependencies(
    projectName,
    projectGraph as ProjectGraph
  )) {
    if (
      internalDependency?.name &&
      config?.externalPackagePatterns?.some((pattern) =>
        internalDependency.name.includes(pattern)
      ) &&
      !externalDependencies?.some(
        (externalDependency) => externalDependency.name === internalDependency.name
      )
    ) {
      externalDependencies.push({
        name: internalDependency.name,
        outputs: [],
        node: internalDependency
      });
    }
  }

  for (const thirdPartyDependency of getExtraDependencies(
    projectName,
    projectGraph as ProjectGraph
  )) {
    const packageConfig = thirdPartyDependency?.node?.data as DependencyNodeData;
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

  if (options.generatePackageJson !== false) {
    if (options.bundle === false) {
      packageJson.dependencies = undefined;
      for (const externalDependency of externalDependencies) {
        const packageConfig = externalDependency?.node?.data as DependencyNodeData;
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
        }
      }
    }

    for (const packageName of internalDependencies) {
      packageJson.dependencies ??= {};
      if (!packageJson.dependencies[packageName]) {
        packageJson.dependencies[packageName] = "latest";
      }
    }

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

      const entryPoints = getEntryPoints(config, projectRoot, sourceRoot, options);
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
      // packageJson.typings ??= `${distPaths.length > 1 ? distPaths[1] : distPaths[0]}index.d.ts`;
      /*packageJson.typescript ??= {
        definition: `${distPaths.length > 1 ? distPaths[1] : distPaths[0]}index.d.ts`
      };*/

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
      : joinPathFragments("packages", projectName);

    const packageJsonPath = joinPathFragments(workspaceRoot, options.outputPath, "package.json");

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

  return packageJson;
};
