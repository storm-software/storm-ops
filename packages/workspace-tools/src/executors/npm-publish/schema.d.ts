export interface NpmPublishExecutorSchema {
  packageRoot?: string;
  registry?: string;
  tag?: string;
  otp?: number;
  dryRun?: boolean;
  firstRelease?: boolean;
}
