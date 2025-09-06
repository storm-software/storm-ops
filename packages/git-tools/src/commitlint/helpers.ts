import { StormWorkspaceConfig } from "@storm-software/config";
import { writeInfo } from "@storm-software/config-tools/logger/console";
import { createJiti } from "jiti";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import DEFAULT_MINIMAL_COMMITLINT_CONFIG, {
  MinimalCommitlintConfig
} from "./config/minimal";
import DEFAULT_MONOREPO_COMMITLINT_CONFIG, {
  MonorepoCommitlintConfig
} from "./config/monorepo";

const jiti = createJiti(import.meta.url, { importMeta: import.meta });

export async function resolveCommitlintConfig<
  TWorkspaceConfig extends StormWorkspaceConfig
>(
  workspaceConfig: TWorkspaceConfig,
  configPath?: string
): Promise<
  TWorkspaceConfig["variant"] extends "minimal"
    ? MinimalCommitlintConfig
    : MonorepoCommitlintConfig
> {
  if (
    configPath &&
    configPath !== "@storm-software/git-tools/commitlint/minimal" &&
    configPath !== "@storm-software/git-tools/commitlint/monorepo"
  ) {
    writeInfo(
      `Using custom commitlint config file: ${configPath}`,
      workspaceConfig
    );
  } else {
    configPath =
      workspaceConfig?.variant === "minimal"
        ? "@storm-software/git-tools/commitlint/minimal"
        : "@storm-software/git-tools/commitlint/monorepo";

    writeInfo(
      `Using standard commitlint config file: ${configPath}`,
      workspaceConfig
    );
  }

  let config = {} as TWorkspaceConfig["variant"] extends "minimal"
    ? MinimalCommitlintConfig
    : MonorepoCommitlintConfig;
  if (
    (configPath.endsWith(".json") || configPath.endsWith(".jsonc")) &&
    !existsSync(jiti.esmResolve(configPath, workspaceConfig.workspaceRoot))
  ) {
    const configContent = await readFile(
      jiti.esmResolve(configPath, workspaceConfig.workspaceRoot),
      "utf8"
    );
    config = JSON.parse(configContent);
  } else {
    config = await jiti.import<
      TWorkspaceConfig["variant"] extends "minimal"
        ? MinimalCommitlintConfig
        : MonorepoCommitlintConfig
    >(jiti.esmResolve(configPath), { default: true });
  }

  return {
    ...(workspaceConfig.variant === "minimal"
      ? DEFAULT_MINIMAL_COMMITLINT_CONFIG
      : DEFAULT_MONOREPO_COMMITLINT_CONFIG),
    ...(config ?? {})
  } as TWorkspaceConfig["variant"] extends "minimal"
    ? MinimalCommitlintConfig
    : MonorepoCommitlintConfig;
}
