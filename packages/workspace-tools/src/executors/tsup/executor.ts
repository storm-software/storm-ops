import type { ExecutorContext } from "@nx/devkit";
import {
  applyDefaultOptions,
  build,
  type TypeScriptBuildOptions
} from "@storm-software/build-tools";
import type { StormConfig } from "@storm-software/config";
import { withRunExecutor } from "../../base/base-executor";
import type { TsupExecutorSchema } from "./schema.d";

export async function tsupExecutorFn(
  options: TsupExecutorSchema,
  context: ExecutorContext,
  config: StormConfig
) {
  const { writeInfo, writeSuccess } = await import(
    "@storm-software/config-tools"
  );

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

  // #region Run the build process

  await build(config, {
    ...options,
    projectRoot:
      context.projectsConfigurations.projects?.[context.projectName]?.root,
    projectName: context.projectName,
    sourceRoot:
      context.projectsConfigurations.projects?.[context.projectName]?.sourceRoot
  } as TypeScriptBuildOptions);

  // #endregion Run the build process

  writeSuccess("⚡ The Build process has completed successfully", config);

  return {
    success: true
  };
}

export default withRunExecutor<TsupExecutorSchema>(
  "TypeScript Build using tsup",
  tsupExecutorFn,
  {
    skipReadingConfig: false,
    hooks: {
      applyDefaultOptions
    }
  }
);
