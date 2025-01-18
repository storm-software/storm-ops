import type { ExecutorContext } from "@nx/devkit";
import { StormConfig } from "@storm-software/config";
import { ProjectTokenizerOptions, run } from "@storm-software/config-tools";
import type {
  BaseExecutorOptions,
  BaseExecutorSchema
} from "@storm-software/workspace-tools";
import { withRunExecutor } from "@storm-software/workspace-tools";
import { join } from "node:path";
import { which } from "shelljs";

export interface PulumiCommandOptions {
  stack?: string;
  root?: string;
  parent?: string;
  name?: string;
}

export type PulumiExecutorSchema = BaseExecutorSchema &
  Partial<PulumiCommandOptions>;

export type NormalizedPulumiExecutorOptions<
  TExecutorSchema extends PulumiExecutorSchema = PulumiExecutorSchema
> = ProjectTokenizerOptions & TExecutorSchema;

export const withPulumiExecutor =
  <TExecutorSchema extends PulumiExecutorSchema = PulumiExecutorSchema>(
    command: string,
    argsMapper: (
      options: NormalizedPulumiExecutorOptions<TExecutorSchema>
    ) => Array<string | false | undefined>,
    executorOptions: BaseExecutorOptions<TExecutorSchema> = {}
  ) =>
  async (
    _options: TExecutorSchema,
    context: ExecutorContext
  ): Promise<{ success: boolean }> => {
    return withRunExecutor<TExecutorSchema>(
      `Pulumi \`${command}\` Command Executor`,
      async (
        options: NormalizedPulumiExecutorOptions<TExecutorSchema>,
        context: ExecutorContext,
        config: StormConfig
      ) => {
        if (!which("pulumi")) {
          throw new Error(
            "Pulumi is not installed. Please install it before running this executor."
          );
        }

        if (
          !context.projectsConfigurations?.projects ||
          !context.projectName ||
          !context.projectsConfigurations.projects[context.projectName]
        ) {
          throw new Error(
            "The Build process failed because the context is not valid. Please run this command from a workspace."
          );
        }

        const { sourceRoot } =
          context.projectsConfigurations.projects[context.projectName]!;

        run(
          config,
          ["pulumi", command, ...argsMapper(options)].filter(Boolean).join(" "),
          join(config.workspaceRoot, (options.root || sourceRoot)!),
          "inherit",
          {
            ...process.env,
            PULUMI_EXPERIMENTAL: "true"
          }
        );

        return null;
      },
      executorOptions
    )(_options, context);
  };
