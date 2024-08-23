export interface HelmDependencyGeneratorSchema {
  /** Project name */
  project: string;
  /** Chart Name of the Dependency */
  chartName?: string;
  /** Chart Version of the Dependency */
  chartVersion?: string;
  /** Repository of the Dependency */
  repository: string;
  /** Repository Name of the Dependency */
  repositoryName: string;
  /** Format the generated files */
  format?: boolean;
  [k: string]: unknown;
}
