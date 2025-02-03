import { S3 } from "@aws-sdk/client-s3";
import {
  joinPathFragments,
  ProjectGraph,
  readCachedProjectGraph,
  type ExecutorContext,
} from "@nx/devkit";
import {
  getConfig,
  writeDebug,
  writeInfo,
  writeSuccess,
  writeWarning,
} from "@storm-software/config-tools";
import { findWorkspaceRoot } from "@storm-software/config-tools/utilities/find-workspace-root";
import { createCliOptions } from "@storm-software/workspace-tools/utils/create-cli-options";
import { getPackageInfo } from "@storm-software/workspace-tools/utils/package-helpers";
import { glob } from "glob";
import { execSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import {
  getInternalDependencies,
  r2UploadFile,
} from "../../utils/r2-bucket-helpers";
import type { R2UploadPublishExecutorSchema } from "./schema";

export default async function runExecutor(
  options: R2UploadPublishExecutorSchema,
  context: ExecutorContext,
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
    `🚀  Running Storm Cloudflare Publish executor on the ${context.projectName} worker`,
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
      context.projectsConfigurations.projects[context.projectName]!,
    );
    if (!projectDetails?.content) {
      throw new Error(
        `Could not find the project details for ${context.projectName}`,
      );
    }

    const args = createCliOptions({ ...options });
    if (isDryRun) {
      args.push("--dry-run");
    }

    const cloudflareAccountId = process.env.STORM_BOT_CLOUDFLARE_ACCOUNT;
    if (!options?.registry && !cloudflareAccountId) {
      throw new Error(
        "The Storm Registry URL is not set in the Storm config. Please set either the `extensions.cyclone.registry` or `config.extensions.cyclone.accountId` property in the Storm config.",
      );
    }

    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      throw new Error(
        "The AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables are not set. Please set these environment variables to upload to the Cyclone Registry.",
      );
    }

    const endpoint = options?.registry
      ? options.registry
      : `https://${cloudflareAccountId}.r2.cloudflarestorage.com`;

    const projectGraph = readCachedProjectGraph();
    if (!projectGraph) {
      throw new Error("No project graph found in cache");
    }

    writeInfo(
      `Publishing ${context.projectName} to the Storm Registry at ${endpoint}`,
    );

    const s3Client = new S3({
      region: "auto",
      endpoint,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const version = projectDetails.content?.version;
    writeInfo(`Generated component version: ${version}`);

    const files = await glob(joinPathFragments(sourceRoot, "**/*"), {
      ignore: "**/{*.stories.tsx,*.stories.ts,*.spec.tsx,*.spec.ts}",
    });
    const projectPath = `registry/${context.projectName}`;

    const internalDependencies = await getInternalDependencies(
      context.projectName,
      projectGraph as ProjectGraph,
    );

    const dependencies = internalDependencies
      .filter(
        (projectNode) =>
          !projectNode.data.tags ||
          projectNode.data.tags.every(
            (tag) => tag.toLowerCase() !== "component",
          ),
      )
      .reduce((ret, dep) => {
        if (!ret[dep.name]) {
          ret[dep.name] = "latest";
        }

        return ret;
      }, projectDetails.content.dependencies ?? {});

    const release =
      options.tag ?? execSync("npm config get tag").toString().trim();

    writeInfo(`Clearing out existing items in ${projectPath}`);

    if (!isDryRun) {
      const response = await s3Client.listObjects({
        Bucket: options.bucketId,
        Prefix: projectPath,
      });

      if (response?.Contents && response.Contents.length > 0) {
        writeDebug(
          `Deleting the following existing items from the component registry: ${response.Contents.map((item) => item.Key).join(", ")}`,
        );

        await Promise.all(
          response.Contents.map((item) =>
            s3Client.deleteObjects({
              Bucket: options.bucketId,
              Delete: {
                Objects: [
                  {
                    Key: item.Key,
                  },
                ],
                Quiet: false,
              },
            }),
          ),
        );
      } else {
        writeDebug(
          `No existing items to delete in the component registry path ${projectPath}`,
        );
      }
    } else {
      writeWarning("[Dry run]: skipping upload to the Cyclone Registry.");
    }

    const meta = {
      name: context.projectName,
      version,
      release,
      description: projectDetails.content.description,
      tags: projectDetails.content.keywords,
      dependencies,
      devDependencies: null,
      internalDependencies: internalDependencies
        .filter(
          (projectNode) =>
            projectNode.data.tags &&
            projectNode.data.tags.some(
              (tag) => tag.toLowerCase() === "component",
            ),
        )
        .map((dep) => dep.name),
    };
    if (projectDetails.type === "package.json") {
      meta.devDependencies = projectDetails.content.devDependencies;
    }

    const metaJson = JSON.stringify(meta);

    writeInfo(`Generating meta.json file: \n${metaJson}`);

    await r2UploadFile(
      s3Client,
      options.bucketId,
      projectPath,
      "meta.json",
      version,
      metaJson,
      "application/json",
      isDryRun,
    );

    await Promise.all(
      files.map((file) => {
        const fileName = file
          .replaceAll("\\", "/")
          .replace(sourceRoot.replaceAll("\\", "/"), "");

        return readFile(file, { encoding: "utf8" }).then((fileContent) =>
          r2UploadFile(
            s3Client,
            options.bucketId,
            projectPath,
            fileName,
            version,
            fileContent,
            "text/plain",
            isDryRun,
          ),
        );
      }),
    );

    writeSuccess(
      `Successfully uploaded the ${projectName} component to the Cyclone Registry`,
      config,
    );

    return {
      success: true,
    };
  } catch (error: any) {
    console.error("Failed to publish to Cloudflare Workers Registry");
    console.error(error);
    console.log("");

    return {
      success: false,
    };
  }
}
