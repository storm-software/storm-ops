import { fork } from "node:child_process";
import { joinPathFragments, type ExecutorContext } from "@nx/devkit";
import { createCliOptions } from "@storm-software/workspace-tools";
import type { CloudflarePublishExecutorSchema } from "./schema";

export default async function runExecutor(
  options: CloudflarePublishExecutorSchema,
  context: ExecutorContext
) {
  /**
   * We need to check both the env var and the option because the executor may have been triggered
   * indirectly via dependsOn, in which case the env var will be set, but the option will not.
   */
  const isDryRun = process.env.NX_DRY_RUN === "true" || options.dryRun || false;

  if (!context.projectName) {
    throw new Error("The executor requires a projectName.");
  }

  console.info(
    `🚀  Running Storm Cloudflare Publish executor on the ${context.projectName} worker`
  );

  if (
    !context.projectName ||
    !context.projectsConfigurations?.projects ||
    !context.projectsConfigurations.projects[context.projectName] ||
    !context.projectsConfigurations.projects[context.projectName]?.root
  ) {
    throw new Error("The executor requires projectsConfigurations.");
  }

  const packageRoot = joinPathFragments(
    context.root,
    context.projectsConfigurations.projects[context.projectName]?.root as string
  );

  try {
    const args = createCliOptions({ ...options });
    if (isDryRun) {
      args.push("--dry-run");
    }

    console.log("");
    console.log(`Running "wrangler deploy ${args.join(" ")}"...`);
    console.log("");

    let proc;
    try {
      const { findWorkspaceRoot, loadStormConfig } = await import(
        "@storm-software/config-tools"
      );
      const workspaceRoot = findWorkspaceRoot();
      const config = await loadStormConfig(workspaceRoot);

      fork(require.resolve("wrangler/bin/wrangler"), ["deploy", ...args], {
        env: {
          CLOUDFLARE_API_TOKEN: process.env.STORM_BOT_CLOUDFLARE_TOKEN,
          CLOUDFLARE_ACCOUNT_ID: config.cloudflareAccountId
            ? config.cloudflareAccountId
            : undefined,
          WRANGLER_LOG: "debug",
          ...process.env,
          FORCE_COLOR: "true"
        },
        cwd: packageRoot,
        stdio: ["pipe", "pipe", "pipe", "ipc"]
      });
    } catch (e) {
      console.error(e);
      throw new Error(
        "Unable to run Wrangler. Please ensure Wrangler is installed."
      );
    }

    proc?.stdout?.on("data", message => {
      process.stdout.write(message);
    });
    proc?.stderr?.on("data", message => {
      process.stderr.write(message);
    });

    return new Promise<{ success: boolean }>(resolve => {
      proc?.on("close", code => {
        console.log("");

        if (isDryRun) {
          console.log(
            "Would publish to Cloudflare Workers Registry, but [dry-run] was set"
          );
        } else {
          console.log("Published to Cloudflare Workers Registry");
        }

        return resolve({ success: code === 0 });
      });
    });
  } catch (error: any) {
    console.error("Failed to publish to Cloudflare Workers Registry");
    console.error(error);
    console.log("");

    return {
      success: false
    };
  }
}
