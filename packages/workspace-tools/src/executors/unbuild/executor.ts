import type { ExecutorContext } from "@nx/devkit";
import type { StormConfig } from "@storm-software/config";
import { withRunExecutor } from "../../base/base-executor";
import type { UnbuildBuildOptions } from "@storm-software/build-tools";
import type { UnbuildExecutorSchema } from "./schema.d";

export async function unbuildExecutorFn(
  options: UnbuildExecutorSchema,
  context: ExecutorContext,
  config?: StormConfig
) {
  const { writeDebug, writeInfo, writeSuccess } = await import(
    "@storm-software/config-tools"
  );
  const { unbuild } = await import("@storm-software/build-tools");

  writeInfo("📦  Running Storm Unbuild executor on the workspace", config);

  // #region Apply default options

  writeDebug(
    `⚙️  Executor options:
${Object.keys(options)
  .map(
    key =>
      `${key}: ${
        !options[key] || _isPrimitive(options[key])
          ? options[key]
          : _isFunction(options[key])
            ? "<function>"
            : JSON.stringify(options[key])
      }`
  )
  .join("\n")}
`,
    config
  );

  // #endregion Apply default options

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

  await unbuild(config!, {
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

        return applyDefaultUnbuildOptions(options, config);
      }
    }
  }
);

const _isPrimitive = (value: unknown): boolean => {
  try {
    return (
      value === undefined ||
      value === null ||
      (typeof value !== "object" && typeof value !== "function")
    );
  } catch (e) {
    return false;
  }
};

const _isFunction = (
  value: unknown
): value is ((params?: unknown) => unknown) & ((param?: any) => any) => {
  try {
    return (
      value instanceof Function ||
      typeof value === "function" ||
      !!(value?.constructor && (value as any)?.call && (value as any)?.apply)
    );
  } catch (e) {
    return false;
  }
};
