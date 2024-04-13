export type NxClientMode = "light" | "dark";
export type PackageManager = "npm" | "yarn" | "pnpm";

export interface PresetGeneratorSchema {
  name: string;
  organization: string;
  includeApps: boolean;
  includeRust: boolean;
  namespace?: string;
  description?: string;
  repositoryUrl?: string;
  nxCloud: "skip";
  mode: NxClientMode;
  packageManager: PackageManager;
}
