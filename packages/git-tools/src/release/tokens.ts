import deepMap from "deep-map";
import { ReleaseConfig } from "../types";

export interface ConfigTokensDict {
  projectDir: string;
  projectName: string;
  workspaceDir: string;
}

export function applyTokensToReleaseConfig(
  options: ReleaseConfig,
  tokens: ConfigTokensDict
): ReleaseConfig {
  return deepMap<ReleaseConfig>(options, value => {
    if (typeof value === "string") {
      return value
        .replaceAll("${PROJECT_DIR}", tokens.projectDir)
        .replaceAll("${PROJECT_NAME}", tokens.projectName)
        .replaceAll("${WORKSPACE_DIR}", tokens.workspaceDir);
    }

    return value;
  });
}
