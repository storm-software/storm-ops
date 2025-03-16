import type { StormConfig } from "@storm-software/config";

export function generateChangelogTitle(
  version: string,
  project?: string | null,
  excludeDate = false,
  workspaceConfig?: StormConfig | null
): string {
  if (!workspaceConfig?.repository || !project) {
    return version;
  }

  let maybeDateStr = "";
  if (excludeDate !== false) {
    const dateStr = new Date().toISOString().slice(0, 10);
    maybeDateStr = ` (${dateStr})`;
  }

  return `[${version}](${workspaceConfig.repository}/releases/tag/${project}%40${version})${maybeDateStr}`;
}
