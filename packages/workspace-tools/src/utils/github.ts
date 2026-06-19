import { StormWorkspaceConfig } from "@storm-software/config";
import { joinPaths } from "@storm-software/config-tools/utilities/correct-paths";
import { createJiti } from "jiti";

export interface GitHubTools {
  error(message: string): void;
  warning(message: string): void;
  info(message: string): void;
  getIDToken(aud?: string): Promise<string>;
}

/**
 * Get GitHub Actions tools if running in a GitHub Actions environment, otherwise return no-op implementations
 *
 * @param workspaceConfig - The Storm workspace configuration
 * @returns An object containing GitHub Actions tools or no-op implementations if not running in a GitHub Actions environment
 */
export async function getGitHubTools(
  workspaceConfig: StormWorkspaceConfig
): Promise<GitHubTools> {
  try {
    const jiti = createJiti(workspaceConfig.workspaceRoot, {
      fsCache: workspaceConfig.skipCache
        ? false
        : joinPaths(
            workspaceConfig.workspaceRoot,
            workspaceConfig.directories.cache || "node_modules/.cache/storm",
            "jiti"
          ),
      interopDefault: true
    });

    const core = await jiti.import<GitHubTools>(
      jiti.esmResolve("@actions/core")
    );

    return {
      error: core.error,
      warning: core.warning,
      info: core.info,
      getIDToken: core.getIDToken
    } as GitHubTools;
  } catch {
    return {
      error: (message: string) => console.error(message),
      warning: (message: string) => console.warn(message),
      info: (message: string) => console.log(message),
      getIDToken: async () => {
        throw new Error("getIDToken is not supported in this environment");
      }
    } as GitHubTools;
  }
}
