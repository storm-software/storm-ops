import {
  joinPathFragments,
  NxJsonConfiguration,
  readJsonFile
} from "@nx/devkit";
import { loadStormConfig } from "@storm-software/config-tools";

export const readNxJson = async (
  workspaceRoot?: string
): Promise<NxJsonConfiguration<string[] | "*">> => {
  let rootDir = workspaceRoot;
  if (!rootDir) {
    const config = await loadStormConfig();
    rootDir = config.workspaceRoot;
  }
  return readJsonFile(joinPathFragments(rootDir, "nx.json"));
};
