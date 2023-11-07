/* eslint-disable @typescript-eslint/no-explicit-any */
import { ExecutorContext } from "@nx/devkit";
import { getOutExtension } from "@nx/esbuild/src/executors/esbuild/lib/build-esbuild-options";
import { getExtraDependencies } from "@nx/esbuild/src/executors/esbuild/lib/get-extra-dependencies";
import { CopyPackageJsonOptions, copyAssets, copyPackageJson } from "@nx/js";
import { DependentBuildableProjectNode } from "@nx/js/src/utils/buildable-libs-utils";
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
    console.log("⚡Running build executor on the workspace");

    const workspaceRoot = getWorkspaceRoot();
    const projectRoot =
      context.projectsConfigurations[context.projectName].root;
    const sourceRoot =
      context.projectsConfigurations[context.projectName].sourceRoot;

    const outputPath = applyWorkspaceTokens(
      options.outputPath
        ? options.outputPath
        : join(workspaceRoot, "dist", projectRoot),
      context
    );
    const main = applyWorkspaceTokens(
      options.main
        ? options.main
        : join(sourceRoot, "**/*@(.js|.jsx|.ts|.tsx)"),
      context
    );

    const assets = Array.from(options.assets);
    assets.push({
      glob: join(sourceRoot, "package.json"),
      input: sourceRoot,
      output: "."
    });
    assets.push({
      glob: join(sourceRoot, "README.md"),
      input: sourceRoot,
      output: outputPath
    });
    assets.push({
      glob: "",
      input: "LICENSE",
      output: "."
    });

    const result = await copyAssets(
      { assets, watch: options.watch, outputPath },
      context
    );
    if (!result.success) {
      throw Error("The Build process failed trying to copy assets");
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
      generateLockfile: true,
      outputFileExtensionForCjs: getOutExtension("cjs", {
        external: [],
        ...options,
        singleEntry: options.additionalEntryPoints?.length === 0,
        thirdParty: true,
        assets,
        userDefinedBuildOptions: {}
      }),
      excludeLibsInPackageJson: true,
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
      throw Error("The Build process failed trying to copy package.json");
    }

    const config = getConfig({ ...options, main, outputPath });
    if (typeof config === "function") {
      await build(await Promise.resolve(config({})));
    } else {
      await build(config);
    }

    console.log("⚡The Build process has completed successfully");
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
