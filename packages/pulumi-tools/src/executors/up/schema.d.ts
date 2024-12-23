import { PulumiCommandOptions } from "../../base/base-executor";

export interface UpExecutorSchema extends PulumiCommandOptions {
  skipPreview?: boolean;
  yes?: boolean;
  suppressOutputs?: boolean;
  json?: boolean;
}
