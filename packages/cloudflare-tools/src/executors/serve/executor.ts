import type { ExecutorContext, PromiseExecutor } from "@nx/devkit";
import { createAsyncIterable } from "@nx/devkit/src/utils/async-iterable";
import { waitForPortOpen } from "@nx/web/src/utils/wait-for-port-open";
import {
  createCliOptions,
  withRunExecutor
} from "@storm-software/workspace-tools";
import { fork } from "child_process";
import { ServeExecutorSchema } from "./schema";

export async function* serveExecutor(
  options: ServeExecutorSchema,
  context: ExecutorContext
) {
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
) as PromiseExecutor<ServeExecutorSchema>;
