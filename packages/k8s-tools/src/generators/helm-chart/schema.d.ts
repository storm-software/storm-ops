import { BaseGeneratorSchema } from "@storm-software/workspace-tools/base/base-generator.schema.d";

export interface HelmChartGeneratorSchema extends BaseGeneratorSchema {
  /** Name of the chart */
  name: string;
  /** Name of the project to add the chart to */
  project: string;
  /** Folder to store the chart */
  chartFolder?: string;
  /** Format the generated chart */
  format?: boolean;

  [k: string]: unknown;
}
