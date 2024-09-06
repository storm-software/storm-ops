import {
  type ExecutorContext,
  parseTargetString,
  runExecutor
} from "@nx/devkit";
import { StormConfig } from "@storm-software/config";
import type { BaseTokenizerOptions } from "@storm-software/config-tools";
import { applyWorkspaceExecutorTokens } from "@storm-software/workspace-tools/utils/apply-workspace-tokens";
import { getPackageInfo } from "@storm-software/workspace-tools/utils/package-helpers";
import { CargoToml } from "@storm-software/workspace-tools/utils/toml";
import https from "node:https";
import type { ContainerPublishExecutorSchema } from "./schema.d";

export default async function* publishExecutor(
  options: ContainerPublishExecutorSchema,
  context: ExecutorContext
) {
  const { loadStormConfig, applyWorkspaceTokens, findWorkspaceRoot } =
    await import("@storm-software/config-tools");

  /**
   * We need to check both the env var and the option because the executor may have been triggered
   * indirectly via dependsOn, in which case the env var will be set, but the option will not.
   */
  const isDryRun = process.env.NX_DRY_RUN === "true" || options.dryRun || false;

  if (!context.projectName) {
    throw new Error("The executor requires a projectName.");
  }

  console.info(
    `🚀  Running Storm Container Registry Publish executor on the ${context.projectName} crate`
  );

  const workspaceRoot = findWorkspaceRoot();
  const config = await loadStormConfig(workspaceRoot);

  const projectConfig =
    context.projectsConfigurations?.projects[context.projectName];
  if (!projectConfig) {
    throw new Error(
      `The executor requires a valid projectsConfiguration - No configuration found for project ${context.projectName}`
    );
  }

  const projectRoot = projectConfig?.root ?? workspaceRoot;
  const sourceRoot = projectConfig?.sourceRoot ?? workspaceRoot;
  const projectName = projectConfig?.name ?? context.projectName;
  config.workspaceRoot = workspaceRoot;

  const tokenized = (await applyWorkspaceTokens(
    options,
    {
      config,
      workspaceRoot,
      projectRoot,
      sourceRoot,
      projectName,
      ...projectConfig
    } as BaseTokenizerOptions,
    applyWorkspaceExecutorTokens
  )) as ContainerPublishExecutorSchema;

  tokenized.engine ??= "docker";
  tokenized.registry ??= config.registry.container;

  try {
    if (isDryRun) {
      console.log(
        `Would publish to ${tokenized.registry}, but [dry-run] was set`
      );
    } else {
      console.log(`Published to ${tokenized.registry}`);

      const packageManager = getPackageInfo(projectConfig);
      if (packageManager) {
        tokenized["build-args"] ??= [
          "ENVIRONMENT=production",
          "DEBUG_IMAGE=false"
        ];
        tokenized["labels"] ??= [];

        let version = "";
        if (process.env.TAG) {
          version = process.env.TAG;
        } else {
          if (packageManager.type === "Cargo.toml") {
            version = (packageManager.content as CargoToml).package.version;
          } else if (packageManager.type === "package.json") {
            version = packageManager.content.version;
          }
        }

        tokenized["build-args"].push(`RELEASE=${version}`);
        tokenized["labels"].push(`org.opencontainers.image.version=${version}`);

        const tags = await getRegistryVersion(projectName, config);
        if (tags.length === 0) {
          tokenized["labels"].push(
            `org.opencontainers.image.created=${new Date().toISOString()}`
          );
        } else if (tags.includes(version)) {
          console.warn(
            `Skipped package "${projectName}" because v${version} already exists in ${tokenized.registry}`
          );
          return {
            success: true
          };
        }
      } else {
        console.warn(
          `No package manager found for project "${projectName}" - Skipping container publishing`
        );
        return {
          success: true
        };
      }

      const { project, target, configuration } = parseTargetString(
        "container",
        context
      );
      for await (const output of await runExecutor<{
        success: boolean;
        baseUrl?: string;
      }>({ project, target, configuration }, tokenized, context)) {
        if (!output.success) {
          throw new Error("Could not compile application files");
        }
        yield;
      }
    }

    return {
      success: true
    };
  } catch (error: any) {
    console.error(`Failed to publish to ${tokenized.registry}`);
    console.error(error);
    console.log("");

    return {
      success: false
    };
  }
}

export const getRegistryVersion = (
  name: string,
  config: StormConfig
): Promise<string[]> => {
  if (!name) {
    throw new Error(
      "The `getRegistryVersion` function requires a container name."
    );
  }

  try {
    const tagsApiUrl = `${config.registry.container}/v2/namespaces/${encodeURIComponent(config.namespace ? config.namespace : "storm-software")}/repositories/${encodeURIComponent(
      name.replace(`${config.namespace}-`, "")
    )}/tags`;
    console.log(`Checking for existing version at ${tagsApiUrl}`);

    return new Promise(
      (resolve: (value: string[]) => void, reject: (error: any) => void) =>
        https
          .get(tagsApiUrl, res => {
            if (res.statusCode === 404) {
              console.log(`No existing version found at ${tagsApiUrl}`);
              return resolve([] as string[]);
            }

            res.on("data", data => {
              if (data) {
                console.log(
                  `Existing versions found at ${tagsApiUrl} - ${data}`
                );
                const json = JSON.parse(data.toString());
                return resolve(
                  json.results
                    .filter(
                      (result: { status: string; name: string }) =>
                        result.status === "active" &&
                        result.name &&
                        result.name !== "latest"
                    )
                    .map((result: { name: string }) => result.name)
                );
              }

              return reject(
                new Error(
                  "No data returned from container registry, expected a 404 if no tags exist"
                )
              );
            });
          })
          .on("error", e => {
            throw e;
          })
    );
  } catch (error) {
    console.error(`Failed to get version from ${config.registry.container}`);
    console.error(error);
    console.log("");

    throw new Error(
      `Could not get version from container registry - ${config.registry.container}`,
      {
        cause: error
      }
    );
  }
};
