import { type ExecutorContext } from "@nx/devkit";
import { joinPaths } from "@storm-software/config-tools/utilities/correct-paths";
import { execSync } from "node:child_process";
import { isAbsolute } from "node:path";
import type { CommandPublishExecutorSchema } from "./schema.d";

export const LARGE_BUFFER = 1024 * 1000000;

export default async function commandPublishExecutorFn(
  options: CommandPublishExecutorSchema,
  context: ExecutorContext
) {
  /**
   * We need to check both the env var and the option because the executor may have been triggered
   * indirectly via dependsOn, in which case the env var will be set, but the option will not.
   */
  const isDryRun = process.env.NX_DRY_RUN === "true" || options.dryRun || false;

  if (!context.projectName) {
    throw new Error("The `command-publish` executor requires a `projectName`.");
  }

  const projectConfig =
    context.projectsConfigurations?.projects?.[context.projectName];
  if (!projectConfig?.root) {
    throw new Error(
      `Could not find project configuration for \`${context.projectName}\``
    );
  }

  const commands = resolveCommands(options);
  if (commands.length === 0) {
    throw new Error(
      "The `command-publish` executor requires a `command` or `commands` option."
    );
  }

  console.info(
    `🚀  Running Storm Command Publish executor on the ${context.projectName} project`
  );

  const cwd = resolveCwd(options.cwd, context.root, projectConfig.root);
  for (const command of commands) {
    if (isDryRun) {
      console.info(
        `Would run publish command "${command}" in current working directory: "${cwd}", but [dry-run] was set.`
      );
      continue;
    }

    try {
      console.info(
        `Running publish command "${command}" in current working directory: "${cwd}"`
      );

      const result = execSync(command, {
        cwd,
        env: {
          ...process.env,
          FORCE_COLOR: "true"
        },
        maxBuffer: LARGE_BUFFER,
        killSignal: "SIGTERM"
      });

      console.info(
        `Published ${context.projectName} successfully.${
          result ? `\n\nExecution response: ${result.toString()}` : ""
        }`
      );
    } catch (error) {
      console.error(`Failed to publish ${context.projectName}`);
      console.error(error);
      console.log("");

      return { success: false };
    }
  }

  return { success: true };
}

function resolveCommands(options: CommandPublishExecutorSchema): string[] {
  if (options.commands?.length) {
    return options.commands.map(command => command.trim()).filter(Boolean);
  }

  if (options.command?.trim()) {
    return [options.command.trim()];
  }

  return [];
}

function resolveCwd(
  cwdOption: string | undefined,
  workspaceRoot: string,
  projectRoot: string
): string {
  if (!cwdOption) {
    return joinPaths(workspaceRoot, projectRoot);
  }

  if (isAbsolute(cwdOption)) {
    return cwdOption;
  }

  return joinPaths(workspaceRoot, cwdOption);
}
