import {
  createProjectGraphAsync,
  type ExecutorContext,
  joinPathFragments,
  type ProjectConfiguration,
  ProjectGraphProjectNode,
  readJsonFile,
  readProjectsConfigurationFromProjectGraph,
  writeJsonFile
} from "@nx/devkit";
import { copyAssets } from "@nx/js";
import type { AssetGlob } from "@nx/js/src/utils/assets/assets.js";
import { calculateProjectBuildableDependencies } from "@nx/js/src/utils/buildable-libs-utils";
import type { StormConfig } from "@storm-software/config";
import {
  applyWorkspaceProjectTokens,
  applyWorkspaceTokens,
  findWorkspaceRoot,
  type ProjectTokenizerOptions,
  writeDebug,
  writeInfo,
  writeTrace,
  writeWarning
} from "@storm-software/config-tools";
import { removeSync } from "fs-extra";
import { globSync } from "glob";
import { existsSync, readFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { readNxJson } from "nx/src/config/nx-json.js";
import {
  createProjectRootMappings,
  findProjectForPath
} from "nx/src/project-graph/utils/find-project-for-path.js";
import { PackageJson } from "nx/src/utils/package-json";
import { build } from "unbuild";
import { getUnbuildBuildOptions } from "../config/get-unbuild-config";
import type { UnbuildBuildOptions } from "../types";
import { applyDefaultUnbuildOptions } from "../utils/apply-default-options";
import {
  addPackageJsonExports,
  addWorkspacePackageJsonFields
} from "../utils/generate-package-json";

/**
 * Build and bundle a TypeScript project using the tsup build tools.
 *
 * @remarks
 * This function is a wrapper around the `buildWithOptions` function that provides a default set of options.
 *
 * @param config - The storm configuration.
 * @param options - A build options partial. The minimum required options are `projectRoot` or `projectName`.
 */
export async function unbuild(
  config: StormConfig,
  options: Partial<UnbuildBuildOptions> = {}
) {
  let projectRoot = options?.projectRoot as string;
  let projectName = options?.projectName as string;

  if (!projectRoot && !projectName) {
    throw new Error(
      "The Build process failed because both the `projectRoot` and the `projectName` options were not provided"
    );
  }

  const projectGraph = await createProjectGraphAsync({
    exitOnError: true
  });

  const projectsConfigurations =
    readProjectsConfigurationFromProjectGraph(projectGraph);
  const projectRootMap = createProjectRootMappings(projectGraph.nodes);

  let projectConfiguration!: ProjectConfiguration;
  if (projectRoot) {
    projectName = findProjectForPath(projectRoot, projectRootMap) as string;
    if (!projectName || typeof projectName !== "string") {
      throw new Error(
        `The Build process failed because the project does not have a valid name in the project.json file. Check if the file exists in the root of the project at ${joinPathFragments(
          projectRoot,
          "project.json"
        )}`
      );
    }

    projectConfiguration = projectsConfigurations?.projects?.[
      projectName
    ] as ProjectConfiguration;
    if (!projectConfiguration) {
      throw new Error(
        "The Build process failed because the project does not have a valid configuration in the project.json file. Check if the file exists in the root of the project."
      );
    }
  } else if (projectName) {
    projectConfiguration = projectsConfigurations?.projects?.[
      projectName
    ] as ProjectConfiguration;
    if (!projectConfiguration) {
      throw new Error(
        "The Build process failed because the project does not have a valid configuration in the project.json file. Check if the file exists in the root of the project."
      );
    }

    projectRoot = projectConfiguration.root;
  }

  await unbuildWithOptions(
    config,
    applyDefaultUnbuildOptions(
      {
        projectRoot,
        projectName,
        sourceRoot: projectConfiguration.sourceRoot!,
        ...options
      },
      config
    )
  );
}

/**
 * Build and bundle a TypeScript project using the tsup build tools.
 *
 * @param config - The storm configuration.
 * @param options - The build options.
 */
export async function unbuildWithOptions(
  config: StormConfig,
  options: UnbuildBuildOptions
) {
  const workspaceRoot = config.workspaceRoot
    ? config.workspaceRoot
    : findWorkspaceRoot();

  const projectRoot = options.projectRoot;
  const projectName = options.projectName;
  const sourceRoot = options.sourceRoot;

  const enhancedOptions = (await applyWorkspaceTokens<ProjectTokenizerOptions>(
    options,
    { projectRoot, projectName, sourceRoot, config },
    applyWorkspaceProjectTokens
  )) as UnbuildBuildOptions;

  // #region Clean output directory

  if (enhancedOptions.clean !== false && enhancedOptions.outputPath) {
    writeInfo(`🧹 Cleaning output path: ${enhancedOptions.outputPath}`, config);
    removeSync(enhancedOptions.outputPath);
  }

  // #endregion Clean output directory

  // #region Copy asset files to output directory

  writeDebug(
    `📦  Copying asset files to output directory: ${enhancedOptions.outputPath}`,
    config
  );

  const assets = Array.from(options.assets ?? []);
  if (
    !enhancedOptions.assets?.some((asset: AssetGlob) => asset?.glob === "*.md")
  ) {
    assets.push({
      input: projectRoot,
      glob: "*.md",
      output: "/"
    });
  }

  if (enhancedOptions.generatePackageJson === false) {
    assets.push({
      input: sourceRoot,
      glob: "package.json",
      output: "."
    });
  }

  if (
    !enhancedOptions.assets?.some(
      (asset: AssetGlob) => asset?.glob === "LICENSE"
    )
  ) {
    assets.push({
      input: "",
      glob: "LICENSE",
      output: "."
    });
  }

  if (enhancedOptions.includeSrc === true) {
    assets.push({
      input: sourceRoot,
      glob: "**/{*.ts,*.tsx,*.js,*.jsx}",
      output: "src/"
    });
  }

  // await retrieveProjectConfigurationsWithoutPluginInference(workspaceRoot);

  const nxJson = readNxJson(workspaceRoot);
  const projectGraph = await createProjectGraphAsync({
    exitOnError: true
  });

  const projectsConfigurations =
    readProjectsConfigurationFromProjectGraph(projectGraph);
  if (!projectsConfigurations?.projects?.[projectName]) {
    throw new Error(
      "The Build process failed because the project does not have a valid configuration in the project.json file. Check if the file exists in the root of the project."
    );
  }

  const buildTarget =
    projectsConfigurations.projects[projectName]?.targets?.build;
  if (!buildTarget) {
    throw new Error(
      `The Build process failed because the project does not have a valid build target in the project.json file. Check if the file exists in the root of the project at ${joinPathFragments(
        projectRoot,
        "project.json"
      )}`
    );
  }

  const result = await copyAssets(
    {
      assets,
      watch: enhancedOptions.watch,
      outputPath: enhancedOptions.outputPath
    },
    {
      root: workspaceRoot,
      targetName: "build",
      target: buildTarget,
      ...enhancedOptions,
      projectName,
      projectGraph,
      projectsConfigurations,
      nxJsonConfiguration: nxJson,
      cwd: workspaceRoot,
      isVerbose: true
    } as ExecutorContext
  );
  if (!result.success) {
    throw new Error("The Build process failed trying to copy assets");
  }

  // #endregion Copy asset files to output directory

  if (options.includeSrc === true) {
    writeDebug(
      `📝  Adding banner and writing source files: ${joinPathFragments(
        enhancedOptions.outputPath,
        "src"
      )}`,
      config
    );

    const files = globSync([
      joinPathFragments(
        workspaceRoot,
        enhancedOptions.outputPath,
        "src/**/*.ts"
      ),
      joinPathFragments(
        workspaceRoot,
        enhancedOptions.outputPath,
        "src/**/*.tsx"
      ),
      joinPathFragments(
        workspaceRoot,
        enhancedOptions.outputPath,
        "src/**/*.js"
      ),
      joinPathFragments(
        workspaceRoot,
        enhancedOptions.outputPath,
        "src/**/*.jsx"
      )
    ]);

    await Promise.allSettled(
      files.map(file =>
        writeFile(
          file,
          `${
            enhancedOptions.banner && typeof enhancedOptions.banner === "string"
              ? enhancedOptions.banner.startsWith("//")
                ? enhancedOptions.banner
                : `// ${enhancedOptions.banner}`
              : ""
          }\n\n${readFileSync(file, "utf8")}\n\n${
            enhancedOptions.footer && typeof enhancedOptions.footer === "string"
              ? enhancedOptions.footer.startsWith("//")
                ? enhancedOptions.footer
                : `// ${enhancedOptions.footer}`
              : ""
          }`
        )
      )
    );
  }

  const packageJson = readJsonFile(
    joinPathFragments(
      workspaceRoot,
      enhancedOptions.projectRoot,
      "package.json"
    )
  );

  // const npmDeps = (projectGraph.dependencies[projectName] ?? [])
  //   .filter(d => d.target.startsWith("npm:"))
  //   .map(d => d.target.slice(4));

  writeDebug("🔍  Detecting the configuration for the build process", config);

  const unbuildBuildOptions = await getUnbuildBuildOptions(
    config,
    enhancedOptions,
    packageJson,
    projectGraph
  );
  if (unbuildBuildOptions.length === 0) {
    writeWarning(
      "🚫 The Build process failed because no entry points were found for the build process",
      config
    );

    return;
  }

  // #region Run the build process

  writeDebug("⚡  Running the build process for each entry point", config);

  writeTrace(
    `⚙️  Build options:
${unbuildBuildOptions
  .map(unbuildBuildOption =>
    Object.keys(unbuildBuildOption)
      .map(
        key =>
          `${key}: ${
            !unbuildBuildOption[key] || _isPrimitive(unbuildBuildOption[key])
              ? unbuildBuildOption[key]
              : _isFunction(unbuildBuildOption[key])
                ? "<function>"
                : JSON.stringify(unbuildBuildOption[key])
          }`
      )
      .join("\n")
  )
  .join("\n-----------\n")}
`,
    config
  );

  const start = process.hrtime.bigint();

  try {
    await Promise.allSettled(
      unbuildBuildOptions.map(opts => {
        writeInfo(`📦  Building ${opts.name}...`, config);

        return build(enhancedOptions.projectRoot, false, opts);
      })
    );

    if (
      enhancedOptions.generatePackageJson !== false &&
      existsSync(joinPathFragments(projectRoot, "package.json"))
    ) {
      writeDebug("✍️   Writing package.json file", config);

      let outputPackageJson = readJsonFile(
        joinPathFragments(
          workspaceRoot,
          enhancedOptions.projectRoot,
          "package.json"
        )
      );

      const projectDependencies = calculateProjectBuildableDependencies(
        undefined,
        projectGraph,
        config.workspaceRoot,
        options.projectName,
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
        .reduce((ret, project) => {
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
                ret.push(projectPackageJson as PackageJson);
              }
            }
          }

          return ret;
        }, [] as PackageJson[]);

      writeTrace(
        `📦  Adding local packages to package.json: ${localPackages.map(p => p.name).join(", ")}`,
        config
      );

      outputPackageJson.peerDependencies = localPackages.reduce(
        (ret, localPackage) => {
          if (!ret[localPackage.name]) {
            ret[localPackage.name] = `>=${localPackage.version || "0.0.1"}`;
          }

          return ret;
        },
        outputPackageJson.peerDependencies ?? {}
      );
      outputPackageJson.peerDependenciesMeta = localPackages.reduce(
        (ret, localPackage) => {
          if (!ret[localPackage.name]) {
            ret[localPackage.name] = {
              optional: false
            };
          }

          return ret;
        },
        outputPackageJson.peerDependenciesMeta ?? {}
      );
      outputPackageJson.devDependencies = localPackages.reduce(
        (ret, localPackage) => {
          if (!ret[localPackage.name]) {
            ret[localPackage.name] = localPackage.version || "0.0.1";
          }

          return ret;
        },
        outputPackageJson.peerDependencies ?? {}
      );

      outputPackageJson = addWorkspacePackageJsonFields(
        config,
        projectRoot,
        sourceRoot,
        projectName,
        options.includeSrc,
        outputPackageJson
      );
      outputPackageJson = await addPackageJsonExports(
        sourceRoot,
        outputPackageJson
      );

      outputPackageJson.main = "./dist/index.cjs";
      outputPackageJson.module = "./dist/index.mjs";
      outputPackageJson.types = "./dist/index.d.ts";

      outputPackageJson.exports ??= {};
      outputPackageJson.exports = Object.keys(outputPackageJson.exports).reduce(
        (ret, key) => {
          if (key.endsWith("/index") && !ret[key.replace("/index", "")]) {
            ret[key.replace("/index", "")] = outputPackageJson.exports[key];
          }

          return ret;
        },
        outputPackageJson.exports
      );

      outputPackageJson.exports["."] = outputPackageJson.exports["."] ?? {
        "import": "./dist/index.mjs",
        "require": "./dist/index.cjs",
        "types": "./dist/index.d.ts"
      };

      await writeJsonFile(
        joinPathFragments(enhancedOptions.outputPath, "package.json"),
        outputPackageJson
      );
    }
  } catch (e) {
    writeWarning(
      `🚫  The Build process failed because an error occurred: ${e.message}`,
      config
    );
    return;
  }

  writeInfo(
    `🚀  Build process for ${enhancedOptions.projectName} completed in ${(Number(process.hrtime.bigint() - start) / 1_000_000_000).toFixed(2)}s`,
    config
  );

  // #endregion Run the build process
}

export default unbuild;

const _isPrimitive = (value: unknown): boolean => {
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

const _isFunction = (
  value: unknown
): value is ((params?: unknown) => unknown) & ((param?: any) => any) => {
  try {
    return (
      value instanceof Function ||
      typeof value === "function" ||
      !!(value?.constructor && (value as any)?.call && (value as any)?.apply)
    );
  } catch (e) {
    return false;
  }
};
