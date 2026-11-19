import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import {
  ProjectGraph,
  ProjectGraphDependency,
  ProjectGraphProjectNode
} from "@nx/devkit";
import {
  writeDebug,
  writeError,
  writeWarning
} from "@storm-software/config-tools/logger/console";
import {
  correctPaths,
  joinPaths
} from "@storm-software/config-tools/utilities/correct-paths";
import mime from "mime-types";
import { createHash } from "node:crypto";
import { statSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { setTimeout } from "node:timers/promises";
import prettyBytes from "pretty-bytes";

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
  client: S3Client,
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
    `Uploading ${key} (content-type: ${contentType}, size: ${prettyBytes(
      Buffer.byteLength(fileContent, getEncoding(contentType))
    )}) to the ${bucketName} R2 bucket`
  );

  try {
    if (!isDryRun) {
      // Retry individual objects, including when the shared SDK retry quota is
      // exhausted. Upload instances are single-use, so recreate one each time.
      for (let attempt = 0; ; attempt++) {
        try {
          const upload = new Upload({
            client,
            params: {
              Bucket: bucketName,
              Key: key,
              Body: Buffer.from(fileContent, getEncoding(contentType)),
              ContentType: contentType,
              Metadata: {
                version,
                checksum: createHash("sha256")
                  .update(fileContent)
                  .digest("base64")
              }
            }
          });

          await upload.done();
          break;
        } catch (error) {
          const failure = error as {
            $metadata?: { httpStatusCode?: number };
            code?: string;
            name?: string;
          } | null;
          const status = failure?.$metadata?.httpStatusCode;
          const retryable =
            status !== undefined
              ? [408, 429, 500, 502, 503, 504].includes(status)
              : [
                  "ECONNRESET",
                  "ETIMEDOUT",
                  "EPIPE",
                  "ECONNREFUSED",
                  "EAI_AGAIN"
                ].includes(failure?.code ?? "") ||
                ["TimeoutError", "RequestTimeout", "NetworkingError"].includes(
                  failure?.name ?? ""
                );
          if (!retryable || attempt >= 3) {
            throw error;
          }
          const delay = Math.round(500 * 2 ** attempt * (0.5 + Math.random()));
          writeWarning(
            `Retrying upload of ${key} to ${bucketName} after a transient failure (attempt ${attempt + 2}/4, waiting ${delay}ms).`
          );
          await setTimeout(delay);
        }
      }
    } else {
      writeWarning("[Dry run]: Skipping upload to the R2 bucket.");
    }
  } catch (error) {
    writeError(`Failed to upload ${key} to the ${bucketName} R2 bucket.`);
    throw error;
  }
}

/** Upload generated files, preserving their paths relative to the output directory. */
export async function uploadFiles(
  client: S3Client,
  bucketName: string,
  bucketPath: string,
  basePath: string,
  files: string[],
  version: string,
  isDryRun = false
) {
  // Bound both upload concurrency and file-buffer memory. Settle each batch
  // before returning a failure so uploads do not outlive the executor result.
  const concurrency = 8;
  for (let offset = 0; offset < files.length; offset += concurrency) {
    const results = await Promise.allSettled(
      files.slice(offset, offset + concurrency).map(async file => {
        if (!statSync(file, { throwIfNoEntry: false })?.isFile()) {
          return;
        }
        const name = correctPaths(file).replace(correctPaths(basePath), "");
        const type = mime.lookup(name) || "application/octet-stream";
        await uploadFile(
          client,
          bucketName,
          bucketPath,
          name,
          version,
          await readFile(file, getEncoding(type)),
          type,
          isDryRun
        );
      })
    );
    const failure = results.find(result => result.status === "rejected");
    if (failure?.status === "rejected") {
      throw failure.reason;
    }
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

/**
 * Determine if a MIME type represents a text file
 *
 * @param mimeType - The MIME type to check
 * @returns True if the MIME type represents a text file, false otherwise
 */
export function isTextFile(mimeType: string): boolean {
  return (
    mimeType.startsWith("text/") ||
    mimeType === "application/json" ||
    mimeType === "application/javascript" ||
    mimeType === "application/xml" ||
    mimeType === "application/x-yaml" ||
    mimeType === "application/xhtml+xml" ||
    mimeType === "application/x-httpd-php" ||
    mimeType === "image/svg+xml"
  );
}

/**
 * Get the appropriate encoding for a given MIME type
 *
 * @param mimeType - The MIME type to evaluate
 * @returns The encoding string ("utf8" for text files, "binary" for others)
 */
export function getEncoding(mimeType: string): BufferEncoding {
  return isTextFile(mimeType) ? "utf8" : "binary";
}
