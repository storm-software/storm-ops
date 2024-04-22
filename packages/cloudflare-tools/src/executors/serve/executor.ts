import { ExecutorContext } from "@nx/devkit";
import { ServeExecutorSchema } from "./schema";
import { fork } from "child_process";
import { createAsyncIterable } from "@nx/devkit/src/utils/async-iterable";
import { waitForPortOpen } from "@nx/web/src/utils/wait-for-port-open";
import {
  createCliOptions,
  withRunExecutor
} from "@storm-software/workspace-tools";
import type { StormConfig } from "@storm-software/config";

export async function* serveExecutor(
  options: ServeExecutorSchema,
  context: ExecutorContext,
  config?: StormConfig
) {
  const { writeDebug, writeInfo, writeSuccess } = await import(
    "@storm-software/config-tools"
  );

  writeInfo("⚡  Running Cloudflare serve executor on the workspace", config);

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

  if (
    !context?.projectName ||
    !context?.projectsConfigurations?.projects?.[context.projectName]?.root
  ) {
    throw new Error("Nx executor context was invalid");
  }

  const projectRoot =
    context!.projectsConfigurations!.projects[context.projectName!]!.root;

  const wranglerOptions = createCliOptions({ ...options });
  const wranglerBin = require.resolve("wrangler/bin/wrangler");

  yield* createAsyncIterable<{ success: boolean; baseUrl: string }>(
    async ({ done, next, error }) => {
      process.env.PWD = projectRoot;
      const server = fork(wranglerBin, ["dev", ...wranglerOptions], {
        cwd: projectRoot,
        stdio: "inherit"
      });

      server.once("exit", code => {
        if (code === 0) {
          done();
        } else {
          error(new Error(`Cloudflare worker exited with code ${code}`));
        }
      });

      const killServer = () => {
        if (server.connected) {
          server.kill("SIGTERM");
        }
      };

      process.on("exit", () => killServer());
      process.on("SIGINT", () => killServer());
      process.on("SIGTERM", () => killServer());
      process.on("SIGHUP", () => killServer());

      await waitForPortOpen(options.port ?? 4500);

      next({
        success: true,
        baseUrl: `http://localhost:${options.port}`
      });
    }
  );

  writeSuccess("⚡ The Serve process has completed successfully", config);

  return {
    success: true
  };
}

export default withRunExecutor<ServeExecutorSchema>(
  "Cloudflare Serve executor",
  serveExecutor,
  {
    skipReadingConfig: false,
    hooks: {
      applyDefaultOptions: (options: ServeExecutorSchema) => {
        options.port ??= 4500;

        return options as ServeExecutorSchema;
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
    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
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
    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
  } catch (e) {
    return false;
  }
};
