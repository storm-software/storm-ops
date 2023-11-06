export interface PresetGeneratorSchema {
  name: string;
  organization: string;
  includeApps: boolean;
  namespace?: string;
  description?: string;
  repositoryUrl?: string;
}
