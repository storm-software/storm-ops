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
import { createHash } from "node:crypto";

export const r2UploadFile = async (
  client: S3,
  bucketName: string,
  projectPath: string,
  fileName: string,
  version: string,
  fileContent: string,
  contentType = "text/plain",
  isDryRun = false
) => {
  const checksum = createHash("sha256").update(fileContent).digest("base64");
  const fileKey = `${projectPath}/${fileName.startsWith("/") ? fileName.substring(1) : fileName}`;
  writeDebug(`Uploading file: ${fileKey}`);

  if (!isDryRun) {
    await client.putObject({
      Bucket: bucketName,
      Key: fileKey,
      Body: fileContent.replaceAll(' from "@cyclone-ui/', ' from "../'),
      ContentType: contentType,
      Metadata: {
        version,
        checksum
      }
    });
  } else {
    writeWarning("[Dry run]: skipping upload to the Cyclone Registry.");
  }
};

export const getInternalDependencies = (
  projectName: string,
  graph: ProjectGraph
): ProjectGraphProjectNode[] => {
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
};
