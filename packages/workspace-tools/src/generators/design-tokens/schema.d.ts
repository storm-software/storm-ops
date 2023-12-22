import { BuildExecutorSchema } from "@nxkit/style-dictionary";
import { CreateConfigOptions } from "@storm-software/design-tools";

export type DesignTokensGeneratorSchema = Omit<
  BuildExecutorSchema,
  "styleDictionaryConfig"
> &
  CreateConfigOptions;

export type NormalizedDesignTokensGeneratorSchema =
  DesignTokensGeneratorSchema & NormalizedBuildExecutorSchema;
