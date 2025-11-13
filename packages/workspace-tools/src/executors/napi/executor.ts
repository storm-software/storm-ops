import { NapiCli as TNapiCli } from "@napi-rs/cli";
import { ExecutorContext, PromiseExecutor } from "@nx/devkit";
import {
  correctPaths,
  isAbsolute,
  joinPaths,
  relative
} from "@storm-software/config-tools/utilities/correct-paths";
import { StormWorkspaceConfig } from "@storm-software/config/types";
import { createJiti } from "jiti";
import { fileExists } from "nx/src/utils/fileutils";
import { withRunExecutor } from "../../base/base-executor";
import { cargoMetadata } from "../../utils/cargo";
import { NapiExecutorSchema } from "./schema.d";

/**
 * Build N-API bindings using NAPI-RS
 *
 * @param options - Executor options
 * @param context - Executor context
 * @param config - Storm workspace config
 * @returns Executor result
 */
export async function napiExecutor(
  options: NapiExecutorSchema,
  context: ExecutorContext,
  config: StormWorkspaceConfig
) {
  const jiti = createJiti(config.workspaceRoot, {
    fsCache: config.skipCache
      ? false
      : joinPaths(
          config.workspaceRoot,
          config.directories.cache || "node_modules/.cache/storm",
          "jiti"
        ),
    interopDefault: true
  });

  const { NapiCli } = await jiti.import<{ NapiCli: new () => TNapiCli }>(
    jiti.esmResolve("@napi-rs/cli")
  );

  if (!context.projectGraph?.nodes[context.projectName ?? ""]) {
    throw new Error(
      "The Napi Build process failed because the project could not be found in the project graph. Please run this command from a workspace root directory."
    );
  }

  const projectRoot =
    context.projectGraph?.nodes[context.projectName ?? ""]!.data.root;
  const packageJson = joinPaths(projectRoot ?? ".", "package.json");
  if (!fileExists(packageJson)) {
    throw new Error(`Could not find package.json at ${packageJson}`);
  }

  const napi = new NapiCli();
  const normalizedOptions: Parameters<typeof napi.build>[0] = { ...options };

  const metadata = cargoMetadata();
  normalizedOptions.targetDir =
    options.targetDir ||
    metadata?.target_directory ||
    joinPaths(config.workspaceRoot, "dist", "target");
  normalizedOptions.outputDir = options.outputPath;
  normalizedOptions.packageJsonPath = options.packageJsonPath || packageJson;

  if (options.cwd) {
    normalizedOptions.cwd = correctPaths(options.cwd);
  } else {
    normalizedOptions.cwd = correctPaths(projectRoot);
    const absoluteProjectRoot = joinPaths(
      config.workspaceRoot,
      projectRoot || "."
    );

    if (normalizedOptions.outputDir) {
      normalizedOptions.outputDir = relative(
        absoluteProjectRoot,
        correctPaths(
          isAbsolute(normalizedOptions.outputDir)
            ? normalizedOptions.outputDir
            : joinPaths(config.workspaceRoot, normalizedOptions.outputDir)
        )
      );
    }

    if (normalizedOptions.packageJsonPath) {
      normalizedOptions.packageJsonPath = relative(
        absoluteProjectRoot,
        correctPaths(
          isAbsolute(normalizedOptions.packageJsonPath)
            ? normalizedOptions.packageJsonPath
            : joinPaths(config.workspaceRoot, normalizedOptions.packageJsonPath)
        )
      );
    }

    if (normalizedOptions.configPath) {
      normalizedOptions.configPath = relative(
        absoluteProjectRoot,
        correctPaths(
          isAbsolute(normalizedOptions.configPath)
            ? normalizedOptions.configPath
            : joinPaths(config.workspaceRoot, normalizedOptions.configPath)
        )
      );
    }

    if (normalizedOptions.manifestPath) {
      normalizedOptions.manifestPath = relative(
        absoluteProjectRoot,
        correctPaths(
          isAbsolute(normalizedOptions.manifestPath)
            ? normalizedOptions.manifestPath
            : joinPaths(config.workspaceRoot, normalizedOptions.manifestPath)
        )
      );
    }
  }

  if (process.env.VERCEL) {
    // Vercel doesn't have support for cargo atm, so auto success builds
    return { success: true };
  }

  const { task } = await napi.build(normalizedOptions);

  return { success: true, terminalOutput: await task };
}

export default withRunExecutor<NapiExecutorSchema>(
  "Napi - Build Bindings",
  napiExecutor,
  {
    skipReadingConfig: false,
    hooks: {
      applyDefaultOptions: (options: NapiExecutorSchema) => {
        options.outputPath ??= "{sourceRoot}";
        options.toolchain ??= "stable";
        options.dtsCache ??= true;
        options.platform ??= true;
        options.constEnum ??= false;
        options.verbose ??= false;

        options.jsBinding ??= "binding.js";
        options.dts ??= "binding.d.ts";

        return options as NapiExecutorSchema;
      }
    }
  }
) as PromiseExecutor<NapiExecutorSchema>;
