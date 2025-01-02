import type { ExecutorContext, PromiseExecutor } from "@nx/devkit";
import type { StormConfig } from "@storm-software/config";
import { writeWarning } from "@storm-software/config-tools/logger/console";
import { withRunExecutor } from "@storm-software/workspace-tools/base/base-executor";
import { createHelmClient } from "../../utils/client";
import { HelmPackageExecutorSchema } from "./schema";

export async function serveExecutor(
  options: HelmPackageExecutorSchema,
  context: ExecutorContext,
  config?: StormConfig
) {
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
        helm.addRepository(repository.name, repository.url);
      } else {
        throw new Error("Repository name and url are required");
      }
    }
  }

  if (options.dependencies?.update) {
    helm.dependencyUpdate(options.chartFolder);
  }

  if (options.dependencies?.build) {
    helm.dependencyBuild(options.chartFolder);
  }

  const chartPath = await helm.package({
    chartFolder: options.chartFolder,
    outputFolder: options.outputFolder
  });

  if (options.push && chartPath && options.remote) {
    helm.push({
      chartPath,
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
