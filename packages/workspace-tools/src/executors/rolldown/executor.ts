import type { ExecutorContext } from "@nx/devkit";
import type { RolldownOptions } from "@storm-software/build-tools";
import type { StormConfig } from "@storm-software/config";
import { withRunExecutor } from "../../base/base-executor";
import type { RolldownExecutorSchema } from "./schema.d";
// import { fork } from "child_process";

export async function rolldownExecutorFn(
  options: RolldownExecutorSchema,
  context: ExecutorContext,
  config?: StormConfig
) {
  const { writeInfo, writeSuccess } = await import(
    "@storm-software/config-tools"
  );
  const { rolldown } = await import("@storm-software/build-tools");

  writeInfo("📦  Running Storm build executor on the workspace", config);

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

  await rolldown(config!, {
    ...options,
    projectRoot:
      context.projectsConfigurations.projects?.[context.projectName]?.root,
    projectName: context.projectName,
    sourceRoot:
      context.projectsConfigurations.projects?.[context.projectName]?.sourceRoot
  } as RolldownOptions);

  // #endregion Run the build process

  writeSuccess("⚡ The Build process has completed successfully", config);

  return {
    success: true
  };
}

export default withRunExecutor<RolldownExecutorSchema>(
  "TypeScript Build using Rolldown",
  rolldownExecutorFn,
  {
    skipReadingConfig: false,
    hooks: {
      applyDefaultOptions: async (
        options: Partial<RolldownOptions>,
        config?: StormConfig | undefined
      ) => {
        const { applyDefaultRolldownOptions } = await import(
          "@storm-software/build-tools"
        );

        return applyDefaultRolldownOptions(options, config);
      }
    }
  }
);
