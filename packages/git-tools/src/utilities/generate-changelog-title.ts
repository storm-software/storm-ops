import type { StormConfig } from "@storm-software/config";

export function generateChangelogTitle(
  version: string,
  project?: string | null,
  workspaceConfig?: StormConfig
): string {
  if (!workspaceConfig?.repository || !project) {
    return version;
  }

  return `[${version}](${workspaceConfig.repository}/releases/tag/${project}%40${version})`;
}
