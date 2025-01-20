import { BaseExecutorSchema } from "@storm-software/workspace-tools/base/base-executor.schema.d";

export interface HelmPackageExecutorSchema extends BaseExecutorSchema {
  /** Folder where the chart is stored */
  chartFolder: string;
  /** Folder to store the packaged chart */
  outputFolder: string;
  /** Push the chart to a remote registry */
  push?: boolean;
  /** Remote registry to publish the chart */
  remote?: string;
  /** Options related to dependencies */
  dependencies?: {
    /** Runs `helm dependency update` before packaging */
    update?: boolean;
    /** Runs `helm dependency build` before packaging */
    build?: boolean;
    /** List of repositories to add with `helm repo add` before packaging */
    repositories?: {
      /** Name of the repository */
      name?: string;
      /** URL of the repository */
      url?: string;
      [k: string]: unknown;
    }[];
    [k: string]: unknown;
  };
  [k: string]: unknown;
}
