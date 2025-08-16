import {
  getStopwatch,
  writeDebug,
  writeError,
  writeFatal,
  writeSuccess,
  writeWarning
} from "@storm-software/config-tools/logger/console";
import { copyBuildAssets } from "./assets";
import { cleanDirectories } from "./clean";
import { resolveContext } from "./context";
import { generatePackageJson } from "./package-json";
import { executeTsup } from "./tsup";
import { ESBuildContext, type ESBuildOptions } from "./types";

/**
 * Report the results of the build
 */
async function reportResults(context: ESBuildContext) {
  if (context.result?.errors.length === 0) {
    if (context.result.warnings.length > 0) {
      writeWarning(
        `  🚧  The following warnings occurred during the build: ${context.result.warnings
          .map(warning => warning.text)
          .join("\n")}`,
        context.workspaceConfig
      );
    }

    writeSuccess(
      `  📦  The ${context.options.name} build completed successfully`,
      context.workspaceConfig
    );
  } else if (context.result?.errors && context.result?.errors.length > 0) {
    writeError(
      `  ❌  The ${context.options.name} build failed with the following errors: ${context.result.errors
        .map(error => error.text)
        .join("\n")}`,
      context.workspaceConfig
    );

    throw new Error(
      `The ${context.options.name} build failed with the following errors: ${context.result.errors
        .map(error => error.text)
        .join("\n")}`
    );
  }
}

/**
 * A blank esbuild run to do an analysis of our deps
 */
// async function dependencyCheck(options: ESBuildOptions) {
//   // we only check our dependencies for a full build
//   if (process.env.DEV === "true") {
//     return undefined;
//   }

//   // Only run on test and publish pipelines on Buildkite
//   // Meaning we skip on GitHub Actions
//   // Because it's slow and runs for each job, during setup, making each job slower
//   if (process.env.CI && !process.env.BUILDKITE) {
//     return undefined;
//   }

//   // we need to bundle everything to do the analysis
//   const buildPromise = esbuild.build({
//     entryPoints: globbySync("**/*.{j,t}s", {
//       // We don't check dependencies in ecosystem tests because tests are isolated from the build.
//       ignore: ["./src/__tests__/**/*", "./tests/e2e/**/*", "./dist/**/*"],
//       gitignore: true
//     }),
//     logLevel: "silent", // there will be errors
//     bundle: true, // we bundle to get everything
//     write: false, // no need to write for analysis
//     outdir: "out",
//     plugins: [depsCheckPlugin(options.bundle)]
//   });

//   // we absolutely don't care if it has any errors
//   // eslint-disable-next-line @typescript-eslint/no-empty-function
//   await buildPromise.catch(() => {});

//   return undefined;
// }

/**
 * Clean the output path
 *
 * @param context - the build context
 */
async function cleanOutputPath(context: ESBuildContext) {
  if (context.clean !== false && context.outputPath) {
    writeDebug(
      ` 🧹  Cleaning ${context.options.name} output path: ${context.outputPath}`,
      context.workspaceConfig
    );
    const stopwatch = getStopwatch(`${context.options.name} output clean`);

    await cleanDirectories(context.outputPath);

    stopwatch();
  }

  return context;
}

/**
 * Execution pipeline that applies a set of actions
 *
 * @param options - the build options
 * @returns the build result
 */
export async function build(options: ESBuildOptions) {
  writeDebug(`  ⚡   Executing Storm ESBuild pipeline`);
  const stopwatch = getStopwatch("ESBuild pipeline");

  try {
    const opts = Array.isArray(options) ? options : [options];
    if (opts.length === 0) {
      throw new Error("No build options were provided");
    }

    const context = await resolveContext(options);
    await cleanOutputPath(context);

    await Promise.all([
      // dependencyCheck(context.options),
      generatePackageJson(context),
      copyBuildAssets(context),
      executeTsup(context)
    ]);
    await reportResults(context);

    writeSuccess("  🏁  ESBuild pipeline build completed successfully");
  } catch (error) {
    writeFatal(
      "Fatal errors that the build process could not recover from have occured. The build process has been terminated."
    );

    throw error;
  } finally {
    stopwatch();
  }
}
