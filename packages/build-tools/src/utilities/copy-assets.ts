import { hfs } from "@humanfs/node";
import {
  createProjectGraphAsync,
  ExecutorContext,
  readProjectsConfigurationFromProjectGraph
} from "@nx/devkit";
import { copyAssets as copyAssetsBase } from "@nx/js";
import { StormConfig } from "@storm-software/config";
import { isVerbose, writeDebug } from "@storm-software/config-tools/logger";
import { joinPaths } from "@storm-software/config-tools/utilities/correct-paths";
import { glob } from "glob";
import { AssetGlob } from "../types";
import { readNxConfig } from "./read-nx-config";

export const copyAssets = async (
  config: StormConfig,
  assets: (AssetGlob | string)[],
  outputPath: string,
  projectRoot: string,
  projectName: string,
  sourceRoot: string,
  generatePackageJson = true,
  includeSrc = false,
  banner?: string,
  footer?: string
) => {
  const pendingAssets = Array.from(assets ?? []);
  if (!pendingAssets?.some((asset: AssetGlob) => asset?.glob === "*.md")) {
    pendingAssets.push({
      input: projectRoot,
      glob: "*.md",
      output: "/"
    });
  }

  if (generatePackageJson === false) {
    pendingAssets.push({
      input: sourceRoot,
      glob: "package.json",
      output: "."
    });
  }

  if (!pendingAssets?.some((asset: AssetGlob) => asset?.glob === "LICENSE")) {
    pendingAssets.push({
      input: "",
      glob: "LICENSE",
      output: "."
    });
  }

  if (includeSrc === true) {
    pendingAssets.push({
      input: sourceRoot,
      glob: "**/{*.ts,*.tsx,*.js,*.jsx}",
      output: "src/"
    });
  }

  const nxJson = readNxConfig(config.workspaceRoot);
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
      `The Build process failed because the project does not have a valid build target in the project.json file. Check if the file exists in the root of the project at ${joinPaths(
        projectRoot,
        "project.json"
      )}`
    );
  }

  const result = await copyAssetsBase(
    {
      assets,
      watch: false,
      outputPath
    },
    {
      root: config.workspaceRoot,
      targetName: "build",
      target: buildTarget,
      projectName,
      projectGraph,
      projectsConfigurations,
      nxJsonConfiguration: nxJson,
      cwd: config.workspaceRoot,
      isVerbose: isVerbose(config.logLevel)
    } as ExecutorContext
  );
  if (!result.success) {
    throw new Error("The Build process failed trying to copy assets");
  }

  if (includeSrc === true) {
    writeDebug(
      `📝  Adding banner and writing source files: ${joinPaths(
        outputPath,
        "src"
      )}`,
      config
    );

    const files = await glob([
      joinPaths(config.workspaceRoot, outputPath, "src/**/*.ts"),
      joinPaths(config.workspaceRoot, outputPath, "src/**/*.tsx"),
      joinPaths(config.workspaceRoot, outputPath, "src/**/*.js"),
      joinPaths(config.workspaceRoot, outputPath, "src/**/*.jsx")
    ]);

    await Promise.allSettled(
      files.map(async file =>
        hfs.write(
          file,
          `${
            banner && typeof banner === "string"
              ? banner.startsWith("//")
                ? banner
                : `// ${banner}`
              : ""
          }\n\n${await hfs.text(file)}\n\n${
            footer && typeof footer === "string"
              ? footer.startsWith("//")
                ? footer
                : `// ${footer}`
              : ""
          }`
        )
      )
    );
  }
};
