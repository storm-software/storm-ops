import { S3 } from "@aws-sdk/client-s3";
import {
  ProjectGraph,
  ProjectGraphDependency,
  ProjectGraphProjectNode
} from "@nx/devkit";
import {
  writeDebug,
  writeWarning
} from "@storm-software/config-tools/logger/console";
import { joinPaths } from "@storm-software/config-tools/utilities/correct-paths";
import { createHash } from "node:crypto";

/**
 * Upload a file to a Cloudflare R2 bucket
 *
 * @param client - The S3 client configured for Cloudflare R2
 * @param bucketName - The name of the R2 bucket
 * @param bucketPath - The path within the R2 bucket where the file will be uploaded
 * @param fileName - The name of the file to upload
 * @param version - The version metadata to associate with the file
 * @param fileContent - The content of the file to upload
 * @param contentType - The MIME type of the file content
 * @param isDryRun - Whether to perform a dry run without actual upload
 */
export async function uploadFile(
  client: S3,
  bucketName: string,
  bucketPath: string | undefined,
  fileName: string,
  version: string,
  fileContent: string,
  contentType = "application/octet-stream",
  isDryRun = false
) {
  const key =
    (!bucketPath?.trim() || bucketPath?.trim() === "/"
      ? fileName
      : joinPaths(bucketPath.trim(), fileName)
    )?.replace(/^\/+/g, "") || "";

  writeDebug(
    `Uploading ${key} (content-type: ${contentType}) to the ${bucketName} R2 bucket`
  );

  if (!isDryRun) {
    await client.putObject(
      {
        Bucket: bucketName,
        Key: key,
        Body: fileContent,
        ContentType: contentType,
        Metadata: {
          version,
          checksum: createHash("sha256").update(fileContent).digest("base64")
        }
      },
      {
        requestTimeout: 15 * 60 * 1000 // 15 minutes
      }
    );
  } else {
    writeWarning("[Dry run]: Skipping upload to the R2 bucket.");
  }
}

/**
 * Get internal dependencies of a project from the project graph
 *
 * @param projectName - The name of the project
 * @param graph - The project graph
 * @returns An array of internal project nodes that are dependencies of the specified project
 */
export function getInternalDependencies(
  projectName: string,
  graph: ProjectGraph
): ProjectGraphProjectNode[] {
  const allDeps = graph.dependencies[projectName] ?? [];

  return Array.from(
    allDeps.reduce(
      (acc: ProjectGraphProjectNode[], node: ProjectGraphDependency) => {
        const found = graph.nodes[node.target];
        if (found) acc.push(found);
        return acc;
      },
      []
    )
  );
}
