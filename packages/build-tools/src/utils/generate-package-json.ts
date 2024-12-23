import type {
  ProjectConfiguration,
  ProjectGraph,
  ProjectGraphProjectNode
} from "@nx/devkit";
import { joinPathFragments, readJsonFile } from "@nx/devkit";
import {
  calculateProjectBuildableDependencies,
  type DependentBuildableProjectNode
} from "@nx/js/src/utils/buildable-libs-utils.js";
import {
  getHelperDependency,
  HelperDependency
} from "@nx/js/src/utils/compiler-helper-dependency.js";
import type { StormConfig } from "@storm-software/config";
import {
  findWorkspaceRoot,
  getLogLevel,
  LogLevel,
  removeExtension,
  writeDebug,
  writeTrace,
  writeWarning
} from "@storm-software/config-tools";
import { exists } from "fs-extra";
import { Glob } from "glob";
import { existsSync, writeFileSync } from "node:fs";
import {
  createProjectGraphAsync,
  readProjectsConfigurationFromProjectGraph
} from "nx/src/project-graph/project-graph.js";
import { retrieveProjectConfigurationsWithoutPluginInference } from "nx/src/project-graph/utils/retrieve-workspace-files.js";
import { fileExists } from "nx/src/utils/fileutils.js";
import type { TypeScriptBuildOptions } from "../../declarations";
import { getEntryPoints } from "./get-entry-points";
import {
  getExtraDependencies,
  getInternalDependencies
} from "./get-project-deps";

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

  const workspaceRoot = config.workspaceRoot
    ? config.workspaceRoot
    : findWorkspaceRoot();
  const pathToPackageJson = joinPathFragments(
    workspaceRoot,
    projectRoot,
    "package.json"
  );

  let packageJson: Record<string, any> | undefined = fileExists(
    pathToPackageJson
  )
    ? readJsonFile(pathToPackageJson)
    : {
        name: `@${config.namespace}/${projectName}`,
        version: "0.0.1"
      };

  if (options.generatePackageJson !== false) {
    options.external = options.external || [];

    const projectGraph = await createProjectGraphAsync({
      exitOnError: true
    });
    if (!projectGraph) {
      throw new Error("No project graph found in cache");
    }

    const projectsConfigurations =
      await retrieveProjectConfigurationsWithoutPluginInference(workspaceRoot);
    if (getLogLevel(config?.logLevel) >= LogLevel.TRACE) {
      writeDebug("Project Configs:", config);
      console.log(projectsConfigurations);
    }
    if (!projectsConfigurations) {
      throw new Error("No project configurations found");
    }

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

    packageJson = await formatPackageJson(
      config,
      projectRoot,
      sourceRoot,
      projectName,
      options,
      packageJson,
      projectGraph,
      projectsConfigurations
    );

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

      const entryPoints = getEntryPoints(
        config,
        projectRoot,
        sourceRoot,
        options
      );
      for (const entryPoint of entryPoints) {
        let formattedEntryPoint = removeExtension(entryPoint).replace(
          sourceRoot,
          ""
        );
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

    const packageJsonPath = joinPathFragments(
      workspaceRoot,
      options.outputPath,
      "package.json"
    );

    writeDebug(`⚡ Writing package.json file to: ${packageJsonPath}`, config);

    // writeFileSync(
    //   packageJsonPath,
    //   await prettier.format(JSON.stringify(packageJson), {
    //     ...prettierOptions,
    //     parser: "json"
    //   })
    // );

    writeFileSync(packageJsonPath, JSON.stringify(packageJson));
  } else {
    writeWarning("Skipping writing to package.json file", config);
  }

  // #endregion Generate the package.json file

  return packageJson;
};

export const formatPackageJson = async (
  config: StormConfig,
  projectRoot: string,
  sourceRoot: string,
  projectName: string,
  options: Pick<
    TypeScriptBuildOptions,
    "tsConfig" | "external" | "generatePackageJson" | "bundle" | "includeSrc"
  >,
  packageJson: Record<string, any>,
  projectGraph: ProjectGraph,
  projectsConfigurations: Record<string, ProjectConfiguration>
): Promise<Record<string, any>> => {
  // #region Generate the package.json file

  const externalDependencies: DependentBuildableProjectNode[] =
    options.external?.reduce(
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
    ) ?? [];

  const tsLibDependency = getHelperDependency(
    HelperDependency.tsc,
    options.tsConfig,
    externalDependencies,
    projectGraph,
    true
  );

  if (tsLibDependency) {
    externalDependencies.push(tsLibDependency);
  }

  const implicitDependencies =
    projectsConfigurations.projects?.[projectName]?.implicitDependencies;
  const internalDependencies: string[] = [];

  if (implicitDependencies && implicitDependencies.length > 0) {
    options.external = implicitDependencies.reduce(
      (ret: string[], key: string) => {
        writeDebug(`⚡ Adding implicit dependency: ${key}`, config);

        const projectConfig = projectsConfigurations[key];
        if (projectConfig?.targets?.build) {
          const projectPackageJson = readJsonFile(
            projectConfig.targets?.build.options.project
          );

          if (
            projectPackageJson?.name &&
            !options.external?.includes(projectPackageJson.name)
          ) {
            ret.push(projectPackageJson.name);
            internalDependencies.push(projectPackageJson.name);
          }
        }

        return ret;
      },
      options.external
    );
  }

  for (const internalDependency of getInternalDependencies(
    projectName,
    projectGraph as ProjectGraph
  )) {
    if (
      internalDependency?.name &&
      config?.externalPackagePatterns?.some(pattern =>
        internalDependency.name.includes(pattern)
      ) &&
      !externalDependencies?.some(
        externalDependency =>
          externalDependency.name === internalDependency.name
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
    const packageConfig = thirdPartyDependency?.node
      ?.data as DependencyNodeData;
    if (
      packageConfig?.packageName &&
      config?.externalPackagePatterns?.some(pattern =>
        packageConfig.packageName.includes(pattern)
      ) &&
      !externalDependencies?.some(
        externalDependency =>
          externalDependency.name === packageConfig.packageName
      )
    ) {
      externalDependencies.push(thirdPartyDependency);
    }
  }

  writeTrace(
    `Building with the following dependencies marked as external:
  ${externalDependencies
    .map(dep => {
      return `name: ${dep.name}, node: ${dep.node}, outputs: ${dep.outputs}`;
    })
    .join("\n")}`,
    config
  );

  if (options.generatePackageJson !== false) {
    if (options.bundle === false) {
      packageJson.dependencies = undefined;
      for (const externalDependency of externalDependencies) {
        const packageConfig = externalDependency?.node
          ?.data as DependencyNodeData;
        if (
          packageConfig?.packageName &&
          !!(
            projectGraph.externalNodes?.[externalDependency.node.name]?.type ===
            "npm"
          )
        ) {
          const { packageName, version } = packageConfig;
          if (!packageJson?.devDependencies?.[packageName]) {
            packageJson.dependencies ??= {};
            packageJson.dependencies[packageName] = projectGraph.nodes[
              externalDependency.node.name
            ]
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
  }

  return addWorkspacePackageJsonFields(
    config,
    projectRoot,
    sourceRoot,
    projectName,
    options.includeSrc,
    packageJson
  );
};

export const addPackageDependencies = async (
  workspaceRoot: string,
  projectRoot: string,
  projectName: string,
  packageJson: Record<string, any>
): Promise<Record<string, any>> => {
  const projectGraph = await createProjectGraphAsync({
    exitOnError: true
  });

  const projectConfigurations =
    readProjectsConfigurationFromProjectGraph(projectGraph);
  if (!projectConfigurations?.projects?.[projectName]) {
    throw new Error(
      "The Build process failed because the project does not have a valid configuration in the project.json file. Check if the file exists in the root of the project."
    );
  }

  const nxJsonPath = joinPathFragments(workspaceRoot, "nx.json");
  if (!(await exists(nxJsonPath))) {
    throw new Error("Cannot find Nx workspace configuration");
  }

  const projectJsonPath = joinPathFragments(
    workspaceRoot,
    projectRoot,
    "project.json"
  );
  if (!(await exists(projectJsonPath))) {
    throw new Error("Cannot find project.json configuration");
  }

  if (!projectConfigurations?.projects?.[projectName]) {
    throw new Error(
      "The Build process failed because the project does not have a valid configuration in the project.json file. Check if the file exists in the root of the project."
    );
  }

  const projectDependencies = calculateProjectBuildableDependencies(
    undefined,
    projectGraph,
    workspaceRoot,
    projectName,
    process.env.NX_TASK_TARGET_TARGET || "build",
    process.env.NX_TASK_TARGET_CONFIGURATION || "production",
    true
  );

  const localPackages = projectDependencies.dependencies
    .filter(
      dep =>
        dep.node.type === "lib" &&
        dep.node.data.root !== projectRoot &&
        dep.node.data.root !== workspaceRoot
    )
    .reduce(
      (ret, project) => {
        const projectNode = project.node as ProjectGraphProjectNode;

        if (projectNode.data.root) {
          const projectPackageJsonPath = joinPathFragments(
            workspaceRoot,
            projectNode.data.root,
            "package.json"
          );
          if (existsSync(projectPackageJsonPath)) {
            const projectPackageJson = readJsonFile(projectPackageJsonPath);

            if (projectPackageJson.private !== false) {
              ret.push(projectPackageJson);
            }
          }
        }

        return ret;
      },
      [] as Record<string, any>[]
    );

  if (localPackages.length > 0) {
    writeTrace(
      `📦  Adding local packages to package.json: ${localPackages.map(p => p.name).join(", ")}`
    );

    packageJson.peerDependencies = localPackages.reduce((ret, localPackage) => {
      if (!ret[localPackage.name]) {
        ret[localPackage.name] = `>=${localPackage.version || "0.0.1"}`;
      }

      return ret;
    }, packageJson.peerDependencies ?? {});
    packageJson.peerDependenciesMeta = localPackages.reduce(
      (ret, localPackage) => {
        if (!ret[localPackage.name]) {
          ret[localPackage.name] = {
            optional: false
          };
        }

        return ret;
      },
      packageJson.peerDependenciesMeta ?? {}
    );
    packageJson.devDependencies = localPackages.reduce((ret, localPackage) => {
      if (!ret[localPackage.name]) {
        ret[localPackage.name] = localPackage.version || "0.0.1";
      }

      return ret;
    }, packageJson.peerDependencies ?? {});
  } else {
    writeTrace("📦  No local packages dependencies to add to package.json");
  }

  return packageJson;
};

export const addWorkspacePackageJsonFields = (
  config: StormConfig,
  projectRoot: string,
  sourceRoot: string,
  projectName: string,
  includeSrc = false,
  packageJson: Record<string, any>
): Record<string, any> => {
  const workspaceRoot = config.workspaceRoot
    ? config.workspaceRoot
    : findWorkspaceRoot();
  const workspacePackageJson = readJsonFile<Record<string, any>>(
    joinPathFragments(workspaceRoot, "package.json")
  );

  packageJson.type ??= "module";
  packageJson.sideEffects ??= false;

  if (includeSrc === true) {
    let distSrc = sourceRoot.replace(projectRoot, "");
    if (distSrc.startsWith("/")) {
      distSrc = distSrc.substring(1);
    }

    packageJson.source ??= `${joinPathFragments(distSrc, "index.ts").replaceAll("\\", "/")}`;
  }

  packageJson.files ??= ["dist/**/*"];
  if (includeSrc === true && !packageJson.files.includes("src")) {
    packageJson.files.push("src/**/*");
  }

  packageJson.publishConfig ??= {
    access: "public"
  };

  packageJson.description ??= workspacePackageJson.description;
  packageJson.homepage ??= workspacePackageJson.homepage;
  packageJson.bugs ??= workspacePackageJson.bugs;
  packageJson.license ??= workspacePackageJson.license;
  packageJson.keywords ??= workspacePackageJson.keywords;
  packageJson.funding ??= workspacePackageJson.funding;
  packageJson.author ??= workspacePackageJson.author;

  packageJson.maintainers ??= workspacePackageJson.maintainers;
  if (!packageJson.maintainers && packageJson.author) {
    packageJson.maintainers = [packageJson.author];
  }

  packageJson.contributors ??= workspacePackageJson.contributors;
  if (!packageJson.contributors && packageJson.author) {
    packageJson.contributors = [packageJson.author];
  }

  packageJson.repository ??= workspacePackageJson.repository;
  packageJson.repository.directory ??= projectRoot
    ? projectRoot
    : joinPathFragments("packages", projectName);

  return packageJson;
};

export const addPackageJsonExport = (
  file: string,
  sourceRoot?: string
): Record<string, any> => {
  let entry = file.replaceAll("\\", "/");
  if (sourceRoot) {
    entry = entry.replace(sourceRoot, "");
  }

  return {
    "import": {
      "types": `./dist/${entry}.d.ts`,
      "default": `./dist/${entry}.js`
    },
    "require": {
      "types": `./dist/${entry}.d.cts`,
      "default": `./dist/${entry}.cjs`
    },
    "default": {
      "types": `./dist/${entry}.d.ts`,
      "default": `./dist/${entry}.js`
    }
  };
};

export const addPackageJsonExports = async (
  sourceRoot: string,
  packageJson: Record<string, any>
): Promise<Record<string, any>> => {
  packageJson.exports ??= {};

  const files = await new Glob("**/*.{ts,tsx}", {
    absolute: false,
    cwd: sourceRoot,
    root: sourceRoot
  }).walk();
  files.forEach(file => {
    addPackageJsonExport(file, sourceRoot);

    const split = file.split(".");
    split.pop();
    const entry = split.join(".").replaceAll("\\", "/");

    packageJson.exports[`./${entry}`] ??= addPackageJsonExport(
      entry,
      sourceRoot
    );
  });

  packageJson.main = "./dist/index.cjs";
  packageJson.module = "./dist/index.js";
  packageJson.types = "./dist/index.d.ts";

  packageJson.exports ??= {};
  packageJson.exports = Object.keys(packageJson.exports).reduce((ret, key) => {
    if (key.endsWith("/index") && !ret[key.replace("/index", "")]) {
      ret[key.replace("/index", "")] = packageJson.exports[key];
    }

    return ret;
  }, packageJson.exports);

  packageJson.exports["./package.json"] ??= "./package.json";
  packageJson.exports["."] =
    packageJson.exports["."] ?? addPackageJsonExport("index");

  return packageJson;
};
