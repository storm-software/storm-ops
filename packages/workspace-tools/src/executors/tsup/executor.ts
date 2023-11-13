/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExecutorContext } from "@nx/devkit";
import { getExtraDependencies } from "@nx/esbuild/src/executors/esbuild/lib/get-extra-dependencies";
import { CopyPackageJsonOptions, copyAssets, copyPackageJson } from "@nx/js";
import { DependentBuildableProjectNode } from "@nx/js/src/utils/buildable-libs-utils";
import { removeSync } from "fs-extra";
import { join } from "path";
import { Options, build as tsup } from "tsup";
import { applyWorkspaceTokens } from "../../utils/apply-workspace-tokens";
import { getWorkspaceRoot } from "../../utils/get-workspace-root";
import { getConfig } from "./get-config";
import { TsupExecutorSchema } from "./schema";

export default async function runExecutor(
  options: TsupExecutorSchema,
  context: ExecutorContext
) {
  try {
    console.log("⚡ Running build executor on the workspace");

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

    if (options.clean !== false) {
      console.log("🧹 Cleaning output path");
      removeSync(options.outputPath);
    }

    const assets = Array.from(options.assets);
    assets.push({
      input: sourceRoot,
      glob: "package.json",
      output: "."
    });
    assets.push({
      input: sourceRoot,
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
      options.external.push((tpd.node.data as any).packageName);
      externalDependencies.push(tpd);
    }

    const cpjOptions: CopyPackageJsonOptions = {
      ...options,
      main: "src/index.ts",
      generateLockfile: true,
      excludeLibsInPackageJson: false,
      updateBuildableProjectDepsInPackageJson: externalDependencies.length > 0
    };

    // If we're bundling third-party packages, then any extra deps from external should be the only deps in package.json
    if (externalDependencies.length > 0) {
      cpjOptions.overrideDependencies = externalDependencies;
    } else {
      cpjOptions.extraDependencies = externalDependencies;
    }

    const packageJsonResult = await copyPackageJson(cpjOptions, context);
    if (!packageJsonResult.success) {
      throw new Error("The Build process failed trying to copy package.json");
    }

    console.log("Getting Tsup build config");
    const config = getConfig(sourceRoot, { ...options, outputPath });
    if (typeof config === "function") {
      await build(await Promise.resolve(config({})));
    } else {
      await build(config);
    }

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
