import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { getWorkspaceRoot } from "./get-workspace-root";

const { env } = process;

const isWritable = path => {
  try {
    fs.accessSync(path, fs.constants.W_OK);
    return true;
  } catch {
    return false;
  }
};

function useDirectory(
  directory: string,
  { create = true }: { create?: boolean }
) {
  if (create) {
    fs.mkdirSync(directory, { recursive: true });
  }

  return directory;
}

function getNodeModuleDirectory(workspaceRoot: string) {
  const nodeModules = path.join(workspaceRoot, "node_modules");

  if (
    !isWritable(nodeModules) &&
    (fs.existsSync(nodeModules) || !isWritable(path.join(workspaceRoot)))
  ) {
    return;
  }

  return nodeModules;
}

export function findCacheDirectory(
  {
    name,
    cacheName,
    workspaceRoot,
    create
  }: {
    name: string;
    cacheName?: string;
    workspaceRoot: string;
    create?: boolean;
  } = {
    name: "storm",
    workspaceRoot: getWorkspaceRoot(),
    create: true
  }
) {
  if (env.CACHE_DIR && !["true", "false", "1", "0"].includes(env.CACHE_DIR)) {
    return useDirectory(path.join(env.CACHE_DIR, name, cacheName), { create });
  }
  if (
    env.STORM_CACHE_DIR &&
    !["true", "false", "1", "0"].includes(env.STORM_CACHE_DIR)
  ) {
    return useDirectory(path.join(env.STORM_CACHE_DIR, name, cacheName), {
      create
    });
  }

  const nodeModules = getNodeModuleDirectory(workspaceRoot);
  if (!nodeModules) {
    return;
  }

  return useDirectory(
    path.join(workspaceRoot, "node_modules", ".cache", name, cacheName),
    { create }
  );
}
