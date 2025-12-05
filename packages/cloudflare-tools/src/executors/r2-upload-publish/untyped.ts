import { defineUntypedSchema } from "untyped";

export default defineUntypedSchema({
  $schema: {
    id: "R2UploadPublishExecutorSchema",
    title: "R2 Upload Publish Executor",
    description: "A type definition for the R2 Upload Publish executor schema",
    requires: ["path", "bucketId", "bucketPath"]
  },
  path: {
    $schema: {
      title: "Upload Files path",
      type: "string",
      format: "path",
      description: "The path to the files to upload"
    }
  },
  registry: {
    $schema: {
      title: "Registry",
      type: "string",
      description: "The registry URL to publish to"
    }
  },
  bucketId: {
    $schema: {
      title: "Bucket ID",
      type: "string",
      description: "The ID of the R2 bucket"
    }
  },
  bucketPath: {
    $schema: {
      title: "Bucket Path",
      type: "string",
      format: "path",
      description: "The path in the R2 bucket to upload files to"
    },
    $default: "/"
  },
  tag: {
    $schema: {
      title: "Tag",
      type: "string",
      description: "The tag to publish with"
    },
    $default: "latest"
  },
  writeMetaJson: {
    $schema: {
      title: "Write Meta JSON",
      type: "boolean",
      description: "Write a `meta.json` file to the upload bucket"
    },
    $default: false
  },
  clean: {
    $schema: {
      title: "Clean",
      type: "boolean",
      description: "Clean the bucket before uploading files"
    },
    $default: false
  },
  verbose: {
    $schema: {
      title: "Verbose",
      type: "boolean",
      description: "Enable verbose logging"
    },
    $default: false
  },
  dryRun: {
    $schema: {
      title: "Dry Run",
      type: "boolean",
      description: "Perform a dry run"
    },
    $default: false
  }
});
