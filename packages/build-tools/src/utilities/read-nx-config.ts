import { hfs } from "@humanfs/node";
import { NxJsonConfiguration } from "@nx/devkit";
import { joinPaths, loadStormConfig } from "@storm-software/config-tools";

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
    const config = await loadStormConfig();
    rootDir = config.workspaceRoot;
  }

  const nxJsonPath = joinPaths(rootDir, "nx.json");
  if (!(await hfs.isFile(nxJsonPath))) {
    throw new Error("Cannot find project.json configuration");
  }

  return hfs.json(nxJsonPath);
};
