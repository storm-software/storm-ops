import type { ExecutorContext } from "@nx/devkit";
import type { StormConfig } from "@storm-software/config";
import { writeInfo } from "@storm-software/config-tools/logger/console";
import { joinPaths } from "@storm-software/config-tools/utilities/correct-paths";
import { UnbuildOptions } from "@storm-software/unbuild";
import { defu } from "defu";
import { createJiti } from "jiti";
import { withRunExecutor } from "../../base/base-executor";
import type { UnbuildExecutorSchema } from "./schema.d";

type StormUnbuildModule = {
  build: (opts: UnbuildOptions) => Promise<void>;
};

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
    !context.projectsConfigurations.projects[context.projectName]
  ) {
    throw new Error(
      "The Build process failed because the context is not valid. Please run this command from a workspace root directory."
    );
  }

  if (!context.projectsConfigurations.projects[context.projectName]!.root) {
    throw new Error(
      "The Build process failed because the project root is not valid. Please run this command from a workspace root directory."
    );
  }

  if (
    !context.projectsConfigurations.projects[context.projectName]!.sourceRoot
  ) {
    throw new Error(
      "The Build process failed because the project's source root is not valid. Please run this command from a workspace root directory."
    );
  }

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

  const stormUnbuild = await jiti.import<StormUnbuildModule>(
    jiti.esmResolve("@storm-software/unbuild/build")
  );

  // #endregion Prepare build context variables

  await stormUnbuild.build(
    defu(
      {
        ...options,
        projectRoot:
          context.projectsConfigurations.projects![context.projectName]!.root,
        projectName: context.projectName,
        sourceRoot:
          context.projectsConfigurations.projects![context.projectName]!
            .sourceRoot,
        platform: options.platform as UnbuildOptions["platform"]
      },
      {
        stubOptions: {
          jiti: {
            fsCache: config.skipCache
              ? false
              : joinPaths(
                  config.workspaceRoot,
                  config.directories.cache || "node_modules/.cache/storm",
                  "jiti"
                )
          }
        },
        rollup: {
          emitCJS: true,
          watch: false,
          dts: {
            respectExternal: true
          },
          esbuild: {
            target: options.target,
            format: "esm",
            platform: options.platform,
            minify: options.minify ?? !options.debug,
            sourcemap: options.sourcemap ?? options.debug,
            treeShaking: options.treeShaking
          }
        }
      }
    ) as UnbuildOptions
  );

  // #endregion Run the build process

  return {
    success: true
  };
}

export default withRunExecutor<UnbuildExecutorSchema>(
  "TypeScript Unbuild build",
  unbuildExecutorFn,
  {
    skipReadingConfig: false,
    hooks: {
      applyDefaultOptions: async (
        options: UnbuildExecutorSchema,
        config?: StormConfig | undefined
      ) => {
        options.debug ??= false;
        options.treeShaking ??= true;
        options.platform ??= "neutral";
        options.entry ??= ["{sourceRoot}"];
        options.tsconfig ??= "{projectRoot}/tsconfig.json";

        return options;
      }
    }
  }
);
