import { BaseExecutorSchema } from "../../../declarations";

export interface CleanPackageExecutorSchema extends BaseExecutorSchema {
  outputPath: string;
  packageJsonPath?: string;
  ignoredFiles?: string;
  fields?: string;
  cleanReadMe: boolean;
  cleanComments: boolean;
}
