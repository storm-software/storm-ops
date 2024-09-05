export interface R2UploadPublishExecutorSchema {
  packageRoot?: string;
  registry: string;
  bucketId: string;
  tsConfig: string;
  tag?: string;
  dryRun: boolean;
  verbose: boolean;
}
