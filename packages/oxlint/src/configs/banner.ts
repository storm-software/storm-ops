import { StormWorkspaceConfig } from "@storm-software/config";
import { defu } from "defu";
import type { OptionsBanner, TypedConfigItem } from "../types";

export function banner(
  options: OptionsBanner,
  workspaceConfig?: StormWorkspaceConfig
): TypedConfigItem {
  return {
    jsPlugins: [
      {
        name: "banner",
        specifier: "@storm-software/eslint-plugin-banner"
      }
    ],
    rules: {
      "banner/banner": [
        "error",
        defu(options, {
          name: workspaceConfig?.name,
          license: workspaceConfig?.license,
          organization: workspaceConfig?.organization,
          licensing: workspaceConfig?.licensing,
          repository: workspaceConfig?.repository,
          docs: workspaceConfig?.docs,
          homepage: workspaceConfig?.homepage,
          commentStyle: "block",
          newlines: 2,
          lineEndings: "unix"
        })
      ]
    }
  };
}
