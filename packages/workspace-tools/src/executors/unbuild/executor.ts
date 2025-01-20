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
    !context.projectsConfigurations.projects[context.projectName] ||
    !context.projectsConfigurations.projects[context.projectName]?.root
  ) {
    throw new Error(
      "The Build process failed because the context is not valid. Please run this command from a workspace."
    );
  }

  const jiti = createJiti(config.workspaceRoot, {
    fsCache: config.skipCache
      ? false
      : joinPaths(
          config.directories.cache || "node_modules/.cache/storm",
          "jiti"
        ),
    interopDefault: true
  });

  const stormUnbuild = await jiti.import<StormUnbuildModule>(
    "@storm-software/unbuild"
  );

  // #endregion Prepare build context variables

  await stormUnbuild.build(
    defu(
      {
        ...options,
        projectRoot:
          context.projectsConfigurations.projects?.[context.projectName]!.root,
        projectName: context.projectName,
        sourceRoot:
          context.projectsConfigurations.projects?.[context.projectName]
            ?.sourceRoot,
        platform: options.platform as UnbuildOptions["platform"],
        name: context.projectName
      },
      {
        stubOptions: {
          jiti: {
            cache: "node_modules/.cache/storm"
          }
        },
        rollup: {
          emitCJS: true,
          watch: false,
          cjsBridge: false,
          dts: {
            respectExternal: true
          },
          replace: {},
          alias: {},
          resolve: {},
          json: {},
          commonjs: {},
          esbuild: {
            target: options.target,
            format: "esm",
            platform: options.platform,
            minify: options.minify,
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
        options.entry ??= ["{sourceRoot}"];
        options.outputPath ??= "dist/{projectRoot}";
        options.tsconfig ??= "{projectRoot}/tsconfig.json";

        return options;
      }
    }
  }
);
