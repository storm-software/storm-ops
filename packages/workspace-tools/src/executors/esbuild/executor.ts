import type { ExecutorContext } from "@nx/devkit";
import type { StormWorkspaceConfig } from "@storm-software/config";
import { writeInfo } from "@storm-software/config-tools/logger/console";
import { joinPaths } from "@storm-software/config-tools/utilities/correct-paths";
import createJiti from "jiti";
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

  const jiti = createJiti(config?.workspaceRoot || process.cwd(), {
    fsCache: config?.skipCache
      ? false
      : joinPaths(
          config?.workspaceRoot || process.cwd(),
          config?.directories?.cache || "node_modules/.cache/storm",
          "jiti"
        ),
    interopDefault: true
  });

  const { build } = await jiti.import<{
    build: (options: any) => Promise<void>;
  }>(jiti.esmResolve("@storm-software/esbuild"));

  await build({
    ...options,
    projectRoot:
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      context.projectsConfigurations.projects?.[context.projectName]!.root,
    name: context.projectName,
    sourceRoot:
      context.projectsConfigurations.projects?.[context.projectName]
        ?.sourceRoot,
    format: options.format,
    platform: options.platform
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
      applyDefaultOptions: async (options: ESBuildExecutorSchema) => {
        options.entry ??= ["src/index.ts"];
        options.outputPath ??= "dist/{projectRoot}";
        options.tsconfig ??= "{projectRoot}/tsconfig.json";

        return options;
      }
    }
  }
);
