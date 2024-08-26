import type { ExecutorContext, PromiseExecutor } from "@nx/devkit";
import type { StormConfig } from "@storm-software/config";
import { withRunExecutor } from "@storm-software/workspace-tools";
import { createHelmClient } from "../../utils/client";
import { HelmPackageExecutorSchema } from "./schema";

export async function serveExecutor(
  options: HelmPackageExecutorSchema,
  context: ExecutorContext,
  config?: StormConfig
) {
  const { writeWarning } = await import("@storm-software/config-tools");

  if (
    !context?.projectName ||
    !context?.projectsConfigurations?.projects?.[context.projectName]?.root
  ) {
    throw new Error("Nx executor context was invalid");
  }

  const helm = createHelmClient();
  if (options.dependencies?.repositories) {
    for (const repository of options.dependencies.repositories) {
      if (repository.name && repository.url) {
        await helm.addRepository(repository.name, repository.url);
      } else {
        throw new Error("Repository name and url are required");
      }
    }
  }

  if (options.dependencies?.update) {
    await helm.dependencyUpdate(options.chartFolder);
  }

  if (options.dependencies?.build) {
    await helm.dependencyBuild(options.chartFolder);
  }

  const chartPath = await helm.package({
    chartFolder: options.chartFolder,
    outputFolder: options.outputFolder
  });

  if (options.push && chartPath && options.remote) {
    await helm.push({
      chartPath: chartPath,
      remote: options.remote
    });
  } else {
    writeWarning(`Chart packaged at: ${chartPath}`, config);
  }

  return {
    success: true
  };
}

export default withRunExecutor<HelmPackageExecutorSchema>(
  "Helm Chart Package executor",
  serveExecutor,
  {
    skipReadingConfig: false,
    hooks: {
      applyDefaultOptions: (options: HelmPackageExecutorSchema) => {
        options.port ??= 4500;

        return options as HelmPackageExecutorSchema;
      }
    }
  }
) as PromiseExecutor<HelmPackageExecutorSchema>;