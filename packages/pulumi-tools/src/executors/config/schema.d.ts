import { PulumiCommandOptions } from "../../base/base-executor";

export interface ConfigExecutorSchema extends PulumiCommandOptions {
  showSecrets?: boolean;
  action: string;
  secret?: boolean;
  path?: boolean;
  value?: string;
}
