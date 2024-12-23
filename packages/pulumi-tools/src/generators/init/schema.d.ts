import { BaseGeneratorSchema } from "@storm-software/workspace-tools/base/base-generator";

export interface InitGeneratorSchema extends BaseGeneratorSchema {
  name?: string;
  directory?: string;
  provider?: Provider;
  secretsProvider?: string;
  login?: string;
  skipFormat?: boolean;
}
