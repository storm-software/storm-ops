/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ExecutorContext,
  joinPathFragments,
  readJsonFile,
  writeJsonFile
} from "@nx/devkit";
import { getExtraDependencies } from "@nx/esbuild/src/executors/esbuild/lib/get-extra-dependencies";
import { copyAssets } from "@nx/js";
import { DependentBuildableProjectNode } from "@nx/js/src/utils/buildable-libs-utils";
import { removeSync } from "fs-extra";
import { buildProjectGraphWithoutDaemon } from "nx/src/project-graph/project-graph";
import { fileExists } from "nx/src/utils/fileutils";
import { join } from "path";
import { Options, build as tsup } from "tsup";
import { applyWorkspaceTokens } from "../../utils/apply-workspace-tokens";
import { getWorkspaceRoot } from "../../utils/get-workspace-root";
import { getConfig } from "./get-config";
import { TsupExecutorSchema } from "./schema";

type PackageConfiguration = {
  version: string;
  packageName: string;
  hash?: string;
};

export default async function runExecutor(
  options: TsupExecutorSchema,
  context: ExecutorContext
) {
  try {
    console.log("⚡ Running build executor on the workspace");

    // #region Prepare build context variables

    if (
      !context.projectsConfigurations?.projects ||
      !context.projectName ||
      !context.projectsConfigurations.projects[context.projectName]
    ) {
      throw Error(
        "The Build process failed because the context is not valid. Please run this command from a workspace."
      );
    }

    const workspaceRoot = getWorkspaceRoot();
    const projectRoot =
      context.projectsConfigurations.projects[context.projectName].root;
    const sourceRoot =
      context.projectsConfigurations.projects[context.projectName].sourceRoot;

    const outputPath = applyWorkspaceTokens(
      options.outputPath
        ? options.outputPath
        : join(workspaceRoot, "dist", projectRoot),
      context
    );

    // #endregion Prepare build context variables

    // #region Clean output directory

    if (options.clean !== false) {
      console.log("🧹 Cleaning output path");
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

    const result = await copyAssets(
      { assets, watch: options.watch, outputPath },
      context
    );
    if (!result.success) {
      console.error("The Build process failed trying to copy assets");
    }

    // #endregion Copy asset files to output directory

    // #region Generate the package.json file

    options.external = options.external || [];
    const externalDependencies: DependentBuildableProjectNode[] =
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

    const thirdPartyDependencies = getExtraDependencies(
      context.projectName,
      context.projectGraph
    );
    for (const tpd of thirdPartyDependencies) {
      const packageConfig = tpd.node.data as PackageConfiguration;
      if (packageConfig?.packageName) {
        options.external.push(packageConfig.packageName);
        externalDependencies.push(tpd);
      }
    }

    const projectGraph = await buildProjectGraphWithoutDaemon();

    const pathToPackageJson = join(context.root, projectRoot, "package.json");
    const packageJson = fileExists(pathToPackageJson)
      ? readJsonFile(pathToPackageJson)
      : { name: context.projectName, version: "0.0.1" };

    const workspacePackageJson = readJsonFile(
      joinPathFragments(workspaceRoot, "package.json")
    );

    externalDependencies.forEach(entry => {
      const packageConfig = entry.node.data as PackageConfiguration;
      if (
        packageConfig?.packageName &&
        !!(projectGraph.externalNodes[entry.node.name]?.type === "npm")
      ) {
        const { packageName, version } = packageConfig;
        if (
          packageJson.dependencies?.[packageName] ||
          packageJson.devDependencies?.[packageName] ||
          packageJson.peerDependencies?.[packageName]
        ) {
          return;
        }
        if (workspacePackageJson.devDependencies?.[packageName]) {
          return;
        }

        packageJson.dependencies ??= {};
        packageJson.dependencies[packageName] = version;
      }
    });

    packageJson.type ??= "module";
    packageJson.exports = {
      ".": {
        "import": {
          "types": "./build/modern/index.d.ts",
          "default": "./build/modern/index.js"
        },
        "require": {
          "types": "./build/modern/index.d.cts",
          "default": "./build/modern/index.cjs"
        }
      },
      "./package.json": "./package.json"
    };

    packageJson.main = "build/legacy/index.cjs";
    packageJson.module = "build/legacy/index.js";
    packageJson.types = "build/legacy/index.d.ts";

    packageJson.sideEffects ??= false;
    packageJson.files ??= ["src"];

    packageJson.description ??= workspacePackageJson.description;
    packageJson.homepage ??= workspacePackageJson.homepage;
    packageJson.bugs ??= workspacePackageJson.bugs;
    packageJson.author ??= workspacePackageJson.author;
    packageJson.license ??= workspacePackageJson.license;
    packageJson.keywords ??= workspacePackageJson.keywords;

    packageJson.repository ??= workspacePackageJson.repository;
    packageJson.repository.directory = projectRoot
      ? projectRoot
      : `packages/${context.projectName}`;

    writeJsonFile(`${options.outputPath}/package.json`, packageJson);

    // #endregion Generate the package.json file

    // #region Run the build process

    console.log("Getting Tsup build config");
    const config = getConfig(sourceRoot, { ...options, outputPath });
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

const build = async (options: Options | Options[]) => {
  if (Array.isArray(options)) {
    await Promise.all(options.map(buildOptions => tsup(buildOptions)));
  } else {
    await tsup(options);
  }
};
