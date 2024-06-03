export interface CargoPublishExecutorSchema {
  cargoRegistry?: string;
  githubRegistry?: string;
  packageRoot?: string;
  dryRun?: boolean;
}
