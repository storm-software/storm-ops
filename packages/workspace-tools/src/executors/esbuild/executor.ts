import type { ExecutorContext } from "@nx/devkit";
import type { StormWorkspaceConfig } from "@storm-software/config";
import { writeInfo } from "@storm-software/config-tools/logger/console";
import { build, ESBuildOptions } from "@storm-software/esbuild";
import { withRunExecutor } from "../../base/base-executor";
import type { ESBuildExecutorSchema } from "./schema.d";

export async function esbuildExecutorFn(
  options: ESBuildExecutorSchema,
  context: ExecutorContext,
  config?: StormWorkspaceConfig
) {
  writeInfo("📦  Running Storm ESBuild executor on the workspace", config);

  // #region Prepare build context variables

  if (
    !context.projectsConfigurations?.projects ||
    !context.projectName ||
    !context.projectsConfigurations.projects[context.projectName] ||
    !context.projectsConfigurations.projects[context.projectName]?.root
  ) {
    throw new Error(
      "The Build process failed because the context is not valid. Please run this command from a workspace."
    );
  }

  // #endregion Prepare build context variables

  await build({
    ...options,
    projectRoot:
      context.projectsConfigurations.projects?.[context.projectName]!.root,
    projectName: context.projectName,
    sourceRoot:
      context.projectsConfigurations.projects?.[context.projectName]
        ?.sourceRoot,
    format: options.format as ESBuildOptions["format"],
    platform: options.format as ESBuildOptions["platform"]
  });

  // #endregion Run the build process

  return {
    success: true
  };
}

export default withRunExecutor<ESBuildExecutorSchema>(
  "Storm ESBuild build",
  esbuildExecutorFn,
  {
    skipReadingConfig: false,
    hooks: {
      applyDefaultOptions: async (
        options: ESBuildExecutorSchema,
        config?: StormWorkspaceConfig | undefined
      ) => {
        options.entry ??= ["src/index.ts"];
        options.outputPath ??= "dist/{projectRoot}";
        options.tsconfig ??= "{projectRoot}/tsconfig.json";

        return options;
      }
    }
  }
);
