import type { ExecutorContext } from "@nx/devkit";
import type { StormWorkspaceConfig } from "@storm-software/config";
import { writeInfo } from "@storm-software/config-tools/logger/console";
import { build, TSDownOptions } from "@storm-software/tsdown";
import { withRunExecutor } from "../../base/base-executor";
import type { TSDownExecutorSchema } from "./schema";

export async function tsdownExecutorFn(
  options: TSDownExecutorSchema,
  context: ExecutorContext,
  config?: StormWorkspaceConfig
) {
  writeInfo("📦  Running Storm TSDown executor on the workspace", config);

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
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      context.projectsConfigurations.projects?.[context.projectName]!.root,
    name: context.projectName,
    sourceRoot:
      context.projectsConfigurations.projects?.[context.projectName]
        ?.sourceRoot,
    format: options.format as TSDownOptions["format"],
    platform: options.platform as TSDownOptions["platform"]
  });

  // #endregion Run the build process

  return {
    success: true
  };
}

export default withRunExecutor<TSDownExecutorSchema>(
  "Storm TSDown build",
  tsdownExecutorFn,
  {
    skipReadingConfig: false,
    hooks: {
      applyDefaultOptions: async (options: TSDownExecutorSchema) => {
        options.entry ??= ["src/index.ts"];
        options.outputPath ??= "dist/{projectRoot}";
        options.tsconfig ??= "{projectRoot}/tsconfig.json";

        return options;
      }
    }
  }
);
