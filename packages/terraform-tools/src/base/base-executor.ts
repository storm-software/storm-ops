import type { ExecutorContext } from "@nx/devkit";
import { run } from "@storm-software/config-tools";
import type {
  BaseExecutorOptions,
  BaseExecutorSchema
} from "@storm-software/workspace-tools";
import { withRunExecutor } from "@storm-software/workspace-tools";
import { which } from "shelljs";

export interface ExecutorOptions {
  backendConfig: { key: string; name: string }[];
  autoApproval: boolean;
  planFile: string;
  ciMode: boolean;
  formatWrite: boolean;
  upgrade: boolean;
  migrateState: boolean;
  lock: boolean;
  varFile: string;
  varString: string;
  reconfigure: boolean;

  [key: string]: string | unknown;
}

export const withTerraformExecutor =
  <TExecutorSchema extends BaseExecutorSchema = BaseExecutorSchema>(
    command: string,
    executorOptions: BaseExecutorOptions<TExecutorSchema> = {}
  ) =>
  async (
    _options: TExecutorSchema,
    context: ExecutorContext
  ): Promise<{ success: boolean }> => {
    return withRunExecutor<TExecutorSchema>(
      `Terraform \`${command}\` Command Executor`,
      async (options, context, config) => {
        if (!which("tofu") || !which("terraform")) {
          throw new Error(
            "Both OpenTofu and Terraform are not installed. Please install one of the two before running this executor."
          );
        }
        if (!which("terragrunt")) {
          throw new Error(
            "Terragrunt is not installed. Please install them before running this executor."
          );
        }

        const {
          backendConfig = [],
          planFile,
          ciMode,
          autoApproval,
          formatWrite,
          upgrade,
          migrateState,
          lock,
          varFile,
          varString,
          reconfigure
        } = options;

        let env = {};
        if (ciMode) {
          env = {
            TF_IN_AUTOMATION: true,
            TF_INPUT: 0
          };
        }

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
              config => `-backend-config="${config.key}=${config.name}"`
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
            command === "test" && varString && `--var ${varString}`
          ]
            .filter(Boolean)
            .join(" "),
          options.sourceRoot
        );

        return null;
      },
      executorOptions
    )(_options, context);
  };
