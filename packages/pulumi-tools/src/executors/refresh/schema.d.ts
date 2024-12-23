import { PulumiCommandOptions } from "../../base/base-executor";

export interface RefreshExecutorSchema extends PulumiCommandOptions {
  skipPreview?: boolean;
  yes?: boolean;
}
