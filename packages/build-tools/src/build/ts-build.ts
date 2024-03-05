import type { AssetGlob, TypeScriptBuildOptions } from "../../declarations";
import { applyDefaultOptions, generatePackageJson, runTsupBuild } from "../utils";
import {
  applyWorkspaceProjectTokens,
  applyWorkspaceTokens,
  writeInfo,
  type ProjectTokenizerOptions,
  findWorkspaceRoot,
  writeDebug
} from "@storm-software/config-tools";
import type { StormConfig } from "@storm-software/config";
import { removeSync } from "fs-extra";
import { copyAssets } from "@nx/js";
import { joinPathFragments, createProjectGraphAsync, type ExecutorContext } from "@nx/devkit";
import { fileExists, writeJsonFile } from "nx/src/utils/fileutils";
import { globSync } from "glob";
import { writeFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { getEntryPoints } from "../utils/get-entry-points";
import { readProjectsConfigurationFromProjectGraph } from "nx/src/project-graph/project-graph";
import { readNxJson } from "nx/src/config/nx-json";
import {
  createProjectRootMappings,
  findProjectForPath
} from "nx/src/project-graph/utils/find-project-for-path";
import { registerPluginTSTranspiler } from "nx/src/utils/nx-plugin";

/**
 * Build the TypeScript project using the tsup build tools.
 *
 * @param config - The storm configuration.
 * @param projectRoot - The project root.
 * @param sourceRoot - The source root.
 * @param options - The build options.
 */
export async function tsBuild(
  config: StormConfig,
  projectRoot: string,
  sourceRoot?: string,
  options: Partial<TypeScriptBuildOptions> = {}
) {
  const workspaceRoot = config.workspaceRoot ? config.workspaceRoot : findWorkspaceRoot();

  registerPluginTSTranspiler();

  let tsconfigFile = joinPathFragments(workspaceRoot, "tsconfig.json");
  if (!fileExists(tsconfigFile)) {
    tsconfigFile = joinPathFragments(workspaceRoot, "tsconfig.base.json");
  }
  if (!fileExists(tsconfigFile)) {
    throw new Error(
      `The Build process failed because the workspace does not have a valid tsconfig file. Check if the file exists in the root of the workspace at ${joinPathFragments(
        projectRoot,
        "tsconfig.json"
      )} or ${joinPathFragments(projectRoot, "tsconfig.base.json")}`
    );
  }

  const projectGraph = await createProjectGraphAsync({
    exitOnError: true
  });

  const nxJson = readNxJson(workspaceRoot);
  const projectsConfigurations = readProjectsConfigurationFromProjectGraph(projectGraph);
  const projectRootMap = createProjectRootMappings(projectGraph.nodes);

  const projectName = findProjectForPath(tsconfigFile, projectRootMap);
  if (!projectName || typeof projectName !== "string") {
    throw new Error(
      `The Build process failed because the project does not have a valid name in the project.json file. Check if the file exists in the root of the project at ${joinPathFragments(
        projectRoot,
        "project.json"
      )}`
    );
  }

  const projectConfiguration = projectsConfigurations?.projects?.[projectName];
  if (!projectConfiguration) {
    throw new Error(
      `The Build process failed because the project does not have a valid configuration in the project.json file. Check if the file exists in the root of the project at ${joinPathFragments(
        projectRoot,
        "project.json"
      )}`
    );
  }

  const buildTarget = projectConfiguration?.targets?.build;
  if (!buildTarget) {
    throw new Error(
      `The Build process failed because the project does not have a valid build target in the project.json file. Check if the file exists in the root of the project at ${joinPathFragments(
        projectRoot,
        "project.json"
      )}`
    );
  }

  const _sourceRoot = (sourceRoot ? sourceRoot : projectConfiguration.sourceRoot) as string;
  const enhancedOptions = (await applyWorkspaceTokens<ProjectTokenizerOptions>(
    applyDefaultOptions(options, config),
    { projectRoot, projectName, sourceRoot: _sourceRoot, config },
    applyWorkspaceProjectTokens
  )) as TypeScriptBuildOptions;

  // #region Clean output directory

  if (enhancedOptions.clean !== false) {
    writeInfo(config, `🧹 Cleaning output path: ${enhancedOptions.outputPath}`);
    removeSync(enhancedOptions.outputPath);
  }

  // #endregion Clean output directory

  // #region Copy asset files to output directory

  writeDebug(config, `📦 Copying asset files to output directory: ${enhancedOptions.outputPath}`);

  const assets = Array.from(options.assets ?? []);
  if (!enhancedOptions.assets?.some((asset: AssetGlob) => asset?.glob === "*.md")) {
    assets.push({
      input: projectRoot,
      glob: "*.md",
      output: "/"
    });
  }

  if (!enhancedOptions.assets?.some((asset: AssetGlob) => asset?.glob === "LICENSE")) {
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
      input: _sourceRoot,
      glob: "**/{*.ts,*.tsx,*.js,*.jsx}",
      output: "src/"
    });
  }

  // await retrieveProjectConfigurationsWithoutPluginInference(workspaceRoot);

  const result = await copyAssets(
    {
      assets,
      watch: enhancedOptions.watch,
      outputPath: enhancedOptions.outputPath
    },
    {
      root: workspaceRoot,
      projectName,
      targetName: "build",
      target: buildTarget,
      ...enhancedOptions,
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
      config,
      `📝 Adding banner and writing source files: ${joinPathFragments(
        enhancedOptions.outputPath,
        "src"
      )}`
    );

    const files = globSync([
      joinPathFragments(workspaceRoot, enhancedOptions.outputPath, "src/**/*.ts"),
      joinPathFragments(workspaceRoot, enhancedOptions.outputPath, "src/**/*.tsx"),
      joinPathFragments(workspaceRoot, enhancedOptions.outputPath, "src/**/*.js"),
      joinPathFragments(workspaceRoot, enhancedOptions.outputPath, "src/**/*.jsx")
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
      files.map((file) =>
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

  writeDebug(config, "📦 Generating package.json file");
  const packageJson = await generatePackageJson(
    config,
    projectRoot,
    _sourceRoot,
    projectName,
    enhancedOptions
  );

  if (enhancedOptions.generatePackageJson !== false) {
    writeDebug(config, "📝 Writing package.json file");
    await writeJsonFile(
      joinPathFragments(workspaceRoot, enhancedOptions.outputPath, "package.json"),
      packageJson
    );

    enhancedOptions.external ??= [];
    for (const packageName of Object.keys(packageJson.dependencies)) {
      if (!enhancedOptions.external.includes(packageName)) {
        enhancedOptions.external.push(packageName);
      }
    }
  }

  writeDebug(config, " Detecting entry points for the build process");
  const entryPoints = getEntryPoints(config, projectRoot, _sourceRoot, enhancedOptions);

  // #region Run the build process

  writeDebug(config, "🛠 Running the build process for each entry point");
  await Promise.allSettled(
    entryPoints.map((entryPoint: string) =>
      runTsupBuild(
        {
          main: entryPoint,
          projectRoot,
          projectName,
          sourceRoot: _sourceRoot
        },
        config,
        enhancedOptions
      )
    )
  );

  // #endregion Run the build process
}
