import { getWorkspaceConfig } from "@storm-software/config-tools/get-config";
import { StormWorkspaceConfig } from "@storm-software/config/types";
import createBasePreset from "conventional-changelog-conventionalcommits";
import defu from "defu";
import { DEFAULT_COMMIT_TYPES } from "./commit-types";
import { COMMIT_CONFIGS } from "./configs";
import { Preset } from "./types/preset";
import { CHANGELOG_COMMIT_TYPES_OBJECT } from "./utilities/constants";
import { getNxScopes, getRuleFromScopeEnum } from "./utilities/nx-scopes";

export {
  CHANGELOG_COMMIT_TYPES_OBJECT as CHANGELOG_COMMIT_TYPES,
  COMMIT_CONFIGS,
  DEFAULT_COMMIT_TYPES
};

/**
 * Create a preset configuration for Storm Software changelog conventions.
 *
 * @param config - The configuration object.
 * @returns The preset configuration.
 */
export default async function createPreset(
  variant: StormWorkspaceConfig["variant"] = "monorepo"
): Promise<Preset> {
  const workspaceConfig = await getWorkspaceConfig();

  if (variant === "minimal") {
    return defu(
      await createBasePreset({ ...COMMIT_CONFIGS.minimal.changelogs.props }),
      {
        ...COMMIT_CONFIGS.minimal,
        commitlint: {
          ...COMMIT_CONFIGS.minimal.commitlint,
          regex: new RegExp(
            `(${Object.keys(DEFAULT_COMMIT_TYPES).join("|")})!?:\\s([a-z0-9:\\-\\/\\s])+`
          )
        }
      }
    );
  }

  const nxScopes = await getNxScopes({ config: workspaceConfig });
  return defu(
    await createBasePreset({
      ...COMMIT_CONFIGS.monorepo.changelogs.props,
      scope: nxScopes
    }),
    {
      ...COMMIT_CONFIGS.monorepo,
      commitlint: {
        ...COMMIT_CONFIGS.monorepo.commitlint,
        rules: {
          ...COMMIT_CONFIGS.monorepo.commitlint.rules,
          ["scope-enum"]: getRuleFromScopeEnum(nxScopes)
        },
        regex: new RegExp(
          `(${Object.keys(DEFAULT_COMMIT_TYPES).join("|")})\\((${nxScopes.join("|")})\\)!?:\\s([a-z0-9:\\-\\/\\s])+`
        )
      }
    }
  );
}
