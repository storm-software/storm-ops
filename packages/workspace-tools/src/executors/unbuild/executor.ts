import type { ExecutorContext } from "@nx/devkit";
import type { StormConfig } from "@storm-software/config";
import { writeInfo } from "@storm-software/config-tools/logger/console";
import { build } from "@storm-software/unbuild";
import { withRunExecutor } from "../../base/base-executor";
import type { UnbuildExecutorSchema } from "./schema.d";

export async function unbuildExecutorFn(
  options: UnbuildExecutorSchema,
  context: ExecutorContext,
  config: StormConfig
) {
  writeInfo("📦  Running Storm Unbuild executor on the workspace", config);

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
    config,
    projectRoot:
      context.projectsConfigurations.projects?.[context.projectName]!.root,
    projectName: context.projectName,
    sourceRoot:
      context.projectsConfigurations.projects?.[context.projectName]?.sourceRoot
  });

  // #endregion Run the build process

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
        options: UnbuildExecutorSchema,
        config?: StormConfig | undefined
      ) => {
        options.entry ??= ["{sourceRoot}"];
        options.outputPath ??= "dist/{projectRoot}";
        options.tsconfig ??= "{projectRoot}/tsconfig.json";

        return options;
      }
    }
  }
);
