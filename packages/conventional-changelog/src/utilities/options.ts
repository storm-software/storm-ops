import { getWorkspaceConfig } from "@storm-software/config-tools/get-config";
import { PresetConfig, ResolvedPresetOptions } from "../types/config";
import { DEFAULT_COMMIT_TYPES } from "./constants";
import { formatDate } from "./helpers";

/**
 * Resolve the preset options.
 *
 * @param config The preset configuration object.
 * @returns The resolved preset options.
 */
export async function resolveOptions(
  config: PresetConfig = {}
): Promise<ResolvedPresetOptions> {
  const workspaceConfig = await getWorkspaceConfig();

  const resolvedOptions: ResolvedPresetOptions = {
    workspace: workspaceConfig,
    ignoreCommits: config.ignoreCommits || [],
    issuePrefixes: config.issuePrefixes || ["#"],
    types: config.types || DEFAULT_COMMIT_TYPES,
    bumpStrict: !!config.bumpStrict,
    scope: workspaceConfig.variant !== "minimal" ? config.scope : undefined,
    issueUrlFormat:
      config.issueUrlFormat ||
      "{{host}}/{{owner}}/{{repository}}/issues/{{id}}",
    commitUrlFormat: "{{host}}/{{owner}}/{{repository}}/commit/{{hash}}",
    compareUrlFormat:
      "{{host}}/{{owner}}/{{repository}}/compare/{{previousTag}}...{{currentTag}}",
    userUrlFormat: "{{host}}/{{user}}",
    preMajor: !!config.preMajor,
    formatDate: config.formatDate || formatDate
  } as const;

  return resolvedOptions;
}
