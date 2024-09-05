import { S3 } from "@aws-sdk/client-s3";
import {
  joinPathFragments,
  ProjectGraph,
  readCachedProjectGraph,
  readJsonFile,
  type ExecutorContext
} from "@nx/devkit";
import { createCliOptions } from "@storm-software/workspace-tools/utils/create-cli-options";
import { glob } from "glob";
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
  const {
    findWorkspaceRoot,
    loadStormConfig,
    writeInfo,
    writeDebug,
    writeSuccess,
    writeWarning
  } = await import("@storm-software/config-tools");

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
    const config = await loadStormConfig(workspaceRoot);

    const packageRoot =
      joinPathFragments(
        context.root,
        context.projectsConfigurations.projects[context.projectName]
          ?.root as string
      ) ?? workspaceRoot;

    const sourceRoot =
      context.projectsConfigurations.projects[context.projectName]
        ?.sourceRoot ?? workspaceRoot;
    const projectName =
      context.projectsConfigurations.projects[context.projectName]?.name ??
      context.projectName;

    const packageJsonPath = joinPathFragments(packageRoot, "package.json");
    const projectPackageJson = readJsonFile(packageJsonPath);

    const args = createCliOptions({ ...options });
    if (isDryRun) {
      args.push("--dry-run");
    }

    // console.log("");
    // console.log(`Running "wrangler deploy ${args.join(" ")}"...`);
    // console.log("");

    // let proc;
    // try {
    //   const { findWorkspaceRoot, loadStormConfig } = await import(
    //     "@storm-software/config-tools"
    //   );
    //   const workspaceRoot = findWorkspaceRoot();
    //   const config = await loadStormConfig(workspaceRoot);

    //   fork(require.resolve("wrangler/bin/wrangler"), ["deploy", ...args], {
    //     env: {
    //       CLOUDFLARE_API_TOKEN: process.env.STORM_BOT_CLOUDFLARE_TOKEN,
    //       CLOUDFLARE_ACCOUNT_ID: config.cloudflareAccountId
    //         ? config.cloudflareAccountId
    //         : undefined,
    //       WRANGLER_LOG: "debug",
    //       ...process.env,
    //       FORCE_COLOR: "true"
    //     },
    //     cwd: packageRoot,
    //     stdio: ["pipe", "pipe", "pipe", "ipc"]
    //   });
    // } catch (e) {
    //   console.error(e);
    //   throw new Error(
    //     "Unable to run Wrangler. Please ensure Wrangler is installed."
    //   );
    // }

    if (!options?.registry && !config.cloudflareAccountId) {
      throw new Error(
        "The Storm Registry URL is not set in the Storm config. Please set either the `extensions.cyclone.registry` or `config.extensions.cyclone.accountId` property in the Storm config."
      );
    }

    const endpoint = options?.registry
      ? options.registry
      : `https://${config.cloudflareAccountId}.r2.cloudflarestorage.com`;

    const projectGraph = readCachedProjectGraph();
    if (!projectGraph) {
      throw new Error("No project graph found in cache");
    }

    writeInfo(
      `Publishing ${context.projectName} to the Storm Registry at ${endpoint}`
    );

    const s3Client = new S3({
      region: "auto",
      endpoint,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    });

    const version = projectPackageJson?.version;
    writeInfo(`Generated component version: ${version}`);

    const files = await glob(joinPathFragments(sourceRoot, "**/*"), {
      ignore: "**/{*.stories.tsx,*.stories.ts,*.spec.tsx,*.spec.ts}"
    });
    const projectPath = `registry/${context.projectName}`;

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
      }, projectPackageJson?.dependencies ?? {});

    const release =
      options.tag ?? execSync("npm config get tag").toString().trim();

    writeInfo(`Clearing out existing items in ${projectPath}`);

    if (!isDryRun) {
      const response = await s3Client.listObjects({
        Bucket: options.bucketId,
        Prefix: projectPath
      });

      if (response?.Contents && response.Contents.length > 0) {
        writeDebug(
          `Deleting the following existing items from the component registry: ${response.Contents.map(item => item.Key).join(", ")}`
        );

        await Promise.all(
          response.Contents.map(item =>
            s3Client.deleteObjects({
              Bucket: options.bucketId,
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
          `No existing items to delete in the component registry path ${projectPath}`
        );
      }
    } else {
      writeWarning("[Dry run]: skipping upload to the Cyclone Registry.");
    }

    const metaJson = JSON.stringify({
      name: context.projectName,
      version,
      release,
      description: projectPackageJson.description,
      tags: projectPackageJson.keywords,
      dependencies,
      devDependencies: projectPackageJson.devDependencies,
      internalDependencies: internalDependencies
        .filter(
          projectNode =>
            projectNode.data.tags &&
            projectNode.data.tags.some(tag => tag.toLowerCase() === "component")
        )
        .map(dep => dep.name)
    });

    writeInfo(`Generating meta.json file: \n${metaJson}`);

    await r2UploadFile(
      s3Client,
      options.bucketId,
      projectPath,
      "meta.json",
      version,
      metaJson,
      "application/json",
      isDryRun
    );

    await Promise.all(
      files.map(file => {
        const fileName = file
          .replaceAll("\\", "/")
          .replace(sourceRoot.replaceAll("\\", "/"), "");

        return readFile(file, { encoding: "utf8" }).then(fileContent =>
          r2UploadFile(
            s3Client,
            options.bucketId,
            projectPath,
            fileName,
            version,
            fileContent,
            "text/plain",
            isDryRun
          )
        );
      })
    );

    writeSuccess(
      `Successfully uploaded the ${projectName} component to the Cyclone Registry`,
      config
    );

    return {
      success: true
    };
  } catch (error: any) {
    console.error("Failed to publish to Cloudflare Workers Registry");
    console.error(error);
    console.log("");

    return {
      success: false
    };
  }
}
