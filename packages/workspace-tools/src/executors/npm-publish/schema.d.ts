export interface NpmPublishExecutorSchema {
  packageRoot?: string;
  npmRegistry?: string;
  githubRegistry?: string;
  tag?: string;
  otp?: number;
  dryRun?: boolean;
  firstRelease?: boolean;
}
