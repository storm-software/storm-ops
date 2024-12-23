import { PulumiCommandOptions } from "../../base/base-executor";

export interface PreviewExecutorSchema extends PulumiCommandOptions {
  expectNoChanges?: boolean;
}
