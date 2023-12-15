import { BuildExecutorSchema } from "@nxkit/style-dictionary";
import { CreateConfigOptions } from "@storm-software/design-tools";

export type DesignTokensExecutorSchema = Omit<
  BuildExecutorSchema,
  "styleDictionaryConfig"
> &
  CreateConfigOptions;

export type NormalizedDesignTokensExecutorSchema = DesignTokensExecutorSchema &
  NormalizedBuildExecutorSchema;
