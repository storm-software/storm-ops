import {
  createProjectGraphAsync,
  joinPathFragments,
  type ExecutorContext,
  type ProjectConfiguration
} from "@nx/devkit";
import { copyAssets } from "@nx/js";
import type { StormConfig } from "@storm-software/config";
import {
  applyWorkspaceProjectTokens,
  applyWorkspaceTokens,
  findWorkspaceRoot,
  writeDebug,
  writeInfo,
  writeTrace,
  type ProjectTokenizerOptions
} from "@storm-software/config-tools";
import { removeSync } from "fs-extra";
import { globSync } from "glob";
import { readFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { readNxJson } from "nx/src/config/nx-json.js";
import { readProjectsConfigurationFromProjectGraph } from "nx/src/project-graph/project-graph.js";
import {
  createProjectRootMappings,
  findProjectForPath
} from "nx/src/project-graph/utils/find-project-for-path.js";
import { writeJsonFile } from "nx/src/utils/fileutils.js";
import type { AssetGlob, TypeScriptBuildOptions } from "../../declarations";
import {
  applyDefaultOptions,
  generatePackageJson,
  runTsupBuild
} from "../utils";
import { getEntryPoints } from "../utils/get-entry-points";

/**
 * Build and bundle a TypeScript project using the tsup build tools.
 *
 * @remarks
 * This function is a wrapper around the `buildWithOptions` function that provides a default set of options.
 *
 * @param config - The storm configuration.
 * @param options - A build options partial. The minimum required options are `projectRoot` or `projectName`.
 */
export async function build(
  config: StormConfig,
  options: Partial<TypeScriptBuildOptions> = {}
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

  await buildWithOptions(
    config,
    applyDefaultOptions(
      {
        projectRoot,
        projectName,
        sourceRoot: projectConfiguration.sourceRoot,
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
export async function buildWithOptions(
  config: StormConfig,
  options: TypeScriptBuildOptions
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
  )) as TypeScriptBuildOptions;

  // #region Clean output directory

  if (enhancedOptions.clean !== false) {
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

  if (enhancedOptions.generatePackageJson === false) {
    assets.push({
      input: projectRoot,
      glob: "**/package.json",
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

    await Promise.allSettled(
      files.map(file =>
        writeFile(
          file,
          `${
            enhancedOptions.banner
              ? enhancedOptions.banner.startsWith("//")
                ? enhancedOptions.banner
                : `// ${enhancedOptions.banner}`
              : ""
          }\n\n${readFileSync(file, "utf-8")}`,
          "utf-8"
        )
      )
    );
  }

  writeDebug("🎁  Generating package.json file", config);
  const packageJson = await generatePackageJson(
    config,
    projectRoot,
    sourceRoot,
    projectName,
    enhancedOptions
  );

  if (enhancedOptions.generatePackageJson !== false) {
    writeDebug("✍️   Writing package.json file", config);
    await writeJsonFile(
      joinPathFragments(
        workspaceRoot,
        enhancedOptions.outputPath,
        "package.json"
      ),
      packageJson
    );

    enhancedOptions.external ??= [];
    for (const packageName of Object.keys(packageJson.dependencies ?? {})) {
      if (!enhancedOptions.external.includes(packageName)) {
        enhancedOptions.external.push(packageName);
      }
    }
  }

  writeDebug("🔍  Detecting entry points for the build process", config);
  const entryPoints = getEntryPoints(
    config,
    projectRoot,
    sourceRoot,
    enhancedOptions
  );

  writeTrace(
    `Found entry points: \n${entryPoints.map(entryPoint => `- ${entryPoint}`).join(" \n")}`,
    config
  );

  // #region Run the build process

  writeDebug("⚡  Running the build process for each entry point", config);
  await Promise.allSettled(
    entryPoints.map((entryPoint: string) =>
      runTsupBuild(
        {
          main: entryPoint,
          projectRoot,
          projectName,
          sourceRoot
        },
        config,
        enhancedOptions
      )
    )
  );

  // #endregion Run the build process
}

export default build;
