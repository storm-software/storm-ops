import type { ExecutorContext } from "@nx/devkit";
import type { UnbuildBuildOptions } from "@storm-software/build-tools";
import type { StormConfig } from "@storm-software/config";
import { withRunExecutor } from "../../base/base-executor";
import type { UnbuildExecutorSchema } from "./schema.d";

export async function unbuildExecutorFn(
  options: UnbuildExecutorSchema,
  context: ExecutorContext,
  config: StormConfig
) {
  const { writeInfo, writeSuccess } = await import(
    "@storm-software/config-tools"
  );
  const { unbuild } = await import("@storm-software/build-tools");

  writeInfo("📦  Running Storm Unbuild executor on the workspace", config);

  // #region Prepare build context variables

  if (
    !context.projectsConfigurations?.projects ||
    !context.projectName ||
    !context.projectsConfigurations.projects[context.projectName]
  ) {
    throw new Error(
      "The Build process failed because the context is not valid. Please run this command from a workspace."
    );
  }

  // #endregion Prepare build context variables

  await unbuild(config, {
    ...options,
    projectRoot:
      context.projectsConfigurations.projects?.[context.projectName]?.root,
    projectName: context.projectName,
    sourceRoot:
      context.projectsConfigurations.projects?.[context.projectName]?.sourceRoot
  } as UnbuildBuildOptions);

  // #endregion Run the build process

  writeSuccess("⚡ The Unbuild process has completed successfully", config);

  return {
    success: true
  };
}

export default withRunExecutor<UnbuildExecutorSchema>(
  "TypeScript Unbuild processing",
  unbuildExecutorFn,
  {
    skipReadingConfig: false,
    hooks: {
      applyDefaultOptions: async (
        options: Partial<UnbuildBuildOptions>,
        config?: StormConfig | undefined
      ) => {
        const { applyDefaultUnbuildOptions } = await import(
          "@storm-software/build-tools"
        );

        options.tsLibs ??= [];

        return applyDefaultUnbuildOptions(options, config);
      }
    }
  }
);
