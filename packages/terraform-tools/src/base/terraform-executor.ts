import type { ExecutorContext } from "@nx/devkit";
import { StormConfig } from "@storm-software/config";
import { ProjectTokenizerOptions, run } from "@storm-software/config-tools";
import { withRunExecutor } from "@storm-software/workspace-tools/base/base-executor";
import type { BaseExecutorSchema } from "@storm-software/workspace-tools/base/base-executor.schema.d";
import type { BaseExecutorOptions } from "@storm-software/workspace-tools/types";
import { which } from "shelljs";
import type { BaseTerraformExecutorSchema } from "./base-terraform-executor.schema.d";

export type TerraformExecutorSchema = BaseExecutorSchema &
  Partial<BaseTerraformExecutorSchema>;

export type NormalizedTerraformExecutorOptions = ProjectTokenizerOptions &
  TerraformExecutorSchema;

export const withTerraformExecutor =
  <TExecutorSchema extends TerraformExecutorSchema = TerraformExecutorSchema>(
    command: string,
    executorOptions: BaseExecutorOptions<TExecutorSchema> = {},
  ) =>
  async (
    _options: TExecutorSchema,
    context: ExecutorContext,
  ): Promise<{ success: boolean }> => {
    return withRunExecutor<TExecutorSchema>(
      `Terraform \`${command}\` Command Executor`,
      async (
        options: NormalizedTerraformExecutorOptions,
        context: ExecutorContext,
        config: StormConfig,
      ) => {
        if (!which("tofu") || !which("terraform")) {
          throw new Error(
            "Both OpenTofu and Terraform are not installed. Please install one of the two before running this executor.",
          );
        }
        if (!which("terragrunt")) {
          throw new Error(
            "Terragrunt is not installed. Please install them before running this executor.",
          );
        }

        const {
          backendConfig = [],
          planFile,
          autoApproval,
          formatWrite,
          upgrade,
          migrateState,
          lock,
          varFile,
          varString,
          reconfigure,
        } = options;

        let jsonBackendConfig = backendConfig;
        if (typeof jsonBackendConfig === "string") {
          jsonBackendConfig = JSON.parse(jsonBackendConfig);
        }

        run(
          config,
          [
            "terragrunt",
            command,
            ...jsonBackendConfig.map(
              (config) => `-backend-config="${config.key}=${config.name}"`,
            ),
            command === "plan" && planFile && `-out ${planFile}`,
            command === "plan" && varFile && `--var-file ${varFile}`,
            command === "plan" && varString && `--var ${varString}`,
            command === "destroy" && autoApproval && "-auto-approve",
            command === "apply" && autoApproval && "-auto-approve",
            command === "apply" && planFile,
            command === "apply" && varString && `--var ${varString}`,
            command === "fmt" && "--recursive",
            command === "fmt" && !formatWrite && "--check --list",
            command === "init" && upgrade && "-upgrade",
            command === "init" && migrateState && "-migrate-state",
            command === "init" && reconfigure && "-reconfigure",
            command === "providers" && lock && "lock",
            command === "test" && varFile && `--var-file ${varFile}`,
            command === "test" && varString && `--var ${varString}`,
          ]
            .filter(Boolean)
            .join(" "),
          options.sourceRoot,
          "inherit",
          process.env.CI
            ? {
                TF_IN_AUTOMATION: "true",
                TF_INPUT: "0",
              }
            : {},
        );

        return null;
      },
      executorOptions,
    )(_options, context);
  };
