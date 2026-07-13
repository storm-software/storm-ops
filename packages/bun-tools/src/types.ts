/**
 * Type definition for the workspace root `package.json` file.
 */
export interface WorkspacePackageJson {
  catalog?: Record<string, string>;
  workspaces?:
    | string[]
    | {
        packages?: string[];
        catalog?: Record<string, string>;
        catalogs?: Record<string, Record<string, string>>;
      };
  [key: string]: unknown;
}
