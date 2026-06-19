import { tryGetWorkspaceConfig } from "@storm-software/config-tools";
import plugin from "@storm-software/eslint-plugin-banner";
import { Options } from "@storm-software/eslint-plugin-banner/rules/banner";
import defu from "defu";
import type {
  OptionsBanner,
  OptionsIsInEditor,
  OptionsOverrides,
  TypedFlatConfigItem
} from "../types";

export async function banner(
  options: Partial<OptionsBanner> & OptionsIsInEditor & OptionsOverrides = {}
): Promise<TypedFlatConfigItem[]> {
  const { overrides = {}, ...rest } = options;

  const workspaceConfig = await tryGetWorkspaceConfig();

  return [
    {
      ...plugin.configs?.["recommended"],
      name: "storm/banner",
      plugins: { banner: plugin },
      rules: {
        "banner/banner": [
          "error",
          defu(
            rest,
            {
              name: workspaceConfig?.name,
              license: workspaceConfig?.license,
              organization:
                typeof workspaceConfig?.organization === "string"
                  ? workspaceConfig.organization
                  : typeof workspaceConfig?.organization?.name === "string"
                    ? workspaceConfig.organization.name
                    : undefined,
              licensing: workspaceConfig?.licensing,
              repository: workspaceConfig?.repository,
              docs: workspaceConfig?.docs,
              homepage: workspaceConfig?.homepage,
              commentStyle: "block",
              newlines: 2,
              lineEndings: "unix" as const
            },
            ((Array.isArray(plugin.configs?.["recommended"])
              ? undefined
              : (
                  plugin.configs?.["recommended"]?.rules?.[
                    "banner/banner"
                  ] as any
                )?.[1]) as Record<string, any> | undefined) ?? {}
          ) as Options[0]
        ],

        ...overrides
      }
    }
  ];
}
