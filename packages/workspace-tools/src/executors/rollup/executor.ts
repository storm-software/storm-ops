import { type ExecutorContext, type PromiseExecutor } from "@nx/devkit";
import { rollupExecutor } from "@nx/rollup/src/executors/rollup/rollup.impl";
import { AssetGlob } from "@storm-software/build-tools";
import type { StormConfig } from "@storm-software/config";
import { withRunExecutor } from "@storm-software/workspace-tools";
import { removeSync } from "fs-extra";
import { Glob } from "glob";
import { join } from "path";
import { RollupExecutorSchema } from "./schema";

export async function* rollupExecutorFn(
  options: RollupExecutorSchema,
  context: ExecutorContext,
  config?: StormConfig
) {
  const { writeDebug, findWorkspaceRoot, correctPaths } = await import(
    "@storm-software/config-tools"
  );

  if (
    !context?.projectName ||
    !context?.projectsConfigurations?.projects?.[context.projectName]?.root
  ) {
    throw new Error("Nx executor context was invalid");
  }

  const workspaceRoot = findWorkspaceRoot();
  const projectRoot =
    context!.projectsConfigurations!.projects[context.projectName!]!.root;
  const sourceRoot =
    context.projectsConfigurations.projects[context.projectName]?.sourceRoot ??
    projectRoot;

  // #region Clean output directory

  if (options.clean !== false) {
    writeDebug(`🧹 Cleaning output path: ${options.outputPath}`, config);
    removeSync(options.outputPath);
  }

  // #endregion Clean output directory

  // #region Copy asset files to output directory

  writeDebug(
    `📦  Copying asset files to output directory: ${options.outputPath}`,
    config
  );

  const assets = Array.from(options.assets ?? []);
  if (!options.assets?.some((asset: AssetGlob) => asset?.glob === "*.md")) {
    assets.push({
      input: projectRoot,
      glob: "*.md",
      output: "/"
    });
  }

  if (!options.assets?.some((asset: AssetGlob) => asset?.glob === "LICENSE")) {
    assets.push({
      input: "",
      glob: "LICENSE",
      output: "."
    });
  }

  if (options.fileLevelInput) {
    const files = await new Glob("**/*.{ts,mts,cts,tsx}", {
      absolute: true,
      cwd: sourceRoot,
      root: workspaceRoot
    }).walk();
    options.additionalEntryPoints = files.reduce(
      (ret, file) => {
        const corrected = correctPaths(file);
        if (!corrected.includes("node_modules") && !ret.includes(corrected)) {
          ret.push(corrected);
        }

        return ret;
      },
      options.additionalEntryPoints.map(entry =>
        correctPaths(join(workspaceRoot, entry))
      )
    );
  }

  writeDebug(
    `📦  Running Storm Rollup build process on the ${context?.projectName} project`,
    config
  );

  yield* rollupExecutor({ ...options, main: options.entry }, context, config);

  return {
    success: true
  };
}

export default withRunExecutor<RollupExecutorSchema>(
  "Rollup build executor",
  rollupExecutorFn,
  {
    skipReadingConfig: false,
    hooks: {
      applyDefaultOptions: (options: RollupExecutorSchema) => {
        options.entry ??= "{sourceRoot}/index.ts";
        options.outputPath ??= "dist/{projectRoot}";
        options.tsConfig ??= "{projectRoot}/tsconfig.json";
        options.assets ??= [];
        options.fileLevelInput ??= true;
        options.generatePackageJson ??= true;
        options.platform ??= "neutral";
        options.verbose ??= false;
        options.external ??= (source: string) =>
          !!(
            process.env.STORM_EXTERNAL_PACKAGE_PATTERNS &&
            process.env.STORM_EXTERNAL_PACKAGE_PATTERNS.split(",")?.length >
              0 &&
            process.env.STORM_EXTERNAL_PACKAGE_PATTERNS.split(",").some(
              pkg => pkg.replaceAll("*", "") && source?.includes(pkg)
            )
          );
        options.additionalEntryPoints ??= [];
        options.assets ??= [];
        options.clean ??= true;
        options.watch ??= false;
        options.sourcemap ??= true;

        return options as RollupExecutorSchema;
      }
    }
  }
) as PromiseExecutor<RollupExecutorSchema>;
