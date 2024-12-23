import { PulumiCommandOptions } from "../../base/base-executor";

export interface ImportExecutorSchema extends PulumiCommandOptions {
  id: string;
  target: string;
}
