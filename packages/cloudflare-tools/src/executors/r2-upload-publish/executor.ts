import { S3 } from "@aws-sdk/client-s3";
import {
  createProjectGraphAsync,
  ProjectGraph,
  readCachedProjectGraph,
  type ExecutorContext
} from "@nx/devkit";
import {
  correctPaths,
  getConfig,
  joinPaths,
  writeDebug,
  writeSuccess,
  writeTrace,
  writeWarning
} from "@storm-software/config-tools";
import { findWorkspaceRoot } from "@storm-software/config-tools/utilities/find-workspace-root";
import { createCliOptions } from "@storm-software/workspace-tools/utils/create-cli-options";
import { getPackageInfo } from "@storm-software/workspace-tools/utils/package-helpers";
import { glob } from "glob";
import mime from "mime-types";
import { execSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import {
  getInternalDependencies,
  r2UploadFile
} from "../../utils/r2-bucket-helpers";
import type { R2UploadPublishExecutorSchema } from "./schema";

export default async function runExecutor(
  options: R2UploadPublishExecutorSchema,
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

  try {
    const workspaceRoot = findWorkspaceRoot();
    const config = await getConfig(workspaceRoot);

    const sourceRoot =
      context.projectsConfigurations.projects[context.projectName]
        ?.sourceRoot ?? workspaceRoot;
    const projectName =
      context.projectsConfigurations.projects[context.projectName]?.name ??
      context.projectName;

    const projectDetails = getPackageInfo(
      context.projectsConfigurations.projects[context.projectName]!
    );

    const bucketId = options.bucketId;
    const bucketPath = options.bucketPath || "/";

    if (!bucketId) {
      throw new Error("The executor requires a bucketId.");
    }

    const args = createCliOptions({ ...options });
    if (isDryRun) {
      args.push("--dry-run");
    }

    const cloudflareAccountId =
      process.env.CLOUDFLARE_ACCOUNT_ID ||
      process.env.STORM_BOT_CLOUDFLARE_ACCOUNT;
    if (!options?.registry && !cloudflareAccountId) {
      throw new Error(
        "The registry option and `CLOUDFLARE_ACCOUNT_ID` environment variable are not set. Please set one of these values to upload to the Cloudflare R2 bucket."
      );
    }

    if (
      (!process.env.STORM_BOT_ACCESS_KEY_ID &&
        !process.env.ACCESS_KEY_ID &&
        !process.env.CLOUDFLARE_ACCESS_KEY_ID &&
        !process.env.AWS_ACCESS_KEY_ID) ||
      (!process.env.STORM_BOT_ACCESS_KEY_SECRET &&
        !process.env.CLOUDFLARE_ACCESS_KEY_SECRET &&
        !process.env.ACCESS_KEY_SECRET &&
        !process.env.AWS_ACCESS_KEY_SECRET)
    ) {
      throw new Error(
        "The `ACCESS_KEY_ID` and `ACCESS_KEY_SECRET` environment variables are not set. Please set these environment variables to upload to the Cloudflare R2 bucket."
      );
    }

    const registry = options?.registry
      ? options.registry
      : `https://${cloudflareAccountId}.r2.cloudflarestorage.com`;

    let projectGraph!: ProjectGraph;
    try {
      projectGraph = readCachedProjectGraph();
    } catch {
      await createProjectGraphAsync();
      projectGraph = readCachedProjectGraph();
    }

    if (!projectGraph) {
      throw new Error(
        "The executor failed because the project graph is not available. Please run the build command again."
      );
    }

    writeDebug(
      `Publishing ${context.projectName} to the ${bucketId} R2 Bucket (at ${registry})`
    );

    const client = new S3({
      region: "auto",
      endpoint: registry,
      credentials: {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        accessKeyId: (process.env.STORM_BOT_ACCESS_KEY_ID ||
          process.env.CLOUDFLARE_ACCESS_KEY_ID ||
          process.env.AWS_ACCESS_KEY_ID ||
          process.env.ACCESS_KEY_ID)!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        secretAccessKey: (process.env.STORM_BOT_ACCESS_KEY_SECRET ||
          process.env.CLOUDFLARE_ACCESS_KEY_SECRET ||
          process.env.AWS_ACCESS_KEY_SECRET ||
          process.env.ACCESS_KEY_SECRET)!
      }
    });

    const version = projectDetails?.content?.version;
    if (version) {
      writeDebug(`Starting upload version ${version}`);
    }

    const basePath = options.path || sourceRoot;
    const files = await glob(joinPaths(basePath, "**/*"), {
      ignore: "**/{*.stories.tsx,*.stories.ts,*.spec.tsx,*.spec.ts}"
    });

    const internalDependencies = await getInternalDependencies(
      context.projectName,
      projectGraph as ProjectGraph
    );

    const dependencies = internalDependencies
      .filter(
        projectNode =>
          !projectNode.data.tags ||
          projectNode.data.tags.every(tag => tag.toLowerCase() !== "component")
      )
      .reduce((ret, dep) => {
        if (!ret[dep.name]) {
          ret[dep.name] = "latest";
        }

        return ret;
      }, projectDetails?.content.dependencies ?? {});

    const release =
      options.tag ?? execSync("npm config get tag").toString().trim();

    if (options.clean === true) {
      writeDebug(`Clearing out existing items in ${bucketPath}`);

      if (!isDryRun) {
        const response = await client.listObjects({
          Bucket: bucketId,
          Prefix: bucketPath
        });

        if (response?.Contents && response.Contents.length > 0) {
          writeTrace(
            `Deleting the following existing items from the R2 bucket path ${
              bucketPath
            }: ${response.Contents.map(item => item.Key).join(", ")}`
          );

          await Promise.all(
            response.Contents.map(item =>
              client.deleteObjects({
                Bucket: bucketId,
                Delete: {
                  Objects: [
                    {
                      Key: item.Key
                    }
                  ],
                  Quiet: false
                }
              })
            )
          );
        } else {
          writeDebug(
            `No existing items to delete in the R2 bucket path ${bucketPath}`
          );
        }
      } else {
        writeWarning("[Dry run]: Skipping R2 bucket clean.");
      }
    }

    if (options.writeMetaJson === true) {
      const meta = {
        name: context.projectName,
        version,
        release,
        description: projectDetails?.content?.description,
        tags: projectDetails?.content?.keywords,
        dependencies,
        devDependencies: null,
        internalDependencies: internalDependencies
          .filter(
            projectNode =>
              projectNode.data.tags &&
              projectNode.data.tags.some(
                tag => tag.toLowerCase() === "component"
              )
          )
          .map(dep => dep.name)
      };
      if (projectDetails?.type === "package.json") {
        meta.devDependencies = projectDetails?.content?.devDependencies;
      }

      const metaJson = JSON.stringify(meta);
      writeTrace(`Generating meta.json file: \n${metaJson}`);

      await r2UploadFile(
        client,
        bucketId,
        bucketPath,
        "meta.json",
        version,
        metaJson,
        "application/json",
        isDryRun
      );
    }

    await Promise.all(
      files.map(async file => {
        const name = correctPaths(file).replace(correctPaths(basePath), "");
        const type = mime.lookup(name) || "application/octet-stream";

        writeTrace(`Uploading file: ${name} (content-type: ${type})`);

        await r2UploadFile(
          client,
          bucketId,
          bucketPath,
          name,
          version,
          await readFile(file, { encoding: "utf8" }),
          type,
          isDryRun
        );
      })
    );

    writeSuccess(
      `Successfully uploaded the ${
        projectName
      } project to the Cloudflare R2 bucket.`,
      config
    );

    return {
      success: true
    };
  } catch (error) {
    console.error("Failed to publish to Cloudflare R2 bucket");
    console.error(error);
    console.log("");

    return {
      success: false
    };
  }
}
