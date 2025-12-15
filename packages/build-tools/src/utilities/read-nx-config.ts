import { NxJsonConfiguration } from "@nx/devkit";
import { getConfig, joinPaths } from "@storm-software/config-tools";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";

/**
 * Read the `nx.json` configuration file in the workspace root.
 *
 * @param workspaceRoot - The workspace root directory.
 * @returns The `nx.json` configuration file.
 */
export const readNxConfig = async (
  workspaceRoot?: string
): Promise<NxJsonConfiguration<string[] | "*">> => {
  let rootDir = workspaceRoot;
  if (!rootDir) {
    const config = await getConfig();
    rootDir = config.workspaceRoot;
  }

  const nxJsonPath = joinPaths(rootDir, "nx.json");
  if (!existsSync(nxJsonPath)) {
    throw new Error("Cannot find project.json configuration");
  }

  const configContent = await readFile(nxJsonPath, "utf8");
  return JSON.parse(configContent);
};
